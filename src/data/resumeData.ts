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
  skills: { name: string }[];
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
    skills: ["React", "TypeScript", "Node.js", "Python", "Rspack", "MCP Servers", "HTTP Web Streams", "Claude Code Skills", "Base UI", "Figma MCP", "GraphQL", "Apollo", "Playwright", "Zustand", "Knip"]
  },
  {
    id: "freshworks",
    featured: true,
    skills: ["React", "JavaScript", "Node.js", "MySQL", "REST APIs", "SaaS Integrations (Jira, Salesforce, Zendesk, ServiceNow)", "Customer 360", "SASS"]
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
  nationality: content.identity.nationality,
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

  // Bold lead-in for each snapshot line, parallel by index (shared with the PDF build).
  snapshotLeads: content.snapshotLeads,

  // Grouped competency lines (shared with the PDF build).
  competencies: content.competencies,

  // SITE-ONLY PRESENTATION DATA — deliberately absent from resumeContent.json.
  // `metrics` are the homepage metric cards; `skillCategories` (below) is the
  // interactive skills matrix. Neither
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
      description: "Reduced build time from 2 minutes to 5 seconds across 12 packages in a solo Webpack 5 → Rspack migration completed in 3 weeks.",
      subtext: "12 Packages · 3 Weeks Solo Project",
      badge: "Performance Architecture",
      iconName: "Zap"
    },
    {
      value: "Team Lead",
      label: "Engineering Team Leadership",
      description: "Lead and manage a frontend team of 4 to 6 engineers across sprint planning, architecture reviews, hiring and interviews, performance feedback and career development, and roadmap prioritisation for a platform serving 4,000+ MSP and IT enterprise customers.",
      subtext: "Cross-Functional Collaboration · Enterprise Scale",
      badge: "Engineering Leadership",
      iconName: "Users"
    },
    {
      value: "10+ Eng",
      label: "Developer Mentorship",
      description: "Mentored 10+ engineers across SuperOps and Freshworks on React, monorepo code quality standards, REST API development, and UI architecture.",
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
        { name: "Production Agent Skills (Claude Code)" },
        { name: "Model Context Protocol (MCP) Servers" },
        { name: "HTTP Web Streams (ReadableStream)" },
        { name: "Figma MCP (Design-to-Code)" },
        { name: "Cursor IDE & Agent Workflows" },
        { name: "GitHub Copilot" },
        { name: "LLM Orchestration & Prompting" },
        { name: "AI Agent Guardrails & Safety" },
        { name: "RAG & Embedding" },
        { name: "Amazon Bedrock AgentCore" }
      ]
    },
    {
      title: "Software Core & Frameworks",
      category: "frontend",
      skills: [
        { name: "React" },
        { name: "TypeScript" },
        { name: "JavaScript (ES6+)" },
        { name: "HTML5 & CSS3" },
        { name: "Tailwind CSS & SASS" },
        { name: "Responsive Web Design" },
        { name: "Performance Optimisation & Core Web Vitals" },
        { name: "Next.js" }
      ]
    },
    {
      title: "Backend & Full Stack",
      category: "backend",
      skills: [
        { name: "Node.js Backend Services" },
        { name: "REST API Design & Integration" },
        { name: "MySQL" },
        { name: "Python" }
      ]
    },
    {
      title: "State, Data & APIs",
      category: "state",
      skills: [
        { name: "GraphQL & Apollo Client" },
        { name: "Zustand State Management" },
        { name: "Custom Cached Query Hooks" }
      ]
    },
    {
      title: "Architecture & Performance",
      category: "architecture",
      skills: [
        { name: "Monorepos & Module Federation" },
        { name: "Rspack & Webpack 5" },
        { name: "Micro-Frontends" },
        { name: "Design Systems & UI SDKs" },
        { name: "Base UI Headless Components" },
        { name: "Role-Based Access Control (RBAC)" },
        { name: "Knip Static Dead-Code Analysis" }
      ]
    },
    {
      title: "Testing, DevOps & Cloud",
      category: "devops",
      skills: [
        { name: "Playwright End-to-End Suite (300+ tests)" },
        { name: "Unit Testing (Jest, Vitest)" },
        { name: "Jenkins CI/CD Pipelines" },
        { name: "Docker" },
        { name: "AWS (EC2, S3, Route 53)" }
      ]
    },
    {
      title: "Leadership & Process",
      category: "leadership",
      skills: [
        { name: "Engineering Team Leadership" },
        { name: "Solution Architecture & System Design" },
        { name: "Developer Mentorship (10+ engineers)" },
        { name: "Technical Knowledge Sharing" },
        { name: "Architecture & Code Reviews" },
        { name: "Agile & Scrum" },
        { name: "Git & GitHub Flow" },
        { name: "Cross-Team Collaboration" },
        { name: "Stakeholder Management & Customer Communication" }
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
