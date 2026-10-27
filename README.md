# CYBER NEXUS — Digital Frontier

A polished cyberpunk-inspired, responsive React site for a fictional cybersecurity learning platform. The interface is built as a client-side experience; console commands, telemetry, event logs, and network edges are deliberately simulated. It does not execute shell commands or contact real hosts.

## Architecture

```text
cyber-nexus/
├── public/                     # Static assets (optional)
├── src/
│   ├── components/
│   │   ├── BootScreen.tsx      # Intro boot sequence
│   │   ├── ContactForm.tsx     # Validated form + optional endpoint integration
│   │   ├── MatrixRain.tsx      # Canvas animation, device-pixel-ratio capped
│   │   ├── NetworkMap.tsx      # Interactive simulated topology
│   │   ├── SectionHeading.tsx  # Reusable animated section heading
│   │   └── TerminalPanel.tsx   # Command history and safe simulated commands
│   ├── App.tsx                 # Main page sections and telemetry state
│   ├── index.css               # Tailwind entry + bespoke cyberpunk design system
│   ├── main.tsx                # React entry point
│   └── vite-env.d.ts           # Vite client typing
├── .env.example
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Requirements

- Node.js **20.19+** or **22.12+** (Node.js 22 LTS recommended)
- npm 10+
- Internet access during the initial dependency install

## Install and run locally

Open a terminal in this directory:

```bash
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`). The Vite server is configured to listen on `0.0.0.0`, so it can also be tested from another device on the same LAN if the computer firewall allows it.

## Available scripts

```bash
npm run dev        # Local development server with HMR
npm run typecheck  # TypeScript project check
npm run build      # Type-check and create production output
npm run preview    # Preview the built site locally
```

## Production build

```bash
npm run build
npm run preview
```

The static production site is written to `dist/`. Upload the contents of `dist/` to a static host such as Cloudflare Pages, Netlify, Vercel, GitHub Pages (configure the repository base path if deploying to a project subpath), or any Nginx/Apache static document root. For a subpath deployment with Vite, set `base` in `vite.config.ts` to that path before building.

### Example Nginx server block

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/cyber-nexus/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:css|js|svg|png|jpg|jpeg|webp|ico|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
}
```

Use HTTPS for a public deployment and configure your host's security headers and caching policy according to the environment.

## Contact form backend (optional)

The contact form trims and length-limits fields, checks the email format, and validates the message before submission.

1. Copy `.env.example` to `.env`.
2. Set `VITE_CONTACT_ENDPOINT` to a **public endpoint URL**, for example `https://api.example.com/contact`.
3. Implement a backend endpoint that accepts `POST` JSON shaped as `{ "name": "...", "email": "...", "message": "..." }` and returns a successful 2xx status.
4. Configure CORS and apply server-side validation, rate limiting, abuse protection, and any required spam controls.
5. Restart Vite after editing `.env`.

If no endpoint is configured, the interface displays a clear **Local demo mode** message and does not send or persist the form data. `VITE_*` variables are bundled into public client code; **never put API keys, credentials, or other secrets in them**.

## Terminal commands

The interactive console supports only these browser-local demonstration commands:

- `help`
- `about`
- `status`
- `scan` — runs a delayed mock scan; no external target is contacted
- `whoami`
- `clear`

Unknown commands show an error. No shell, arbitrary JavaScript, network scanning, or server access is available from this terminal.

## Interaction and accessibility notes

- Responsive navigation includes a keyboard-focusable mobile toggle.
- Navigation links use native anchors, so they work without a router.
- Terminal input supports command history with the Up/Down arrow keys.
- Network nodes are real buttons with `aria-pressed` state.
- Form feedback uses live status/error regions; fields have labels and maximum lengths.
- `prefers-reduced-motion` is respected by reducing or disabling nonessential visual effects.
- The Canvas rain caps device pixel ratio to reduce GPU/memory cost and is hidden for reduced-motion preferences.
- Metrics and logs are intentionally fictional and labelled as simulation/demo data.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4 with the Vite plugin
- Motion for React (the current continuation of Framer Motion; imported from `motion/react`)
- Lucide React icons
- Custom CSS for the visual system and responsive interactions
