function getPlainText(block) {
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

module.exports = {
  beforeCreate(event) {
    const {data, where, select, populate} = event.params;
    const ctx = strapi.requestContext.get();
    event.params.data.tile_title = ctx?.request?.body?.tile?.title;
    plain_txt = getPlainText(ctx?.request?.body?.description)
    event.params.data.description_search = plain_txt;
  },

  beforeUpdate(event) {
    const {data, where, select, populate} = event.params;
    const ctx = strapi.requestContext.get();
    plain_txt = getPlainText(ctx?.request?.body?.description)
    event.params.data.tile_title = ctx?.request?.body?.tile?.title;
    event.params.data.description_search = plain_txt;
  },
};
