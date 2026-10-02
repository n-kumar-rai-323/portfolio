# Nishan Kumar Rai — Portfolio

Personal portfolio of Nishan Kumar Rai, AI Engineer in Kathmandu, Nepal. Live at **[nishankrai.com.np](https://nishankrai.com.np)**.

A single-page site built with Next.js (static export), React, TypeScript and Three.js, served by Nginx in Docker on AWS EC2.

## Sections

- **Hero** — typing roles and an interactive 3D skill constellation (Three.js, with a tag-cloud fallback when WebGL is unavailable).
- **What I build** — capability explorer with simulated agent traces (Plan → Tool → Observe → Done).
- **Projects** — search, category filters and a case-study drawer.
- **Ask my AI** — a TF-IDF + cosine-similarity retriever that runs entirely in the browser, with a PCA knowledge map.
- **Journey** — scroll-lit career timeline.
- **Contact** — Kathmandu clock, contact links, a mail form and Chatwoot live chat.

## Tech stack

| Area | Tools |
| --- | --- |
| App | Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript |
| 3D | Three.js |
| Styling | Plain CSS with design tokens, light and dark themes |
| Serving | Nginx in Docker |
| CI/CD | GitHub Actions → GitHub Container Registry → AWS EC2 |
| HTTPS | nginx-proxy + acme-companion (Let's Encrypt) |
| Live chat | Self-hosted Chatwoot |

## Run locally

Requires Node.js 24.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run typecheck  # TypeScript check
npm run build      # static export to ./out
```

## Editing content

All text lives in `src/lib/`, not in the components:

| File | Content |
| --- | --- |
| `site.ts` | Name, links, email, demo and resume URLs, Chatwoot settings |
| `skills.ts` | Hero roles and constellation skills |
| `services.ts` | Capabilities, agent traces and process steps |
| `projects.ts` | Projects and case studies |
| `kb.ts` | Knowledge base for "Ask my AI" |
| `journey.ts` | Career timeline |

## Project structure

```
src/
  app/          layout, page and global styles
  components/   one folder per section, each with its own CSS
  lib/          content data and small utilities
public/         static assets
chatwoot/       self-hosted Chatwoot compose stack
scripts/        one-time EC2 setup
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. **check** — type check and build.
2. **image** — build the Docker image and push it to GHCR.
3. **deploy** — SSH into EC2, pull the image and restart the container.

One-time server setup:

```bash
bash scripts/ec2-setup.sh
docker network create web
docker compose -f docker-compose.proxy.yml up -d
```

Required repository secrets: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`.

Chatwoot runs from `chatwoot/`: copy `.env.example` to `.env`, fill in the secrets, then follow the comments in `chatwoot/docker-compose.yml`. Never commit the real `.env`.
