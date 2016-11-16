module.exports = {
    create(context) {
        return {
            ImportDeclaration(node) {
                const pattern = /(.*)\/index(?:.js)?$/;
                const match = node.source.value.match(pattern);
                if (match !== null) {
                    context.report({
                        node: node.source,
                        message: `'${node.source.value}' is not allowed. Use '${match[1]}' instead`,
                    });
                }
            },
        };
    },
};
