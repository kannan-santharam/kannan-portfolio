#!/usr/bin/env python3
"""Build public/Kannan_Santharam_Senior_Lead_Software_Engineer_Business_Impact.pdf.

Reproduces the visual format of the shipped resume
(public/Kannan_Santharam_Senior_Lead_Software_Engineer.pdf); every geometry
constant below was measured from that file's raw content stream.

Usage:  python3 scripts/build_business_resume.py [out.pdf]
Needs:  pip install reportlab pypdf
"""
import os
import re
import sys

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas

# ---------------------------------------------------------------- geometry ----
PAGE_W, PAGE_H = 595.2756, 841.8898
LEFT = 49.15
CONTENT_W = 496.9756
RIGHT = LEFT + CONTENT_W

TOP_BASELINE_P1 = 790.8898          # name baseline, page 1
TOP_BASELINE_CONT = 801.3898        # first baseline on continuation pages
BOTTOM_LIMIT = 44.0                 # lowest permitted baseline

BODY_SIZE, BODY_LEAD = 10.5, 13.8
BLOCK_GAP = 14.6                    # last baseline -> next block's first baseline
SECTION_GAP = 20.9                  # last baseline -> section header baseline
RULE_DROP = 5.5                     # section header baseline -> rule y
RULE_TO_BODY = 13.0                 # rule y -> first content baseline
TITLE_TO_COMPANY = 13.5
COMPANY_TO_SUB = 12.0
SUB_TO_BULLET = 14.3
JOB_GAP = 16.1                      # last bullet baseline -> next job title baseline
SECTION_SIZE, JOB_SIZE, SUB_SIZE = 11.5, 10.5, 9.0

NAVY = (0.121569, 0.219608, 0.392157)
BLUE = (0.180392, 0.454902, 0.709804)
BODY = (0.2, 0.2, 0.2)
LINK = (0.0, 0.321569, 1.0)
GRAY = (0.333333, 0.333333, 0.333333)

F1, F2, F3, F4 = 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Symbol'
ARROW = '→'          # Symbol font maps this to arrowright; a raw \xae is a box
BULLET = '•' + '   '
HANG = pdfmetrics.stringWidth(BULLET, F1, BODY_SIZE)
assert abs(HANG - 12.432) < 0.01, f'bullet hang drifted: {HANG}'
SEP = '  |  '


# -------------------------------------------------------------- run helpers ----
def run(t, f=F1, s=BODY_SIZE, c=BODY, url=None):
    return {'t': t, 'f': f, 's': s, 'c': c, 'url': url}


def runs_width(rs):
    return sum(pdfmetrics.stringWidth(r['t'], r['f'], r['s']) for r in rs)


def wrap(rs, width_first, width_rest):
    words = []
    for r in rs:
        for part in re.split(r'(\s+)', r['t']):
            if part:
                words.append(dict(r, t=part))
    lines, cur, cur_w = [], [], 0.0
    for w in words:
        ww = pdfmetrics.stringWidth(w['t'], w['f'], w['s'])
        if w['t'].isspace():
            if cur:
                cur.append(w)
                cur_w += ww
            continue
        limit = width_first if not lines else width_rest
        if cur and cur_w + ww > limit:
            while cur and cur[-1]['t'].isspace():
                cur_w -= pdfmetrics.stringWidth(cur[-1]['t'], cur[-1]['f'], cur[-1]['s'])
                cur.pop()
            lines.append(cur)
            cur, cur_w = [w], ww
        else:
            cur.append(w)
            cur_w += ww
    if cur:
        while cur and cur[-1]['t'].isspace():
            cur.pop()
        lines.append(cur)
    return lines or [[]]


