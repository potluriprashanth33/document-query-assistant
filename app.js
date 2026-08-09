// Mock Datasets & Corpus Knowledge Base
const CORPUS_DATASETS = {
  "swecha-open-docs": [
    {
      id: "doc-101",
      title: "Swecha Workbench & CLI Architecture",
      score: 0.94,
      text: "The swecha CLI manages workbench verification across 24 tools in 8 categories. System authentication credentials are stored in ~/.config/swecha/auth.json with strict 0600 permissions."
    },
    {
      id: "doc-102",
      title: "OpenCode Provider & MCP Setup",
      score: 0.89,
      text: "OpenCode integrates with local LLM providers via ~/.local/share/opencode/auth.json and configures Model Context Protocol (MCP) servers in ~/.config/opencode/opencode.json."
    },
    {
      id: "doc-103",
      title: "Local AI Runtime with Ollama",
      score: 0.82,
      text: "Ollama provides local LLM inference over port 11434, allowing offline code completion and semantic document querying via corpus-client."
    }
  ],
  "telugu-nlp": [
    {
      id: "telugu-201",
      title: "Swecha Telugu NLP Corpus Overview",
      score: 0.96,
      text: "The Telugu NLP corpus contains tokenized literature, news archives, and technical glossary translations formatted for language model fine-tuning."
    },
    {
      id: "telugu-202",
      title: "Tokenizer & Embedding Standard",
      score: 0.91,
      text: "Uses Byte-Pair Encoding (BPE) optimized for Indic scripts, supporting subword segmentation for agglutinative Telugu words."
    }
  ],
  "python-ml": [
    {
      id: "py-301",
      title: "FastAPI & Vector Search Integration",
      score: 0.95,
      text: "Dense vector indexes are computed using sentence-transformers and queried via cosine similarity metrics in high-performance Python services."
    },
    {
      id: "py-302",
      title: "RAG Prompt Augmentation Pattern",
      score: 0.88,
      text: "Context chunks are formatted into System Prompts with top-k relevance rankings to prevent hallucinations during model inference."
    }
  ]
};

// Tab Switching Logic
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');
}

// Preset Chip Click Helper
function setQuery(text) {
  document.getElementById('query-input').value = text;
  runDocumentQuery();
}

// Dataset Switcher Handler
function onDatasetChange() {
  const selected = document.getElementById('dataset-select').value;
  console.log("Selected dataset:", selected);
}

// Main Pipeline Execution Simulation
async function runDocumentQuery() {
  const query = document.getElementById('query-input').value.trim();
  const datasetKey = document.getElementById('dataset-select').value;
  
  if (!query) {
    alert("Please enter a question or prompt.");
    return;
  }

  // Reset Stages
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`stage-${i}`);
    el.className = "pipeline-step";
    document.getElementById(`stage-${i}-out`).innerText = "Pending...";
  }

  document.getElementById('chunks-container').innerHTML = `
    <div style="text-align: center; padding-top: 40px; color: var(--accent-cyan);">
      <p>⏳ Querying corpus vector database...</p>
    </div>
  `;

  document.getElementById('response-box').innerHTML = `
    <p style="color: var(--text-muted); text-align: center; padding-top: 40px;">
      Synthesizing answers...
    </p>
  `;

  // Stage 1: Tokenization
  setStageActive(1, "Encoding text to vector [1 x 384]...");
  await sleep(600);
  setStageCompleted(1, "Vector generated (dim: 384, norm: 1.0)");

  // Stage 2: Similarity Matching
  setStageActive(2, "Running KNN cosine similarity...");
  await sleep(700);
  const chunks = CORPUS_DATASETS[datasetKey] || CORPUS_DATASETS['swecha-open-docs'];
  setStageCompleted(2, `Retrieved ${chunks.length} matching chunks (top_k=3)`);

  renderChunks(chunks);

  // Stage 3: Context Construction
  setStageActive(3, "Injecting chunks into prompt template...");
  await sleep(600);
  setStageCompleted(3, `Context window ready (${chunks.length * 120} tokens)`);

  // Stage 4: LLM Synthesis
  setStageActive(4, "Streaming response from local LLM...");
  await sleep(800);
  setStageCompleted(4, "Response generation complete (100%)");

  renderSynthesizedResponse(query, chunks);
}

function setStageActive(stageNum, text) {
  const el = document.getElementById(`stage-${stageNum}`);
  el.className = "pipeline-step active";
  document.getElementById(`stage-${stageNum}-out`).innerText = text;
}

function setStageCompleted(stageNum, text) {
  const el = document.getElementById(`stage-${stageNum}`);
  el.className = "pipeline-step completed";
  document.getElementById(`stage-${stageNum}-out`).innerText = "✓ " + text;
}

function renderChunks(chunks) {
  const container = document.getElementById('chunks-container');
  container.innerHTML = chunks.map(chunk => `
    <div class="chunk-card">
      <div class="chunk-header">
        <span><strong>${chunk.id}</strong> — ${chunk.title}</span>
        <span class="chunk-score">Cosine Similarity: ${(chunk.score * 100).toFixed(1)}%</span>
      </div>
      <div class="chunk-text">"${chunk.text}"</div>
    </div>
  `).join('');
}

function renderSynthesizedResponse(query, chunks) {
  const box = document.getElementById('response-box');
  const primaryDoc = chunks[0];

  box.innerHTML = `
    <div style="color: var(--text-main);">
      <p style="margin-bottom: 12px; font-weight: 600; color: var(--accent-success);">
        💡 Direct Answer based on Corpus Retrieval:
      </p>
      <p style="margin-bottom: 14px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border-left: 3px solid var(--accent-success);">
        Based on <strong>${primaryDoc.title}</strong>, ${primaryDoc.text}
      </p>
      <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 10px;">
        <strong>Attribution Sources:</strong> ${chunks.map(c => c.id).join(', ')} | Model: Ollama Local (LLaMA3/OpenCode)
      </div>
    </div>
  `;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto-run sample query on load
window.addEventListener('DOMContentLoaded', () => {
  console.log("Document Query Assistant initialized.");
});
