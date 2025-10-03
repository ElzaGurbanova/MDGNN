const fs = require('fs');
const path = require('path');
const v114 = require('child_process');
const execSync = v114.execSync;
const v115 = process.argv;
const args = v115.slice(2);
const envIndex = args.indexOf('--env');
let environment;
const v116 = -1;
const v117 = envIndex !== v116;
const v118 = envIndex + 1;
const v119 = args[v118];
const v120 = v117 && v119;
const v121 = envIndex + 1;
const v122 = args[v121];
if (v120) {
    environment = v122;
} else {
    environment = 'dev';
}
const outputIndex = args.indexOf('--output-file');
let outputFile;
const v123 = -1;
const v124 = outputIndex !== v123;
const v125 = outputIndex + 1;
const v126 = args[v125];
const v127 = v124 && v126;
const v128 = outputIndex + 1;
const v129 = args[v128];
const v130 = path.join(__dirname, '..', 'src', 'aws-exports.js');
if (v127) {
    outputFile = v129;
} else {
    outputFile = v130;
}
const allowedEnvironments = [
    'dev',
    'staging',
    'prod'
];
const v131 = allowedEnvironments.includes(environment);
const v132 = !v131;
if (v132) {
    const v133 = `❌ Invalid environment: ${ environment }`;
    const v134 = console.error(v133);
    v134;
    const v135 = allowedEnvironments.join(', ');
    const v136 = `Allowed environments: ${ v135 }`;
    const v137 = console.error(v136);
    v137;
    const v138 = process.exit(1);
    v138;
}
const stackPrefix = 'LittleBit';
const coreStackName = `${ stackPrefix }-Core-${ environment }`;
const apiStackName = `${ stackPrefix }-API-${ environment }`;
const computeStackName = `${ stackPrefix }-Compute-${ environment }`;
const fetchStackOutputs = async function (stackName) {
    try {
        const v139 = /^[a-zA-Z0-9-]+$/.test(stackName);
        const v140 = !v139;
        if (v140) {
            const v141 = new Error(`Invalid stack name format: ${ stackName }`);
            throw v141;
        }
        const command = `aws cloudformation describe-stacks --stack-name ${ stackName } --query "Stacks[0].Outputs" --output json`;
        const v142 = { encoding: 'utf-8' };
        const output = execSync(command, v142);
        const outputs = JSON.parse(output);
        const outputsMap = {};
        const v145 = output => {
            const v143 = output.OutputKey;
            const v144 = output.OutputValue;
            outputsMap[v143] = v144;
        };
        const v146 = outputs.forEach(v145);
        v146;
        return outputsMap;
    } catch (error) {
        const v147 = `Failed to fetch outputs for stack ${ stackName }:`;
        const v148 = error.message;
        const v149 = console.error(v147, v148);
        v149;
        return null;
    }
};
const readLocalOutputs = function () {
    const v150 = `cdk-outputs-${ environment }.json`;
    const outputsFile = path.join(__dirname, '..', 'cdk', 'outputs', v150);
    const v151 = fs.existsSync(outputsFile);
    const v152 = !v151;
    if (v152) {
        const v153 = `Local outputs file not found: ${ outputsFile }`;
        const v154 = console.log(v153);
        v154;
        return null;
    }
    try {
        const content = fs.readFileSync(outputsFile, 'utf-8');
        const v155 = JSON.parse(content);
        return v155;
    } catch (error) {
        const v156 = `Failed to read local outputs file:`;
        const v157 = error.message;
        const v158 = console.error(v156, v157);
        v158;
        return null;
    }
};
const generateAwsExports = function (outputs) {
    const v159 = outputs;
    const core = v159.core;
    const api = v159.api;
    const compute = v159.compute;
    const v160 = !core;
    const v161 = !api;
    const v162 = v160 || v161;
    if (v162) {
        const v163 = new Error('Missing required stack outputs (Core or API)');
        throw v163;
    }
    const v164 = process.env;
    const v165 = v164.CDK_DEPLOY_REGION;
    const v166 = v165 || 'us-west-2';
    const v167 = core.IdentityPoolId;
    const v168 = process.env;
    const v169 = v168.CDK_DEPLOY_REGION;
    const v170 = v169 || 'us-west-2';
    const v171 = core.UserPoolId;
    const v172 = core.UserPoolClientId;
    const v173 = api.GraphQLAPIURL;
    const v174 = process.env;
    const v175 = v174.CDK_DEPLOY_REGION;
    const v176 = v175 || 'us-west-2';
    const v177 = api.GraphQLAPIKey;
    const v178 = core.AudioBucketName;
    const v179 = process.env;
    const v180 = v179.CDK_DEPLOY_REGION;
    const v181 = v180 || 'us-west-2';
    const v182 = process.env;
    const v183 = v182.CDK_DEPLOY_REGION;
    const v184 = v183 || 'us-west-2';
    const config = {};
    config.aws_project_region = v166;
    config.aws_cognito_identity_pool_id = v167;
    config.aws_cognito_region = v170;
    config.aws_user_pools_id = v171;
    config.aws_user_pools_web_client_id = v172;
    config.aws_appsync_graphqlEndpoint = v173;
    config.aws_appsync_region = v176;
    config.aws_appsync_authenticationType = 'AMAZON_COGNITO_USER_POOLS';
    config.aws_appsync_apiKey = v177;
    config.aws_user_files_s3_bucket = v178;
    config.aws_user_files_s3_bucket_region = v181;
    config.aws_mobile_analytics_app_id = undefined;
    config.aws_mobile_analytics_app_region = v184;
    const v185 = compute.ProcessingQueueUrl;
    const v186 = compute && v185;
    if (v186) {
        const v187 = compute.ProcessingQueueUrl;
        config.aws_sqs_queue_url = v187;
    }
    return config;
};
const writeAwsExports = function (config, filePath) {
    const v188 = new Date();
    const v189 = v188.toISOString();
    const v190 = JSON.stringify(config, null, 4);
    const content = `/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by scripts/generate-aws-exports.js
// Generated from CDK stack outputs for environment: ${ environment }
// Generated at: ${ v189 }

const awsmobile = ${ v190 };

export default awsmobile;
`;
    const dir = path.dirname(filePath);
    const v191 = fs.existsSync(dir);
    const v192 = !v191;
    if (v192) {
        const v193 = { recursive: true };
        const v194 = fs.mkdirSync(dir, v193);
        v194;
    }
    const v195 = fs.writeFileSync(filePath, content);
    v195;
    const v196 = `✅ Generated ${ filePath }`;
    const v197 = console.log(v196);
    v197;
};
const main = async function () {
    const v198 = `🔧 Generating aws-exports.js for environment: ${ environment }`;
    const v199 = console.log(v198);
    v199;
    let outputs = {};
    const v200 = console.log('\uD83D\uDCE1 Attempting to fetch outputs from AWS CloudFormation...');
    v200;
    const coreOutputs = await fetchStackOutputs(coreStackName);
    const apiOutputs = await fetchStackOutputs(apiStackName);
    const computeOutputs = await fetchStackOutputs(computeStackName);
    const v201 = coreOutputs && apiOutputs;
    if (v201) {
        const v202 = {};
        const v203 = computeOutputs || v202;
        outputs.core = coreOutputs;
        outputs.api = apiOutputs;
        outputs.compute = v203;
        outputs = {};
        outputs = {};
        const v204 = console.log('\u2705 Successfully fetched outputs from AWS');
        v204;
    } else {
        const v205 = console.log('\uD83D\uDCC1 Attempting to read outputs from local file...');
        v205;
        const localOutputs = readLocalOutputs();
        if (localOutputs) {
            outputs = localOutputs;
            const v206 = console.log('\u2705 Successfully read outputs from local file');
            v206;
        } else {
            const v207 = console.error('\u274C Failed to obtain CDK outputs from any source');
            v207;
            const v208 = console.log('\nPlease ensure either:');
            v208;
            const v209 = console.log('1. AWS CLI is configured and CDK stacks are deployed, or');
            v209;
            const v210 = `2. CDK outputs are saved to cdk/outputs/cdk-outputs-${ environment }.json`;
            const v211 = console.log(v210);
            v211;
            const v212 = process.exit(1);
            v212;
        }
    }
    try {
        const config = generateAwsExports(outputs);
        const v213 = writeAwsExports(config, outputFile);
        v213;
        const v214 = console.log('\n\uD83C\uDF89 Successfully generated aws-exports.js!');
        v214;
        const v215 = `Environment: ${ environment }`;
        const v216 = console.log(v215);
        v216;
        const v217 = `Output file: ${ outputFile }`;
        const v218 = console.log(v217);
        v218;
    } catch (error) {
        const v219 = error.message;
        const v220 = console.error('\u274C Failed to generate aws-exports.js:', v219);
        v220;
        const v221 = process.exit(1);
        v221;
    }
};
const v222 = main();
const v225 = error => {
    const v223 = console.error('Unexpected error:', error);
    v223;
    const v224 = process.exit(1);
    v224;
};
const v226 = v222.catch(v225);
v226;