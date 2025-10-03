const path = require('node:path');
const validatePath = function (req, res, next) {
    const v157 = req.path;
    const v158 = path.normalize(v157);
    const v159 = v158.includes('..');
    if (v159) {
        const v160 = res.status(400);
        const v161 = v160.send('Bad request');
        v161;
        return;
    }
    const v162 = next();
    v162;
};
const v163 = {};
v163.validatePath = validatePath;
module.exports = v163;
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const v164 = require('notifications-node-client');
const NotifyClient = v164.NotifyClient;
const config = require('./app/config');
const v165 = require('./app/auth-config');
const skipAuth = v165.skipAuth;
const v166 = require('./app/auth/middleware');
const session = v166.session;
const isAuthenticated = v166.isAuthenticated;
const PageIndex = require('./middleware/pageIndex');
const v167 = require('./request-validation');
const validatePath = v167.validatePath;
const authRouter = require('./app/routes/auth');
const contentfulRouter = require('./app/routes/contentful');
const pageIndex = new PageIndex(config);
const v168 = process.env;
const v169 = v168.GOV_NOTIFY_API_KEY;
const notify = new NotifyClient(v169);
const app = express();
const v170 = helmet();
const v171 = app.use(v170);
v171;
const v172 = app.use(validatePath);
v172;
const v173 = app.set('trust proxy', 1);
const v174 = skipAuth || v173;
v174;
const v175 = app.use(session);
const v176 = skipAuth || v175;
v176;
const v177 = bodyParser.json();
const v178 = app.use(v177);
v178;
const v179 = { extended: true };
const v180 = bodyParser.urlencoded(v179);
const v181 = app.use(v180);
v181;
const v182 = path.join(__dirname, 'public/assets/images', 'favicon.ico');
const v183 = favicon(v182);
const v184 = app.use(v183);
v184;
const v185 = app.set('view engine', 'html');
v185;
const v186 = app.locals;
v186.serviceName = 'Apply the Service Standard in DfE';
const v187 = [
    'app/views',
    'node_modules/govuk-frontend/dist/',
    'node_modules/dfe-frontend/packages/components'
];
const v188 = {
    autoescape: true,
    express: app
};
var nunjuckEnv = nunjucks.configure(v187, v188);
const v189 = nunjuckEnv.addFilter('date', dateFilter);
v189;
const v190 = marked.parse;
const v191 = markdown.register(nunjuckEnv, v190);
v191;
const v192 = express.static('public/assets');
const v193 = app.use('/assets', v192);
v193;
const v199 = (_, res) => {
    const v194 = res.type('text/plain');
    v194;
    const v195 = config.allowRobots;
    let v196;
    if (v195) {
        v196 = '';
    } else {
        v196 = '/';
    }
    const v197 = `User-agent: *\nDisallow: ${ v196 }`;
    const v198 = res.send(v197);
    return v198;
};
const v200 = app.get('/robots.txt', v199);
v200;
const v201 = app.use(isAuthenticated);
const v202 = skipAuth || v201;
v202;
const v203 = app.use('/auth', authRouter);
const v204 = skipAuth || v203;
v204;
const v205 = app.use('/', contentfulRouter);
v205;
const v209 = (_, res) => {
    const v206 = { 'Content-Type': 'application/xml' };
    const v207 = res.set(v206);
    v207;
    const v208 = res.render('sitemap.xml');
    v208;
};
const v210 = app.get('/sitemap.xml', v209);
v210;
const v234 = (req, res) => {
    const v211 = req.query;
    const v212 = v211['searchterm'];
    const v213 = console.log(v212);
    v213;
    const v214 = req.query;
    const v215 = v214['searchterm'];
    const query = v215 || '';
    const resultsPerPage = 10;
    const v216 = req.query;
    const v217 = v216.page;
    let currentPage = parseInt(v217, 10);
    const results = pageIndex.search(query);
    const v218 = 'Results: ' + results;
    const v219 = console.log(v218);
    v219;
    const v220 = 'Query: ' + query;
    const v221 = console.log(v220);
    v221;
    const v222 = results.length;
    const v223 = v222 / resultsPerPage;
    const maxPage = Math.ceil(v223);
    const v224 = Number.isInteger(currentPage);
    const v225 = !v224;
    if (v225) {
        currentPage = 1;
    } else {
        const v226 = currentPage > maxPage;
        const v227 = currentPage < 1;
        const v228 = v226 || v227;
        if (v228) {
            currentPage = 1;
        }
    }
    const v229 = currentPage - 1;
    const startingIndex = resultsPerPage * v229;
    const endingIndex = startingIndex + resultsPerPage;
    const v230 = results.slice(startingIndex, endingIndex);
    const v231 = results.length;
    const v232 = {
        currentPage,
        maxPage,
        query,
        results: v230,
        resultsLen: v231
    };
    const v233 = res.render('search.html', v232);
    v233;
};
const v235 = app.get('/search', v234);
v235;
const v236 = config.env;
const v237 = v236 !== 'development';
if (v237) {
    const v239 = () => {
        const v238 = pageIndex.init();
        v238;
    };
    const v240 = setTimeout(v239, 2000);
    v240;
}
const v255 = (req, res) => {
    const v241 = req.body;
    const feedback = v241.feedback_form_input;
    const v242 = req.headers;
    const v243 = v242.referer;
    const fullUrl = v243 || 'Unknown';
    const v244 = process.env;
    const v245 = v244.FEEDBACK_TEMPLATE_ID;
    const v246 = {};
    v246.feedback = feedback;
    v246.page = fullUrl;
    v246.service = 'Apply Service Standard in Justice Digital';
    const v247 = { personalisation: v246 };
    const v248 = notify.sendEmail(v245, 'cdpt@justice.gov.uk', v247);
    const v249 = response => {
    };
    const v250 = v248.then(v249);
    const v252 = err => {
        const v251 = console.log(err);
        return v251;
    };
    const v253 = v250.catch(v252);
    v253;
    const v254 = res.sendStatus(200);
    return v254;
};
const v256 = app.post('/submit-feedback', v255);
v256;
const v258 = (req, res) => {
    const v257 = res.redirect('/');
    return v257;
};
const v259 = app.get('/service-standard', v258);
v259;
const v268 = (req, res) => {
    const v260 = req.body;
    const response = v260.response;
    const service = 'Apply the service standard';
    const v261 = req.headers;
    const v262 = v261.referer;
    const pageURL = v262 || 'Unknown';
    const v263 = new Date();
    const date = v263.toISOString();
    const v264 = {
        Response: response,
        Service: service,
        URL: pageURL
    };
    const v265 = console.log('Data', v264);
    v265;
    const v266 = {
        success: true,
        message: 'Feedback submitted successfully'
    };
    const v267 = res.json(v266);
    v267;
};
const v269 = app.post('/form-response/helpful', v268);
v269;
const v278 = (req, res) => {
    const v270 = req.body;
    const response = v270.response;
    const service = 'Apply the service standard';
    const v271 = req.headers;
    const v272 = v271.referer;
    const pageURL = v272 || 'Unknown';
    const v273 = new Date();
    const date = v273.toISOString();
    const v274 = {
        Feedback: response,
        Service: service,
        URL: pageURL
    };
    const v275 = console.log('Feedback', v274);
    v275;
    const v276 = {
        success: true,
        message: 'Feedback submitted successfully'
    };
    const v277 = res.json(v276);
    v277;
};
const v279 = app.post('/form-response/feedback', v278);
v279;
const v281 = function (req, res, next) {
    const v280 = matchRoutes(req, res, next);
    v280;
};
const v282 = app.get(/^([^.]+)$/, v281);
v282;
const v285 = function (req, res, next) {
    const v283 = res.status(404);
    const v284 = v283.render('error.html');
    v284;
};
const v286 = app.use(v285);
v286;
const v291 = function (err, req, res, next) {
    const v287 = err.stack;
    const v288 = console.error(v287);
    v288;
    const v289 = res.status(500);
    const v290 = v289.render('error.html');
    v290;
};
const v292 = app.use(v291);
v292;
const renderPath = function (path, res, next) {
    const v306 = function (error, html) {
        const v293 = !error;
        if (v293) {
            const v294 = { 'Content-type': 'text/html; charset=utf-8' };
            const v295 = res.set(v294);
            v295;
            const v296 = res.end(html);
            v296;
            return;
        }
        const v297 = error.message;
        const v298 = v297.startsWith('template not found');
        const v299 = !v298;
        if (v299) {
            const v300 = next(error);
            v300;
            return;
        }
        const v301 = path.endsWith('/index');
        const v302 = !v301;
        if (v302) {
            const v303 = path + '/index';
            const v304 = renderPath(v303, res, next);
            v304;
            return;
        }
        const v305 = next();
        v305;
    };
    const v307 = res.render(path, v306);
    v307;
};
const v310 = function (req, res, next) {
    var path = req.path;
    path = path.substr(1);
    const v308 = path === '';
    if (v308) {
        path = 'index';
    }
    const v309 = renderPath(path, res, next);
    v309;
};
matchRoutes = v310;
const v311 = config.port;
const v312 = app.listen(v311);
v312;