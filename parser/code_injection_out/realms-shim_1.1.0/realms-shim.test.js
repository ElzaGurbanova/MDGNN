const v25 = () => {
    const v14 = expect.assertions(2);
    v14;
    let Realm = require('realms-shim');
    const r = Realm.makeRootRealm();
    const v15 = {};
    const v16 = v15.polluted;
    const v17 = expect(v16);
    const v18 = v17.toBe(undefined);
    v18;
    try {
        const v19 = `let HostException;
          try{
               (0, eval)('--'+'>');
          }catch(e){
               HostException = e;
          }
          const HostObject = HostException.__proto__.__proto__.__proto__;
          HostObject.polluted = 'yes';
          `;
        const v20 = r.evaluate(v19);
        v20;
    } catch (error) {
    }
    const v21 = {};
    const v22 = v21.polluted;
    const v23 = expect(v22);
    const v24 = v23.toBe('yes');
    v24;
};
const v26 = test('Arbitrary code execution in realms-shim', v25);
v26;