function _getPlainText(block) {
  if (!block) {
    return ''
  }
  const text = block.reduce((acc, node) => {
    if (node.type === 'text') {
      return acc + node.text;
    }
    return acc + _getPlainText(node.children);
  }, '');

  return text;
}

module.exports = {
  getPlainText(block) {
    return _getPlainText(block)
  }
}
