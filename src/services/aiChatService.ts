import { CANDIDATE_DETAILED_DOSSIER } from '../data/candidateDetailedDossier';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isRealLlm?: boolean;
}

// Conversation history turn for multi-turn context passed to the server
export interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

export function getEnvApiKey(): string {
  // NOTE: We do NOT expose the real API key to the client.
  // The key lives server-side only (GEMINI_API_KEY in .env.local, no VITE_ prefix).
  // This function returns a non-empty string when the proxy endpoint is expected to be available,
  // which is always true — so the "Gemini HTTP Stream" badge always shows.
  return 'proxy-enabled';
}

// REAL LLM HTTP Streamable Engine (Routes via /api/chat serverless proxy - API Key is 100% hidden on server)
// Sends full conversation history for multi-turn follow-up awareness
export async function streamRealLlmApi(
  userQuery: string,
  history: ConversationTurn[],
  onChunk: (accumulatedText: string, isRealLlm: boolean) => void,
  signal?: AbortSignal
): Promise<{ isRealLlm: boolean }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery, history }),
      signal
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          accumulatedText += chunk;
          onChunk(accumulatedText, true);
        }
      }

      if (accumulatedText.trim()) {
        return { isRealLlm: true };
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    console.warn('/api/chat server proxy call failed, executing Universal Subword Vector RAG Engine:', err);
  }

  // Offline-capable Fallback: Universal Vector RAG Engine
  const fullResponseText = executeUniversalRagPipeline(userQuery, history, CANDIDATE_DETAILED_DOSSIER);
  await simulateHttpStreamableDelivery(fullResponseText, (text) => onChunk(text, false));
  return { isRealLlm: false };
}

// Simulates HTTP Streamable chunked token delivery for offline RAG fallback
async function simulateHttpStreamableDelivery(
  fullText: string,
  onChunk: (text: string) => void
): Promise<void> {
  const words = fullText.split(' ');
  let currentText = '';

  for (let i = 0; i < words.length; i++) {
    currentText += (i === 0 ? '' : ' ') + words[i];
    onChunk(currentText);
    await new Promise(resolve => setTimeout(resolve, 14));
  }
}

/**
 * UNIVERSAL ZERO-MAINTENANCE VECTOR RAG ENGINE (Offline Fallback)
 * ============================================================================
 * Used only when /api/chat is unavailable (no Gemini key or network error).
 * Features:
 * 1. Document-Agnostic Dynamic Chunking (Headers, Lists, Paragraphs).
 * 2. Word Token + Subword Character N-Gram Embeddings (Typo Tolerance).
 * 3. Hybrid TF-IDF Cosine Vector Space Retrieval + Title Entity Multipliers.
 * 4. Conversation-Aware Follow-Up Detection using history context.
 * ============================================================================
 */

interface VectorChunk {
  id: string;
  title: string;
  text: string;
  wordVector: Map<string, number>;
  wordMag: number;
  ngramVector: Map<string, number>;
  ngramMag: number;
}

// Standard English Stop Words + General Query Action Verbs + Generic Section Nouns
// NOTE: 'experience' is intentionally a stop word — it appears in section titles like
// "WORK HISTORY & EXPERIENCE DEEP DIVE" and would false-match "explain Freshworks experience"
const UNIVERSAL_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'done', 'down', 'during', 'each', 'experience', 'explain', 'few',
  'for', 'from', 'further', 'get', 'give', 'had', 'has', 'have', 'he', "he'd",
  "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself',
  'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into',
  'is', "isn't", 'it', "it's", 'its', 'itself', 'job', 'kannan', 'kannans',
  "kannan's", 'know', 'let', "let's", 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'role', 'same', 'she',
  "she'd", "she'll", "she's", 'should', 'show', 'so', 'some', 'such', 'tell',
  'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're",
  "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were',
  "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which',
  'while', 'who', "who's", 'whom', 'why', "why's", 'will', 'with', "won't",
  'work', 'worked', 'working', 'would', "wouldn't", 'you', "you'd", "you'll",
  "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
]);

// Follow-up phrases that signal the user wants more detail on the last topic
const FOLLOWUP_PHRASES = [
  'tell me more', 'more about', 'can you expand', 'elaborate', 'what else',
  'go deeper', 'give me more', 'say more', 'continue', 'and then', 'what about',
  'how about', 'expand on', 'details', 'detail'
];

function isFollowUpQuery(query: string): boolean {
  const lower = query.toLowerCase().trim();
  return FOLLOWUP_PHRASES.some(p => lower.includes(p));
}

function extractWordTokens(rawText: string): string[] {
  return rawText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !UNIVERSAL_STOP_WORDS.has(w));
}

