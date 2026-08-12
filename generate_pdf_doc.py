import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Technical Document & Interview Guide — Kannan Appiya Santharam")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, "Senior Lead Software Engineer | React 19 · TypeScript · AI-Native | Dubai, UAE")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        
        self.restoreState()

def create_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    COLOR_PRIMARY = colors.HexColor("#0F172A")    # Deep Navy
    COLOR_ACCENT = colors.HexColor("#B88820")     # Dubai Gold
    COLOR_CYAN = colors.HexColor("#0284C7")       # Cyber Cyan
    COLOR_TEXT = colors.HexColor("#334155")       # Charcoal
    COLOR_BG_CARD = colors.HexColor("#F8FAFC")    # Cool Slate Light
    COLOR_BORDER = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=COLOR_PRIMARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=COLOR_ACCENT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=COLOR_PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=COLOR_TEXT,
        spaceAfter=6
    )

    q_title_style = ParagraphStyle(
        'Q_Title',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14.5,
        textColor=COLOR_PRIMARY,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    answer_style = ParagraphStyle(
        'Q_Answer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=COLOR_TEXT,
        spaceAfter=6
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("TECHNICAL ARCHITECTURE & INTERVIEW PREPARATION GUIDE", title_style))
    story.append(Paragraph("Executive Portfolio Architecture & Technical Interview Q&A for Dubai Recruiter Standards", subtitle_style))
    
    meta_text = "<b>Candidate:</b> Kannan Appiya Santharam &nbsp;|&nbsp; <b>Role Target:</b> Senior Lead Software Engineer / Engineering Manager<br/>" \
                "<b>Relocation Status:</b> Ready to Relocate to Dubai, UAE &nbsp;|&nbsp; <b>Notice Period:</b> 60 Days &nbsp;|&nbsp; <b>Tech Stack:</b> React 19, TypeScript, HTTP Streamable, Rspack"
    story.append(Paragraph(meta_text, body_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_ACCENT, spaceAfter=14))

    # SECTION 1: SYSTEM ARCHITECTURE
    story.append(Paragraph("1. SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATIONS", h1_style))
    story.append(Paragraph("This executive portfolio was built to present Kannan Appiya Santharam's 10.5+ years of monorepo leadership, build acceleration metrics, and AI-native engineering capabilities directly to top UAE technology recruiters and hiring managers.", body_style))
    
    # Core Architecture Specs Table
    specs_data = [
        [Paragraph("<b>Component Layer</b>", body_style), Paragraph("<b>Technology & Implementation Specification</b>", body_style)],
        [Paragraph("Framework & Core", body_style), Paragraph("<b>React 19 (Latest Stable)</b> + <b>React Compiler</b> (<code>babel-plugin-react-compiler</code> via <code>@rolldown/plugin-babel</code>). Auto-memoizes JSX render trees without manual useMemo/useCallback.", body_style)],
        [Paragraph("Build Engine", body_style), Paragraph("<b>Vite 8</b> + TypeScript 6. Production client bundle built in 390ms.", body_style)],
        [Paragraph("Streaming Architecture", body_style), Paragraph("<b>HTTP Streamable Web Streams (fetch + ReadableStream)</b>. Streams real-time LLM tokens and AI agent tool calls with zero text-framing overhead (~80ms TTFT).", body_style)],
        [Paragraph("Styling System", body_style), Paragraph("<b>Tailwind CSS v4</b> + Custom CSS Variable Engine (<code>--bg-page</code>, <code>--bg-card</code>, <code>--text-title</code>, <code>--text-body</code>). Supports seamless 100% Light and Dark theme switching.", body_style)],
        [Paragraph("Package Manager", body_style), Paragraph("<b>pnpm (v11.20.0)</b> with <code>pnpm-lock.yaml</code>. Content-addressable store for fast, deterministic installs (4.8s).", body_style)],
        [Paragraph("Mobile Responsiveness", body_style), Paragraph("Mobile-first design with swipeable experience tab strips, touch-friendly 44px+ tap targets, and responsive hero photo ordering.", body_style)]
    ]

    specs_table = Table(specs_data, colWidths=[1.4*inch, 5.2*inch])
    specs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), COLOR_BG_CARD),
        ('TEXTCOLOR', (0,0), (1,0), COLOR_PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(specs_table)
    story.append(Spacer(1, 14))

    # SECTION 2: INTERVIEW PREPARATION (PART A - RESUME & PORTFOLIO CONTENT)
    story.append(Paragraph("2. INTERVIEW PREPARATION: RESUME & PORTFOLIO IMPACT WINS (PART A)", h1_style))
    story.append(Paragraph("Technical recruiters, Engineering Managers, and Software Architects in Dubai will dive deep into the specific achievements listed on Kannan's portfolio. Below are the exact technical questions and model answers.", body_style))

    qa_part_a = [
        ("Q1: You executed a solo Webpack 5 to Rspack migration in 3 weeks cutting build time by 96% (2 minutes to 5 seconds across 12 packages). How did you execute this safely?",
         "<b>Context:</b> The SuperOps monorepo contained 12 packages with heavy compile bottlenecks caused by ts-loader, babel-loader, and complex Webpack plugin chains.<br/>" \
         "<b>Execution Steps:</b><br/>" \
         "• Analyzed monorepo dependency graph and identified Webpack loader bottlenecks.<br/>" \
         "• Replaced Webpack 5 with Rust-powered <b>Rspack</b> and built-in <b>swc-loader</b> for ultra-fast compilation.<br/>" \
         "• Configured Rspack Module Federation for shared core UI components.<br/>" \
         "• <b>Quantitative Result:</b> Cold-start compilation dropped from 120 seconds to 5 seconds (96% speedup). Hot Module Replacement (HMR) re-compiles in under 50ms.<br/>" \
         "• <b>Impact:</b> Saved hundreds of engineering hours monthly across distributed teams and accelerated CI/CD build pipelines in Jenkins."),

        ("Q2: How did you architect the AI test-authoring platform over HTTP Streamable Web Streams?",
         "<b>Context:</b> Traditional manual end-to-end Playwright/Cypress test writing was slow and brittle during UI feature releases.<br/>" \
         "<b>Architecture:</b> Built a React 19 frontend paired with a Node.js orchestration layer streaming LLM tool calls in real time over <b>HTTP Streamable Web Streams (fetch + ReadableStream)</b>.<br/>" \
         "<b>Self-Healing Loop:</b> LLM agent inspects DOM tree snapshots, auto-generates Playwright spec code, executes the test, captures assertion failures, and self-heals broken selectors automatically."),

        ("Q3: How did you author custom production Claude Code skills using MCP servers and enforce write-scope guardrails?",
         "<b>Model Context Protocol (MCP):</b> Implemented custom TypeScript MCP servers that expose codebase AST symbol graphs, imports, and component hierarchies directly to Claude Code and Cursor IDE.<br/>" \
         "<b>Write-Scope Guardrails:</b> Engineered multi-layered safety guardrails. Autonomous AI coding agents are permitted to modify target feature components (e.g., <code>src/features/**</code>) while strictly blocking edits to core system contracts, GraphQL schemas, or global design tokens (e.g., <code>src/core/**</code>)."),

        ("Q4: How do you protect platform quality with a 232-spec Playwright regression suite and Knip static analysis?",
         "<b>Knip Static Analysis:</b> Executed Knip across the monorepo, identifying and stripping over <b>30,000 lines of dead code</b>, unused exports, and unreferenced dependencies.<br/>" \
         "<b>Playwright Suite:</b> Maintained 232 Playwright end-to-end specs structured using Page Object Models (POM), parallel execution workers, and visual regression snapshot testing in Jenkins CI.")
    ]

    for q, a in qa_part_a:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, answer_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))

    # SECTION 3: INTERVIEW PREPARATION (PART B - PORTFOLIO ENGINEERING & FRONTEND STANDARDS)
    story.append(Paragraph("3. INTERVIEW PREPARATION: PORTFOLIO ENGINEERING & SOFTWARE STANDARDS (PART B)", h1_style))
    story.append(Paragraph("Interviewers will also examine the engineering techniques used to build this portfolio itself to gauge React 19 knowledge, CSS architecture, performance, and package management.", body_style))

    qa_part_b = [
        ("Q5: Why did you build this application with React 19 and React Compiler instead of traditional React 18 with useMemo/useCallback?",
         "<b>Answer:</b> React 19's <code>babel-plugin-react-compiler</code> automatically memoizes component render trees, JSX elements, and hook dependencies at build time. It eliminates manual <code>useMemo</code> and <code>useCallback</code> boilerplate while preventing unnecessary component re-renders. This demonstrates forward-thinking adoption of React 19's production compiler pipeline."),

        ("Q6: Why is HTTP Streamable (fetch + ReadableStream) superior to standard SSE or REST JSON for LLM chatbots?",
         "<b>Answer:</b> HTTP Streamable eliminates line-by-line SSE data framing overhead (no <code>data: {...}</code> string regex parsing needed). Chunks stream directly over native browser WHATWG <code>ReadableStream</code> readers, cutting Time-To-First-Token (TTFT) by 90% down to ~80ms and streaming tokens in real time."),

        ("Q7: How did you implement 100% Light & Dark theme support without layout shifts or text contrast issues?",
         "<b>Answer:</b> Constructed a CSS custom property token engine in <code>index.css</code> mapped under <code>html.dark</code> and <code>html.light</code> selectors. Theme state is persisted in <code>localStorage</code> via React <code>ThemeContext</code>. Replaced hardcoded utilities with semantic CSS variables (<code>var(--bg-page)</code>, <code>var(--bg-card)</code>, <code>var(--text-title)</code>, <code>var(--text-body)</code>), ensuring 100% theme coverage across all 7 sections with zero text contrast degradation."),

        ("Q8: Why did you switch package management from npm to pnpm?",
         "<b>Answer:</b> <code>pnpm</code> uses a content-addressable global store with hard links, saving disk space and speeding up installs to 4.8 seconds. It enforces strict non-hoisted dependency resolution, preventing hidden 'ghost dependency' bugs common in npm/yarn."),

        ("Q9: How did you optimize the recruiter experience for mobile viewports?",
         "<b>Answer:</b> Mobile-first photo placement brings the candidate portrait and relocation status (Dubai, UAE) to the top of mobile screens. Added a horizontally swipeable company tab strip for career history, 44px+ touch-friendly buttons, and direct one-click PDF resume download triggers.")
    ]

    for q, a in qa_part_b:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, answer_style))
        story.append(Spacer(1, 4))

    # Summary Sign-off Box
    story.append(Spacer(1, 10))
    summary_box_data = [[
        Paragraph("<b>Executive Summary for Dubai Hiring Managers:</b> Kannan Appiya Santharam brings 10.5+ years of proven software architecture, monorepo performance gains (96% compilation speedup), and production AI-native engineering (HTTP Streamable Web Streams, Claude Code MCP servers). Ready to relocate immediately to Dubai, UAE on 60 days notice.", body_style)
    ]]
    summary_table = Table(summary_box_data, colWidths=[6.6*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_CARD),
        ('BORDER', (0,0), (-1,-1), 1, COLOR_ACCENT),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(summary_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    pdf_filename = "/Users/kannansantharam/Documents/Personal/Portfolio/public/Portfolio_Technical_Doc_Interview_Prep.pdf"
    create_pdf(pdf_filename)
