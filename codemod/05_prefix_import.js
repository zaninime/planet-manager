const locals = ['components', 'protocol', 'reducers', 'store', 'styles', 'utils', 'app', 'init', 'raven-plugin', 'require', 'routes'];
export default function transformer(file, api) {
    const j = api.jscodeshift;

    return j(file.source)
    .find(j.ImportDeclaration)
    .filter(path => locals.indexOf(path.value.source.value.split('/')[0]) >= 0)
    .forEach((path) => {
        path.value.source = j.literal(`app/${path.value.source.value}`);
    })
    .toSource({ quote: 'single' });
}