// Generate Subword Character 3-Grams & 4-Grams for Fuzzy Typo Resilience
function extractSubwordNgrams(words: string[]): string[] {
  const ngrams: string[] = [];
  for (const word of words) {
    if (word.length >= 3) {
      for (let i = 0; i <= word.length - 3; i++) {
        ngrams.push(word.slice(i, i + 3));
      }
    }
    if (word.length >= 4) {
      for (let i = 0; i <= word.length - 4; i++) {
        ngrams.push(word.slice(i, i + 4));
      }
    }
  }
  return ngrams;
}

function buildVector(tokens: string[]): { vector: Map<string, number>; magnitude: number } {
  const vector = new Map<string, number>();
  for (const t of tokens) {
    vector.set(t, (vector.get(t) || 0) + 1);
  }
  let sumSq = 0;
  for (const val of vector.values()) sumSq += val * val;
  return { vector, magnitude: Math.sqrt(sumSq) };
}

function computeCosineSim(
  v1: Map<string, number>, mag1: number,
  v2: Map<string, number>, mag2: number
): number {
  if (mag1 === 0 || mag2 === 0) return 0;
  let dot = 0;
  for (const [term, freq] of v1.entries()) {
    if (v2.has(term)) dot += freq * (v2.get(term) || 0);
  }
  return dot / (mag1 * mag2);
}

