export const TOPICS = ['AI project', 'AI agent idea', 'Collaboration', 'Just saying hi'] as const;
export type Topic = (typeof TOPICS)[number];

// The message box hint changes with the topic, so people know what to write.
export const PLACEHOLDERS: Record<Topic, string> = {
  'AI project': 'What documents or data should answer questions, and who will ask them?',
  'AI agent idea': 'What should the agent do, and which tools or systems would it use?',
  'Collaboration': 'What are you building, and where could I help?',
  'Just saying hi': 'Hi Nishan, …',
};

export const MAX_MSG = 1000;

export type Field = 'name' | 'email' | 'message';

// Returns an error message, or '' when the value is fine.
export const CHECKS: Record<Field, (v: string) => string> = {
  name: v => v.trim().length >= 2 ? '' : 'Add your name (at least 2 letters) so I know who to reply to.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? ''
    : v.trim() ? 'That email looks incomplete. Check it has an @ and a domain, like name@example.com.' : 'Add your email so I can write back.',
  message: v => v.trim().length >= 10 ? '' : 'Tell me a little more: at least 10 characters.',
};
