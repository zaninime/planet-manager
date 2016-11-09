export default function transformer(file, api) {
    const { jscodeshift } = api;

    return jscodeshift(file.source)
    .find(jscodeshift.ImportDeclaration)
    .forEach((decl) => {
        if (decl.value.source.value === 'protocol/plug') decl.value.source.value = 'protocol/api';
    })
    .toSource({ quote: 'single' });
}
