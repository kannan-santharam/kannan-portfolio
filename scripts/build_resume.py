#!/usr/bin/env python3
"""Build the resume PDFs in public/ from src/data/resumeContent.json.

Content (every string on the page) comes from that JSON, the single source of
truth shared with the site. This file holds only the layout: every geometry
constant below was measured from the raw content stream of the original
shipped resume, so the visual format is preserved exactly.

Writes  public/Kannan_Santharam_Senior_Lead_Software_Engineer.pdf      (dubai)
        public/Kannan_Santharam_Senior_Lead_Software_Engineer_ind.pdf  (india)

Usage:  python3 scripts/build_resume.py [region ...]
Needs:  pip install reportlab pypdf
"""
import json
import os
import re
import sys
from pathlib import Path

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

BODY_SIZE, BODY_LEAD = 11.0, 14.0
BLOCK_GAP = 14.6                    # last baseline -> next block's first baseline
SECTION_GAP = 20.9                  # last baseline -> section header baseline
RULE_DROP = 5.5                     # section header baseline -> rule y
RULE_TO_BODY = 13.0                 # rule y -> first content baseline
TITLE_TO_COMPANY = 13.5
COMPANY_TO_SUB = 12.0
SUB_TO_BULLET = 14.3
JOB_GAP = 16.1                      # last bullet baseline -> next job title baseline
SECTION_SIZE, JOB_SIZE, SUB_SIZE = 11.5, 11.0, 9.0

NAVY = (0.121569, 0.219608, 0.392157)
BLUE = (0.180392, 0.454902, 0.709804)
BODY = (0.2, 0.2, 0.2)
LINK = (0.0, 0.321569, 1.0)
GRAY = (0.333333, 0.333333, 0.333333)

F1, F2, F3, F4 = 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Symbol'
ARROW = '→'          # Symbol font maps this to arrowright; a raw \xae is a box
BULLET = '•' + '   '
HANG = pdfmetrics.stringWidth(BULLET, F1, BODY_SIZE)
assert abs(HANG - 13.024) < 0.01, f'bullet hang drifted: {HANG}'
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
# Every resume string comes from src/data/resumeContent.json, the single source of
# truth shared with the site (src/data/resumeData.ts). Nothing is authored here.
CONTENT_PATH = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'resumeContent.json'
with CONTENT_PATH.open(encoding='utf-8') as fh:
    CONTENT = json.load(fh)

IDENTITY = CONTENT['identity']
CONTACT = CONTENT['contact']
REGIONS = CONTENT['regions']

# The only per-region fact that is not content: where each PDF is written.
OUT = {
    'dubai': 'public/Kannan_Santharam_Senior_Lead_Software_Engineer.pdf',
    'india': 'public/Kannan_Santharam_Senior_Lead_Software_Engineer_ind.pdf',
}
assert set(OUT) == set(REGIONS), f'region mismatch: {sorted(OUT)} vs {sorted(REGIONS)}'


def link10(text_key, url_key):
    return run(CONTACT[text_key], F1, 10, LINK, CONTACT[url_key])


def sep10():
    return run(SEP, F1, 10)


def meta_row(R):
    """Nationality | [Visa Status |] Notice Period. India has no visa segment."""
    rs = [run('Nationality:', F2, 10), run(' ' + IDENTITY['nationality'], F1, 10)]
    if R['visaStatus']:
        rs += [sep10(), run('Visa Status:', F2, 10), run(' ' + R['visaStatus'], F1, 10)]
    rs += [sep10(), run('Notice Period:', F2, 10), run(' ' + IDENTITY['noticePeriod'], F1, 10)]
    return rs


def contact_rows(R):
    """Header contact block, as (runs, gap) pairs.

    Three rows for both regions: location/phone/email, then the nationality
    meta row, then the links. Dubai's location line carries the relocation
    note and its meta row an extra visa segment; both still fit one line."""
    location = run(R['locationLine'], F1, 10)
    phone = run(R['phoneLine'], F1, 10)
    email = link10('email', 'emailUrl')
    linkedin = link10('linkedin', 'linkedinUrl')
    github = link10('github', 'githubUrl')
    portfolio = run(R['portfolio'], F1, 10, LINK, R['portfolioUrl'])
    rows = [[location, sep10(), phone, sep10(), email],
            meta_row(R),
            [linkedin, sep10(), github, sep10(), portfolio]]
    return [(rs, 14.5 if i == 0 else 14.0) for i, rs in enumerate(rows)]


def build(path, region):
    R = REGIONS[region]
    d = Doc(path, R['subject'])

    name = IDENTITY['name'].upper()
    d.draw_line([run(name, F2, 21, BLUE)],
                LEFT + (CONTENT_W - pdfmetrics.stringWidth(name, F2, 21)) / 2.0, d.y)

    d.centered([run(IDENTITY['title'], F2), run(SEP, F2), run(IDENTITY['tagline'], F2)], 15.0)
    for rs, gap in contact_rows(R):
        d.centered(rs, gap)

    d.section('PROFESSIONAL SUMMARY')
    d.paragraph([run(CONTENT['summaryTemplate'].format(seeking=R['seeking']))])

    d.section('BUSINESS IMPACT SNAPSHOT')
    for i, b in enumerate(CONTENT['snapshot']):
        d.bullet([run(b)], gap=None if i == 0 else BLOCK_GAP)

    d.section('CORE COMPETENCIES')
    for i, comp in enumerate(CONTENT['competencies']):
        d.paragraph(lbl(comp['label'] + ':', ' ' + ', '.join(comp['items'])),
                    gap=None if i == 0 else BLOCK_GAP)

    d.section('PROFESSIONAL EXPERIENCE')
    for i, j in enumerate(CONTENT['experience']):
        sub = progression(*j['progression']) if j['progression'] else None
        d.job(j['title'], j['dates'], j['company'], sub, j['bullets'],
              gap=0.0 if i == 0 else JOB_GAP)

    d.section('EDUCATION')
    edu = CONTENT['education']
    d.c.setFont(F2, JOB_SIZE)
    d.c.setFillColorRGB(*BODY)
    d.c.drawString(LEFT, d.y, edu['degree'])
    yrs = edu['years']
    d.c.drawString(RIGHT - pdfmetrics.stringWidth(yrs, F2, JOB_SIZE), d.y, yrs)
    d.y -= BODY_LEAD
    d.draw_line([run(edu['institution'], F1, BODY_SIZE, GRAY)], LEFT, d.y)

    d.section('LANGUAGES')
    langs = []
    for lang in CONTENT['languages']:
        if langs:
            langs.append(run(SEP))
        langs += [run(lang['name'] + ':', F2), run(' ' + lang['level'])]
    d.draw_line(langs, LEFT, d.y)

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
        out = OUT[region]
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
        assert REGIONS[region]['portfolioUrl'] in urls, f'{region}: portfolio link missing'
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