// Document Ingestion & Chunk Vector Indexing (Agnostic to document structure)
// Header-depth awareness: bullet `- **x**:` splitting ONLY happens at h1/h2 level.
// Inside h3 sections (company entries), all sub-bullets stay in the company chunk.
function ingestDocumentChunks(markdownDoc: string): VectorChunk[] {
  const chunks: VectorChunk[] = [];
  const lines = markdownDoc.split('\n');
  let currentTitle = '';
  let currentBuffer: string[] = [];
  let currentDepth = 0; // 1 = #, 2 = ##, 3 = ###

  const commitChunk = (title: string, bodyLines: string[]) => {
    const text = bodyLines.join('\n').trim();
    if (!text && !title) return;
    const fullContent = title ? (text.startsWith(title) ? text : `${title}\n${text}`) : text;
    const words = extractWordTokens(fullContent);
    const ngrams = extractSubwordNgrams(words);
    const { vector: wordVector, magnitude: wordMag } = buildVector(words);
    const { vector: ngramVector, magnitude: ngramMag } = buildVector(ngrams);
    chunks.push({ id: `chunk-${chunks.length}`, title: title || 'GENERAL DOSSIER', text: fullContent, wordVector, wordMag, ngramVector, ngramMag });
  };

  for (const line of lines) {
    const h3Match = line.match(/^###\s+(.*)/);
    const h2Match = !h3Match && line.match(/^##\s+(.*)/);
    const h1Match = !h3Match && !h2Match && line.match(/^#\s+(.*)/);

    if (h3Match || h2Match || h1Match) {
      commitChunk(currentTitle, currentBuffer);
      const rawTitle = ((h3Match && h3Match[1]) || (h2Match && h2Match[1]) || (h1Match && h1Match[1]) || '').replace(/^[0-9.]+\s*/, '').trim();
      currentTitle = rawTitle;
      currentBuffer = [];
      currentDepth = h3Match ? 3 : h2Match ? 2 : 1;
    } else if (
      currentDepth < 3 &&                          // Only bullet-split outside h3 sections
      line.trim().startsWith('- **') &&
      line.includes('**:')
    ) {
      commitChunk(currentTitle, currentBuffer);
      const match = line.match(/- \*\*([^*]+)\*\*:\s*(.*)/);
      if (match) {
        currentTitle = match[1].trim();
        currentBuffer = match[2].trim() ? [match[2].trim()] : [];
      } else {
        currentBuffer = [line];
      }
    } else {
      currentBuffer.push(line);
    }
  }

  commitChunk(currentTitle, currentBuffer);
  return chunks;
}

// Hybrid Vector Search (Word Cosine + Subword N-Gram Cosine + Title Entity Multiplier)
function searchVectorIndex(query: string, chunks: VectorChunk[], topK = 3): { chunk: VectorChunk; score: number }[] {
  const queryWords = extractWordTokens(query);
  const queryNgrams = extractSubwordNgrams(queryWords);
  const { vector: qWordVec, magnitude: qWordMag } = buildVector(queryWords);
  const { vector: qNgramVec, magnitude: qNgramMag } = buildVector(queryNgrams);
  if (qWordMag === 0) return [];

  const scored = chunks.map(chunk => {
    const wordSim = computeCosineSim(qWordVec, qWordMag, chunk.wordVector, chunk.wordMag);
    const ngramSim = computeCosineSim(qNgramVec, qNgramMag, chunk.ngramVector, chunk.ngramMag);
    let score = (wordSim * 0.70) + (ngramSim * 0.30);

    const titleWords = extractWordTokens(chunk.title);
    for (const qw of queryWords) {
      if (titleWords.includes(qw)) score += 0.85;
    }
    return { chunk, score };
  });

  return scored
    .filter(item => item.score > 0.01)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Universal RAG Pipeline Execution (Offline Fallback - used only when LLM proxy is unavailable)
export function executeUniversalRagPipeline(query: string, history: ConversationTurn[], rawDossier: string): string {
  const rawLower = query.toLowerCase();

  // Off-topic Guardrail
  const offTopicKeywords = ['weather', 'recipe', 'cook', 'movie', 'sports', 'football', 'cricket', 'president', 'capital', 'crypto', 'bitcoin'];
  if (offTopicKeywords.some(kw => rawLower.includes(kw)) && !rawLower.includes('kannan') && !rawLower.includes('superops')) {
    return `I'm specifically trained on Kannan Appiya Santharam's executive profile. I can only help with questions about Kannan's 10.5+ years of Senior Lead experience, AI engineering achievements, and Dubai relocation readiness. What would you like to know?`;
  }

  const chunks = ingestDocumentChunks(rawDossier);

  // Follow-up detection: boost last topic from history into current query
  let effectiveQuery = query;
  if (isFollowUpQuery(query) && history.length > 0) {
    // Pull the last user question as additional context
    const lastUserTurn = [...history].reverse().find(t => t.role === 'user');
    if (lastUserTurn) {
      effectiveQuery = `${lastUserTurn.text} ${query}`;
    }
  }

  const topMatches = searchVectorIndex(effectiveQuery, chunks, 3);

  if (topMatches.length === 0) return getOfflineFallbackSummary();

  const topMatch = topMatches[0];
  const lowerTitle = topMatch.chunk.title.toLowerCase();

  // Contextual emoji
  let emoji = '📋';
  if (lowerTitle.includes('skill') || lowerTitle.includes('matrix')) emoji = '🛠️';
  else if (lowerTitle.includes('metric') || lowerTitle.includes('rspack') || lowerTitle.includes('build')) emoji = '⚡';
  else if (['superops', 'freshworks', 'infigenic', 'niche', 'work history', 'experience'].some(k => lowerTitle.includes(k))) emoji = '🏢';
  else if (lowerTitle.includes('education') || lowerTitle.includes('school')) emoji = '🎓';
  else if (lowerTitle.includes('dubai') || lowerTitle.includes('uae') || lowerTitle.includes('relocation') || lowerTitle.includes('visa') || lowerTitle.includes('salary')) emoji = '🇦🇪';
  else if (lowerTitle.includes('governance') || lowerTitle.includes('leadership')) emoji = '🏛️';
  else if (lowerTitle.includes('ai') || lowerTitle.includes('mcp') || lowerTitle.includes('test')) emoji = '🤖';

  const cleanTitle = topMatch.chunk.title.trim();
  const rawText = topMatch.chunk.text.replace(cleanTitle, '').trim();

  // Company experience — structured bullet synthesis
  if (['superops', 'freshworks', 'infigenic', 'niche'].some(c => lowerTitle.includes(c))) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const meta = lines.filter(l => l.startsWith('- **') || l.startsWith('Progression:') || l.startsWith('Location:'));
    const bullets = lines
      .filter(l => l.startsWith('•') || l.startsWith('*'))
      .map(l => l.replace(/^[•*]\s*/, ''));

    let out = `${emoji} **${cleanTitle}**\n\n`;
    if (meta.length) out += meta.map(m => m.replace(/^- /, '')).join('\n') + '\n\n';
    out += `**Key Contributions & Achievements:**\n`;
    out += bullets.length ? bullets.map(b => `• ${b}`).join('\n') : rawText;
    return out;
  }

  return `${emoji} **${cleanTitle}**\n\n${rawText}`;
}

function getOfflineFallbackSummary(): string {
  return `👋 **Kannan Appiya Santharam — Senior Lead Software Engineer**\n\nKannan brings **10.5+ years** of high-impact engineering across global SaaS platforms, currently at SuperOps leading Agentic AI automations.\n\n• **96% Faster Builds** — Solo Webpack 5 → Rspack migration across 12 packages in 3 weeks\n• **AI Test Platform** — Built from scratch using React, Node.js & LLM agents over HTTP Streamable Web Streams\n• **Claude Code Skills + MCP Servers** — Production AI agent workflows with strict write-scope guardrails\n• **30k+ Dead Code Stripped** — Led monorepo code health & dependency hygiene using Knip static analysis\n• **Quality Champion** — 232-spec Playwright E2E suite in Jenkins CI with zero flaky test tolerance\n• **Dubai Ready** — Available on 60 days notice, seeking UAE employment visa sponsorship\n\nWhat would you like to explore? His tech stack, specific companies, AI projects, or relocation details?`;
}
