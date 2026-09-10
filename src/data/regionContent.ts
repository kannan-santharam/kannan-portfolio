import resumeContent from './resumeContent.json';
// Shared with vite.config.ts, which stamps the same strings into the static HTML
// for each region so crawlers and link previews see the right metadata pre-JS.
import seo from './seo.json';

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

  /** Region-specific portfolio link, from resumeContent.json's regions block. */
  portfolio: { url: string; display: string };

  hero: {
    statusBadge: string;
    visaBadge?: string;
    /** Role titles this region's resume asks for; mirrors resumeContent.json's `seeking`. */
    targetRole: string;
    /** The ask, stated in the headline block: role, place, and where from. */
    roleLine: string;
    /** Names what the contact section holds beyond WhatsApp, which differs by
        region: BOTIM is a UAE app and must never surface for India. */
    contactCtaLabel: string;
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
    seekingLine: resumeContent.regions.dubai.seeking,
    portfolio: {
      url: resumeContent.regions.dubai.portfolioUrl,
      display: resumeContent.regions.dubai.portfolio
    },

    hero: {
      statusBadge: 'Chennai, India → Dubai, UAE · Ready to Relocate',
      targetRole: 'Lead / Staff Engineer or Engineering Manager',
      roleLine: 'SEEKING LEAD / STAFF ENGINEER OR ENGINEERING MANAGER · DUBAI, UAE',
      contactCtaLabel: 'BOTIM, LinkedIn & More',
      visaBadge: 'Sponsorship Required',
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
        label: 'Direct Contact',
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
      heading: 'Ready to Lead & Accelerate Engineering Teams in Dubai',
      paragraph: 'Seeking a Lead / Staff Engineer or Engineering Manager position with a tech product company in Dubai. Available on 60 days notice with full mobility for visa processing.',
      monoLine: 'Dubai Relocation Ready',
    },

    resumeModal: {
      badge: 'Dubai Hiring Ready',
      contactLine: 'Phone / BOTIM / WhatsApp',
      locationLine: 'Chennai, India · Notice Period: 60 Days · Target Location: Dubai, UAE (Relocation Ready)',
      statusBadge: '🇦🇪 Ready to Relocate to Dubai, UAE',
      visaBadge: 'Sponsorship Required',
    },

    botim: true,

    seo: seo.dubai,
    resumePdf: RESUME_PDF,
  },

  india: {
    code: 'india',
    flag: '🇮🇳',
    seekingLine: resumeContent.regions.india.seeking,
    portfolio: {
      url: resumeContent.regions.india.portfolioUrl,
      display: resumeContent.regions.india.portfolio
    },

    hero: {
      statusBadge: 'Based in Chennai, India',
      targetRole: 'Senior Lead / Staff Engineer or Engineering Manager',
      roleLine: 'SEEKING SENIOR LEAD / STAFF ENGINEER OR ENGINEERING MANAGER · INDIA',
      contactCtaLabel: 'LinkedIn, GitHub & More',
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
    sectionBadge: 'No Sponsorship Needed',
    navLabel: 'Location & Availability',

    mobileBanner: {
      flag: '🇮🇳',
      text: 'Based in Chennai, India',
    },

    footer: {
      quickTopic: {
        label: '🇮🇳 India Role Inquiry',
        message: 'Hi Kannan, I reviewed your executive portfolio and would like to discuss a Senior Lead Engineering role in India.',
      },
      bannerBadge: '🇮🇳 Based in Chennai, India',
      heading: 'Ready to Lead & Accelerate Engineering Teams in India',
      paragraph: 'Seeking a Senior Lead / Staff Engineer or Engineering Manager position with a product company in India. Available on 60 days notice, open to remote or on-site roles.',
      monoLine: 'Chennai, India Based',
    },

    resumeModal: {
      badge: 'India Hiring Ready',
      contactLine: 'Phone / WhatsApp',
      locationLine: 'Chennai, India · Notice Period: 60 Days',
      statusBadge: '🇮🇳 Based in Chennai, India',
    },

    seo: seo.india,
    resumePdf: RESUME_PDF_INDIA,
  },
};
