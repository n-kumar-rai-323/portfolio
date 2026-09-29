// Profile settings used across the site. Edit here, not inside components.
export const SITE = {
  name: 'Nishan Kumar Rai',
  role: 'AI Engineer',
  url: 'https://n-kumar-rai-323.github.io/',
  email: 'nishanrai341@gmail.com',
  github: 'https://github.com/n-kumar-rai-323',
  linkedin: 'https://www.linkedin.com/in/nishankumarrai/',
  company: { name: 'HiTech Solutions and Services Pvt. Ltd.', url: 'https://www.hitechnepal.com.np' },
  // Paste the Streamlit URL of the live RAG demo. While empty, demo links fall back to the GitHub repo.
  ragDemoUrl: '',
  // Resume: set `url` to a PDF in /public (e.g. '/resume.pdf') to enable the button.
  resume: { url: '', label: 'Download PDF' },
  // Chatwoot live chat. Paste the website inbox token (Settings → Inboxes → Configuration) to show the widget.
  chatwoot: { baseUrl: 'https://chat.nishankrai.com.np', websiteToken: '' },
} as const;

export const DEMO_URL = SITE.ragDemoUrl || `${SITE.github}/RAG-AI-Document-Assistant`;
