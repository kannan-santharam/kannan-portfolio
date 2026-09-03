import content from './resumeContent.json';

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

/**
 * Site-only presentation metadata for each role. resumeContent.json has no
 * equivalent for these — `id` is a UI selection key, `featured` drives a badge,
 * and `skills` are the tech chips shown in the timeline. Zipped by index onto
 * the JSON's `experience` array (same order, reverse-chronological). Adding a role
 * to the JSON requires a matching entry here, in the same position.
 */
const EXPERIENCE_PRESENTATION: { id: string; featured: boolean; skills: string[] }[] = [
  {
    id: "superops",
    featured: true,
    skills: ["React", "TypeScript", "Rspack", "MCP Servers", "HTTP Streamable", "Claude Code Skills", "Base UI", "Figma MCP", "GraphQL", "Apollo", "Playwright", "Zustand", "Knip"]
  },
  {
    id: "freshworks",
    featured: true,
    skills: ["React", "JavaScript", "Node.js", "REST APIs", "SaaS Integrations (Jira, Salesforce, Zendesk, ServiceNow)", "Customer 360", "SASS"]
  },
  {
    id: "niche-infigenic",
    featured: false,
    skills: ["JavaScript", "HTML5", "CSS3", "Responsive Design", "Stripe API", "REST APIs", "DocuSign API"]
  }
];

/**
 * resumeContent.json embeds the location in `company`, e.g.
 * "SuperOps — Chennai, India". Split on any dash separator (em/en/hyphen) so
 * the JSON stays editable with whichever dash the author types.
 */
const splitCompany = (value: string): { company: string; location: string } => {
  const parts = value.split(/\s+[—–-]\s+/);
  return {
    company: parts[0].trim(),
    location: parts.slice(1).join(' — ').trim()
  };
};

const experiences: ExperienceItem[] = content.experience.map((exp, idx) => {
  const { company, location } = splitCompany(exp.company);
  const presentation = EXPERIENCE_PRESENTATION[idx];
  return {
    id: presentation.id,
    company,
    location,
    period: exp.dates,
    title: exp.title,
    progression: exp.progression.join(' → '),
    highlights: exp.bullets,
    skills: presentation.skills,
    featured: presentation.featured
  };
});

export const RESUME_DATA = {
  name: content.identity.name,
  title: content.identity.title,
  relocation: {
    noticePeriod: content.identity.noticePeriod,
  },
  contact: {
    phone: content.contact.phone,
    phoneClean: content.contact.phoneClean,
    email: content.contact.email,
    // NOTE: the JSON stores display text under `linkedin`/`github` and the href
    // under `linkedinUrl`/`githubUrl`. The site's convention is the reverse.
    linkedin: content.contact.linkedinUrl,
    linkedinDisplay: content.contact.linkedin,
    github: content.contact.githubUrl,
    githubDisplay: content.contact.github,
  },
  // `summaryTemplate` ends with a `{seeking}` placeholder; the region-specific
  // seeking sentence is appended at render time (ResumeModal + content.seekingLine).
  summary: content.summaryTemplate.replace(/\s*\{seeking\}\s*/, ' ').trim(),

  // Business-impact highlight bullets (shared with the PDF build).
  snapshot: content.snapshot,

  // Grouped competency lines (shared with the PDF build).
  competencies: content.competencies,

  // SITE-ONLY PRESENTATION DATA — deliberately absent from resumeContent.json.
  // `metrics` are the homepage metric cards; `skillCategories` (below) is the
  // interactive skills matrix with proficiency levels and `hot` flags. Neither
  // has an equivalent in the resume PDFs, so their omission from the JSON
  // single source of truth is intentional, not an oversight. Edit them here.
  metrics: [
    {
      value: "AI-Native",
      label: "AI Platform & Agentic Tooling",
      description: "Architected an AI test platform via Web Streams, and built a headless Base UI design system on customised design tokens whose Claude Code skill turns a Figma node link into production components.",
      subtext: "MCP Servers · Claude Code · Figma MCP",
      badge: "GenAI & Agentic Tech",
      iconName: "Bot"
    },
    {
      value: "96%",
      label: "Build Speed Acceleration",
      description: "Reduced cold-start compilation from 2 minutes to 5 seconds across 12 packages in a solo Webpack 5 → Rspack migration completed in 3 weeks.",
      subtext: "12 Packages · 3 Weeks Solo Project",
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
      value: "10+ Eng",
      label: "Developer Mentorship",
      description: "Mentored 10+ junior and mid-level engineers across SuperOps and Freshworks on React, monorepo quality standards, REST API development, and UI architecture.",
      subtext: "Talent Development & Ramp-Up Acceleration",
      badge: "People & Growth",
      iconName: "Award"
    }
  ] as MetricItem[],

  experiences,

  // SITE-ONLY PRESENTATION DATA — see the note above `metrics`.
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
        { name: "Core Web Vitals", level: "Expert" },
        { name: "Next.js", level: "Proficient" }
      ]
    },
    {
      title: "Backend & Full Stack",
      category: "backend",
      skills: [
        { name: "Node.js Backend Services", level: "Advanced" },
        { name: "REST API Design & Integration", level: "Expert" },
        { name: "Python", level: "Proficient" }
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
        { name: "Custom Cached Query Hooks", level: "Expert" }
      ]
    },
    {
      title: "Architecture & Performance",
      category: "architecture",
      skills: [
        { name: "Monorepos & Module Federation", level: "Expert", hot: true },
        { name: "Rspack & Webpack 5", level: "Expert", hot: true },
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
        { name: "Playwright End-to-End Suite (300+ tests)", level: "Expert", hot: true },
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
        { name: "Developer Mentorship (10+ engineers)", level: "Expert" },
        { name: "Technical Knowledge Sharing", level: "Expert", hot: true },
        { name: "Architecture & Code Reviews", level: "Expert" },
        { name: "Agile Methodology", level: "Expert" },
        { name: "Git & GitHub Flow", level: "Expert" },
        { name: "Cross-Team Collaboration", level: "Expert" }
      ]
    }
  ] as SkillCategory[],

  education: {
    degree: content.education.degree,
    // The JSON's `institution` already embeds the location.
    institution: content.education.institution,
    period: content.education.years
  },

  languages: content.languages
};
