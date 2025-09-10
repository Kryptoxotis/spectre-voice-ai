const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
require('dotenv').config();

const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { MCPIntegration } = require('./mcp-integration.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Initialize API clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize persistent memory storage
const fs = require('fs');
const conversationMemory = new Map();
const MEMORY_FILE = './memory.json';

// Load existing memory from file
function loadMemory() {
    try {
        if (fs.existsSync(MEMORY_FILE)) {
            const data = fs.readFileSync(MEMORY_FILE, 'utf8');
            const memoryData = JSON.parse(data);
            Object.entries(memoryData).forEach(([key, value]) => {
                conversationMemory.set(key, value);
            });
            console.log(`Loaded memory for ${conversationMemory.size} users`);
        }
    } catch (error) {
        console.error('Error loading memory:', error);
    }
}

// Save memory to file
function saveMemory() {
    try {
        const memoryData = Object.fromEntries(conversationMemory.entries());
        fs.writeFileSync(MEMORY_FILE, JSON.stringify(memoryData, null, 2));
    } catch (error) {
        console.error('Error saving memory:', error);
    }
}

// Initialize memory
loadMemory();

// Initialize MCP Integration
const mcpIntegration = new MCPIntegration();

console.log('OpenAI API Key:', !!process.env.OPENAI_API_KEY);
console.log('Anthropic API Key:', !!process.env.ANTHROPIC_API_KEY);
console.log('Conversation memory initialized');
console.log('MCP Integration initialized - Available tool categories:', Object.keys(mcpIntegration.toolCategories).join(', '));

// Serve static files
app.use(express.static('.'));

// API endpoint to view memory
app.get('/api/memory', (req, res) => {
    const memoryData = Object.fromEntries(conversationMemory.entries());
    res.json(memoryData);
});

// API endpoint to get available MCP tools
app.get('/api/mcp-tools', (req, res) => {
    const { category, search } = req.query;
    
    if (category) {
        res.json(mcpIntegration.getToolsByCategory(category));
    } else if (search) {
        res.json(mcpIntegration.searchTools(search));
    } else {
        res.json(mcpIntegration.getAllTools());
    }
});

// Memory visualization page
app.get('/memory', (req, res) => {
    res.sendFile(path.join(__dirname, 'memory.html'));
});

// MCP Tools visualization page
app.get('/tools', (req, res) => {
    res.sendFile(path.join(__dirname, 'tools.html'));
});

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Default user ID - will be updated when client sends identification
    let userId = 'default_user';

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received:', data);

            // Handle user identification
            if (data.type === 'identify') {
                userId = data.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                console.log('User identified:', userId);
                
                // Send confirmation back to client
                ws.send(JSON.stringify({
                    type: 'identified',
                    userId: userId
                }));
                return;
            }

            if (data.type === 'chat') {
                const { provider, model, userMessage } = data;
                
                // Get conversation history for this user
                let userConversations = conversationMemory.get(userId) || [];
                console.log(`Found ${userConversations.length} previous messages for user ${userId}`);
                
                // Search for relevant context in conversation history
                let memoryContext = '';
                if (userConversations.length > 0) {
                    // Get last 3 conversations for context
                    const recentConversations = userConversations.slice(-6); // Last 3 exchanges (user + assistant)
                    if (recentConversations.length > 0) {
                        memoryContext = '\n\nRecent conversation context:\n' + 
                            recentConversations.map(msg => `${msg.role}: ${msg.content}`).join('\n');
                    }
                }

                // Add MCP tool context
                const mcpContext = mcpIntegration.getToolContext(userMessage);
                
                let response = '';
                
                if (provider === 'openai') {
                    console.log(`Using OpenAI ${model}`);
                    try {
                        const completion = await openai.chat.completions.create({
                            model: model,
                            messages: [
                                { role: 'system', content: `You are SPECTRE, an intelligent voice assistant with persistent memory and access to powerful MCP tools. Use any relevant context provided to personalize your responses. Give concise, conversational responses.${memoryContext}${mcpContext}` },
                                { role: 'user', content: userMessage }
                            ],
                            max_completion_tokens: 150
                        });
                        response = completion.choices[0].message.content;
                        console.log(`OpenAI response: ${response}`);
                        
                        // Check for empty response
                        if (!response || response.trim().length === 0) {
                            console.log('OpenAI returned empty response, trying fallback');
                            response = `Sorry, ${model} returned an empty response. This model might not be available with your API key. Try GPT-4o instead.`;
                        }
                    } catch (openaiError) {
                        console.error('OpenAI API Error:', openaiError.message);
                        console.error('Full error:', openaiError);
                        response = `OpenAI Error: ${openaiError.message}`;
                    }
                    
                } else if (provider === 'anthropic') {
                    console.log(`Using Anthropic ${model}`);
                    const message = await anthropic.messages.create({
                        model: model,
                        max_tokens: 150,
                        messages: [
                            { role: 'user', content: userMessage }
                        ],
                        system: `You are SPECTRE, an intelligent voice assistant with persistent memory and access to powerful MCP tools. Use any relevant context provided to personalize your responses. Give concise, conversational responses.${memoryContext}${mcpContext}`
                    });
                    response = message.content[0].text;
                }

                // Store conversation in memory
                console.log('Storing conversation in memory...');
                userConversations = conversationMemory.get(userId) || [];
                userConversations.push(
                    { 
                        role: 'user', 
                        content: userMessage,
                        timestamp: new Date().toISOString()
                    },
                    { 
                        role: 'assistant', 
                        content: response,
                        provider: provider,
                        model: model,
                        timestamp: new Date().toISOString()
                    }
                );
                
                // Keep only last 20 messages to prevent memory bloat
                if (userConversations.length > 20) {
                    userConversations = userConversations.slice(-20);
                }
                
                conversationMemory.set(userId, userConversations);
                console.log(`Stored conversation. Total messages for user: ${userConversations.length}`);
                
                // Save memory to file after each conversation
                saveMemory();

                // Send response back
                ws.send(JSON.stringify({
                    type: 'response',
                    text: response,
                    provider: provider,
                    model: model
                }));

            } else if (data.type === 'tts') {
                // Handle text-to-speech using OpenAI
                console.log('Generating TTS for:', data.text);
                
                // Validate input text is not empty
                if (!data.text || data.text.trim().length === 0) {
                    console.log('TTS: Empty text, skipping audio generation');
                    return;
                }
                
                const mp3 = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "alloy",
                    input: data.text.trim(),
                });
                
                const buffer = Buffer.from(await mp3.arrayBuffer());
                
                ws.send(JSON.stringify({
                    type: 'audio',
                    audioData: buffer.toString('base64')
                }));
            }
            
        } catch (error) {
            console.error('Error:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: error.message
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Simple Voice AI running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Tailscale: http://100.89.5.69:${PORT}`);
});