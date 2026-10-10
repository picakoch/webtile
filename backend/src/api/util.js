// Plain text of a Strapi "blocks" (rich text) value, for search and
// descriptions. Block-level nodes (paragraphs, headings, list items...) are
// separated by a space so their words don't run together ("2015. Prise");
// inline nodes (text, links) are joined as they are ("voir ici.").
const INLINE = new Set(['text', 'link']);

function _getPlainText(nodes) {
  if (!Array.isArray(nodes)) {
    return '';
  }
  return nodes
    .map((node) => {
      const text = node.type === 'text' ? node.text || '' : _getPlainText(node.children);
      return INLINE.has(node.type) ? text : ` ${text} `;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  getPlainText(block) {
    return _getPlainText(block);
  },
};
