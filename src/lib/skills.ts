// Roles cycled by the typing effect in the hero.
export const ROLES = ['AI Engineer', 'AI Agent Builder', 'Full-stack Developer', 'DevOps Engineer', 'RAG Builder'];

export type SkillGroup = 'ai' | 'fs' | 'ops' | 'core';

// Colour token is a CSS variable from globals.css, so groups follow the theme.
export const GROUPS: Record<SkillGroup, { label: string; token: string }> = {
  ai: { label: 'AI & LLMs', token: '--cyan' },
  fs: { label: 'Full-stack', token: '--violet' },
  ops: { label: 'DevOps', token: '--amber' },
  core: { label: 'Core', token: '--rose' },
};

// Skills shown in the constellation: [name, group].
export const SKILLS: [string, SkillGroup][] = [
  ['LLMs', 'ai'], ['RAG', 'ai'], ['AI Agents', 'ai'], ['Tool calling', 'ai'], ['LangChain', 'ai'],
  ['ChromaDB', 'ai'], ['Llama 3.1', 'ai'], ['Hugging Face', 'ai'], ['Streamlit', 'ai'],
  ['React', 'fs'], ['Node.js', 'fs'], ['Express', 'fs'], ['MongoDB', 'fs'], ['Django', 'fs'], ['PostgreSQL', 'fs'], ['REST APIs', 'fs'],
  ['Docker', 'ops'], ['CI/CD', 'ops'], ['Nginx', 'ops'], ['Linux', 'ops'], ['Git', 'ops'],
  ['Python', 'core'], ['Java', 'core'], ['DSA', 'core'],
];
