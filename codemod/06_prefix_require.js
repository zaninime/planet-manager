const locals = ['components', 'protocol', 'reducers', 'store', 'styles', 'utils', 'app', 'init', 'raven-plugin', 'require', 'routes'];
export default function transformer(file, api) {
    const j = api.jscodeshift;

    return j(file.source)
    .find(j.CallExpression)
    .filter(path => path.value.callee.name === "require")
    .filter(path => locals.indexOf(path.value.arguments[0].value.split('/')[0]) >= 0)
    .forEach(path => {
        path.value.arguments[0] = j.literal(`app/${path.value.arguments[0].value}`);
    })
    .toSource({ quote: 'single' });
}