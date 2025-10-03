const v211 = require('fs');
const fs = v211.promises;
const fsSync = require('fs');
const path = require('path');
const v212 = require('child_process');
const spawn = v212.spawn;
const colors = {};
colors.reset = '\x1B[0m';
colors.green = '\x1B[32m';
colors.yellow = '\x1B[33m';
colors.blue = '\x1B[34m';
colors.red = '\x1B[31m';
const log = function (message, color = colors.reset) {
    const v213 = colors.reset;
    const v214 = `${ color }${ message }${ v213 }`;
    const v215 = console.log(v214);
    v215;
};
const validateProjectName = function (name) {
    const v216 = !name;
    const v217 = typeof name;
    const v218 = v217 !== 'string';
    const v219 = v216 || v218;
    const v220 = name.trim();
    const v221 = v220.length;
    const v222 = v221 === 0;
    const v223 = v219 || v222;
    if (v223) {
        const v224 = new Error('Project name cannot be empty');
        throw v224;
    }
    const trimmedName = name.trim();
    const invalidChars = /[<>:"|?*;\\&$`(){}[\]!]/;
    const v225 = invalidChars.test(trimmedName);
    if (v225) {
        const v226 = new Error('Project name contains invalid characters. Only letters, numbers, hyphens, underscores, and dots are allowed.');
        throw v226;
    }
    const v227 = trimmedName.startsWith('.');
    if (v227) {
        const v228 = new Error('Project name cannot start with a dot');
        throw v228;
    }
    const reservedNames = [
        'con',
        'prn',
        'aux',
        'nul',
        'com1',
        'com2',
        'com3',
        'com4',
        'com5',
        'com6',
        'com7',
        'com8',
        'com9',
        'lpt1',
        'lpt2',
        'lpt3',
        'lpt4',
        'lpt5',
        'lpt6',
        'lpt7',
        'lpt8',
        'lpt9',
        'node_modules',
        'package.json'
    ];
    const v229 = trimmedName.toLowerCase();
    const v230 = reservedNames.includes(v229);
    if (v230) {
        const v231 = new Error(`'${ trimmedName }' is a reserved name and cannot be used as a project name`);
        throw v231;
    }
    const v232 = trimmedName.includes('..');
    const v233 = trimmedName.includes('/');
    const v234 = v232 || v233;
    const v235 = trimmedName.includes('\\');
    const v236 = v234 || v235;
    if (v236) {
        const v237 = new Error('Project name cannot contain path separators or parent directory references');
        throw v237;
    }
    const v238 = trimmedName.length;
    const v239 = v238 > 214;
    if (v239) {
        const v240 = new Error('Project name is too long (maximum 214 characters)');
        throw v240;
    }
    return trimmedName;
};
const safeSpawn = function (args, cwd) {
    const v258 = resolve => {
        const normalizedCwd = path.resolve(cwd);
        const v241 = process.cwd();
        const v242 = normalizedCwd.startsWith(v241);
        const v243 = !v242;
        const v244 = path.isAbsolute(normalizedCwd);
        const v245 = !v244;
        const v246 = v243 && v245;
        if (v246) {
            const v247 = resolve(false);
            v247;
            return;
        }
        const v248 = args[0];
        const v249 = args.slice(1);
        const v250 = {
            cwd: normalizedCwd,
            stdio: 'ignore',
            shell: false
        };
        const child = spawn(v248, v249, v250);
        const v253 = code => {
            const v251 = code === 0;
            const v252 = resolve(v251);
            v252;
        };
        const v254 = child.on('close', v253);
        v254;
        const v256 = () => {
            const v255 = resolve(false);
            v255;
        };
        const v257 = child.on('error', v256);
        v257;
    };
    const v259 = new Promise(v258);
    return v259;
};
const createProjectStructure = async function (projectDir) {
    const directories = [
        'src/config',
        'src/controllers',
        'src/middlewares',
        'src/models',
        'src/routes',
        'src/services',
        'src/utils',
        'tests/unit',
        'tests/integration',
        'tests/fixtures',
        'docs/standards',
        'public/images',
        'public/styles',
        'public/scripts'
    ];
    try {
        const v265 = async dir => {
            const fullPath = path.join(projectDir, dir);
            try {
                const v260 = { recursive: true };
                await fs.mkdir(fullPath, v260);
            } catch (error) {
                const v261 = error.code;
                const v262 = v261 !== 'EEXIST';
                if (v262) {
                    const v263 = error.message;
                    const v264 = new Error(`Failed to create directory ${ fullPath }: ${ v263 }`);
                    throw v264;
                }
            }
        };
        const v266 = directories.map(v265);
        await Promise.all(v266);
        const v267 = colors.green;
        const v268 = log('Created project directory structure', v267);
        v268;
    } catch (error) {
        const v269 = error.message;
        const v270 = new Error(`Failed to create project structure: ${ v269 }`);
        throw v270;
    }
};
const createPackageJson = async function (projectDir, projectName) {
    const v271 = {};
    v271.start = 'node src/app.js';
    v271.dev = 'nodemon src/app.js';
    v271.test = 'jest';
    v271['lint:md'] = 'markdownlint "*.md" "docs/*.md"';
    v271['lint:js'] = 'eslint --ext .js,.jsx,.ts,.tsx .';
    v271.lint = 'npm run lint:md && npm run lint:js';
    v271['test:watch'] = 'jest --watch';
    v271['test:coverage'] = 'jest --coverage';
    const v272 = [
        'rest',
        'api',
        'node',
        'express'
    ];
    const v273 = {};
    v273['bcrypt'] = '^5.1.1';
    v273['cors'] = '^2.8.5';
    v273['dotenv'] = '^16.3.1';
    v273['express'] = '^4.18.2';
    v273['express-validator'] = '^7.0.1';
    v273['helmet'] = '^7.1.0';
    v273['joi'] = '^17.11.0';
    v273['jsonwebtoken'] = '^9.0.2';
    v273['morgan'] = '^1.10.0';
    v273['mysql2'] = '^3.6.5';
    v273['sequelize'] = '^6.35.1';
    v273['winston'] = '^3.11.0';
    const v274 = {};
    v274['eslint'] = '^8.55.0';
    v274['eslint-config-airbnb-base'] = '^15.0.0';
    v274['eslint-plugin-import'] = '^2.29.0';
    v274['jest'] = '^29.7.0';
    v274['markdownlint-cli'] = '^0.37.0';
    v274['nodemon'] = '^3.0.2';
    v274['supertest'] = '^6.3.3';
    const packageJson = {};
    packageJson.name = projectName;
    packageJson.version = '1.0.0';
    packageJson.description = 'A RESTful API using REST-Base standards';
    packageJson.main = 'src/app.js';
    packageJson.scripts = v271;
    packageJson.keywords = v272;
    packageJson.author = '';
    packageJson.license = 'MIT';
    packageJson.dependencies = v273;
    packageJson.devDependencies = v274;
    try {
        const packageJsonPath = path.join(projectDir, 'package.json');
        const v275 = JSON.stringify(packageJson, null, 2);
        await fs.writeFile(packageJsonPath, v275, 'utf8');
        const v276 = colors.green;
        const v277 = log('Created package.json', v276);
        v277;
    } catch (error) {
        const v278 = error.message;
        const v279 = new Error(`Failed to create package.json: ${ v278 }`);
        throw v279;
    }
};
const copyStandardsFiles = async function (projectDir, sourceDir) {
    const standardsFiles = [
        'node_structure_and_naming_conventions.md',
        'sql-standards-and-patterns.md',
        'technologies.md',
        'operations-and-responses.md',
        'request.md',
        'validation.md',
        'global-rules.md',
        'CLAUDE.md'
    ];
    try {
        const v285 = async file => {
            const source = path.join(sourceDir, file);
            const destination = path.join(projectDir, 'docs', 'standards', file);
            try {
                await fs.access(source);
                await fs.copyFile(source, destination);
            } catch (error) {
                const v280 = error.code;
                const v281 = v280 === 'ENOENT';
                if (v281) {
                    const v282 = new Error(`Source file not found: ${ source }`);
                    throw v282;
                }
                const v283 = error.message;
                const v284 = new Error(`Failed to copy ${ file }: ${ v283 }`);
                throw v284;
            }
        };
        const v286 = standardsFiles.map(v285);
        await Promise.all(v286);
        const v287 = colors.green;
        const v288 = log('Copied standards documentation', v287);
        v288;
    } catch (error) {
        const v289 = error.message;
        const v290 = new Error(`Failed to copy standards files: ${ v289 }`);
        throw v290;
    }
};
const copyConfigFiles = async function (projectDir, sourceDir) {
    const v291 = [
        '.markdownlint.json',
        '.markdownlint.json'
    ];
    const v292 = [
        '.gitignore',
        '.gitignore'
    ];
    const configFiles = [
        v291,
        v292
    ];
    try {
        const v298 = async ([source, destination]) => {
            const sourcePath = path.join(sourceDir, source);
            const destPath = path.join(projectDir, destination);
            try {
                await fs.access(sourcePath);
                await fs.copyFile(sourcePath, destPath);
            } catch (error) {
                const v293 = error.code;
                const v294 = v293 === 'ENOENT';
                if (v294) {
                    const v295 = new Error(`Source config file not found: ${ sourcePath }`);
                    throw v295;
                }
                const v296 = error.message;
                const v297 = new Error(`Failed to copy ${ source }: ${ v296 }`);
                throw v297;
            }
        };
        const v299 = configFiles.map(v298);
        await Promise.all(v299);
        const eslintConfig = `module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }]
  },
};`;
        const v300 = path.join(projectDir, '.eslintrc.js');
        await fs.writeFile(v300, eslintConfig);
        const envExample = `# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_name
DB_USER=db_user
DB_PASSWORD=db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h

# Logging
LOG_LEVEL=info
`;
        const v301 = path.join(projectDir, '.env.example');
        await fs.writeFile(v301, envExample);
        const v302 = colors.green;
        const v303 = log('Created configuration files', v302);
        v303;
    } catch (error) {
        const v304 = error.message;
        const v305 = new Error(`Failed to create config files: ${ v304 }`);
        throw v305;
    }
};
const createAppFiles = async function (projectDir) {
    const appJs = `/**
 * Main application entry point
 */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(\`Server running on port \${port}\`);
  });
}

module.exports = app;
`;
    const loggerJs = `/**
 * Logger utility
 */
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Don't log during tests
if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}

module.exports = logger;
`;
    const errorHandlerJs = `/**
 * Global error handler middleware
 */
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.id
  });
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: statusCode === 500 
      ? 'An unexpected error occurred' 
      : err.message,
    requestId: req.id // For support reference
  });
};

module.exports = { errorHandler };
`;
    const routesJs = `/**
 * API Routes
 */
const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// TODO: Add your routes here
// Example: router.use('/users', require('./userRoutes'));

module.exports = router;
`;
    try {
        const v306 = path.join(projectDir, 'src', 'app.js');
        const v307 = {
            path: v306,
            content: appJs
        };
        const v308 = path.join(projectDir, 'src', 'utils', 'logger.js');
        const v309 = {
            path: v308,
            content: loggerJs
        };
        const v310 = path.join(projectDir, 'src', 'middlewares', 'errorHandler.js');
        const v311 = {
            path: v310,
            content: errorHandlerJs
        };
        const v312 = path.join(projectDir, 'src', 'routes', 'index.js');
        const v313 = {
            path: v312,
            content: routesJs
        };
        const files = [
            v307,
            v309,
            v311,
            v313
        ];
        const v319 = async file => {
            try {
                const v314 = file.path;
                const v315 = file.content;
                await fs.writeFile(v314, v315);
            } catch (error) {
                const v316 = file.path;
                const v317 = error.message;
                const v318 = new Error(`Failed to create ${ v316 }: ${ v317 }`);
                throw v318;
            }
        };
        const v320 = files.map(v319);
        await Promise.all(v320);
        const v321 = colors.green;
        const v322 = log('Created application files', v321);
        v322;
    } catch (error) {
        const v323 = error.message;
        const v324 = new Error(`Failed to create application files: ${ v323 }`);
        throw v324;
    }
};
const createReadme = async function (projectDir, projectName) {
    const readme = `# ${ projectName }

A RESTful API built following REST-Base standards.

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MySQL/MariaDB

### Installation

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Copy .env.example to .env and update with your configuration
4. Start the server: \`npm run dev\`

## Project Structure

\`\`\`
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Express middlewares
├── models/         # Data models
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Utility functions
└── app.js          # Express app setup
tests/              # Test files
docs/               # Documentation
└── standards/      # REST-Base standards
\`\`\`

## Development

### Available Scripts

- \`npm run dev\`: Start development server with hot reload
- \`npm start\`: Start production server
- \`npm test\`: Run tests
- \`npm run lint\`: Run linters (ESLint and Markdownlint)

## Standards

This project follows the REST-Base standards. See the \`docs/standards/\` directory for details.

## License

This project is licensed under the MIT License.
`;
    try {
        const v325 = path.join(projectDir, 'README.md');
        await fs.writeFile(v325, readme);
        const v326 = colors.green;
        const v327 = log('Created README.md', v326);
        v327;
    } catch (error) {
        const v328 = error.message;
        const v329 = new Error(`Failed to create README.md: ${ v328 }`);
        throw v329;
    }
};
const initGit = async function (projectDir) {
    const normalizedPath = path.resolve(projectDir);
    const v330 = !normalizedPath;
    const v331 = normalizedPath.includes('..');
    const v332 = v330 || v331;
    const v333 = path.isAbsolute(normalizedPath);
    const v334 = !v333;
    const v335 = v332 || v334;
    const v336 = fsSync.existsSync(normalizedPath);
    const v337 = !v336;
    const v338 = v335 || v337;
    if (v338) {
        const v339 = colors.yellow;
        const v340 = log('Warning: Invalid or unsafe project directory path, skipping Git initialization', v339);
        v340;
        return;
    }
    const v341 = [
        'git',
        'init'
    ];
    const initSuccess = await safeSpawn(v341, normalizedPath);
    const v342 = !initSuccess;
    if (v342) {
        const v343 = colors.yellow;
        const v344 = log('Warning: Could not initialize Git repository', v343);
        v344;
        return;
    }
    const v345 = [
        'git',
        'add',
        '.'
    ];
    const addSuccess = await safeSpawn(v345, normalizedPath);
    const v346 = !addSuccess;
    if (v346) {
        const v347 = colors.yellow;
        const v348 = log('Warning: Could not add files to Git repository', v347);
        v348;
        return;
    }
    const v349 = [
        'git',
        'commit',
        '-m',
        'Initial commit with REST-Base standards'
    ];
    const commitSuccess = await safeSpawn(v349, normalizedPath);
    const v350 = !commitSuccess;
    if (v350) {
        const v351 = colors.yellow;
        const v352 = log('Warning: Could not create initial commit (this is normal if Git user is not configured)', v351);
        v352;
        return;
    }
    const v353 = colors.green;
    const v354 = log('Initialized Git repository', v353);
    v354;
};
const main = async function () {
    const v355 = process.argv;
    const args = v355.slice(2);
    const v356 = args.length;
    const v357 = v356 === 0;
    if (v357) {
        const v358 = colors.red;
        const v359 = log('Please provide a project name', v358);
        v359;
        const v360 = colors.yellow;
        const v361 = log('Usage: node create-project.js <project-name>', v360);
        v361;
        const v362 = process.exit(1);
        v362;
    }
    let projectName;
    try {
        const v363 = args[0];
        projectName = validateProjectName(v363);
    } catch (error) {
        const v364 = error.message;
        const v365 = `Error: ${ v364 }`;
        const v366 = colors.red;
        const v367 = log(v365, v366);
        v367;
        const v368 = colors.yellow;
        const v369 = log('Usage: node create-project.js <project-name>', v368);
        v369;
        const v370 = process.exit(1);
        v370;
    }
    const v371 = process.cwd();
    const projectDir = path.join(v371, projectName);
    const sourceDir = path.join(__dirname, '..');
    const v372 = fsSync.existsSync(projectDir);
    if (v372) {
        const v373 = `Directory ${ projectDir } already exists. Please choose another name.`;
        const v374 = colors.red;
        const v375 = log(v373, v374);
        v375;
        const v376 = process.exit(1);
        v376;
    }
    const v377 = `Creating new project: ${ projectName }`;
    const v378 = colors.blue;
    const v379 = log(v377, v378);
    v379;
    const v380 = colors.blue;
    const v381 = log('===============================', v380);
    v381;
    try {
        await createProjectStructure(projectDir);
        await createPackageJson(projectDir, projectName);
        await copyStandardsFiles(projectDir, sourceDir);
        await copyConfigFiles(projectDir, sourceDir);
        await createAppFiles(projectDir);
        await createReadme(projectDir, projectName);
        await initGit(projectDir);
        const v382 = colors.green;
        const v383 = log('\nProject creation complete!', v382);
        v383;
        const v384 = `\nTo get started:`;
        const v385 = colors.yellow;
        const v386 = log(v384, v385);
        v386;
        const v387 = `  cd ${ projectName }`;
        const v388 = colors.yellow;
        const v389 = log(v387, v388);
        v389;
        const v390 = `  npm install`;
        const v391 = colors.yellow;
        const v392 = log(v390, v391);
        v392;
        const v393 = `  npm run dev`;
        const v394 = colors.yellow;
        const v395 = log(v393, v394);
        v395;
    } catch (error) {
        const v396 = error.message;
        const v397 = `\nError creating project: ${ v396 }`;
        const v398 = colors.red;
        const v399 = log(v397, v398);
        v399;
        try {
            const v400 = fsSync.existsSync(projectDir);
            if (v400) {
                const v401 = colors.yellow;
                const v402 = log('Attempting to clean up...', v401);
                v402;
                const v403 = { recursive: true };
                await fs.rmdir(projectDir, v403);
                const v404 = colors.yellow;
                const v405 = log('Cleanup completed', v404);
                v405;
            }
        } catch (rollbackError) {
            const v406 = rollbackError.message;
            const v407 = `Warning: Could not clean up ${ projectDir }: ${ v406 }`;
            const v408 = colors.red;
            const v409 = log(v407, v408);
            v409;
            const v410 = colors.yellow;
            const v411 = log('You may need to manually remove the directory', v410);
            v411;
        }
        const v412 = process.exit(1);
        v412;
    }
};
const v413 = main();
const v419 = error => {
    const v414 = error.message;
    const v415 = `Fatal error: ${ v414 }`;
    const v416 = colors.red;
    const v417 = log(v415, v416);
    v417;
    const v418 = process.exit(1);
    v418;
};
const v420 = v413.catch(v419);
v420;