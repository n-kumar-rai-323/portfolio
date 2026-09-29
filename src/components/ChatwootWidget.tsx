'use client';

import { useEffect } from 'react';
import { SITE } from '@/lib/site';

type ChatwootWindow = Window & {
  chatwootSettings?: Record<string, unknown>;
  chatwootSDK?: { run: (o: { websiteToken: string; baseUrl: string }) => void };
};

// Loads the self-hosted Chatwoot bubble after hydration. Does nothing until a website token is set.
export default function ChatwootWidget() {
  useEffect(() => {
    const { baseUrl, websiteToken } = SITE.chatwoot as { baseUrl: string; websiteToken: string };
    if (!websiteToken || document.getElementById('chatwoot-sdk')) return;
    const w = window as ChatwootWindow;
    w.chatwootSettings = { position: 'right', type: 'standard', darkMode: 'auto', launcherTitle: 'Chat with me' };
    const s = document.createElement('script');
    s.id = 'chatwoot-sdk';
    s.src = `${baseUrl}/packs/js/sdk.js`;
    s.async = true;
    s.onload = () => w.chatwootSDK?.run({ websiteToken, baseUrl });
    document.body.appendChild(s);
  }, []);

  return null;
}
