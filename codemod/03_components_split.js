const re = /^(components|containers|views)\/(\w+)$/;

export default function transformer(file, api) {
  const { jscodeshift: j } = api;
  return j(file.source)
  .find(j.ImportDeclaration)
  .forEach(decl => {
    j(decl).find(j.Literal).replaceWith((v) => {
      const match = v.node.value.match(re);
      if (!match) return v.node;
      let dir;
      switch (match[1]) {
        case 'components':
          dir = 'presentational';
          break;
        case 'containers':
          dir = 'connected';
          break;
        case 'views':
          dir = 'views';
          break;
      }
      return j.literal(`components/${dir}/${match[2]}`);
    });
  })
  .toSource({quote: 'single'});
}