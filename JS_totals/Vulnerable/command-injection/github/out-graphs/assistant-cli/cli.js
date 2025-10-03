const v10 = require('child_process');
const spawnSync = v10.spawnSync;
const v11 = require('path');
const resolve = v11.resolve;
const v12 = 'node --no-warnings ' + __dirname;
const v13 = v12 + '/../dist/app.js ';
const v14 = process.argv;
const v15 = v14.join(' ');
const cmd = v13 + v15;
const v16 = process.env;
const v17 = {
    stdio: 'inherit',
    shell: true,
    env: v16
};
const v18 = spawnSync(cmd, v17);
v18;