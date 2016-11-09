const re = /(components|containers|views)\/\w+\/(\w+)/;

export default function transformer(file, api) {
    const { jscodeshift: j } = api;
    return j(file.source)
  .find(j.ImportDeclaration)
  .forEach((decl) => {
      j(decl).find(j.Literal).replaceWith((v) => {
          const match = v.node.value.match(re);
          if (!match) return v.node;
          return j.literal(`${match[1]}/${match[2]}`);
      });
  })
  .toSource({ quote: 'single' });
}
