'use strict';
const path = require('path');
const v112 = require('util');
const promisify = v112.promisify;
const graphviz = require('graphviz');
const v113 = require('child_process');
const v114 = v113.exec;
const exec = promisify(v114);
const v115 = require('fs');
const v116 = v115.writeFile;
const writeFile = promisify(v116);
const setNodeColor = function (node, color) {
    const v117 = node.set('color', color);
    v117;
    const v118 = node.set('fontcolor', color);
    v118;
};
const checkGraphvizInstalled = function (config) {
    const v119 = config.graphVizPath;
    if (v119) {
        const v120 = config.graphVizPath;
        const cmd = path.join(v120, 'gvpr -V');
        const v121 = exec(cmd);
        const v124 = () => {
            const v122 = 'Could not execute ' + cmd;
            const v123 = new Error(v122);
            throw v123;
        };
        const v125 = v121.catch(v124);
        return v125;
    }
    const v126 = exec('gvpr -V');
    const v129 = error => {
        const v127 = 'Graphviz could not be found. Ensure that "gvpr" is in your $PATH.\n' + error;
        const v128 = new Error(v127);
        throw v128;
    };
    const v130 = v126.catch(v129);
    return v130;
};
const createGraphvizOptions = function (config) {
    const v131 = config.graphVizOptions;
    const v132 = {};
    const graphVizOptions = v131 || v132;
    const v133 = config.rankdir;
    const v134 = config.layout;
    const v135 = config.backgroundColor;
    const v136 = {
        overlap: false,
        pad: 0.3,
        rankdir: v133,
        layout: v134,
        bgcolor: v135
    };
    const v137 = graphVizOptions.G;
    const v138 = Object.assign(v136, v137);
    const v139 = config.edgeColor;
    const v140 = { color: v139 };
    const v141 = graphVizOptions.E;
    const v142 = Object.assign(v140, v141);
    const v143 = config.fontName;
    const v144 = config.fontSize;
    const v145 = config.nodeColor;
    const v146 = config.nodeShape;
    const v147 = config.nodeStyle;
    const v148 = config.nodeColor;
    const v149 = {
        fontname: v143,
        fontsize: v144,
        color: v145,
        shape: v146,
        style: v147,
        height: 0,
        fontcolor: v148
    };
    const v150 = graphVizOptions.N;
    const v151 = Object.assign(v149, v150);
    const v152 = {};
    v152.G = v138;
    v152.E = v142;
    v152.N = v151;
    return v152;
};
const createGraph = function (modules, circular, config, options) {
    const g = graphviz.digraph('G');
    const nodes = {};
    const v154 = (a, b) => {
        const v153 = a.concat(b);
        return v153;
    };
    const v155 = [];
    const cyclicModules = circular.reduce(v154, v155);
    const v156 = config.graphVizPath;
    if (v156) {
        const v157 = config.graphVizPath;
        const v158 = g.setGraphVizPath(v157);
        v158;
    }
    const v159 = Object.keys(modules);
    const v186 = id => {
        const v160 = nodes[id];
        const v161 = g.addNode(id);
        nodes[id] = v160 || v161;
        const v162 = modules[id];
        const v163 = v162.length;
        const v164 = !v163;
        if (v164) {
            const v165 = nodes[id];
            const v166 = config.noDependencyColor;
            const v167 = setNodeColor(v165, v166);
            v167;
        } else {
            const v168 = cyclicModules.indexOf(id);
            const v169 = v168 >= 0;
            if (v169) {
                const v170 = nodes[id];
                const v171 = config.cyclicNodeColor;
                const v172 = setNodeColor(v170, v171);
                v172;
            }
        }
        const v173 = modules[id];
        const v184 = depId => {
            const v174 = nodes[depId];
            const v175 = g.addNode(depId);
            nodes[depId] = v174 || v175;
            const v176 = modules[depId];
            const v177 = !v176;
            if (v177) {
                const v178 = nodes[depId];
                const v179 = config.noDependencyColor;
                const v180 = setNodeColor(v178, v179);
                v180;
            }
            const v181 = nodes[id];
            const v182 = nodes[depId];
            const v183 = g.addEdge(v181, v182);
            v183;
        };
        const v185 = v173.forEach(v184);
        v185;
    };
    const v187 = v159.forEach(v186);
    v187;
    const v192 = (resolve, reject) => {
        const v190 = (code, out, err) => {
            const v188 = new Error(err);
            const v189 = reject(v188);
            v189;
        };
        const v191 = g.output(options, resolve, v190);
        v191;
    };
    const v193 = new Promise(v192);
    return v193;
};
const v194 = module.exports;
const v199 = function (modules, circular, config) {
    const options = createGraphvizOptions(config);
    options.type = 'svg';
    const v195 = checkGraphvizInstalled(config);
    const v197 = () => {
        const v196 = createGraph(modules, circular, config, options);
        return v196;
    };
    const v198 = v195.then(v197);
    return v198;
};
v194.svg = v199;
const v200 = module.exports;
const v213 = function (modules, circular, imagePath, config) {
    const options = createGraphvizOptions(config);
    const v201 = path.extname(imagePath);
    const v202 = v201.replace('.', '');
    options.type = v202 || 'png';
    const v203 = checkGraphvizInstalled(config);
    const v211 = () => {
        const v204 = createGraph(modules, circular, config, options);
        const v206 = image => {
            const v205 = writeFile(imagePath, image);
            return v205;
        };
        const v207 = v204.then(v206);
        const v209 = () => {
            const v208 = path.resolve(imagePath);
            return v208;
        };
        const v210 = v207.then(v209);
        return v210;
    };
    const v212 = v203.then(v211);
    return v212;
};
v200.image = v213;
const v214 = module.exports;
const v222 = function (modules, circular, config) {
    const options = createGraphvizOptions(config);
    options.type = 'dot';
    const v215 = checkGraphvizInstalled(config);
    const v217 = () => {
        const v216 = createGraph(modules, circular, config, options);
        return v216;
    };
    const v218 = v215.then(v217);
    const v220 = output => {
        const v219 = output.toString('utf8');
        return v219;
    };
    const v221 = v218.then(v220);
    return v221;
};
v214.dot = v222;