class Doc:
    def __init__(self, path, subject='Business Impact Resume'):
        self.c = canvas.Canvas(path, pagesize=(PAGE_W, PAGE_H))
        self.c.setTitle('Kannan Appiya Santharam - Senior Lead Software Engineer')
        self.c.setAuthor('Kannan Appiya Santharam')
        self.c.setSubject(subject)
        self.page = 1
        self.y = TOP_BASELINE_P1

    def newpage(self):
        self.c.showPage()
        self.page += 1
        self.y = TOP_BASELINE_CONT

    def draw_line(self, line, x, y):
        # Coalesce same-style runs so text extractors (ATS) see whole phrases.
        merged = []
        for r in line:
            if merged and all(merged[-1][k] == r[k] for k in ('f', 's', 'c', 'url')):
                merged[-1] = dict(merged[-1], t=merged[-1]['t'] + r['t'])
            else:
                merged.append(dict(r))
        for r in merged:
            w = pdfmetrics.stringWidth(r['t'], r['f'], r['s'])
            self.c.setFont(r['f'], r['s'])
            self.c.setFillColorRGB(*r['c'])
            self.c.drawString(x, y, r['t'])
            if r['url']:
                self.c.linkURL(r['url'], (x, y - 3.0, x + w, y + r['s'] * 0.86), relative=0)
            x += w
        return x

    def flow(self, lines, x_first, x_rest, lead=BODY_LEAD):
        for i, line in enumerate(lines):
            if self.y < BOTTOM_LIMIT:
                self.newpage()
            x = x_first if i == 0 else x_rest
            end = x + runs_width(line)
            assert end <= RIGHT + 0.05, (
                f'line overruns right margin by {end - RIGHT:.1f}pt: '
                + ''.join(r['t'] for r in line))
            self.draw_line(line, x, self.y)
            if i < len(lines) - 1:
                self.y -= lead

    def centered(self, rs, gap):
        self.y -= gap
        width = runs_width(rs)
        assert width <= CONTENT_W, (
            f'header line overflows by {width - CONTENT_W:.1f}pt: '
            + ''.join(r['t'] for r in rs))
        self.draw_line(rs, LEFT + (CONTENT_W - width) / 2.0, self.y)

    def section(self, title):
        if self.y - SECTION_GAP - RULE_DROP - RULE_TO_BODY - BODY_LEAD < BOTTOM_LIMIT:
            self.newpage()
            self.y += SECTION_GAP
        self.y -= SECTION_GAP
        self.c.setFont(F2, SECTION_SIZE)
        self.c.setFillColorRGB(*NAVY)
        self.c.drawString(LEFT, self.y, title)
        rule_y = self.y - RULE_DROP
        self.c.setLineWidth(1)
        self.c.setLineCap(1)
        self.c.setStrokeColorRGB(*NAVY)
        self.c.line(LEFT, rule_y, RIGHT, rule_y)
        self.y = rule_y - RULE_TO_BODY

    def paragraph(self, rs, gap=None):
        if gap is not None:
            self.y -= gap
        self.flow(wrap(rs, CONTENT_W, CONTENT_W), LEFT, LEFT)

    def bullet(self, rs, gap=None):
        if isinstance(rs, str):
            rs = [run(rs)]
        if gap is not None:
            self.y -= gap
        col = LEFT + 14.0            # source PDF's bullet text column
        body = wrap(rs, RIGHT - col, RIGHT - col)
        self.flow([[run(BULLET)] + body[0]] + body[1:], col - HANG, col)

    def job(self, title, dates, company, sub, bullets, gap):
        need = TITLE_TO_COMPANY + COMPANY_TO_SUB * bool(sub) + SUB_TO_BULLET + BODY_LEAD
        if self.y - gap - need < BOTTOM_LIMIT:
            self.newpage()
        else:
            self.y -= gap
        self.c.setFont(F2, JOB_SIZE)
        self.c.setFillColorRGB(*BODY)
        self.c.drawString(LEFT, self.y, title)
        self.c.drawString(RIGHT - pdfmetrics.stringWidth(dates, F2, JOB_SIZE), self.y, dates)
        self.y -= TITLE_TO_COMPANY
        self.c.setFillColorRGB(*BLUE)
        self.c.drawString(LEFT, self.y, company)
        if sub:
            self.y -= COMPANY_TO_SUB
            self.draw_line(sub, LEFT, self.y)
        for i, b in enumerate(bullets):
            self.bullet(b, gap=SUB_TO_BULLET if i == 0 else BLOCK_GAP)

    def save(self):
        self.c.save()


