export type ProjectCategory = 'ai' | 'core';
export type Project = {
  repo: string;
  title: string;
  cat: ProjectCategory;
  kind: string;
  featured?: boolean;
  demo?: boolean;
  // Still being built: shows an "In progress" badge and no GitHub link, since the code isn't published yet.
  wip?: boolean;
  short: string;
  tech: string[];
  pipeline?: string[];
  problem: string;
  how: string[];
  outcome: string;
};

// Projects: edit text here. `repo` is the GitHub repository name; `demo: true` shows the live demo link.
export const PROJECTS: Project[] = [
  {
    repo: 'RAG-AI-Document-Assistant', title: 'RAG AI Document Assistant', cat: 'ai', kind: 'RAG application', featured: true, demo: true,
    short: 'Upload a PDF and chat with it. Every answer comes from the document, with the pages it came from.',
    tech: ['Python', 'LangChain', 'ChromaDB', 'Hugging Face', 'Llama 3.1', 'Groq', 'Streamlit'],
    pipeline: ['PDF', 'Chunks', 'Embeddings', 'ChromaDB', 'Llama 3.1', 'Answer'],
    problem: 'Long PDFs such as reports, manuals and contracts are slow to search, and a general chatbot will happily make up an answer that isn’t in the file.',
    how: [
      'PyPDFLoader reads the uploaded PDF page by page and keeps the page numbers.',
      'RecursiveCharacterTextSplitter cuts the text into 500-character chunks with a 50-character overlap, so sentences aren’t lost at the edges.',
      'Each chunk is embedded with the all-MiniLM-L6-v2 sentence-transformer model.',
      'The vectors are stored in ChromaDB.',
      'For each question, MMR (maximal marginal relevance) retrieval picks chunks that are relevant but not repetitive.',
      'Llama 3.1, served on Groq, answers from those chunks and cites the pages they came from.',
      'Streamlit wraps it all in a simple upload-and-chat interface.',
    ],
    outcome: 'A working, deployed document assistant: upload a PDF, ask in plain language and get an answer with page sources you can check.',
  },
  {
    repo: 'smart-inventory-agent', title: 'Smart Inventory Agent', cat: 'ai', kind: 'Machine learning + agent', wip: true,
    short: 'A demand-forecasting model plus an AI agent that turns its predictions into reorder suggestions for small retailers.',
    tech: ['Python', 'pandas', 'scikit-learn', 'LangChain', 'Llama 3.1', 'PostgreSQL', 'Docker'],
    pipeline: ['Sales data', 'Features', 'Forecast model', 'Agent tools', 'Reorder plan'],
    problem: 'Small shops reorder stock by gut feeling, so fast sellers run out and slow ones sit on the shelf.',
    how: [
      'Clean past sales data with pandas and build features such as weekday, season and festival weeks.',
      'Train a scikit-learn model to forecast next week’s demand per item, and compare it against a simple baseline.',
      'Expose the forecast, current stock and supplier details as tools the agent can call.',
      'A LangChain agent on Llama 3.1 plans, calls those tools and explains each reorder suggestion in plain language.',
      'Nothing is ordered automatically: a person approves every suggestion.',
    ],
    outcome: 'In progress. The data pipeline and baseline forecast come first, then the agent. The code and results will be published here once it works end to end.',
  },
  {
    repo: 'Resume_Extractor_Chatbot', title: 'Resume Extractor Chatbot', cat: 'ai', kind: 'LLM extraction',
    short: 'A chatbot that reads resumes and pulls out the key details.',
    tech: ['Python', 'LLM'],
    problem: 'Screening resumes by hand means reading every one to find the same handful of details.',
    how: [
      'The resume text is extracted and passed to an LLM.',
      'A structured prompt asks the model for the key details a recruiter looks for.',
      'The chatbot returns those details and answers questions about the resume.',
    ],
    outcome: 'A prototype that turns an unstructured resume into key details you can read at a glance or question further.',
  },
  {
    repo: 'AI_Book_Information_Extractor', title: 'AI Book Information Extractor', cat: 'ai', kind: 'LLM extraction',
    short: 'Extracts structured information from book content.',
    tech: ['Python', 'LLM'],
    problem: 'Book text is long and unstructured, which makes it hard to catalogue, search or compare.',
    how: [
      'Book content is loaded and prepared for the model.',
      'An LLM is prompted to extract the information into a fixed structure.',
      'The results come back in a consistent format that other code can use.',
    ],
    outcome: 'An experiment in LLM information extraction, the same technique that applies to invoices, forms and other business documents.',
  },
  {
    repo: 'ChatBot', title: 'ChatBot', cat: 'ai', kind: 'Conversational AI',
    short: 'A conversational assistant written in Python.',
    tech: ['Python'],
    problem: 'Learning how a chat assistant takes a message, produces a reply and keeps a conversation going.',
    how: [
      'Reads the user’s message.',
      'Generates a reply in Python.',
      'Repeats turn by turn to hold a conversation.',
    ],
    outcome: 'One of the early building blocks behind my later RAG and agent work.',
  },
  {
    repo: 'Generative_AI_All', title: 'Generative AI Lab', cat: 'ai', kind: 'Notebook',
    short: 'A notebook of generative AI experiments.',
    tech: ['Python', 'Jupyter', 'LLMs'],
    problem: 'Learning generative AI by building things, not just reading about them.',
    how: [
      'Small, self-contained experiments with LLMs and prompting.',
      'Trying techniques out in isolation before using them in real projects.',
    ],
    outcome: 'A running lab book, and the groundwork for the RAG and extraction projects.',
  },
  {
    repo: 'DSA', title: 'Data Structures & Algorithms', cat: 'core', kind: 'Computer science',
    short: 'Classic data structures and algorithms implemented from scratch in Java.',
    tech: ['Java', 'DSA'],
    problem: 'Libraries hide how data structures work. Writing them yourself shows the trade-offs in time and memory.',
    how: [
      'Implemented classic data structures from scratch in Java.',
      'Implemented the standard algorithms that work on them.',
      'Kept each one small and readable, as a reference.',
    ],
    outcome: 'A from-scratch reference of the fundamentals, and the reason I think about complexity when designing retrieval and data pipelines.',
  },
];

export const CATS: Record<ProjectCategory, { label: string; token: string }> = {
  ai: { label: 'AI & LLMs', token: '--cyan' },
  core: { label: 'Core CS', token: '--rose' },
};
