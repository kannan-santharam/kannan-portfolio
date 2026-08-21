export type Region = 'dubai' | 'india';

export interface RecruiterFact {
  label: string;
  value: string;
  subtext: string;
  iconName: 'Plane' | 'ShieldCheck' | 'Clock' | 'MessageSquare' | 'MapPin';
  color: string;
}

export interface RegionProfile {
  code: Region;
  flag: string;
  seekingLine: string;

  hero: {
    statusBadge: string;
    contactBadge?: string;
    visaBadge?: string;
    mobileStrip: string;
    readinessLabel: string;
    readinessValue: string;
    contactLabel: string;
    contactValue: string;
    whatsappMessage: string;
  };

  recruiterFacts: RecruiterFact[];
  sectionHeading: string;
  sectionBadge: string;
  navLabel: string;

  mobileBanner: {
    flag: string;
    text: string;
  };

  footer: {
    quickTopic?: { label: string; message: string };
    bannerBadge: string;
    heading: string;
    paragraph: string;
    monoLine: string;
    editionLabel: string;
  };

  resumeModal: {
    badge: string;
    contactLine: string;
    locationLine: string;
    statusBadge: string;
    visaBadge?: string;
  };

  botim?: true;
  seo: { title: string; description: string; keywords: string };
  resumePdf: string;
}

const RESUME_PDF = '/Kannan_Santharam_Senior_Lead_Software_Engineer.pdf';
const RESUME_PDF_INDIA = '/Kannan_Santharam_Senior_Lead_Software_Engineer_ind.pdf';

