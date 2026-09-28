export type StepType = 'plan' | 'tool' | 'observe' | 'done';
export type Step = [StepType, string];
export type Task = { label: string; steps: Step[] };
export type Capability = { title: string; desc: string; token: string; demo?: boolean; tasks: Task[] };

export const STEP_LABEL: Record<StepType, string> = { plan: 'Plan', tool: 'Tool', observe: 'Observe', done: 'Done' };

// What I build. Each capability has example tasks with illustrative, simulated agent traces.
export const CAPABILITIES: Capability[] = [
  {
    title: 'RAG systems',
    desc: 'Assistants that answer from your own documents and data, and show where each answer came from.',
    token: '--cyan',
    demo: true,
    tasks: [
      { label: 'What does the contract say about late payment?', steps: [
        ['plan', 'The answer has to come from the uploaded contract, so retrieve before answering.'],
        ['tool', 'retrieve(query="late payment penalty", k=4, search="mmr")'],
        ['observe', '4 chunks returned. Best match: page 7, clause 4.2.'],
        ['plan', 'The clause is explicit. Answer from it and cite the page.'],
        ['done', 'Late payments carry a 2% monthly charge after 30 days. Source: page 7.'],
      ] },
      { label: 'Summarise the key risks in this report', steps: [
        ['plan', 'A summary needs coverage, not one passage, so pull diverse chunks.'],
        ['tool', 'retrieve(query="risks and challenges", k=6, search="mmr")'],
        ['observe', '6 chunks from pages 3, 9, 12 and 14.'],
        ['done', 'Three risks: supplier delays, currency exposure and staffing. Sources: pages 3, 9, 12, 14.'],
      ] },
    ],
  },
  {
    title: 'AI agents',
    desc: 'LLM agents that plan, call tools and check the result before they reply.',
    token: '--violet',
    tasks: [
      { label: 'Remind customers with overdue invoices', steps: [
        ['plan', 'Find overdue invoices first, then draft one reminder per customer.'],
        ['tool', 'search_invoices(status="overdue")'],
        ['observe', '3 invoices across 2 customers.'],
        ['tool', 'draft_email(customer_id=112, tone="polite")'],
        ['observe', 'Draft 1 of 2 ready. Moving to the second customer.'],
        ['done', '2 reminder drafts are ready for review. Nothing is sent without approval.'],
      ] },
      { label: 'Which item sold best last week?', steps: [
        ['plan', 'Need last week’s sales grouped by item.'],
        ['tool', 'query_sales(period="last_week", group_by="item")'],
        ['observe', '142 rows. Top item: 1 L cooking oil, 318 units.'],
        ['done', 'Best seller last week: 1 L cooking oil, 318 units.'],
      ] },
    ],
  },
  {
    title: 'Full-stack & DevOps delivery',
    desc: 'The app around the model and the pipeline that ships it: APIs, UI, Docker, CI/CD and Nginx.',
    token: '--amber',
    tasks: [
      { label: 'Ship the RAG app to a server', steps: [
        ['plan', 'Containerise the app, then deploy through the CI pipeline.'],
        ['tool', 'docker build -t rag-assistant .'],
        ['observe', 'Image built.'],
        ['tool', 'ci.run(pipeline="deploy", target="staging")'],
        ['observe', 'Tests passed. Container healthy behind Nginx.'],
        ['done', 'Live on staging over HTTPS.'],
      ] },
      { label: 'Add an API for the chatbot', steps: [
        ['plan', 'Expose the chatbot through a REST endpoint the web app can call.'],
        ['tool', 'create_route("POST /api/ask")'],
        ['observe', 'Route added. Test request returned 200.'],
        ['done', 'The front end can now call /api/ask.'],
      ] },
    ],
  },
];

// How I work, shown under the capabilities.
export const PROCESS = [
  { title: 'Understand', text: 'Sit with the people who’ll use it and agree on what a good answer looks like.' },
  { title: 'Prototype', text: 'A working slice in days, on real documents or data, not a slide.' },
  { title: 'Evaluate', text: 'Test questions with known answers, check retrieval and the failure cases before anyone relies on it.' },
  { title: 'Ship', text: 'Docker, CI/CD and monitoring, so it keeps working long after the demo.' },
];
