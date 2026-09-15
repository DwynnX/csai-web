import { Message } from '../types';

const RESPONSES: Record<string, string> = {
  hello: `Hello. I'm CSAI 1, an advanced conversational AI operating in alpha mode.

I can assist you with a variety of tasks including:

- **Code analysis** and generation
- **Technical writing** and documentation
- **Problem solving** across domains
- **Data interpretation** and synthesis
- **Creative tasks** and brainstorming

What would you like to explore?`,

  help: `Here are the available commands:

\`/help\` — Show this help message
\`/new\` — Start a new session
\`/clear\` — Clear current conversation
\`/history\` — View session history
\`/model\` — Show current model info
\`/settings\` — Open settings panel
\`/about\` — About CSAI 1

You can also type naturally and I'll respond conversationally.`,

  about: `**CSAI 1 (alpha)**

Version: 1.0.0-alpha
Architecture: Transformer-based conversational AI
Mode: Cloud
Status: Active

CSAI 1 is an advanced language model designed for technical and creative tasks. It operates through this terminal interface to provide a focused, distraction-free environment for complex work.

This is an alpha release. Features and capabilities are actively evolving.`,

  code: `Here's an example of a clean implementation:

\`\`\`typescript
interface Config {
  endpoint: string;
  apiKey: string;
  model: string;
}

async function initialize(config: Config) {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${config.apiKey}\`,
    },
    body: JSON.stringify({ model: config.model }),
  });

  return response.json();
}
\`\`\`

This pattern keeps configuration separate from logic and handles authentication cleanly.`,

  default: `I understand your request. Let me process that.

Based on my analysis, here are my thoughts:

1. **Context** — I've reviewed the parameters of your query
2. **Analysis** — The key factors involve structure and clarity
3. **Recommendation** — I'd suggest approaching this systematically

Would you like me to elaborate on any specific aspect? I can provide more detailed analysis, alternative approaches, or practical examples.

You can also use commands like \`/help\` to see what I can do.`,
};

function matchResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return RESPONSES.hello;
  }
  if (lower.includes('code') || lower.includes('function') || lower.includes('implement')) {
    return RESPONSES.code;
  }
  if (lower.includes('who are you') || lower.includes('what are you')) {
    return RESPONSES.about;
  }

  return RESPONSES.default;
}

export interface AIResponse {
  content: string;
  delay: number;
}

export async function sendMessage(message: string): Promise<AIResponse> {
  // Simulate network delay
  const delay = 400 + Math.random() * 800;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const content = matchResponse(message);

  return {
    content,
    delay: 15 + Math.random() * 25, // ms per character for typing effect
  };
}

export function processCommand(command: string): { type: 'command'; command: string } | null {
  const trimmed = command.trim();
  if (trimmed.startsWith('/')) {
    return { type: 'command', command: trimmed.slice(1).toLowerCase() };
  }
  return null;
}