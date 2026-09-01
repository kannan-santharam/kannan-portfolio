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
  title: "Senior Lead Software Engineer (Lead Frontend Engineer)",
  subTitle: "React · Node.js · AI-Native Engineering · Large-Scale Monorepos",
  relocation: {
    noticePeriod: "60 Days",
  },
  contact: {
    phone: "+91 97902 47499",
    phoneClean: "+919790247499",
    botim: "+91 97902 47499",
    email: "as.kannan4@gmail.com",
    linkedin: "https://linkedin.com/in/askannan",
    linkedinDisplay: "linkedin.com/in/askannan",
    github: "https://github.com/kannan-santharam",
    githubDisplay: "github.com/kannan-santharam",
  },
  summary: `Senior Lead Software Engineer with 10.5+ years of experience turning AI-native engineering into measurable business impact: architected an AI test-authoring platform and LLM-orchestrated agent workflows, backed by custom Claude Code skills and Model Context Protocol (MCP) servers with strict write-scope guardrails, cutting manual test effort and speeding releases. Delivered a 96% build-time reduction reclaiming hundreds of engineering hours monthly and eliminated 30,000+ lines of dead code, without disrupting a platform serving 4,000+ MSP and IT enterprise customers. Proven record leading solo platform migrations and mentoring engineering teams.`,
  
  metrics: [
    {
      value: "AI-Native",
      label: "AI Platform & Agentic Tooling",
      description: "Architected an AI test platform via Web Streams, and shipped Claude Code skills that turn a Figma node link into production Base UI components.",
      subtext: "MCP Servers · Claude Code · Figma MCP",
      badge: "GenAI & Agentic Tech",
      iconName: "Bot"
    },
    {
      value: "96%",
      label: "Build Speed Acceleration",
      description: "Reduced cold-start compilation from 2 minutes to 5 seconds across 12 packages in a solo Webpack 5 → Rspack migration completed in 3 weeks.",
      subtext: "12 Monorepo Packages · 3 Weeks Solo Project",
      badge: "Performance Architecture",
      iconName: "Zap"
    },
    {
      value: "Squad Lead",
      label: "Frontend Squad Leadership",
      description: "Led an engineering squad driving sprint execution, architecture reviews, and cross-team delivery for 4,000+ enterprise customers.",
      subtext: "Cross-Functional Collaboration · Enterprise Scale",
      badge: "Engineering Leadership",
      iconName: "Users"
    },
    {
      value: "6–7 Eng",
      label: "Developer Mentorship",
      description: "Mentored 6 to 7 junior and onboarding software engineers across React, REST API development, and UI architecture.",
      subtext: "Talent Development & Ramp-Up Acceleration",
      badge: "People & Growth",
      iconName: "Award"
    }
  ] as MetricItem[],

  experiences: [
    {
      id: "superops",
      company: "SuperOps",
      location: "Chennai, India",
      period: "Jul 2022 to Present",
      title: "Senior Lead Software Engineer",
      progression: "Senior Software Engineer → Lead Software Engineer → Senior Lead Software Engineer",
      featured: true,
      highlights: [
        "Led an engineering squad of frontend developers, driving sprint execution, architecture reviews, and cross-team collaboration across product, design, and QA to deliver enterprise features supporting 4,000+ MSP and IT enterprise customers.",
        "Mentored junior and mid-level engineers on React best practices and monorepo code quality, while standardizing a reusable UI SDK framework adopted across product teams.",
        "Architected an AI test authoring platform from zero using React and Node.js, orchestrating LLM agents over HTTP Streamable Web Streams (fetch + ReadableStream) to auto-generate, run, and self-heal end-to-end test suites.",
        "Authored custom production Claude Code skills and engineered Model Context Protocol (MCP) servers, establishing strict multi-tier write-scope guardrails to secure autonomous agent workflows across the codebase.",
        "Built a headless design system from scratch on Base UI, and authored a custom Claude Code skill that pulls design context from a Figma node link through an MCP server to generate production components automatically, cutting page build time from 2 days of AI-assisted engineering to a few hours.",
        "Executed a solo Webpack 5 to Rspack migration in 3 weeks, reducing cold-start build compilation from 2 minutes to 5 seconds across 12 packages.",
        "Improved application load times through React lazy loading, route-level code splitting and per-package chunking strategy across the monorepo.",
        "Eliminated 30,000+ lines of dead code and unused dependencies across the monorepo using Knip static analysis.",
        "Maintained platform health with a 232-spec Playwright regression suite in Jenkins CI.",
        "Built role-based access control (RBAC) gates and high-frequency polling dashboards using custom cached Apollo query hooks, balancing data freshness against network load."
      ],
      skills: ["React", "TypeScript", "Rspack", "MCP Servers", "HTTP Streamable", "Claude Code Skills", "Base UI", "Figma MCP", "GraphQL", "Apollo", "Playwright", "Zustand", "Knip"]
    },
    {
      id: "freshworks",
      company: "Freshworks",
      location: "Chennai, India",
      period: "Jun 2018 to Jul 2022",
      title: "Senior Software Engineer",
      progression: "Onboarding Engineer → Senior Software Engineer (Customer-Facing Engineering)",
      featured: true,
      highlights: [
        "Mentored 6 to 7 junior and onboarding software engineers on React, REST API development, and UI architecture, conducting regular code and design reviews to accelerate ramp-up time.",
        "Worked directly with enterprise customers alongside Support, Customer Success and Sales teams to understand complex requirements, then partnered with Product Design to deliver UI solutions.",
        "Built UI web pages and REST API services across Freshworks products using React, JavaScript, Node.js, HTML and SASS.",
        "Built a Customer 360 dashboard consolidating all customer support, sales, and account information into a single unified operational view.",
        "Integrated tier 1 enterprise SaaS platforms including Jira, Salesforce, Zendesk and ServiceNow with Freshworks products through robust REST API services.",
        "Implemented multiple Freshworks add-ons and supporting REST API services to solve customer-specific operational use cases.",
        "Created UI wireframes and design mockups in Balsamiq, and led code & UI design reviews."
      ],
      skills: ["React", "JavaScript", "Node.js", "REST APIs", "SaaS Integrations (Jira, Salesforce, Zendesk, ServiceNow)", "Customer 360", "SASS"]
    },
    {
      id: "niche-infigenic",
      company: "Niche Video Media, LLC / Infigenic, LLC (acquired by Freshworks)",
      location: "Chennai & Bengaluru, India",
      period: "Mar 2016 to Jun 2018",
      title: "Software Developer",
      progression: "Web Application Developer & Designer → Software Developer",
      featured: false,
      highlights: [
        "Designed and implemented responsive web pages, landing pages, and custom plugins for a commercial video-hosting platform.",
        "Built a video player customisation feature from scratch with configurable player buttons, annotations, and call-to-action overlays.",
        "Implemented an administrative dashboard that dynamically calculated Stripe pricing plans based on feature selection, storage tiers, and bandwidth limits.",
        "Built high-converting company and product landing pages supporting top-of-funnel demand.",
        "Built a seamless integration connecting Freshservice with DocuSign using REST API services, joining Freshworks with the team on acquisition."
      ],
      skills: ["JavaScript", "HTML5", "CSS3", "Responsive Design", "Stripe API", "REST APIs", "DocuSign API"]
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
        { name: "Figma MCP (Design-to-Code)", level: "Expert", hot: true },
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
        { name: "React", level: "Expert", hot: true },
        { name: "TypeScript", level: "Expert", hot: true },
        { name: "JavaScript (ES6+)", level: "Expert" },
        { name: "HTML5 & CSS3", level: "Expert" },
        { name: "Tailwind CSS & SASS", level: "Expert" },
        { name: "Responsive Web Design", level: "Expert" },
        { name: "Core Web Vitals", level: "Expert" }
      ]
    },
    {
      title: "State, Data & APIs",
      category: "state",
      skills: [
        { name: "GraphQL & Apollo Client", level: "Expert", hot: true },
        { name: "HTTP Streamable Web Streams", level: "Expert", hot: true },
        { name: "Server-Sent Events (SSE)", level: "Expert", hot: true },
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
        { name: "Base UI Headless Components", level: "Expert", hot: true },
        { name: "Role-Based Access Control (RBAC)", level: "Expert" },
        { name: "Knip Static Dead-Code Analysis", level: "Expert" }
      ]
    },
    {
      title: "Testing, DevOps & Cloud",
      category: "devops",
      skills: [
        { name: "Playwright End-to-End Suite (232 specs)", level: "Expert", hot: true },
        { name: "Node.js Backend Services", level: "Advanced" },
        { name: "Jenkins CI/CD Pipelines", level: "Proficient" },
        { name: "Docker", level: "Proficient" },
        { name: "AWS (EC2, S3, Route 53)", level: "Proficient" }
      ]
    },
    {
      title: "Leadership & Process",
      category: "leadership",
      skills: [
        { name: "Engineering Squad Leadership", level: "Expert" },
        { name: "Developer Mentorship (6 to 7 engineers)", level: "Expert" },
        { name: "Technical Knowledge Sharing", level: "Expert", hot: true },
        { name: "Architecture & Code Reviews", level: "Expert" },
        { name: "Agile Methodology", level: "Expert" },
        { name: "Git & GitHub Flow", level: "Expert" },
        { name: "Cross-Team Collaboration", level: "Expert" }
      ]
    }
  ] as SkillCategory[],

  education: {
    degree: "Bachelor of Engineering (B.E.), Computer Science",
    period: "2011 to 2015",
    institution: "K.L.N. College of Information Technology",
    location: "Tamil Nadu, India"
  },

  languages: [
    { name: "English", level: "Fluent (Professional Working Proficiency)" },
    { name: "Tamil", level: "Native" },
    { name: "Hindi", level: "Intermediate" }
  ]
};
