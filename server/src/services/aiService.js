const natural = require('natural');

function normalizeLine(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/^\s*\d+[\.|\)|\-]\s*/g, '')      // 1. , 1) , 1-
    .replace(/^\s*[ivxlcdm]+[\.|\)]\s*/gi, '')   // I. , IV)
    .replace(/[\s\t]+/g, ' ')
    .replace(/[\:;,.]+$/g, '')                      // trailing punctuation
    .trim();
}

function similarity(a, b) {
  const aa = normalizeLine(a);
  const bb = normalizeLine(b);
  if (!aa || !bb) return 0;
  if (aa === bb) return 1;
  // Jaro-Winkler хорошо подходит для мелких отличий
  return natural.JaroWinklerDistance(aa, bb);
}

function analyzeTextAgainstTemplate(text, template) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const matched = new Map(); // templateItem -> { line, idx, score }
  const usedIdx = new Set();

  for (let ti = 0; ti < template.length; ti++) {
    const t = template[ti];
    let best = { score: 0, idx: -1, line: '' };

    for (let i = 0; i < lines.length; i++) {
      if (usedIdx.has(i)) continue;
      const line = lines[i];
      // ограничим кандидаты по длине, чтобы не путать с абзацами
      if (line.length > 140) continue;

      const sc = similarity(line, t);
      if (sc > best.score) best = { score: sc, idx: i, line };
    }

    // порог (можно подкрутить). С ним «1. Введение» точно пройдёт.
    if (best.score >= 0.88) {
      matched.set(t, best);
      usedIdx.add(best.idx);
    }
  }

  const found = [];
  const missing = [];
  for (const t of template) {
    if (matched.has(t)) found.push(t);
    else missing.push(t);
  }

  // проверка порядка: индексы найденных заголовков должны быть по возрастанию
  const indices = found.map(t => matched.get(t).idx);
  const orderIssues = [];
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] < indices[i - 1]) {
      orderIssues.push({
        type: 'ORDER',
        message: `Раздел "${found[i]}" расположен раньше, чем предыдущий раздел`,
        section: found[i]
      });
      break;
    }
  }

  const ok = missing.length === 0 && orderIssues.length === 0;

  return { template, found, missing, orderIssues, ok };
}

module.exports = { analyzeTextAgainstTemplate, normalizeLine };
