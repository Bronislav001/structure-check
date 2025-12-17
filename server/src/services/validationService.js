// tolerant section finder
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function normalize(s) {
  return String(s).toLowerCase().replace(/ё/g, 'е');
}
function findMissingSections(text, required) {
  const t = normalize(text);
  return required.filter((sec) => {
    const pat = `(^|\n)\s*${escapeRegExp(normalize(sec))}\s*(\n|$)`;
    const re = new RegExp(pat, 'i');
    return !re.test(t);
  });
}

module.exports = { findMissingSections };
