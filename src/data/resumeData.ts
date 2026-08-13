export interface ExperienceItem {
  id: string;
  company: string;
  location: string;
  period: string;
  title: string;
  progression?: string;
  highlights: string[];
  skills: string[];
  featured?: boolean;
}

export interface MetricItem {
  value: string;
  label: string;
  description: string;
  subtext: string;
  badge: string;
  iconName: string;
}

export interface SkillCategory {
  title: string;
  category: string;
  skills: { name: string; level?: 'Expert' | 'Advanced' | 'Proficient'; hot?: boolean }[];
}

export const RESUME_DATA = {
  name: "Kannan Appiya Santharam",
  title: "Senior Lead Software Engineer",
  subTitle: "React 19 · TypeScript · AI-Native Engineering · Large-Scale Monorepos",
  relocation: {
    targetCity: "Dubai, UAE",
    currentLocation: "Chennai, India",
    status: "Ready to Relocate to Dubai, UAE",
    visaStatus: "Employment Visa Sponsorship Required",
    noticePeriod: "60 Days",
    nationality: "Indian",
  },
  contact: {
    phone: "+91 97902 47499",
    phoneClean: "+919790247499",
    botim: "+91 97902 47499",
    email: "as.kannan4@gmail.com",
    linkedin: "https://linkedin.com/in/askannan",
    linkedinDisplay: "linkedin.com/in/askannan",
  },
  summary: `Senior Lead Software Engineer with 10.5 years of experience delivering high-performance web applications, monorepos, and scalable client architectures for global SaaS products. Specialised in AI-driven development and agentic workflows — LLM orchestration, custom Claude Code skills, MCP servers, and HTTP Streamable Web Streams (fetch + ReadableStream). Proven record of leading solo platform migrations, cutting build compilation time by 96%, and setting engineering standards and safety guardrails across distributed engineering teams. Seeking a Lead Software Engineer / Engineering Manager role with a product-led technology company in Dubai, UAE.`,
  
  metrics: [
    {
      value: "96%",
      label: "Build Speed Acceleration",
      description: "Reduced cold-start compilation from 2 minutes to 5 seconds across 12 packages in a solo Webpack 5 → Rspack migration completed in 3 weeks.",
      subtext: "12 Monorepo Packages · 3 Weeks Solo Project",
      badge: "Performance Architecture",
      iconName: "Zap"
    },
    {
      value: "AI-Native",
      label: "Test-Authoring & LLM Agents",
      description: "Architected end-to-end AI test platform from scratch using LLM agents over HTTP Streamable Web Streams to auto-generate, execute, and self-heal test suites.",
      subtext: "React · Node.js · HTTP Streamable · LLM Agents",
      badge: "GenAI & Agentic Tech",
      iconName: "Bot"
    },
    {
      value: "MCP / Claude",
      label: "Custom Claude Code Skills",
      description: "Authored custom production Claude Code skills via MCP servers, enforcing strict write-scope guardrails for safe autonomous agent workflows.",
      subtext: "Model Context Protocol · Custom Guardrails",
      badge: "Developer Productivity",
      iconName: "Cpu"
    },
    {
      value: "30k+",
      label: "Dead Code Stripped & 232 Specs",
      description: "Maintained 232-spec Playwright regression suite and executed Knip static analysis, eliminating 30,000 lines of unmaintained code across monorepo.",
      subtext: "Playwright · Knip · Monorepo Maintenance",
      badge: "Quality & Safety",
      iconName: "ShieldCheck"
    }
  ] as MetricItem[],

  aiCapabilities: [
    {
      title: "LLM Agent Orchestration & Real-Time HTTP Streaming",
      description: "Built an enterprise AI test-authoring engine using React & Node.js, streaming real-time LLM agent tool calls and test generation over HTTP Streamable Web Streams (fetch + ReadableStream).",
      tags: ["LLM Agents", "HTTP Streamable", "ReadableStream", "React 19", "Node.js", "Self-Healing Tests"]
    },
    {
      title: "Model Context Protocol (MCP) Servers & Skills",
      description: "Engineered custom production Claude Code skills connected via MCP servers to enable agents to query codebase symbols and safely generate refactors.",
      tags: ["Claude Code", "MCP (Model Context Protocol)", "MCP Servers", "Cursor IDE"]
    },
    {
      title: "Agent Guardrails & Strict Write-Scope Design",
      description: "Designed multi-tier permission boundaries ensuring autonomous AI coding agents only modify target domain modules without mutating core platform interfaces.",
      tags: ["Agent Safety", "Write-Scope Boundaries", "Security Control", "Amazon Bedrock AgentCore"]
    }
  ],

  experiences: [
    {
      id: "superops",
      company: "SuperOps",
      location: "Chennai, India",
      period: "Jul 2022 – Present",
      title: "Senior Lead Software Engineer",
      progression: "Senior Software Engineer → Lead Software Engineer → Senior Lead Software Engineer",
      featured: true,
      highlights: [
        "Architected an AI test-authoring platform from zero using React and Node.js, orchestrating LLM agents over HTTP Streamable Web Streams (fetch + ReadableStream) to auto-generate, run, and self-heal end-to-end test suites.",
        "Authored custom production Claude Code skills via MCP servers and enforced strict write-scope guardrails, securing autonomous agent workflows across the codebase.",
        "Executed a solo Webpack 5 to Rspack migration in 3 weeks, reducing cold-start build compilation from 2 minutes to 5 seconds across 12 packages.",
        "Improved application load times through React lazy loading, route-level code splitting and per-package chunking strategy across the monorepo.",
        "Maintained platform health with a 232-spec Playwright regression suite and Knip static analysis, stripping 30k lines of dead code from the monorepo.",
        "Sole-authored a reusable API / UI SDK integration framework adopted across product teams, standardising how features consume platform services.",
        "Built role-based access control (RBAC) gates and high-frequency polling dashboards using custom cached Apollo query hooks, balancing data freshness against network load."
      ],
      skills: ["React", "TypeScript", "Rspack", "MCP Servers", "HTTP Streamable", "Claude Code Skills", "GraphQL", "Apollo", "Playwright", "Zustand", "Knip"]
    },
    {
      id: "freshworks",
      company: "Freshworks",
      location: "Chennai, India",
      period: "Jun 2018 – Jul 2022",
      title: "Senior Software Engineer",
      progression: "Onboarding Engineer → Senior Software Engineer (Customer-Facing Engineering)",
      featured: true,
      highlights: [
        "Worked directly with enterprise customers alongside Support, Customer Success and Sales teams to understand complex requirements, then partnered with Product Design to deliver UI solutions.",
        "Built UI web pages and REST API services across Freshworks products using React, JavaScript, Node.js, HTML and SASS.",
        "Built a Customer 360 dashboard consolidating all customer support, sales, and account information into a single unified operational view.",
        "Integrated tier-1 enterprise SaaS platforms — Jira, Salesforce, Zendesk and ServiceNow — with Freshworks products through robust REST API services.",
        "Implemented multiple Freshworks add-ons and supporting REST API services to solve customer-specific operational use cases.",
        "Created UI wireframes and design mockups in Balsamiq; mentored engineers on add-on development and led code & UI design reviews."
      ],
      skills: ["React", "JavaScript", "Node.js", "REST APIs", "SaaS Integrations (Jira, Salesforce, Zendesk, ServiceNow)", "Customer 360", "SASS"]
    },
    {
      id: "infigenic",
      company: "Infigenic, LLC",
      location: "Bengaluru, India",
      period: "Jan 2018 – Jun 2018",
      title: "Software Developer",
      featured: false,
      highlights: [
        "Designed and implemented high-converting company web pages and product landing pages.",
        "Built a seamless integration connecting Freshservice with DocuSign using REST API services; the product was subsequently acquired by Freshworks."
      ],
      skills: ["JavaScript", "DocuSign API", "Freshservice Integration", "REST APIs", "HTML5/CSS3"]
    },
    {
      id: "niche",
      company: "Niche Video Media, LLC",
      location: "Chennai, India",
      period: "Mar 2016 – Dec 2017",
      title: "Web Application Developer & Designer",
      featured: false,
      highlights: [
        "Designed and implemented responsive web pages, landing pages, and custom plugins for a commercial video-hosting platform.",
        "Built a video player customisation feature from scratch — configurable player buttons, annotations, and call-to-action overlays.",
        "Implemented an administrative dashboard that dynamically generated Stripe pricing plans based on feature selection, storage tiers, and bandwidth tiers."
      ],
      skills: ["JavaScript", "HTML5", "CSS3", "Stripe API", "Video Player Customization", "Admin Dashboards"]
    }
  ] as ExperienceItem[],

  skillCategories: [
    {
      title: "AI & Agentic Tooling",
      category: "ai",
      skills: [
        { name: "Claude Code Skills", level: "Expert", hot: true },
        { name: "Model Context Protocol (MCP) Servers", level: "Expert", hot: true },
        { name: "HTTP Streamable (ReadableStream)", level: "Expert", hot: true },
        { name: "Cursor IDE & Agent Workflows", level: "Expert", hot: true },
        { name: "LLM Orchestration & Prompting", level: "Advanced", hot: true },
        { name: "Agent Write-Scope Safety", level: "Expert", hot: true },
        { name: "Amazon Bedrock AgentCore", level: "Proficient" }
      ]
    },
    {
      title: "Software Core & Frameworks",
      category: "frontend",
      skills: [
        { name: "React (React 19 / Compiler)", level: "Expert", hot: true },
        { name: "TypeScript", level: "Expert", hot: true },
        { name: "JavaScript (ES6+)", level: "Expert" },
        { name: "HTML5 & Semantic Web", level: "Expert" },
        { name: "CSS3 / SASS / Tailwind CSS", level: "Expert" }
      ]
    },
    {
      title: "State, Data & APIs",
      category: "state",
      skills: [
        { name: "GraphQL & Apollo Client", level: "Expert", hot: true },
        { name: "HTTP Streamable Web Streams", level: "Expert", hot: true },
        { name: "Zustand State Management", level: "Expert" },
        { name: "REST API Design & Integration", level: "Expert" },
        { name: "Custom Cached Query Hooks", level: "Expert" }
      ]
    },
    {
      title: "Architecture & Performance",
      category: "architecture",
      skills: [
        { name: "Monorepos & Module Federation", level: "Expert", hot: true },
        { name: "Rspack & Webpack 5 Migration", level: "Expert", hot: true },
        { name: "Micro-Frontends", level: "Advanced" },
        { name: "Design Systems & UI SDKs", level: "Expert" },
        { name: "Role-Based Access Control (RBAC)", level: "Expert" },
        { name: "Knip Static Dead-Code Analysis", level: "Expert" }
      ]
    },
    {
      title: "Testing, DevOps & Cloud",
      category: "devops",
      skills: [
        { name: "Playwright End-to-End Suite", level: "Expert", hot: true },
        { name: "Node.js Backend Services", level: "Advanced" },
        { name: "Jenkins CI/CD Pipelines", level: "Proficient" },
        { name: "AWS (EC2, S3, Route 53)", level: "Proficient" }
      ]
    },
    {
      title: "Leadership & Strategy",
      category: "leadership",
      skills: [
        { name: "Technical Team Leadership", level: "Expert" },
        { name: "Architecture & Design Reviews", level: "Expert" },
        { name: "Engineering Safety Standards", level: "Expert" },
        { name: "Developer Mentorship", level: "Expert" },
        { name: "Cross-Cultural Collaboration", level: "Expert" }
      ]
    }
  ] as SkillCategory[],

  education: {
    degree: "Bachelor of Engineering (B.E.), Computer Science",
    period: "2011 – 2015",
    institution: "K.L.N. College of Information Technology",
    location: "Tamil Nadu, India"
  },

  languages: [
    { name: "English", level: "Fluent (Professional Working Proficiency)" },
    { name: "Tamil", level: "Native" },
    { name: "Hindi", level: "Basic" }
  ]
};
