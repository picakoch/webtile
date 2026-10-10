// Plain text of a Strapi "blocks" (rich text) value. Blocks (paragraphs,
// headings, list items...) are separated by a space so their words don't run
// together ("2015.Prise" -> "2015. Prise"), for search and descriptions.
function _getPlainText(nodes) {
  if (!Array.isArray(nodes)) {
    return '';
  }
  return nodes
    .map((node) => (node.type === 'text' ? node.text : _getPlainText(node.children)))
    .join(nodes.some((node) => node.type !== 'text') ? ' ' : '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  getPlainText(block) {
    return _getPlainText(block);
  },
};
