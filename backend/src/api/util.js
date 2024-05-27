module.exports = {
  getPlainText(block) {
    if (!block){
      return ''
    }
    const text = block.reduce((acc, node) => {
      if (node.type === 'text') {
        return acc + node.text;
      }
      return acc + getPlainText(node.children);
    }, '');

    return text;
  }
}