def progression(*steps):
    rs = [run('Progression: ', F3, SUB_SIZE, GRAY)]
    for i, s in enumerate(steps):
        if i:
            rs.append(run(' ' + ARROW + ' ', F4, SUB_SIZE, GRAY))
        rs.append(run(s, F3, SUB_SIZE, GRAY))
    return rs


def lbl(label, rest):
    return [run(label, F2), run(rest)]


# ------------------------------------------------------------------ content ----
TITLE_LINE = 'Senior Lead Software Engineer (Full Stack Engineer)'
TAGLINE = 'Business Impact · AI-Native Delivery'

SUMMARY_TMPL = (
    'Full stack Senior Lead Software Engineer with 10.5+ years in B2B SaaS, working across React and '
    'Node.js. Currently leading an engineering team on a platform serving 4,000+ MSP and IT enterprise '
    'customers, focused on AI-native engineering with LLM orchestration, MCP servers, and production '
    'agent skills. {seeking}'
)

EMAIL = ('as.kannan4@gmail.com', 'mailto:as.kannan4@gmail.com')
LINKEDIN = ('linkedin.com/in/askannan', 'https://linkedin.com/in/askannan')
GITHUB = ('github.com/kannan-santharam', 'https://github.com/kannan-santharam')

REGIONS = {
    'dubai': dict(
        out='public/Kannan_Santharam_Senior_Lead_Software_Engineer_Business_Impact.pdf',
        subject='Business Impact Resume - Dubai, UAE',
        seeking='Seeking a Lead Software Engineer / Engineering Manager role in Dubai, UAE.',
        portfolio=('kannan-ai-dev.vercel.app', 'https://kannan-ai-dev.vercel.app'),
        # Dubai keeps the relocation line and BOTIM, so contacts need three rows.
        rows=lambda R: [
            ([run('Chennai, India \u2014 Ready to Relocate to Dubai, UAE', F1, 10), run(SEP, F1, 10),
              run('+91 97902 47499 (Phone / BOTIM / WhatsApp)', F1, 10)], 14.5),
            ([run(EMAIL[0], F1, 10, LINK, EMAIL[1]), run(SEP, F1, 10),
              run(LINKEDIN[0], F1, 10, LINK, LINKEDIN[1])], 14.0),
            ([run(GITHUB[0], F1, 10, LINK, GITHUB[1]), run(SEP, F1, 10),
              run(R['portfolio'][0], F1, 10, LINK, R['portfolio'][1])], 14.0),
            ([run('Nationality:', F2, 10), run(' Indian', F1, 10), run(SEP, F1, 10),
              run('Visa Status:', F2, 10), run(' Employment Visa Sponsorship Required', F1, 10),
              run(SEP, F1, 10), run('Notice Period:', F2, 10), run(' 60 Days', F1, 10)], 14.0),
        ],
    ),
    'india': dict(
        out='public/Kannan_Santharam_Senior_Lead_Software_Engineer_Business_Impact_ind.pdf',
        subject='Business Impact Resume',
        seeking='Seeking a Senior Lead Software Engineer / Engineering Manager role.',
        portfolio=('kannan-ai-dev.vercel.app/ind', 'https://kannan-ai-dev.vercel.app/ind'),
        # No relocation, no visa line, no BOTIM (a UAE VoIP app), so contacts fit two rows.
        rows=lambda R: [
            ([run('Chennai, India', F1, 10), run(SEP, F1, 10),
              run('+91 97902 47499 (WhatsApp)', F1, 10), run(SEP, F1, 10),
              run(EMAIL[0], F1, 10, LINK, EMAIL[1])], 14.5),
            ([run(LINKEDIN[0], F1, 10, LINK, LINKEDIN[1]), run(SEP, F1, 10),
              run(GITHUB[0], F1, 10, LINK, GITHUB[1]), run(SEP, F1, 10),
              run(R['portfolio'][0], F1, 10, LINK, R['portfolio'][1])], 14.0),
            ([run('Nationality:', F2, 10), run(' Indian', F1, 10), run(SEP, F1, 10),
              run('Notice Period:', F2, 10), run(' 60 Days', F1, 10)], 14.0),
        ],
    ),
}