export const REGION_CONTENT: Record<Region, RegionProfile> = {
  dubai: {
    code: 'dubai',
    flag: '🇦🇪',
    seekingLine: 'Seeking a Lead Software Engineer / Engineering Manager role in Dubai, UAE.',

    hero: {
      statusBadge: 'Ready to Relocate to Dubai, UAE',
      contactBadge: 'BOTIM App & WhatsApp Active',
      visaBadge: 'Visa Sponsorship Required',
      mobileStrip: '🇦🇪 Relocation: Dubai, UAE',
      readinessLabel: 'Relocation Readiness:',
      readinessValue: 'Immediate to Dubai, UAE 🇦🇪',
      contactLabel: 'Direct UAE Contact:',
      contactValue: 'BOTIM & WhatsApp (+91 97902 47499)',
      whatsappMessage: 'Hi Kannan, I reviewed your portfolio and would like to connect regarding a role in Dubai.',
    },

    recruiterFacts: [
      {
        label: 'Relocation Target',
        value: 'Dubai, UAE 🇦🇪',
        subtext: 'Actively seeking roles across the Dubai tech ecosystem',
        iconName: 'Plane',
        color: 'theme-gold-text',
      },
      {
        label: 'Visa Sponsorship Status',
        value: 'Employment Visa Required',
        subtext: 'Requires standard UAE Employment Visa sponsorship from employer',
        iconName: 'ShieldCheck',
        color: 'text-emerald-500',
      },
      {
        label: 'Notice Period',
        value: '60 Days',
        subtext: 'Standard transition period from current Senior Lead role at SuperOps',
        iconName: 'Clock',
        color: 'theme-cyan-text',
      },
      {
        label: 'Direct UAE Communication',
        value: 'BOTIM & WhatsApp Active',
        subtext: 'Available on BOTIM App (+91 97902 47499) for UAE VoIP calling & messaging',
        iconName: 'MessageSquare',
        color: 'text-[#00F2FE]',
      },
    ],
    sectionHeading: 'Dubai & UAE Hiring Checklist',
    sectionBadge: 'Full Mobility Readiness',
    navLabel: 'Relocation & Visa',

    mobileBanner: {
      flag: '🇦🇪',
      text: 'Ready for Dubai, UAE',
    },

    footer: {
      quickTopic: {
        label: '🇦🇪 Dubai Role Inquiry',
        message: 'Hi Kannan, I reviewed your executive portfolio and would like to discuss a Lead Engineering role in Dubai, UAE.',
      },
      bannerBadge: '🇦🇪 Available for Dubai, UAE Hiring',
      heading: 'Ready to Lead & Accelerate Frontend Engineering in Dubai',
      paragraph: 'Seeking a Lead Frontend Engineer or Engineering Manager position with a tech product company in Dubai. Available on 60 days notice with full mobility for visa processing.',
      monoLine: 'Dubai Relocation Ready',
      editionLabel: 'Dubai, UAE Executive Portfolio Edition',
    },

    resumeModal: {
      badge: 'Dubai Hiring Ready',
      contactLine: 'Phone / BOTIM / WhatsApp',
      locationLine: 'Chennai, India · Notice Period: 60 Days · Target Location: Dubai, UAE (Relocation Ready)',
      statusBadge: '🇦🇪 Ready to Relocate to Dubai, UAE',
      visaBadge: 'Visa Sponsorship Required',
    },

    botim: true,

    seo: {
      title: 'Kannan Appiya Santharam | Senior Lead Software Engineer | Dubai, UAE',
      description: 'Senior Lead Software Engineer with 10.5+ years experience delivering high-performance monorepos, React 19, TypeScript, Rspack migrations, and AI-Native Engineering (Claude Code skills, MCP, SSE streaming). Ready to relocate to Dubai, UAE.',
      keywords: 'Software Lead Dubai, Lead Software Engineer Dubai, Engineering Manager UAE, Senior Lead Software Engineer, Rspack Migration, Claude Code MCP, AI Native Engineering',
    },
    resumePdf: RESUME_PDF,
  },

  india: {
    code: 'india',
    flag: '🇮🇳',
    seekingLine: 'Seeking a Senior Lead Software Engineer / Engineering Manager role in India.',

    hero: {
      statusBadge: 'Based in Chennai, India',
      contactBadge: 'WhatsApp Active',
      mobileStrip: '📍 Based in Chennai, India',
      readinessLabel: 'Current Location:',
      readinessValue: 'Chennai, India',
      contactLabel: 'Direct Contact:',
      contactValue: 'WhatsApp (+91 97902 47499)',
      whatsappMessage: 'Hi Kannan, I reviewed your portfolio and would like to connect regarding a role in India.',
    },

    recruiterFacts: [
      {
        label: 'Current Location',
        value: 'Chennai, India',
        subtext: 'Open to remote or on-site opportunities',
        iconName: 'MapPin',
        color: 'theme-gold-text',
      },
      {
        label: 'Employment Status',
        value: 'No Sponsorship Needed',
        subtext: 'Indian national based in India — no visa or relocation processing required',
        iconName: 'ShieldCheck',
        color: 'text-emerald-500',
      },
      {
        label: 'Notice Period',
        value: '60 Days',
        subtext: 'Standard transition period from current Senior Lead role at SuperOps',
        iconName: 'Clock',
        color: 'theme-cyan-text',
      },
      {
        label: 'Direct Communication',
        value: 'WhatsApp Active',
        subtext: 'Available on WhatsApp (+91 97902 47499) for calling & messaging',
        iconName: 'MessageSquare',
        color: 'text-[#00F2FE]',
      },
    ],
    sectionHeading: 'India Hiring Snapshot',
    sectionBadge: 'Immediately Available',
    navLabel: 'Location & Availability',

    mobileBanner: {
      flag: '📍',
      text: 'Based in Chennai, India',
    },

    footer: {
      bannerBadge: '📍 Based in Chennai, India',
      heading: 'Ready to Lead & Accelerate Frontend Engineering in India',
      paragraph: 'Seeking a Senior Lead Software Engineer or Engineering Manager position with a product company in India. Available on 60 days notice, open to remote or on-site roles.',
      monoLine: 'Chennai, India Based',
      editionLabel: 'India Executive Portfolio Edition',
    },

    resumeModal: {
      badge: 'India Hiring Ready',
      contactLine: 'Phone / WhatsApp',
      locationLine: 'Chennai, India · Notice Period: 60 Days',
      statusBadge: '📍 Based in Chennai, India',
    },

    seo: {
      title: 'Kannan Appiya Santharam | Senior Lead Software Engineer | Chennai, India',
      description: 'Senior Lead Software Engineer with 10.5+ years experience delivering high-performance monorepos, React 19, TypeScript, Rspack migrations, and AI-Native Engineering (Claude Code skills, MCP, SSE streaming). Based in Chennai, India.',
      keywords: 'Software Lead Chennai, Lead Software Engineer India, Engineering Manager India, Senior Lead Software Engineer, Rspack Migration, Claude Code MCP, AI Native Engineering',
    },
    resumePdf: RESUME_PDF_INDIA,
  },
};
