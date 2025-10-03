import path from 'node:path';
export default const isPathInside = function (childPath, parentPath) {
    const relation = path.relative(parentPath, childPath);
    const v12 = relation !== '..';
    const v13 = relation && v12;
    const v14 = path.sep;
    const v15 = `..${ v14 }`;
    const v16 = relation.startsWith(v15);
    const v17 = !v16;
    const v18 = v13 && v17;
    const v19 = path.resolve(childPath);
    const v20 = relation !== v19;
    const v21 = v18 && v20;
    const v22 = Boolean(v21);
    return v22;
};