SNAPSHOT = [
    '96% faster builds: 2-minute cold starts cut to 5 seconds across 12 packages, reclaiming hundreds '
    'of engineering hours a month.',

    'A headless Base UI design system, paired with a custom Claude Code skill that generates '
    'components straight from a Figma node link, took page build-out from 2 days of AI-assisted '
    'engineering to a few hours.',

    '4,000+ enterprise customers: platform-wide migrations, dead-code removal, and regression '
    'automation delivered without disrupting the platform.',

    'An AI test-authoring platform generates, runs, and self-heals end-to-end suites, converting '
    'manual regression effort into automated coverage.',

    '30,000+ lines of dead code retired: smaller maintenance footprint and lower security overhead.',

    'Team capacity multiplied: squad leadership plus mentorship of 6 to 7 engineers across SuperOps '
    'and Freshworks, shortening ramp-up time.',
]

COMPETENCIES = [
    ('Leadership & Delivery:',
     ' Engineering Squad Leadership, Developer Mentorship (6 to 7 engineers), Architecture & Code '
     'Reviews, Agile Delivery, Cross-Team Collaboration, Stakeholder & Customer Communication'),
    ('AI-Native Engineering:',
     ' Claude Code Skills, Model Context Protocol (MCP) Servers, LLM Orchestration, Agent '
     'Write-Scope Safety, HTTP Streamable (ReadableStream), Amazon Bedrock AgentCore'),
    ('Platform & Performance:',
     ' Monorepos, Module Federation, Rspack & Webpack 5 Migration, Micro-Frontends, Design Systems '
     '& UI SDKs, Role-Based Access Control (RBAC), Core Web Vitals, Knip Static Analysis'),
    ('Full Stack Engineering:',
     ' React, TypeScript, JavaScript (ES6+), Node.js, REST API Design & Integration, GraphQL & '
     'Apollo, Zustand, Playwright, Jenkins CI/CD, Docker, AWS (EC2, S3, Route 53)'),
]

