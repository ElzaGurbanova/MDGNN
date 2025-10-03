const path = require('node:path');
const fs = require('node:fs');
const ENV_LINE_REGEX = /^([^=]+)=(.*)$/;
const envPath = path.resolve(__dirname, '../../packages/database/.env');
const schemaPath = path.resolve(__dirname, '../../packages/database/prisma/schema.prisma');
const v39 = fs.existsSync(envPath);
const v40 = !v39;
if (v40) {
    const v41 = process.stderr;
    const v42 = `Error: .env file not found at ${ envPath }\n`;
    const v43 = v41.write(v42);
    v43;
    const v44 = process.exit(1);
    v44;
}
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
let line;
const v45 = envContent.split('\n');
for (line of v45) {
    const match = line.match(ENV_LINE_REGEX);
    if (match) {
        const v46 = match[1];
        const key = v46.trim();
        const v47 = match[2];
        let value = v47.trim();
        const v48 = value.startsWith('"');
        const v49 = value.endsWith('"');
        const v50 = v48 && v49;
        if (v50) {
            const v51 = -1;
            value = value.slice(1, v51);
        }
        envVars[key] = value;
    }
}
let [key, value];
const v52 = Object.entries(envVars);
for ([key, value] of v52) {
    const v53 = process.env;
    v53[key] = value;
}
const v54 = process.stdout;
const v55 = v54.write('Starting Prisma Studio with the correct environment variables...\n');
v55;
const v56 = process.stdout;
const v57 = `Using schema: ${ schemaPath }\n`;
const v58 = v56.write(v57);
v58;
try {
    const v59 = require('node:child_process');
    const spawn = v59.spawn;
    const v60 = [
        'prisma',
        'studio',
        '--schema',
        schemaPath,
        '--port',
        '3005'
    ];
    const v61 = process.env;
    const v62 = {
        stdio: 'inherit',
        env: v61
    };
    const studio = spawn('npx', v60, v62);
    const v68 = code => {
        const v63 = code !== 0;
        if (v63) {
            const v64 = process.stderr;
            const v65 = `Prisma Studio exited with code ${ code }\n`;
            const v66 = v64.write(v65);
            v66;
            const v67 = process.exit(code);
            v67;
        }
    };
    const v69 = studio.on('exit', v68);
    v69;
    const v71 = () => {
        const v70 = studio.kill('SIGINT');
        v70;
    };
    const v72 = process.on('SIGINT', v71);
    v72;
} catch (error) {
    const v73 = process.stderr;
    const v74 = `Error running Prisma Studio: ${ error }\n`;
    const v75 = v73.write(v74);
    v75;
    const v76 = process.exit(1);
    v76;
}