// MCP Integration for SPECTRE
// This module provides access to Model Context Protocol servers

class MCPIntegration {
    constructor() {
        this.availableTools = {
            // GitHub Tools
            github: {
                'create_repository': 'Create a new GitHub repository',
                'get_repository': 'Get repository information', 
                'search_repositories': 'Search GitHub repositories',
                'create_issue': 'Create a GitHub issue',
                'list_issues': 'List repository issues',
                'create_pull_request': 'Create a pull request'
            },
            
            // Railway Tools  
            railway: {
                'project_list': 'List Railway projects',
                'service_create_from_repo': 'Deploy service from GitHub repo',
                'database_deploy': 'Deploy a database',
                'domain_create': 'Create custom domain',
                'variable_set': 'Set environment variables'
            },
            
            // ElevenLabs Tools
            elevenlabs: {
                'text_to_speech': 'Convert text to speech',
                'speech_to_text': 'Transcribe speech from audio',
                'voice_clone': 'Clone a voice from audio samples',
                'create_agent': 'Create conversational AI agent',
                'text_to_sound_effects': 'Generate sound effects from text'
            },
            
            // N8N Workflow Tools
            n8n: {
                'list_nodes': 'List available N8N nodes',
                'search_nodes': 'Search for specific node types',
                'get_node_documentation': 'Get detailed node documentation',
                'n8n_create_workflow': 'Create new N8N workflow',
                'validate_workflow': 'Validate workflow configuration'
            },
            
            // Notion Tools
            notion: {
                'search': 'Search Notion pages and databases',
                'create_page': 'Create a new Notion page',
                'query_database': 'Query Notion database',
                'create_database': 'Create new Notion database'
            },
            
            // Blender Tools
            blender: {
                'get_scene_info': 'Get Blender scene information',
                'spawn_actor': 'Create objects in Blender',
                'create_pyramid': 'Generate pyramid structures',
                'create_town': 'Generate complete 3D towns'
            },
            
            // Unreal Engine Tools
            unreal: {
                'spawn_actor': 'Create actors in Unreal Engine',
                'create_blueprint': 'Create Unreal Engine blueprints',
                'construct_house': 'Build architectural structures',
                'create_maze': 'Generate solvable mazes'
            },
            
            // Vercel Tools
            vercel: {
                'project_list': 'List Vercel projects',
                'deployment_trigger': 'Trigger new deployment',
                'domain_create': 'Create custom domains',
                'variable_set': 'Set environment variables'
            },
            
            // File System & Development Tools
            system: {
                'read_file': 'Read file contents',
                'write_file': 'Write to files', 
                'bash_command': 'Execute shell commands',
                'search_code': 'Search through codebase',
                'web_fetch': 'Fetch web content'
            }
        };
        
        this.toolCategories = {
            'development': ['github', 'system', 'vercel', 'railway'],
            'ai_media': ['elevenlabs', 'spectre'],
            'automation': ['n8n'],
            'documentation': ['notion'],
            'creative': ['blender', 'unreal'],
            'deployment': ['railway', 'vercel']
        };
    }

    // Get tools by category
    getToolsByCategory(category) {
        const categoryTools = this.toolCategories[category] || [];
        const tools = {};
        
        categoryTools.forEach(toolGroup => {
            if (this.availableTools[toolGroup]) {
                tools[toolGroup] = this.availableTools[toolGroup];
            }
        });
        
        return tools;
    }

    // Search for tools by description
    searchTools(query) {
        const results = {};
        const queryLower = query.toLowerCase();
        
        Object.entries(this.availableTools).forEach(([category, tools]) => {
            Object.entries(tools).forEach(([toolName, description]) => {
                if (toolName.toLowerCase().includes(queryLower) || 
                    description.toLowerCase().includes(queryLower)) {
                    if (!results[category]) results[category] = {};
                    results[category][toolName] = description;
                }
            });
        });
        
        return results;
    }

    // Get all available tools
    getAllTools() {
        return this.availableTools;
    }

    // Generate tool usage suggestions based on user input
    suggestTools(userMessage) {
        const messageLower = userMessage.toLowerCase();
        const suggestions = [];

        // GitHub suggestions
        if (messageLower.includes('github') || messageLower.includes('repository') || 
            messageLower.includes('repo') || messageLower.includes('issue')) {
            suggestions.push({
                category: 'github',
                tools: ['create_repository', 'search_repositories', 'create_issue'],
                reason: 'GitHub repository management'
            });
        }

        // Deployment suggestions
        if (messageLower.includes('deploy') || messageLower.includes('host') || 
            messageLower.includes('server')) {
            suggestions.push({
                category: 'railway',
                tools: ['service_create_from_repo', 'project_list', 'database_deploy'],
                reason: 'Cloud deployment and hosting'
            });
        }

        // Voice/Audio suggestions
        if (messageLower.includes('voice') || messageLower.includes('speech') || 
            messageLower.includes('audio') || messageLower.includes('sound')) {
            suggestions.push({
                category: 'elevenlabs',
                tools: ['text_to_speech', 'speech_to_text', 'voice_clone'],
                reason: 'Voice and audio processing'
            });
        }

        // Automation suggestions
        if (messageLower.includes('automate') || messageLower.includes('workflow') || 
            messageLower.includes('process')) {
            suggestions.push({
                category: 'n8n',
                tools: ['n8n_create_workflow', 'list_nodes'],
                reason: 'Workflow automation'
            });
        }

        // Documentation suggestions
        if (messageLower.includes('document') || messageLower.includes('note') || 
            messageLower.includes('wiki')) {
            suggestions.push({
                category: 'notion',
                tools: ['create_page', 'search', 'create_database'],
                reason: 'Documentation and knowledge management'
            });
        }

        // 3D/Creative suggestions
        if (messageLower.includes('3d') || messageLower.includes('model') || 
            messageLower.includes('blender') || messageLower.includes('unreal')) {
            suggestions.push({
                category: 'blender',
                tools: ['create_town', 'spawn_actor', 'create_pyramid'],
                reason: '3D modeling and creation'
            });
        }

        return suggestions;
    }

    // Format tools for display to users
    formatToolsForDisplay(tools) {
        let display = '\n🔧 **Available MCP Tools:**\n\n';
        
        Object.entries(tools).forEach(([category, categoryTools]) => {
            display += `**${category.toUpperCase()}:**\n`;
            Object.entries(categoryTools).forEach(([toolName, description]) => {
                display += `• ${toolName}: ${description}\n`;
            });
            display += '\n';
        });
        
        return display;
    }

    // Get enhanced context for AI with available tools
    getToolContext(userMessage) {
        const suggestions = this.suggestTools(userMessage);
        let context = '\n\n=== MCP TOOLS AVAILABLE ===\n';
        
        if (suggestions.length > 0) {
            context += 'SUGGESTED TOOLS for this request:\n';
            suggestions.forEach(suggestion => {
                context += `${suggestion.category}: ${suggestion.tools.join(', ')} (${suggestion.reason})\n`;
            });
            context += '\n';
        }
        
        context += 'TOOL CATEGORIES:\n';
        Object.entries(this.toolCategories).forEach(([category, tools]) => {
            context += `${category}: ${tools.join(', ')}\n`;
        });
        
        context += '\nI can use these tools to help with your request. Just ask me to use specific MCP tools or I can suggest the best ones for your task.';
        
        return context;
    }
}

module.exports = { MCPIntegration };