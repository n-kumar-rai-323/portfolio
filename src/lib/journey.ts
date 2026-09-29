export type Stage = { when: string; title: string; text: string; tags: string[]; layer: string; token: string; now?: boolean };

// Career timeline, oldest first. Each stage also drives one layer of the stack beside it.
export const STAGES: Stage[] = [
  {
    when: 'Foundations',
    title: 'Full-stack developer',
    text: 'Built web apps end to end with the MERN stack and Python Django, and worked through data structures and algorithms in Java.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Django', 'PostgreSQL', 'REST APIs', 'Java DSA'],
    layer: 'Full-stack & DSA',
    token: '--violet',
  },
  {
    when: 'Level up',
    title: 'DevOps',
    text: 'Learned to ship what I built: containers, CI/CD pipelines, reverse proxies and Linux servers.',
    tags: ['Docker', 'CI/CD', 'Nginx', 'Linux', 'Git'],
    layer: 'DevOps',
    token: '--amber',
  },
  {
    when: 'Before HiTech',
    title: 'Generative AI, RAG & agents',
    text: 'Moved into LLMs: retrieval-augmented generation, embeddings, vector databases and agents that call tools.',
    tags: ['LLMs', 'LangChain', 'ChromaDB', 'Hugging Face', 'Llama 3.1', 'Streamlit', 'Tool calling'],
    layer: 'GenAI, RAG & agents',
    token: '--rose',
  },
  {
    when: '2026 – present',
    title: 'AI Engineer at HiTech',
    text: 'At HiTech Solutions and Services in Kathmandu, bringing AI into business software used by SMEs, retailers, restaurants and accountants across Nepal.',
    tags: ['RAG', 'AI agents', 'LLMs', 'Python'],
    layer: 'AI Engineering',
    token: '--cyan',
    now: true,
  },
];