JOBS = [
    dict(
        title='Senior Lead Software Engineer',
        dates='Jul 2022 – Present',
        company='SuperOps — Chennai, India',
        sub=progression('Senior Software Engineer', 'Lead Software Engineer',
                        'Senior Lead Software Engineer'),
        bullets=[
            'Own frontend delivery for a platform serving 4,000+ MSP and IT enterprise customers, '
            'leading a squad through sprint planning, architecture review, and cross-functional '
            'execution with product, design, and QA to keep enterprise feature commitments on schedule.',

            'Cut cold-start build compilation by 96%, from 2 minutes to 5 seconds, via a solo '
            'Webpack 5 to Rspack migration delivered in 3 weeks across 12 packages, reclaiming '
            'hundreds of engineering hours per month and accelerating time-to-market for every '
            'downstream feature.',

            'Reduced manual regression effort and release risk by architecting an AI test-authoring platform '
            'in React and Node.js that orchestrates LLM agents to generate, execute, and self-heal '
            'end-to-end test suites, streaming real-time results over HTTP Web Streams.',

            'Raised team throughput by putting custom Claude Code skills and MCP servers into '
            'production developer workflow, with multi-tier write-scope guardrails that let engineers '
            'adopt autonomous agents without exposing core platform interfaces to risk.',

            'Built a headless Base UI design system and authored a Claude Code skill that generates '
            'production components from a Figma node link via MCP, cutting page build time from 2 '
            'days of AI-assisted engineering to a few hours.',

            'Lowered total cost of ownership by eliminating 30,000+ lines of dead code and unused '
            'dependencies, shrinking the monorepo’s maintenance, build, and security surface.',

            'Improved user-perceived performance across the product through route-level code '
            'splitting, React lazy loading, and a per-package chunking strategy.',

            'Maintained platform health with a 232-spec Playwright regression suite in Jenkins CI, '
            'catching regressions before release.',

            'Unlocked enterprise-tier requirements by delivering role-based access control and '
            'near-real-time operational dashboards, tuning custom cached Apollo hooks to balance data '
            'freshness against network load.',

            'Removed duplicated build effort by standardising a reusable UI SDK framework adopted '
            'across product teams.',

            'Grew engineering capacity by mentoring junior and mid-level engineers on React and '
            'monorepo quality standards, shortening ramp-up and reducing rework.',
        ],
    ),
    dict(
        title='Senior Software Engineer (Customer-Facing Engineering)',
        dates='Jun 2018 – Jul 2022',
        company='Freshworks — Chennai, India',
        sub=progression('Onboarding Engineer', 'Senior Software Engineer'),
        bullets=[
            'Served as the engineering bridge to enterprise customers, partnering with Support, '
            'Customer Success, and Sales to turn complex account requirements into shipped solutions '
            'that unblocked onboarding and renewals.',

            'Reduced support handling effort by building a Customer 360 dashboard consolidating '
            'support, sales, and account data into a single operational view.',

            'Widened platform fit in competitive enterprise deals by integrating tier-1 SaaS systems '
            'including Jira, Salesforce, Zendesk, and ServiceNow through robust REST API services.',

            'Closed customer-specific gaps by shipping targeted add-ons and '
            'supporting REST API services in place of one-off custom work.',

            'Accelerated team onboarding by mentoring 6 to 7 junior and onboarding engineers on '
            'React, REST API development, and UI architecture through structured code and design '
            'reviews.',

            'Shipped features end to end across Freshworks products, building the React UI and the '
            'Node.js REST API services behind it, so enterprise requirements landed without waiting '
            'on a separate backend team.',
        ],
    ),
    # One company under two names, same founding team; acquired by Freshworks,
    # which is how the Freshworks role above was joined. Merged into a single
    # entry so the timeline reads as one employer, not two.
    dict(
        title='Software Developer',
        dates='Mar 2016 – Jun 2018',
        company='Niche Video Media, LLC / Infigenic, LLC (acquired by Freshworks) '
                '— Chennai & Bengaluru, India',
        sub=progression('Web Application Developer & Designer', 'Software Developer'),
        bullets=[
            'Increased self-serve revenue capture with an admin dashboard that dynamically priced '
            'Stripe plans across feature selection, storage tiers, and bandwidth limits.',

            'Strengthened product differentiation by building video player customisation from '
            'scratch, with configurable controls, annotations, and call-to-action overlays driving '
            'viewer conversion.',

            'Built high-converting company and product landing pages supporting top-of-funnel demand.',

            'Extended enterprise workflow coverage by delivering a Freshservice–DocuSign '
            'integration over REST API services, joining Freshworks with the team on acquisition.',
        ],
    ),
]


