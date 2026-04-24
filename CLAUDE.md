# whatwouldkeanudo.com — CLAUDE.md

## What this is
A fun tribute site: ask a life question and receive grounded, Keanu-style wisdom. Powered by Claude AI via a Netlify serverless function.

## Live URL
https://whatwouldkeanudo.com

## Hosting & deployment
- **Platform**: Netlify
- **Account**: remtheory@gmail.com (confirm — may differ)
- **Method**: Connected to GitHub repo `whatwouldkeanudo` (auto-deploys on push to main)
- **Security headers**: Configured in `netlify.toml` under `[[headers]]`

## Tech stack
- Static HTML (`index.html`, `about.html`) with inline CSS and JS
- Netlify serverless function: `netlify/functions/ask.js`
- The function calls the **Anthropic Claude API** with a Keanu Reeves persona system prompt
- Google Fonts: Lora + DM Sans
- Giphy GIFs loaded from `https://media.giphy.com` (displayed after each answer)

## Key files
| File | Purpose |
|---|---|
| `index.html` | Main page — question input, answer display, Giphy |
| `about.html` | Brief explanation of the site |
| `netlify/functions/ask.js` | Serverless function — calls Claude API |
| `netlify.toml` | Netlify build config + security headers |
| `robots.txt` | Crawler instructions |
| `sitemap.xml` | Sitemap for search engines |
| `poweredby_giphy.gif` | Giphy attribution badge (required by Giphy ToS) |

## External services & API keys
- **Anthropic Claude API** — `ANTHROPIC_API_KEY` must be set in Netlify environment variables (dashboard → Site settings → Environment variables). Never hardcode this.
- **Giphy** — images loaded directly from `media.giphy.com`, no API key needed for display

## How to update
1. Edit files locally
2. `git push` to GitHub → Netlify auto-deploys
3. To update the Keanu persona or AI behavior: edit the `SYSTEM_PROMPT` in `netlify/functions/ask.js`

## CSP note
The Content Security Policy in `netlify.toml` includes `img-src https://media.giphy.com` for the Giphy GIFs. If you add other external image sources, add them there too.

## TODO
- [ ] Add a proper OG/Twitter share image (a static Keanu image would boost social sharing)
- [ ] Register with Google Search Console
- [ ] Consider rate-limiting the Netlify function to control Claude API costs
