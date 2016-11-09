const re = /^components\/(presentational|connected|views)\/(\w+)$/;

const nameMap = {
    presentational: 'presentational',
    connected: 'connected',
    views: 'layout',
};

export default function transformer(file, api) {
    const { jscodeshift: j } = api;
    const root = j(file.source);

    root.find(j.CallExpression)
    .filter(path => path.node.callee.name === 'require')
    .filter(path => re.test(path.node.arguments[0].value))
    .replaceWith((path) => {
        const m = path.node.arguments[0].value.match(re);
        const newImportPath = `components/${nameMap[m[1]]}/${m[2]}`;
        const newNode = j.callExpression(j.identifier(path.node.callee.name), [j.literal(newImportPath)]);
        return newNode;
    });

    root.find(j.ImportDeclaration)
    .filter(path => re.test(path.node.source.value))
    .replaceWith((path) => {
        const m = path.node.source.value.match(re);
        const newImportPath = `components/${nameMap[m[1]]}/${m[2]}`;
        const newNode = j.importDeclaration(path.node.specifiers, j.literal(newImportPath));
        return newNode;
    });

    return root.toSource({ quote: 'single' });
}
