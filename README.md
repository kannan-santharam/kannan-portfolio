# Kannan Appiya Santharam — Executive Portfolio & AI Career Agent

> **Senior Lead Software Engineer (Lead Frontend Engineer)** with 10.5+ years of experience delivering high-performance web applications, large-scale monorepos, and scalable client architectures for global SaaS products. Specialised in frontend infrastructure, AI-driven engineering workflows, LLM orchestration, custom Claude Code skills, Model Context Protocol (MCP) servers, and HTTP Streamable Web Streams (`fetch` + `ReadableStream`).
>
> 🌐 **Live Portfolio:** [https://kannan-ai-dev.vercel.app/](https://kannan-ai-dev.vercel.app/)  
> 📄 **Official PDF Resume:** [Download PDF](https://kannan-ai-dev.vercel.app/Kannan_Santharam_Senior_Lead_Software_Engineer.pdf)  
> 🇦🇪 **Relocation Readiness:** Chennai, India ➔ Ready to Relocate to Dubai, UAE (60-Day Notice Period)

---

## 🌟 Key Architecture & Engineering Highlights

* **AI-Native Engineering & Autonomous Tooling:** Architected an automated end-to-end test authoring platform from zero, orchestrating LLM agents over HTTP Streamable Web Streams (`fetch` + `ReadableStream`) to auto-generate, execute, and self-heal test suites. Authored custom production Claude Code skills and engineered Model Context Protocol (MCP) servers with strict multi-tier write-scope guardrails.
* **96% Build Speed Acceleration (Rspack Migration):** Solo-led a 3-week build migration from Webpack 5 to Rust-powered Rspack across 12 monorepo packages at SuperOps. Reduced cold-start build compilation from 2 minutes (120s) down to 5 seconds, with HMR hot reloads under 50ms.
* **Frontend Engineering Squad Leadership:** Led an engineering squad of frontend developers at SuperOps, governing architecture reviews, sprint execution, and cross-team delivery supporting **4,000+ MSP and IT enterprise customers**.
* **Developer Mentorship:** Mentored 6 to 7 junior and onboarding engineers across SuperOps and Freshworks on React best practices, REST API development, and UI architecture to accelerate team ramp-up.
* **Dead Code Elimination:** Stripped 30,000+ lines of dead code and unreferenced exports across 12 packages using Knip static analysis.
* **Enterprise Test Reliability:** Maintained platform stability with a 232-spec Playwright regression test suite integrated into Jenkins CI/CD pipelines.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend Core** | React 19, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, SASS, Responsive Design, Core Web Vitals |
| **AI & Agentic Tech** | Claude Code Skills, Model Context Protocol (MCP) Servers, Gemini 2.5 Flash, LLM Orchestration, HTTP Streamable (ReadableStream), Langfuse Observability |
| **State & APIs** | GraphQL, Apollo Client, REST API Design, Zustand, Custom Cached Query Hooks, Server-Sent Events (SSE) |
| **Build & Architecture** | Vite, Rust-powered Rspack, Webpack 5, Monorepos, Micro-Frontends, Knip Static Analysis, Design Systems, RBAC |
| **Testing & DevOps** | Playwright (232 Specs), Node.js, Jenkins CI/CD, Docker, AWS (EC2, S3, Route 53) |

---

## 🤖 AI Career Assistant — DocMind (Embedded)

The portfolio's "Ask AI" experience is powered by [DocMind](https://docmind-rag-llm.vercel.app), a standalone agentic RAG chatbot ([source](https://github.com/kannan-santharam/DocMind)) preloaded with Kannan's professional profile, embedded full-screen via an iframe overlay:

* **Agentic RAG:** A tool-calling Gemini agent decides *when* to retrieve, rewrites its own query when results come back thin, and streams its decision trail to the UI.
* **Grounded Answers:** Every answer cites the exact source passage; recruiters can also upload their own job description and ask against it.
* **Stack:** Next.js 16, TypeScript, Gemini function calling, Supabase Postgres + pgvector (HNSW, cosine), [Langfuse](https://langfuse.com/) tracing, deployed on Vercel.

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js:** `>= 18.0.0`
* **pnpm:** `>= 9.0.0`

### Installation & Development

```bash
# 1. Clone repository
git clone https://github.com/kannan-santharam/kannan-portfolio.git
cd kannan-portfolio

# 2. Install dependencies
pnpm install

# 3. Start local development server
pnpm dev
```

### Production Build & Verification

```bash
# Type check and build production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## 📁 Repository Structure

```text
├── public/
│   ├── Kannan_Santharam_Senior_Lead_Software_Engineer.pdf   # Canonical ATS Resume PDF
│   ├── Kannan_Santharam_Cover_Letter_Careem.pdf             # Executive Careem Cover Letter PDF
│   └── favicon.svg, icons.svg, kannanphoto.jpeg
├── src/
│   ├── components/                 # React UI Components (Hero, Resume Modal, DocMind Overlay, etc.)
│   ├── data/                       # Resume data and Skills Matrix
│   └── index.css, App.tsx, main.tsx
├── vite.config.ts                  # Clean, declarative Vite configuration
└── package.json
```

---

## 📬 Contact & Connect

* **Location:** Chennai, India (Ready to Relocate to Dubai, UAE)
* **Phone / WhatsApp / BOTIM:** [+91 97902 47499](https://wa.me/919790247499)
* **Email:** [as.kannan4@gmail.com](mailto:as.kannan4@gmail.com)
* **LinkedIn:** [linkedin.com/in/askannan](https://linkedin.com/in/askannan)
* **GitHub:** [github.com/kannan-santharam](https://github.com/kannan-santharam)
