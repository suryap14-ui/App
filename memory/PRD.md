# BVMCS Revamp — AI-Native Website

## Original Problem Statement
"I want to revamp a website and that should look like AI" + "We need it with 3D animations included"

Source site: https://www.bvmcs.com/ — BVM Consultancy Services, a software development consultancy (UI/UX, Mobile, Cloud, Architectural, Testing, E-Commerce, Staffing, Frontend, Backend).

## User Choices
- Visual direction: animated particles + generative gradients + 3D orbs; bold AI-native aesthetic
- Color theme: deep navy (#060611) base, electric cyan (#00F0FF) + violet (#B026FF) accents
- Fonts: Unbounded (display), IBM Plex Sans (body), JetBrains Mono (overlines)
- AI chatbot: yes — both general assistant AND lead capture
- LLM: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via **Emergent Universal LLM Key**
- 3D animations: yes — real Three.js (not just CSS)

## Architecture
- **Backend**: FastAPI + MongoDB (motor). emergentintegrations.LlmChat for LLM. Endpoints: `/api/`, `/api/chat`, `/api/leads` (POST+GET), `/api/contact`.
- **Frontend**: React 19 + Tailwind + Framer Motion + Three.js (imperative, not @react-three/fiber JSX — needed to bypass the Emergent visual-edits babel transform).
- **3D**: `/app/frontend/src/components/HeroScene.jsx` — pure Three.js (`useEffect` + raw WebGL renderer). Two scenes: `HeroScene` (orb + 3 orbital rings + 4 floating icosahedra + 600-point particle field + mouse parallax) and `CapabilitiesScene` (decorative).

## Personas
- **Enterprise CTO / startup founder** — landing on the site to evaluate BVMCS as a development partner.
- **Curious dev** — exploring services, will likely engage with the chatbot before contacting.

## Core Requirements (Static)
- AI-native dark aesthetic with 3D animations
- All BVMCS services and content represented
- Working AI chatbot that converts curious visitors into leads
- Mobile-responsive
- Contact + lead-capture forms persist to MongoDB
- All interactive elements have `data-testid`

## What's Been Implemented (Jan 2026)
- **Hero**: gradient headline, animated 3D AI orb (rings + particles + floating polyhedra + mouse parallax), CTAs, stats grid
- **Services**: 9 service cards with hover glow gradient
- **Tech marquee**: continuous-scroll list of 20 technologies
- **Capabilities tabs**: 5 tabs (UI/UX, Frontend, Mobile, Backend, Testing) with bullet panel + decorative 3D scene
- **Work / Portfolio**: 4 bento-grid case study cards using BVMCS images
- **Testimonials**: 3 client cards + 12-logo marquee wall
- **Contact form** → POST /api/contact → MongoDB
- **AI Chatbot widget** (bottom-left to avoid Emergent badge): Nova persona, multi-turn conversations, lead-capture form triggered on buying-intent
- **Footer** with social icons + status indicator
- **Navigation**: sticky blurred nav, mobile hamburger
- **Backend testing**: 7/7 pytest tests pass. **Frontend testing**: 100% pass on iteration_2.

## Prioritized Backlog
- P1: Replace lead-form trigger regex with structured tool-call / classifier
- P1: Split App.js (886 lines) into per-section module files
- P2: Add `/case-studies/[slug]` detail pages
- P2: Blog/insights section to demonstrate engineering thought leadership
- P2: Streaming chatbot responses (SSE) for instant feedback
- P3: Admin dashboard for viewing captured leads
- P3: A/B test hero copy variants

## Next Tasks
- Iterate on copy with founder
- Wire real Calendly/Cal.com integration on "Start a project"

## Recent Changes
- 2026-01: Initial revamp delivered with hero 3D Three.js scene, AI chatbot (Claude Sonnet 4.5), contact + leads APIs. Iteration_1 found two issues (HeroScene not rendered, chatbot trigger collided with Emergent badge). Iteration_2 confirmed both fixes verified end-to-end.