def build(path, region):
    R = REGIONS[region]
    d = Doc(path, R['subject'])

    d.draw_line([run('KANNAN APPIYA SANTHARAM', F2, 21, BLUE)],
                LEFT + (CONTENT_W - pdfmetrics.stringWidth(
                    'KANNAN APPIYA SANTHARAM', F2, 21)) / 2.0, d.y)

    d.centered([run(TITLE_LINE, F2), run(SEP, F2), run(TAGLINE, F2)], 15.0)
    for rs, gap in R['rows'](R):
        d.centered(rs, gap)

    d.section('PROFESSIONAL SUMMARY')
    d.paragraph([run(SUMMARY_TMPL.format(seeking=R['seeking']))])

    d.section('BUSINESS IMPACT SNAPSHOT')
    for i, b in enumerate(SNAPSHOT):
        d.bullet([run(b)], gap=None if i == 0 else BLOCK_GAP)

    d.section('CORE COMPETENCIES')
    for i, (label, rest) in enumerate(COMPETENCIES):
        d.paragraph(lbl(label, rest), gap=None if i == 0 else BLOCK_GAP)

    d.section('PROFESSIONAL EXPERIENCE')
    for i, j in enumerate(JOBS):
        d.job(j['title'], j['dates'], j['company'], j['sub'], j['bullets'],
              gap=0.0 if i == 0 else JOB_GAP)

    d.section('EDUCATION')
    d.c.setFont(F2, JOB_SIZE)
    d.c.setFillColorRGB(*BODY)
    d.c.drawString(LEFT, d.y, 'Bachelor of Engineering (B.E.), Computer Science')
    yrs = '2011 – 2015'
    d.c.drawString(RIGHT - pdfmetrics.stringWidth(yrs, F2, JOB_SIZE), d.y, yrs)
    d.y -= BODY_LEAD
    d.draw_line([run('K.L.N. College of Information Technology, Tamil Nadu, India',
                     F1, BODY_SIZE, GRAY)], LEFT, d.y)

    d.section('LANGUAGES')
    d.draw_line([run('English:', F2), run(' Fluent (Professional Working Proficiency)'),
                 run(SEP), run('Tamil:', F2), run(' Native'),
                 run(SEP), run('Hindi:', F2), run(' Intermediate')], LEFT, d.y)

    slack = d.y - BOTTOM_LIMIT
    d.save()
    return d.page, slack


def fix_bullet_byte(path):
    """reportlab encodes U+2022 to byte 0x7F, which is undefined in WinAnsi:
    viewers guess and text extractors drop it. Rewrite to 0x95, the real
    WinAnsi bullet (identical 350/1000 width, so nothing moves)."""
    import pypdf
    from pypdf.generic import DecodedStreamObject

    writer = pypdf.PdfWriter(clone_from=path)
    n = 0
    for page in writer.pages:
        data = page.get_contents().get_data()
        if b'\\177' not in data:
            continue
        n += data.count(b'\\177')
        obj = DecodedStreamObject()
        obj.set_data(data.replace(b'\\177', b'\\225'))
        page.replace_contents(obj)
    tmp = path + '.fix'
    with open(tmp, 'wb') as f:
        writer.write(f)
    os.replace(tmp, path)
    return n


if __name__ == '__main__':
    import pypdf

    wanted = sys.argv[1:] or list(REGIONS)
    for region in wanted:
        assert region in REGIONS, f'unknown region {region!r}; expected {list(REGIONS)}'
        out = REGIONS[region]['out']
        tmp = out + '.tmp'
        pages, slack = build(tmp, region)
        n_bullets = fix_bullet_byte(tmp)

        r = pypdf.PdfReader(tmp)
        text = '\n'.join(p.extract_text() for p in r.pages)
        n_pages = len(r.pages)
        urls = [a.get_object().get('/A', {}).get('/URI')
                for pg in r.pages for a in (pg.get('/Annots') or [])]
        assert n_pages == 2, f'{region}: expected 2 pages, got {n_pages}'
        assert text.count(chr(0x2022)) == n_bullets, f'{region}: bullet extraction mismatch'
        assert chr(0x7F) not in text, f'{region}: stray 0x7F survived'
        assert REGIONS[region]['portfolio'][1] in urls, f'{region}: portfolio link missing'
        if region == 'india':
            meta = ' '.join(str(v) for v in (r.metadata or {}).values())
            for banned in ('Dubai', 'UAE', 'BOTIM', 'Visa Status', 'Relocate'):
                assert banned not in text, f'india: leaked Dubai content in text ({banned})'
                assert banned not in meta, f'india: leaked Dubai content in metadata ({banned})'
        del r
        os.replace(tmp, out)
        print(f'{region:6s} pages={n_pages} slack={slack:5.1f}pt '
              f'({slack / BODY_LEAD:.1f} lines) bullets={n_bullets} -> {out} '
              f'{os.path.getsize(out)} bytes')
