'use strict';
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var esprima = require('esprima');
var uglify = require('uglify-js');
var walk = require('esprima-walk');
const v977 = require('child_process');
var exec = v977.execSync;
var DS = path.sep;
const v978 = process.cwd();
var __callerDir = v978 + DS;
const v979 = __callerDir + 'node_modules';
var modulesPath = v979 + DS;
const v980 = DS + 'lib';
const v981 = __dirname.replace(v980, '');
const __buns = v981 + DS;
const v982 = __dirname + DS;
const v983 = v982 + 'src';
const v984 = v983 + DS;
const v985 = v984 + 'core';
const __core = v985 + DS;
const v986 = __dirname + DS;
const v987 = v986 + 'src';
const v988 = v987 + DS;
const v989 = v988 + 'includes';
const __inc = v989 + DS;
const v990 = __buns + 'node_modules';
const __mod = v990 + DS;
const v991 = __dirname + DS;
const v992 = v991 + 'src';
const v993 = v992 + DS;
const v994 = v993 + 'templates';
const __tpl = v994 + DS;
const v995 = __buns + '.tmp';
const __tmp = v995 + DS;
const v996 = __buns.replace(__callerDir, '');
const v997 = v996.replace(/\\/g, '/');
const v998 = '/' + v997;
const __tmpUri = v998 + '.tmp/';
try {
    const v999 = __mod + 'babel-preset-es2015';
    const v1000 = fs.lstatSync(v999);
    const v1001 = v1000.isDirectory();
    v1001;
    const v1002 = babel.OptionManager;
    const v1003 = v1002.prototype;
    const resolvePresets = function (presets, dirname, onResolve) {
        const v1006 = function (val) {
            const v1004 = __mod + 'babel-preset-';
            var presetLoc = v1004 + val;
            const v1005 = require(presetLoc);
            return v1005;
        };
        const v1007 = presets.map(v1006);
        return v1007;
    };
    v1003.resolvePresets = resolvePresets;
} catch (e) {
}
const BUILD_CONF = 'buns.json';
const MOD_CONF = __mod + 'modules.json';
const BOOT_FILE = 'bootstrap.js';
const TEMP_FILE = 'temp.js';
var i;
var j;
var e;
var currentModule;
var loopModules = false;
const v1008 = [];
const v1009 = {};
var config = {};
config.output = 'output';
config.source = 'source';
config.mode = 'dev';
config.watch = v1008;
config.modules = v1009;
var modules;
var currentPath;
var NL = '\n\n\n';
var file;
var moduleName;
var requiredPaths = [];
var isWatching = false;
var flagValue;
var outputName;
var localConfig = {};
var configExists = true;
var moduleOrder = [];
try {
    const v1010 = fs.readFileSync(BUILD_CONF);
    localConfig = JSON.parse(v1010, 'utf-8');
} catch (e) {
    configExists = false;
}
const extend = function (target) {
    const v1011 = [];
    const v1012 = v1011.slice;
    var sources = v1012.call(arguments, 1);
    const v1014 = function (source) {
        let prop;
        for (prop in source) {
            const v1013 = source[prop];
            target[prop] = v1013;
        }
    };
    const v1015 = sources.forEach(v1014);
    v1015;
    return target;
};
e = __callerDir.split(DS);
if (localConfig) {
    config = extend(config, localConfig);
}
const walkCallback = function (node, tempCode, code, explodedName) {
    var parsedData = {};
    var sub;
    const v1016 = node.type;
    const v1017 = node && v1016;
    if (v1017) {
        const v1018 = node.type;
        switch (v1018) {
        case 'CallExpression':
            const v1019 = node.callee;
            const v1020 = v1019.range;
            const v1021 = v1020[0];
            const v1022 = node.callee;
            const v1023 = v1022.range;
            const v1024 = v1023[1];
            const v1025 = node.callee;
            const v1026 = v1025.range;
            const v1027 = v1026[0];
            const v1028 = v1024 - v1027;
            sub = code.substr(v1021, v1028);
            e = sub.split('.');
            const v1029 = node.callee;
            const v1030 = v1029.loc;
            const v1031 = v1030.start;
            parsedData.dbg = v1031;
            const v1032 = e.length;
            const v1033 = v1032 - 1;
            const v1034 = e[v1033];
            parsedData.method = v1034;
            const v1035 = parsedData.method;
            const v1036 = '.' + v1035;
            const v1037 = sub.replace(v1036, '');
            parsedData.member = v1037;
            const v1038 = parsedData.member;
            const v1039 = v1038.indexOf('function(');
            const v1040 = 0 !== v1039;
            const v1041 = parsedData.member;
            const v1042 = 'super' !== v1041;
            const v1043 = v1040 && v1042;
            if (v1043) {
                const v1044 = parsedData.member;
                const v1045 = parsedData.method;
                const v1046 = v1044 === v1045;
                if (v1046) {
                    parsedData.member = 'null';
                } else {
                    const v1047 = parsedData.method;
                    const v1048 = `'` + v1047;
                    parsedData.method = v1048 + `'`;
                }
                parsedData.arguments = [];
                const v1049 = node.arguments;
                const v1060 = function (val) {
                    const v1050 = parsedData.arguments;
                    const v1051 = val.range;
                    const v1052 = v1051[0];
                    const v1053 = val.range;
                    const v1054 = v1053[1];
                    const v1055 = val.range;
                    const v1056 = v1055[0];
                    const v1057 = v1054 - v1056;
                    const v1058 = code.substr(v1052, v1057);
                    const v1059 = v1050.push(v1058);
                    v1059;
                };
                const v1061 = v1049.forEach(v1060);
                v1061;
                const v1062 = node.range;
                const v1063 = v1062[0];
                const v1064 = node.range;
                const v1065 = v1064[1];
                const v1066 = node.range;
                const v1067 = v1066[0];
                const v1068 = v1065 - v1067;
                const v1069 = code.substr(v1063, v1068);
                const v1070 = v1069.escape();
                const v1071 = v1070 + '(?!\\s+{)';
                const v1072 = new RegExp(v1071);
                const v1073 = parsedData.member;
                const v1074 = `trace(` + v1073;
                const v1075 = v1074 + `,`;
                const v1076 = parsedData.method;
                const v1077 = v1075 + v1076;
                const v1078 = v1077 + `,[`;
                const v1079 = parsedData.arguments;
                const v1080 = v1079.join(',');
                const v1081 = v1078 + v1080;
                const v1082 = v1081 + `],`;
                const v1083 = parsedData.dbg;
                const v1084 = v1083.line;
                const v1085 = v1082 + v1084;
                const v1086 = v1085 + `,`;
                const v1087 = parsedData.dbg;
                const v1088 = v1087.column;
                const v1089 = v1086 + v1088;
                const v1090 = v1089 + `,`;
                const v1091 = v1090 + explodedName;
                const v1092 = v1091 + `)`;
                tempCode = tempCode.replace(v1072, v1092);
            }
            break;
        case 'NewExpression':
            const v1093 = node.callee;
            const v1094 = v1093.range;
            const v1095 = v1094[0];
            const v1096 = node.callee;
            const v1097 = v1096.range;
            const v1098 = v1097[1];
            const v1099 = node.callee;
            const v1100 = v1099.range;
            const v1101 = v1100[0];
            const v1102 = v1098 - v1101;
            sub = code.substr(v1095, v1102);
            const v1103 = node.loc;
            const v1104 = v1103.start;
            parsedData.dbg = v1104;
            const v1105 = e.length;
            const v1106 = v1105 - 1;
            const v1107 = e[v1106];
            parsedData.method = v1107;
            parsedData.className = sub;
            parsedData.arguments = [];
            const v1108 = node.arguments;
            const v1119 = function (val) {
                const v1109 = parsedData.arguments;
                const v1110 = val.range;
                const v1111 = v1110[0];
                const v1112 = val.range;
                const v1113 = v1112[1];
                const v1114 = val.range;
                const v1115 = v1114[0];
                const v1116 = v1113 - v1115;
                const v1117 = code.substr(v1111, v1116);
                const v1118 = v1109.push(v1117);
                v1118;
            };
            const v1120 = v1108.forEach(v1119);
            v1120;
            const v1121 = node.range;
            const v1122 = v1121[0];
            const v1123 = node.range;
            const v1124 = v1123[1];
            const v1125 = node.range;
            const v1126 = v1125[0];
            const v1127 = v1124 - v1126;
            const v1128 = code.substr(v1122, v1127);
            const v1129 = v1128.escape();
            const v1130 = v1129 + '(?!\\s+{)';
            const v1131 = new RegExp(v1130);
            const v1132 = parsedData.className;
            const v1133 = `traceInstance(` + v1132;
            const v1134 = v1133 + `, [`;
            const v1135 = parsedData.arguments;
            const v1136 = v1135.join(',');
            const v1137 = v1134 + v1136;
            const v1138 = v1137 + `], `;
            const v1139 = parsedData.dbg;
            const v1140 = v1139.line;
            const v1141 = v1138 + v1140;
            const v1142 = v1141 + `, `;
            const v1143 = parsedData.dbg;
            const v1144 = v1143.column;
            const v1145 = v1142 + v1144;
            const v1146 = v1145 + `,`;
            const v1147 = v1146 + explodedName;
            const v1148 = v1147 + `)`;
            tempCode = tempCode.replace(v1131, v1148);
            break;
        case 'MethodDefinition':
            break;
        default:
            break;
        }
    }
    return tempCode;
};
const v1149 = String.prototype;
const v1154 = function (regexes) {
    var thus = this;
    const v1152 = function (val) {
        const v1150 = new RegExp(val);
        const v1151 = thus.match(v1150);
        return v1151;
    };
    const v1153 = regexes.some(v1152);
    return v1153;
};
v1149.matchIn = v1154;
const v1155 = String.prototype;
const v1162 = function (number, regexes) {
    var thus = this;
    var matches = 0;
    const v1160 = function (val) {
        const v1156 = new RegExp(val);
        const v1157 = thus.match(v1156);
        if (v1157) {
            const v1158 = ++matches;
            v1158;
        }
        const v1159 = matches === number;
        if (v1159) {
            return true;
        }
    };
    const v1161 = regexes.some(v1160);
    return v1161;
};
v1155.matchAtLeast = v1162;
const v1163 = String.prototype;
const v1170 = function (number, regexes) {
    var thus = this;
    var flag = true;
    var matches = 0;
    const v1168 = function (val) {
        const v1164 = new RegExp(val);
        const v1165 = thus.match(v1164);
        if (v1165) {
            const v1166 = ++matches;
            v1166;
        }
        const v1167 = matches > number;
        if (v1167) {
            flag = false;
        }
    };
    const v1169 = regexes.forEach(v1168);
    v1169;
    return flag;
};
v1163.matchAtMost = v1170;
const v1171 = String.prototype;
const v1182 = function (regexp) {
    var matches = [];
    const v1178 = function () {
        const v1172 = [];
        const v1173 = v1172.slice;
        var arr = v1173.call(arguments, 0);
        const v1174 = -2;
        var extras = arr.splice(v1174);
        const v1175 = extras[0];
        arr.index = v1175;
        const v1176 = extras[1];
        arr.input = v1176;
        const v1177 = matches.push(arr);
        v1177;
    };
    const v1179 = this.replace(regexp, v1178);
    v1179;
    const v1180 = matches.length;
    let v1181;
    if (v1180) {
        v1181 = matches;
    } else {
        v1181 = null;
    }
    return v1181;
};
v1171.matchAll = v1182;
const v1183 = String.prototype;
const v1185 = function () {
    const v1184 = this.replace(/\\/g, '\\\\');
    return v1184;
};
v1183.adjustPath = v1185;
const v1186 = String.prototype;
const v1193 = function (idx, rem, str) {
    const v1187 = this.slice(0, idx);
    const v1188 = v1187 + str;
    const v1189 = Math.abs(rem);
    const v1190 = idx + v1189;
    const v1191 = this.slice(v1190);
    const v1192 = v1188 + v1191;
    return v1192;
};
v1186.splice = v1193;
const v1194 = String.prototype;
const v1196 = function () {
    const v1195 = this.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return v1195;
};
v1194.escape = v1196;
const v1197 = String.prototype;
const v1201 = function () {
    var slug = '';
    var trimmed = this.trim();
    const v1198 = trimmed.replace(/[^a-z0-9-]/gi, '-');
    const v1199 = v1198.replace(/-+/g, '-');
    slug = v1199.replace(/^-|-$/g, '');
    const v1200 = slug.toLowerCase();
    return v1200;
};
v1197.slugify = v1201;
const v1202 = String.prototype;
const v1207 = function () {
    const v1203 = this.charAt(0);
    const v1204 = v1203.toUpperCase();
    const v1205 = this.slice(1);
    const v1206 = v1204 + v1205;
    return v1206;
};
v1202.capitalize = v1207;
const v1208 = String.prototype;
const v1211 = function () {
    const v1209 = this.replace(/([a-z])([A-Z])/g, '$1-$2');
    const v1210 = v1209.toLowerCase();
    return v1210;
};
v1208.camelCaseToDash = v1211;
const v1212 = String.prototype;
const v1217 = function () {
    const v1215 = function (g) {
        const v1213 = g[1];
        const v1214 = v1213.toUpperCase();
        return v1214;
    };
    const v1216 = this.replace(/-([a-z])/g, v1215);
    return v1216;
};
v1212.dashToCamelCase = v1217;
const preprocess = function (fileName, code) {
    var classMatch = code.match(/class\s+(\S+)(?:\s+extends\s+(?:\S+))?/);
    var parentMatch = code.match(/class\s+(?:\S+)(?:\s+extends\s+(\S+))?/);
    var currentClass;
    var parentClass;
    var i;
    var replacements;
    var explodedName;
    e = fileName.split(DS);
    const v1218 = e.length;
    const v1219 = v1218 - 3;
    const v1220 = e[v1219];
    const v1221 = '\'' + v1220;
    const v1222 = v1221 + DS;
    const v1223 = e.length;
    const v1224 = v1223 - 2;
    const v1225 = e[v1224];
    const v1226 = v1222 + v1225;
    const v1227 = v1226 + DS;
    const v1228 = e.length;
    const v1229 = v1228 - 1;
    const v1230 = e[v1229];
    const v1231 = v1230.replace(/\\/g, '\\\\');
    const v1232 = v1227 + v1231;
    explodedName = v1232 + '\'';
    if (classMatch) {
        currentClass = classMatch[1];
    }
    if (parentMatch) {
        parentClass = parentMatch[1];
    }
    const namespacify = function () {
        var namespace = code.match(/#!namespace\s+([^;\r\n]*)/);
        var uses = code.matchAll(/#!use\s+([^;\r\n]*)/g);
        var classNameSplit;
        var used = [];
        if (uses) {
            const v1258 = function (val, key) {
                const v1233 = val[1];
                replacements = v1233.matchAll(/([^\s,]+)(?:\s+as\s+([^,]+))?/g);
                const v1234 = val[0];
                const v1235 = val[0];
                const v1236 = v1235.replace(/(.)/g, '/');
                code = code.replace(v1234, v1236);
                const v1256 = function (val1, key1) {
                    const v1237 = val1[2];
                    const v1238 = undefined !== v1237;
                    if (v1238) {
                        const v1239 = val1[2];
                        const v1240 = '\\b' + v1239;
                        const v1241 = v1240 + '\\b';
                        const v1242 = new RegExp(v1241, 'g');
                        const v1243 = val1[1];
                        code = code.replace(v1242, v1243);
                    } else {
                        const v1244 = val1[1];
                        classNameSplit = v1244.split('.');
                        const v1245 = classNameSplit.length;
                        const v1246 = v1245 - 1;
                        const v1247 = classNameSplit[v1246];
                        const v1248 = used.push(v1247);
                        v1248;
                        const v1249 = classNameSplit.length;
                        const v1250 = v1249 - 1;
                        const v1251 = classNameSplit[v1250];
                        const v1252 = '\\b' + v1251;
                        const v1253 = v1252 + '\\b';
                        const v1254 = new RegExp(v1253, 'g');
                        const v1255 = val1[1];
                        code = code.replace(v1254, v1255);
                    }
                };
                const v1257 = replacements.forEach(v1256);
                v1257;
            };
            const v1259 = uses.forEach(v1258);
            v1259;
        }
        if (namespace) {
            const v1260 = namespace[1];
            const v1261 = v1260 + ' = ';
            const v1262 = namespace[1];
            const v1263 = v1261 + v1262;
            const v1264 = v1263 + ' || {};';
            code = v1264 + code;
            const v1265 = namespace[0];
            const v1266 = namespace[0];
            const v1267 = v1266.replace(/(.)/g, '/');
            code = code.replace(v1265, v1267);
            const v1268 = namespace[1];
            const v1269 = v1268 + '.';
            const v1270 = v1269 + currentClass;
            const v1271 = v1270 + ' = class';
            code = code.replace('class', v1271);
            const v1272 = namespace[1];
            const v1273 = v1272 + '.';
            currentClass = v1273 + currentClass;
        }
    };
    const enableDebug = function () {
        var tempCode = code;
        const v1274 = {
            range: true,
            attachComment: true,
            loc: true
        };
        var parsed = esprima.parse(code, v1274);
        var excludeClasses = [
            '^Development',
            '^Environment',
            '^Abstract'
        ];
        const v1275 = currentClass.matchIn(excludeClasses);
        const v1276 = !v1275;
        const v1277 = currentClass && v1276;
        if (v1277) {
            const v1278 = parsed.body;
            const v1279 = parsed && v1278;
            if (v1279) {
                const v1280 = function (node) {
                    tempCode = walkCallback(node, tempCode, code, explodedName);
                };
                const v1281 = walk(parsed, v1280);
                v1281;
            }
            code = tempCode;
            var methods = code.match(/((?!\b(if|while|for|function|typeof|switch)\b)\b[\w]+\s*\(([^().]*)\)\s*{)/g);
            var args;
            var toCheck = [];
            var codeWalk;
            var codeReplaced = [];
            var calls;
            var matchKey;
            var matchVal;
            var key;
            var output = '';
            var funcName;
            if (methods) {
                const v1316 = function (val) {
                    const v1282 = val.replace('*', '\\*');
                    const v1283 = 'function\\s+' + v1282;
                    const v1284 = new RegExp(v1283);
                    const v1285 = code.match(v1284);
                    const v1286 = !v1285;
                    if (v1286) {
                        funcName = val.match(/([^()]+)\(/);
                        args = val.match(/\w*\((.*)\) {/);
                        if (args) {
                            const v1287 = args[1];
                            args = v1287.split(/\s*,\s*/);
                            toCheck = [];
                            output = '';
                            i = 0
                            const v1288 = args.length;
                            let v1289 = i < v1288;
                            while (v1289) {
                                const v1291 = args[i];
                                matchKey = v1291.match(/\/\*(\w*)\*\//);
                                const v1292 = args[i];
                                matchVal = v1292.match(/(?:\/\*\w*\*\/)?(\w*)/);
                                const v1293 = matchVal[1];
                                if (v1293) {
                                    const v1294 = {};
                                    toCheck[i] = v1294;
                                    const v1295 = toCheck[i];
                                    const v1296 = matchKey[1];
                                    let v1297;
                                    if (matchKey) {
                                        v1297 = v1296;
                                    } else {
                                        v1297 = 'mixed';
                                    }
                                    const v1298 = matchVal[1];
                                    v1295[v1297] = v1298;
                                    const v1299 = matchKey[1];
                                    let v1300;
                                    if (matchKey) {
                                        v1300 = v1299;
                                    } else {
                                        v1300 = 'mixed';
                                    }
                                    const v1301 = '{"' + v1300;
                                    const v1302 = v1301 + '": ';
                                    const v1303 = matchVal[1];
                                    const v1304 = v1302 + v1303;
                                    output += v1304 + '}';
                                    const v1305 = i + 1;
                                    const v1306 = args.length;
                                    const v1307 = v1305 !== v1306;
                                    if (v1307) {
                                        output += ', ';
                                    }
                                }
                                const v1290 = ++i;
                                v1289 = i < v1288;
                            }
                            const v1308 = val + `Development.Debugger.Argument.check([`;
                            const v1309 = v1308 + output;
                            const v1310 = v1309 + `], '`;
                            const v1311 = funcName[1];
                            const v1312 = v1310 + v1311;
                            const v1313 = v1312 + `', `;
                            const v1314 = v1313 + explodedName;
                            const v1315 = v1314 + `);`;
                            code = code.replace(val, v1315);
                        }
                    }
                };
                const v1317 = methods.forEach(v1316);
                v1317;
            }
        }
    };
    const v1318 = namespacify();
    v1318;
    const v1319 = config.mode;
    const v1320 = 'dev' === v1319;
    if (v1320) {
        const v1321 = enableDebug();
        v1321;
    }
    return code;
};
const treatFile = function (dirname, filename) {
    file = path.resolve(dirname, filename);
    const v1322 = path.extname(file);
    const v1323 = '.js' === v1322;
    if (v1323) {
        const v1324 = -1;
        const v1325 = file.indexOf(BOOT_FILE);
        const v1326 = v1324 < v1325;
        if (v1326) {
            return;
        }
        const v1327 = config.mode;
        const v1328 = 'dev' === v1327;
        if (v1328) {
            const v1329 = -1;
            const v1330 = file.indexOf(__dirname);
            const v1331 = v1329 < v1330;
            if (v1331) {
                var parentDirs = dirname.replace(__dirname, '');
            } else {
                if (loopModules) {
                    var parentDirs = dirname.replace(modulesPath, '');
                } else {
                    const v1332 = config.source;
                    const v1333 = __callerDir + v1332;
                    var parentDirs = dirname.replace(v1333, '');
                }
            }
            const v1334 = fs.readFileSync(file, 'utf-8');
            const v1335 = preprocess(file, v1334);
            const v1336 = [
                'es2015',
                'stage-0'
            ];
            const v1337 = { presets: v1336 };
            var result = babel.transform(v1335, v1337);
            var filePath = parentDirs.replace(/\\/g, '/');
            const v1338 = filePath.indexOf('/');
            const v1339 = 0 === v1338;
            const v1340 = filePath.substr(1);
            let v1341;
            if (v1339) {
                v1341 = v1340;
            } else {
                v1341 = filePath;
            }
            const v1342 = __tmpUri + v1341;
            const v1343 = v1342 + '/';
            const v1344 = v1343 + filename;
            const v1345 = requiredPaths.push(v1344);
            v1345;
            const v1346 = __tmp + parentDirs;
            const v1347 = v1346 + DS;
            const v1348 = v1347 + filename;
            const v1349 = result.code;
            const v1350 = fs.writeFileSync(v1348, v1349);
            v1350;
        } else {
            var temp = fs.readFileSync(file, 'utf-8');
            const v1351 = currentPath + TEMP_FILE;
            const v1352 = preprocess(file, temp);
            const v1353 = '\n' + v1352;
            const v1354 = fs.appendFileSync(v1351, v1353);
            v1354;
        }
    } else {
        const v1355 = path.extname(file);
        const v1356 = '' === v1355;
        if (v1356) {
            const v1357 = config.mode;
            const v1358 = 'dev' === v1357;
            if (v1358) {
                const v1359 = -1;
                const v1360 = file.indexOf(__dirname);
                const v1361 = v1359 < v1360;
                if (v1361) {
                    const v1362 = file.replace(__dirname, '');
                    var parentDirs = v1362.split(DS);
                } else {
                    if (loopModules) {
                        const v1363 = file.replace(modulesPath, '');
                        var parentDirs = v1363.split(DS);
                    } else {
                        const v1364 = file.replace(__callerDir, '');
                        var parentDirs = v1364.split(DS);
                    }
                }
                var tempPath = __tmp;
                const v1368 = function (val) {
                    tempPath += val + DS;
                    const v1365 = fs.existsSync(tempPath);
                    const v1366 = !v1365;
                    if (v1366) {
                        const v1367 = fs.mkdirSync(tempPath);
                        v1367;
                    }
                };
                const v1369 = parentDirs.forEach(v1368);
                v1369;
            }
            const v1370 = -1;
            const v1371 = file.indexOf(__buns);
            const v1372 = v1370 < v1371;
            const v1373 = v1372 || loopModules;
            const v1374 = file !== MOD_CONF;
            const v1375 = v1373 && v1374;
            if (v1375) {
                var roots = [
                    'core',
                    'modules'
                ];
                var splittedName = file.split(DS);
                var newNamespace;
                const v1376 = -1;
                const v1377 = splittedName.length;
                const v1378 = v1377 - 2;
                const v1379 = splittedName[v1378];
                const v1380 = roots.indexOf(v1379);
                const v1381 = v1376 < v1380;
                if (v1381) {
                    const v1382 = splittedName.length;
                    const v1383 = v1382 - 1;
                    const v1384 = splittedName[v1383];
                    const v1385 = 'var ' + v1384;
                    const v1386 = v1385 + ' = ';
                    const v1387 = splittedName.length;
                    const v1388 = v1387 - 1;
                    const v1389 = splittedName[v1388];
                    const v1390 = v1386 + v1389;
                    newNamespace = v1390 + ' || {};';
                } else {
                    if (loopModules) {
                        const v1391 = splittedName.length;
                        const v1392 = v1391 - 2;
                        const v1393 = splittedName[v1392];
                        const v1394 = 'buns' === v1393;
                        if (v1394) {
                            const v1395 = splittedName.length;
                            const v1396 = v1395 - 1;
                            const v1397 = splittedName[v1396];
                            const v1398 = 'var ' + v1397;
                            const v1399 = v1398 + ' = ';
                            const v1400 = splittedName.length;
                            const v1401 = v1400 - 1;
                            const v1402 = splittedName[v1401];
                            const v1403 = v1399 + v1402;
                            newNamespace = v1403 + ' || {};';
                        } else {
                            const v1404 = splittedName.length;
                            const v1405 = v1404 - 2;
                            const v1406 = splittedName[v1405];
                            const v1407 = v1406 + '.';
                            const v1408 = splittedName.length;
                            const v1409 = v1408 - 1;
                            const v1410 = splittedName[v1409];
                            const v1411 = v1407 + v1410;
                            const v1412 = v1411 + ' = ';
                            const v1413 = splittedName.length;
                            const v1414 = v1413 - 2;
                            const v1415 = splittedName[v1414];
                            const v1416 = v1412 + v1415;
                            const v1417 = v1416 + '.';
                            const v1418 = splittedName.length;
                            const v1419 = v1418 - 1;
                            const v1420 = splittedName[v1419];
                            const v1421 = v1417 + v1420;
                            newNamespace = v1421 + ' || {};';
                        }
                    } else {
                        const v1422 = splittedName.length;
                        const v1423 = v1422 - 2;
                        const v1424 = splittedName[v1423];
                        const v1425 = v1424 + '.';
                        const v1426 = splittedName.length;
                        const v1427 = v1426 - 1;
                        const v1428 = splittedName[v1427];
                        const v1429 = v1425 + v1428;
                        const v1430 = v1429 + ' = ';
                        const v1431 = splittedName.length;
                        const v1432 = v1431 - 2;
                        const v1433 = splittedName[v1432];
                        const v1434 = v1430 + v1433;
                        const v1435 = v1434 + '.';
                        const v1436 = splittedName.length;
                        const v1437 = v1436 - 1;
                        const v1438 = splittedName[v1437];
                        const v1439 = v1435 + v1438;
                        newNamespace = v1439 + ' || {};';
                    }
                }
                const v1440 = currentPath + TEMP_FILE;
                const v1441 = fs.appendFileSync(v1440, newNamespace);
                v1441;
            }
        } else {
        }
    }
};
const recursiveReaddirSync = function (path1) {
    var list = [];
    var files = fs.readdirSync(path1);
    var stats;
    const v1449 = function (file) {
        const v1442 = treatFile(path1, file);
        v1442;
        const v1443 = path.join(path1, file);
        stats = fs.lstatSync(v1443);
        const v1444 = stats.isDirectory();
        if (v1444) {
            const v1445 = path.join(path1, file);
            const v1446 = recursiveReaddirSync(v1445);
            list = list.concat(v1446);
        } else {
            const v1447 = path.join(path1, file);
            const v1448 = list.push(v1447);
            v1448;
        }
    };
    const v1450 = files.forEach(v1449);
    v1450;
    return list;
};
const getDependencies = function (moduleDir, name) {
    const v1451 = moduleDir + name;
    var path = v1451 + DS;
    const v1452 = path + 'package.json';
    const v1453 = fs.readFileSync(v1452, 'utf-8');
    var moduleConf = JSON.parse(v1453);
    const v1455 = function (val) {
        const v1454 = val.name;
        return v1454;
    };
    var loadedModules = moduleOrder.map(v1455);
    const v1456 = -1;
    const v1457 = loadedModules.indexOf(name);
    const v1458 = v1456 === v1457;
    const v1459 = config.mode;
    const v1460 = 'dev' === v1459;
    const v1461 = moduleConf.bunsDev;
    const v1462 = v1460 && v1461;
    const v1463 = moduleConf.buns;
    const v1464 = v1462 || v1463;
    const v1465 = v1458 && v1464;
    if (v1465) {
        const v1466 = moduleConf.dependencies;
        if (v1466) {
            const v1467 = moduleConf.dependencies;
            for (j in v1467) {
                const v1468 = getDependencies(modulesPath, j);
                v1468;
            }
        }
        const v1469 = {
            path,
            name
        };
        const v1470 = moduleOrder.push(v1469);
        v1470;
    }
};
const executeBabel = function () {
    const v1471 = currentPath + DS;
    const v1472 = v1471 + outputName;
    const v1496 = function (error) {
        const v1473 = !error;
        if (v1473) {
            const v1474 = currentPath + DS;
            const v1475 = v1474 + outputName;
            const v1476 = fs.unlinkSync(v1475);
            v1476;
        }
        const v1477 = currentPath + TEMP_FILE;
        const v1478 = fs.readFileSync(v1477, 'utf-8');
        const v1479 = [
            'es2015',
            'stage-0'
        ];
        const v1480 = { presets: v1479 };
        var result = babel.transform(v1478, v1480);
        const v1481 = currentPath + DS;
        const v1482 = v1481 + outputName;
        const v1483 = result.code;
        const v1484 = fs.writeFileSync(v1482, v1483);
        v1484;
        const v1485 = config.mode;
        const v1486 = 'prod' === v1485;
        const v1487 = v1486 && false;
        if (v1487) {
            const v1488 = currentPath + DS;
            const v1489 = v1488 + outputName;
            var minified = uglify.minify(v1489);
            const v1490 = currentPath + DS;
            const v1491 = v1490 + outputName;
            const v1492 = minified.code;
            const v1493 = fs.writeFileSync(v1491, v1492);
            v1493;
        }
        const v1494 = currentPath + TEMP_FILE;
        const v1495 = fs.unlinkSync(v1494);
        v1495;
    };
    const v1497 = fs.stat(v1472, v1496);
    v1497;
};
const v1667 = function (flag) {
    const v1498 = !configExists;
    if (v1498) {
        const v1499 = new Error('Error, buns.json does not exist. You can create it with "buns init" command.');
        throw v1499;
    }
    const v1500 = fs.existsSync(__tmp);
    const v1501 = !v1500;
    if (v1501) {
        const v1502 = fs.mkdirSync(__tmp);
        v1502;
    }
    var bunsBase = __tmp + 'buns-base.js';
    const v1503 = config.outputName;
    const v1504 = 'buns-' + flag;
    const v1505 = v1504 + '.js';
    outputName = v1503 || v1505;
    const v1506 = config.output;
    currentPath = v1506 + DS;
    try {
        const v1507 = currentPath + TEMP_FILE;
        const v1508 = fs.unlinkSync(v1507);
        v1508;
    } catch (e) {
    }
    const v1509 = config.mode;
    config.mode = flag || v1509;
    const v1510 = fs.existsSync(currentPath);
    const v1511 = !v1510;
    if (v1511) {
        const v1512 = fs.mkdirSync(currentPath);
        v1512;
    }
    const v1513 = config.mode;
    const v1514 = 'dev' === v1513;
    if (v1514) {
        const v1515 = currentPath + TEMP_FILE;
        const v1516 = __inc + 'errorInit.js';
        const v1517 = fs.readFileSync(v1516);
        const v1518 = NL + v1517;
        const v1519 = fs.appendFileSync(v1515, v1518);
        v1519;
    } else {
        const v1520 = currentPath + TEMP_FILE;
        const v1521 = NL + '(function() {';
        const v1522 = fs.appendFileSync(v1520, v1521);
        v1522;
    }
    const v1523 = recursiveReaddirSync(__core);
    v1523;
    const v1524 = config.modules;
    const v1525 = Object.keys(v1524);
    const v1526 = v1525.length;
    const v1527 = 0 < v1526;
    if (v1527) {
        loopModules = true;
        const v1528 = config.modules;
        for (i in v1528) {
            currentModule = i;
            const v1529 = modulesPath + i;
            const v1530 = v1529 + DS;
            const v1531 = v1530 + 'buns';
            var modulePath = v1531 + DS;
            const v1533 = function (val) {
                const v1532 = val.name;
                return v1532;
            };
            var loadedModules = moduleOrder.map(v1533);
            const v1534 = -1;
            const v1535 = loadedModules.indexOf(i);
            const v1536 = v1534 === v1535;
            if (v1536) {
                try {
                    const v1537 = getDependencies(modulesPath, i);
                    v1537;
                } catch (e) {
                    const v1538 = 'Error, module "' + i;
                    const v1539 = v1538 + '" is not installed.';
                    const v1540 = new Error(v1539);
                    throw v1540;
                }
            }
        }
        i = 0
        const v1541 = moduleOrder.length;
        let v1542 = i < v1541;
        while (v1542) {
            const v1544 = moduleOrder[i];
            currentModule = v1544.name;
            const v1545 = moduleOrder[i];
            const v1546 = v1545.path;
            const v1547 = v1546 + 'buns';
            const v1548 = v1547 + DS;
            const v1549 = recursiveReaddirSync(v1548);
            v1549;
            try {
                const v1550 = moduleOrder[i];
                const v1551 = v1550.path;
                var currentModuleDir = v1551.replace(modulesPath, '');
                const v1552 = moduleOrder[i];
                const v1553 = v1552.path;
                const v1554 = v1553 + 'buns';
                const v1555 = v1554 + DS;
                const v1556 = v1555 + BOOT_FILE;
                const v1557 = moduleOrder[i];
                const v1558 = v1557.path;
                const v1559 = v1558 + 'buns';
                const v1560 = v1559 + DS;
                const v1561 = v1560 + BOOT_FILE;
                const v1562 = fs.readFileSync(v1561, 'utf-8');
                const v1563 = preprocess(v1556, v1562);
                const v1564 = [
                    'es2015',
                    'stage-0'
                ];
                const v1565 = { presets: v1564 };
                var result = babel.transform(v1563, v1565);
                const v1566 = currentModuleDir + 'buns';
                const v1567 = v1566 + DS;
                const v1568 = v1567 + BOOT_FILE;
                const v1569 = modulesPath + 'buns';
                const v1570 = v1568.replace(v1569, '');
                const v1571 = v1570.replace(/\\/g, '/');
                const v1572 = __tmpUri + v1571;
                const v1573 = requiredPaths.push(v1572);
                v1573;
                const v1574 = __tmp + currentModuleDir;
                const v1575 = v1574 + 'buns';
                const v1576 = v1575 + DS;
                const v1577 = v1576 + BOOT_FILE;
                const v1578 = result.code;
                const v1579 = '(function() {' + v1578;
                const v1580 = v1579 + '})();';
                const v1581 = fs.writeFileSync(v1577, v1580);
                v1581;
            } catch (e) {
            }
            const v1543 = ++i;
            v1542 = i < v1541;
        }
        loopModules = false;
    }
    try {
        const v1582 = config.source;
        const v1583 = recursiveReaddirSync(v1582);
        v1583;
    } catch (e) {
        const v1584 = new Error('Source code directory is not defined or does not exist, check your buns.json file.');
        throw v1584;
    }
    const v1585 = currentPath + TEMP_FILE;
    const v1586 = NL + 'var BUNS_IS_DEV = ';
    const v1587 = config.mode;
    const v1588 = 'dev' === v1587;
    let v1589;
    if (v1588) {
        v1589 = 'true';
    } else {
        v1589 = 'false';
    }
    const v1590 = v1586 + v1589;
    const v1591 = v1590 + ';';
    const v1592 = fs.appendFileSync(v1585, v1591);
    v1592;
    const v1593 = config.mode;
    const v1594 = 'dev' === v1593;
    if (v1594) {
        const v1595 = __buns + 'package.json';
        const v1596 = fs.readFileSync(v1595);
        var confBuns = JSON.parse(v1596);
        const v1597 = exec('npm info buns --json');
        const v1598 = v1597.toString('utf8');
        var infos = JSON.parse(v1598);
        const v1599 = currentPath + TEMP_FILE;
        const v1600 = NL + `var BUNS_FILES = ["`;
        const v1601 = requiredPaths.join('","');
        const v1602 = v1600 + v1601;
        const v1603 = v1602 + `"],`;
        const v1604 = fs.appendFileSync(v1599, v1603);
        v1604;
        const v1605 = currentPath + TEMP_FILE;
        const v1606 = NL + ` BUNS_VERSION = "`;
        const v1607 = confBuns.version;
        const v1608 = v1606 + v1607;
        const v1609 = v1608 + `",`;
        const v1610 = fs.appendFileSync(v1605, v1609);
        v1610;
        const v1611 = currentPath + TEMP_FILE;
        const v1612 = NL + ` BUNS_LATEST_VERSION = "`;
        const v1613 = infos.version;
        const v1614 = v1612 + v1613;
        const v1615 = v1614 + `",`;
        const v1616 = fs.appendFileSync(v1611, v1615);
        v1616;
        const v1617 = currentPath + TEMP_FILE;
        const v1618 = NL + ` BUNS_DEPRECATED_VERSION = "`;
        const v1619 = infos.deprecatedVersion;
        const v1620 = v1618 + v1619;
        const v1621 = v1620 + `";`;
        const v1622 = fs.appendFileSync(v1617, v1621);
        v1622;
        const v1623 = currentPath + TEMP_FILE;
        const v1624 = __inc + 'devLaunch.js';
        const v1625 = fs.readFileSync(v1624);
        const v1626 = NL + v1625;
        const v1627 = fs.appendFileSync(v1623, v1626);
        v1627;
    }
    const v1628 = config.mode;
    const v1629 = 'dev' === v1628;
    if (v1629) {
        const v1630 = currentPath + TEMP_FILE;
        const v1631 = fs.readFileSync(v1630, 'utf-8');
        const v1632 = [
            'es2015',
            'stage-0'
        ];
        const v1633 = { presets: v1632 };
        const v1634 = babel.transform(v1631, v1633);
        const v1635 = v1634.code;
        const v1636 = fs.writeFileSync(bunsBase, v1635);
        v1636;
    }
    var code;
    var sub;
    var parsedData = {};
    try {
        const v1637 = config.source;
        const v1638 = v1637 + DS;
        const v1639 = v1638 + BOOT_FILE;
        const v1640 = fs.statSync(v1639);
        v1640;
        const v1641 = config.source;
        const v1642 = v1641 + DS;
        const v1643 = v1642 + BOOT_FILE;
        code = fs.readFileSync(v1643, 'utf-8');
    } catch (e) {
        const v1644 = __inc + BOOT_FILE;
        code = fs.readFileSync(v1644, 'utf-8');
    }
    var tempCode = code;
    const v1645 = config.mode;
    const v1646 = 'dev' === v1645;
    if (v1646) {
        const v1647 = {
            range: true,
            attachComment: true,
            loc: true
        };
        const v1648 = esprima.parse(code, v1647);
        const v1651 = function (node) {
            const v1649 = '"' + BOOT_FILE;
            const v1650 = v1649 + '"';
            tempCode = walkCallback(node, tempCode, code, v1650);
        };
        const v1652 = walk(v1648, v1651);
        v1652;
    }
    const v1653 = currentPath + TEMP_FILE;
    const v1654 = NL + 'document.addEventListener("DOMContentLoaded", function(BUNS_DOM_READY) {';
    const v1655 = fs.appendFileSync(v1653, v1654);
    v1655;
    const v1656 = currentPath + TEMP_FILE;
    const v1657 = fs.appendFileSync(v1656, tempCode);
    v1657;
    const v1658 = currentPath + TEMP_FILE;
    const v1659 = NL + '});';
    const v1660 = fs.appendFileSync(v1658, v1659);
    v1660;
    const v1661 = config.mode;
    const v1662 = 'prod' === v1661;
    if (v1662) {
        const v1663 = currentPath + TEMP_FILE;
        const v1664 = NL + '})();';
        const v1665 = fs.appendFileSync(v1663, v1664);
        v1665;
    }
    const v1666 = executeBabel();
    v1666;
};
const v1679 = function () {
    var deleteFolderRecursive = function (path) {
        const v1668 = fs.existsSync(path);
        if (v1668) {
            const v1669 = fs.readdirSync(path);
            const v1675 = function (file, index) {
                const v1670 = path + DS;
                var curPath = v1670 + file;
                const v1671 = fs.lstatSync(curPath);
                const v1672 = v1671.isDirectory();
                if (v1672) {
                    const v1673 = deleteFolderRecursive(curPath);
                    v1673;
                } else {
                    const v1674 = fs.unlinkSync(curPath);
                    v1674;
                }
            };
            const v1676 = v1669.forEach(v1675);
            v1676;
            const v1677 = fs.rmdirSync(path);
            v1677;
        }
    };
    const v1678 = deleteFolderRecursive(__tmp);
    v1678;
};
const v1682 = function (data) {
    data = extend(config, data);
    const v1680 = JSON.stringify(data, null, 2);
    const v1681 = fs.writeFileSync(BUILD_CONF, v1680);
    v1681;
};
const v1707 = function (requestedModule) {
    var name = requestedModule;
    const saveModule = function (module) {
        const v1683 = module.buns;
        const v1684 = module.bunsDev;
        const v1685 = v1683 || v1684;
        if (v1685) {
            const v1686 = localConfig.modules;
            const v1687 = !v1686;
            if (v1687) {
                const v1688 = {};
                localConfig.modules = v1688;
            }
            const v1689 = localConfig.modules;
            const v1690 = module.name;
            const v1691 = module.version;
            v1689[v1690] = '^' + v1691;
            const v1692 = JSON.stringify(localConfig, null, 2);
            const v1693 = fs.writeFileSync(BUILD_CONF, v1692);
            v1693;
        } else {
            const v1694 = new Error('This module is not made for Buns.');
            throw v1694;
        }
    };
    var command = 'npm i';
    if (requestedModule) {
        command += ' --save-dev ' + name;
    } else {
        command += ' --only=dev';
        const v1695 = __buns + 'package.json';
        const v1696 = fs.readFileSync(v1695);
        var confBuns = JSON.parse(v1696);
        const v1697 = localConfig.modules;
        confBuns.devDependencies = v1697;
        const v1698 = __buns + 'package.json';
        const v1699 = JSON.stringify(confBuns, null, 2);
        const v1700 = fs.writeFileSync(v1698, v1699);
        v1700;
    }
    const v1701 = exec(command);
    v1701;
    if (requestedModule) {
        const v1702 = modulesPath + name;
        const v1703 = v1702 + DS;
        const v1704 = v1703 + 'package.json';
        const v1705 = fs.readFileSync(v1704);
        var conf = JSON.parse(v1705);
        const v1706 = saveModule(conf);
        v1706;
    }
};
const v1710 = function (type, name) {
    const v1708 = !configExists;
    if (v1708) {
        const v1709 = new Error('Error, buns.json does not exist. You can create it with "buns init" command.');
        throw v1709;
    }
};
const v1951 = function () {
    const v1711 = !configExists;
    if (v1711) {
        const v1712 = new Error('Error, buns.json does not exist. You can create it with "buns init" command.');
        throw v1712;
    }
    config.mode = 'dev';
    const v1713 = this.build();
    v1713;
    const v1714 = require('browser-sync');
    var bs = v1714.create();
    var callbacks = {};
    const v1772 = function (file) {
        const v1715 = -1;
        const v1716 = __tmp + file;
        const v1717 = requiredPaths.indexOf(v1716);
        const v1718 = v1715 === v1717;
        if (v1718) {
            const v1719 = -1;
            const v1720 = file.indexOf(__dirname);
            const v1721 = v1719 < v1720;
            if (v1721) {
                var parentDirs = file.replace(__dirname, '');
            } else {
                const v1722 = config.source;
                const v1723 = __callerDir + v1722;
                var parentDirs = file.replace(v1723, '');
            }
            e = parentDirs.split(DS);
            var filename = e.pop();
            parentDirs = e.join(DS);
            var filePath = parentDirs.replace(/\\/g, '/');
            const v1724 = filePath.indexOf('/');
            const v1725 = 0 === v1724;
            const v1726 = filePath.substr(1);
            let v1727;
            if (v1725) {
                v1727 = v1726;
            } else {
                v1727 = filePath;
            }
            const v1728 = __tmpUri + v1727;
            const v1729 = v1728 + '/';
            const v1730 = v1729 + filename;
            const v1731 = requiredPaths.push(v1730);
            v1731;
        }
        const v1732 = config.source;
        const v1733 = v1732 + DS;
        const v1734 = v1733 + BOOT_FILE;
        const v1735 = v1734 !== file;
        if (v1735) {
            const v1736 = 'Recompiled : ' + __callerDir;
            const v1737 = v1736 + file;
            const v1738 = console.log(v1737);
            v1738;
            const v1739 = __callerDir + DS;
            const v1740 = v1739 + file;
            const v1741 = __callerDir + file;
            const v1742 = fs.readFileSync(v1741, 'utf-8');
            const v1743 = preprocess(v1740, v1742);
            const v1744 = [
                'es2015',
                'stage-0'
            ];
            const v1745 = { presets: v1744 };
            var result = babel.transform(v1743, v1745);
            const v1746 = __tmp + file;
            const v1747 = result.code;
            const v1748 = fs.writeFileSync(v1746, v1747);
            v1748;
        } else {
            const v1749 = config.source;
            const v1750 = v1749 + DS;
            const v1751 = v1750 + BOOT_FILE;
            var code = fs.readFileSync(v1751, 'utf-8');
            var tempCode = code;
            const v1752 = config.mode;
            const v1753 = 'dev' === v1752;
            if (v1753) {
                const v1754 = {
                    range: true,
                    attachComment: true,
                    loc: true
                };
                const v1755 = esprima.parse(code, v1754);
                const v1758 = function (node) {
                    const v1756 = '"' + BOOT_FILE;
                    const v1757 = v1756 + '"';
                    tempCode = walkCallback(node, tempCode, code, v1757);
                };
                const v1759 = walk(v1755, v1758);
                v1759;
            }
            const v1760 = currentPath + outputName;
            const v1761 = __tmp + 'buns-base.js';
            const v1762 = fs.readFileSync(v1761);
            const v1763 = v1762 + NL;
            const v1764 = v1763 + 'document.addEventListener("DOMContentLoaded", function(BUNS_DOM_READY) {';
            const v1765 = v1764 + tempCode;
            const v1766 = v1765 + NL;
            const v1767 = v1766 + '});';
            const v1768 = fs.writeFileSync(v1760, v1767);
            v1768;
        }
        const v1769 = bs.sockets;
        const v1770 = { file: file };
        const v1771 = v1769.emit('browser:reload', v1770);
        v1771;
    };
    callbacks.change = v1772;
    const v1840 = function (file) {
        const v1773 = -1;
        const v1774 = __tmp + file;
        const v1775 = requiredPaths.indexOf(v1774);
        const v1776 = v1773 === v1775;
        if (v1776) {
            const v1777 = -1;
            const v1778 = file.indexOf(__dirname);
            const v1779 = v1777 < v1778;
            if (v1779) {
                var parentDirs = file.replace(__dirname, '');
            } else {
                const v1780 = config.source;
                const v1781 = __callerDir + v1780;
                var parentDirs = file.replace(v1781, '');
            }
            e = parentDirs.split(DS);
            var filename = e.pop();
            parentDirs = e.join(DS);
            var filePath = parentDirs.replace(/\\/g, '/');
            const v1782 = filePath.indexOf('/');
            const v1783 = 0 === v1782;
            const v1784 = filePath.substr(1);
            let v1785;
            if (v1783) {
                v1785 = v1784;
            } else {
                v1785 = filePath;
            }
            const v1786 = __tmpUri + v1785;
            const v1787 = v1786 + '/';
            var newFile = v1787 + filename;
            const v1788 = -1;
            const v1789 = requiredPaths.indexOf(newFile);
            const v1790 = v1788 === v1789;
            if (v1790) {
                const v1791 = requiredPaths.push(newFile);
                v1791;
            }
        }
        const v1792 = config.source;
        const v1793 = v1792 + DS;
        const v1794 = v1793 + BOOT_FILE;
        const v1795 = v1794 !== file;
        if (v1795) {
            const v1796 = 'Added : ' + __callerDir;
            const v1797 = v1796 + file;
            const v1798 = console.log(v1797);
            v1798;
            const v1799 = __callerDir + DS;
            const v1800 = v1799 + file;
            const v1801 = __callerDir + file;
            const v1802 = fs.readFileSync(v1801, 'utf-8');
            const v1803 = preprocess(v1800, v1802);
            const v1804 = [
                'es2015',
                'stage-0'
            ];
            const v1805 = { presets: v1804 };
            var result = babel.transform(v1803, v1805);
            const v1806 = __tmp + file;
            const v1807 = result.code;
            const v1808 = fs.writeFileSync(v1806, v1807);
            v1808;
            const v1809 = currentPath + outputName;
            const v1810 = currentPath + outputName;
            const v1811 = fs.readFileSync(v1810, 'utf-8');
            const v1812 = requiredPaths.join('","');
            const v1813 = `var BUNS_FILES = ["` + v1812;
            const v1814 = v1813 + `"];`;
            const v1815 = v1811.replace(/var BUNS_FILES = \[(?:.*)\];/, v1814);
            const v1816 = fs.writeFileSync(v1809, v1815);
            v1816;
        } else {
            const v1817 = config.source;
            const v1818 = v1817 + DS;
            const v1819 = v1818 + BOOT_FILE;
            var code = fs.readFileSync(v1819, 'utf-8');
            var tempCode = code;
            const v1820 = config.mode;
            const v1821 = 'dev' === v1820;
            if (v1821) {
                const v1822 = {
                    range: true,
                    attachComment: true,
                    loc: true
                };
                const v1823 = esprima.parse(code, v1822);
                const v1826 = function (node) {
                    const v1824 = '"' + BOOT_FILE;
                    const v1825 = v1824 + '"';
                    tempCode = walkCallback(node, tempCode, code, v1825);
                };
                const v1827 = walk(v1823, v1826);
                v1827;
            }
            const v1828 = currentPath + outputName;
            const v1829 = __tmp + 'buns-base.js';
            const v1830 = fs.readFileSync(v1829);
            const v1831 = v1830 + NL;
            const v1832 = v1831 + 'document.addEventListener("DOMContentLoaded", function(BUNS_DOM_READY) {';
            const v1833 = v1832 + tempCode;
            const v1834 = v1833 + NL;
            const v1835 = v1834 + '});';
            const v1836 = fs.writeFileSync(v1828, v1835);
            v1836;
        }
        const v1837 = bs.sockets;
        const v1838 = { file: file };
        const v1839 = v1837.emit('browser:reload', v1838);
        v1839;
    };
    callbacks.add = v1840;
    const v1899 = function (file) {
        const v1841 = -1;
        const v1842 = __tmp + file;
        const v1843 = requiredPaths.indexOf(v1842);
        const v1844 = v1841 === v1843;
        if (v1844) {
            const v1845 = -1;
            const v1846 = file.indexOf(__dirname);
            const v1847 = v1845 < v1846;
            if (v1847) {
                var parentDirs = file.replace(__dirname, '');
            } else {
                const v1848 = config.source;
                const v1849 = __callerDir + v1848;
                var parentDirs = file.replace(v1849, '');
            }
            e = parentDirs.split(DS);
            var filename = e.pop();
            parentDirs = e.join(DS);
            var filePath = parentDirs.replace(/\\/g, '/');
            const v1850 = filePath.indexOf('/');
            const v1851 = 0 === v1850;
            const v1852 = filePath.substr(1);
            let v1853;
            if (v1851) {
                v1853 = v1852;
            } else {
                v1853 = filePath;
            }
            const v1854 = __tmpUri + v1853;
            const v1855 = v1854 + '/';
            var newFile = v1855 + filename;
            const v1856 = -1;
            const v1857 = requiredPaths.indexOf(newFile);
            const v1858 = v1856 === v1857;
            if (v1858) {
                const v1859 = requiredPaths.push(newFile);
                v1859;
            }
        }
        const v1860 = config.source;
        const v1861 = v1860 + DS;
        const v1862 = v1861 + BOOT_FILE;
        const v1863 = v1862 !== file;
        if (v1863) {
            const v1864 = 'Removed : ' + __callerDir;
            const v1865 = v1864 + file;
            const v1866 = console.log(v1865);
            v1866;
            var index = requiredPaths.indexOf(newFile);
            const v1867 = -1;
            const v1868 = v1867 !== index;
            if (v1868) {
                const v1869 = requiredPaths.splice(index, 1);
                v1869;
                const v1870 = currentPath + outputName;
                const v1871 = currentPath + outputName;
                const v1872 = fs.readFileSync(v1871, 'utf-8');
                const v1873 = requiredPaths.join('","');
                const v1874 = `var BUNS_FILES = ["` + v1873;
                const v1875 = v1874 + `"];`;
                const v1876 = v1872.replace(/var BUNS_FILES = \[(?:.*)\];/, v1875);
                const v1877 = fs.writeFileSync(v1870, v1876);
                v1877;
            }
        } else {
            const v1878 = __inc + BOOT_FILE;
            var code = fs.readFileSync(v1878, 'utf-8');
            var tempCode = code;
            const v1879 = config.mode;
            const v1880 = 'dev' === v1879;
            if (v1880) {
                const v1881 = {
                    range: true,
                    attachComment: true,
                    loc: true
                };
                const v1882 = esprima.parse(code, v1881);
                const v1885 = function (node) {
                    const v1883 = '"' + BOOT_FILE;
                    const v1884 = v1883 + '"';
                    tempCode = walkCallback(node, tempCode, code, v1884);
                };
                const v1886 = walk(v1882, v1885);
                v1886;
            }
            const v1887 = currentPath + outputName;
            const v1888 = __tmp + 'buns-base.js';
            const v1889 = fs.readFileSync(v1888);
            const v1890 = v1889 + NL;
            const v1891 = v1890 + 'document.addEventListener("DOMContentLoaded", function(BUNS_DOM_READY) {';
            const v1892 = v1891 + tempCode;
            const v1893 = v1892 + NL;
            const v1894 = v1893 + '});';
            const v1895 = fs.writeFileSync(v1887, v1894);
            v1895;
        }
        const v1896 = bs.sockets;
        const v1897 = { file: file };
        const v1898 = v1896.emit('browser:reload', v1897);
        v1898;
    };
    callbacks.unlink = v1899;
    const v1900 = config.source;
    const v1901 = v1900 + DS;
    const v1902 = v1901 + '**';
    const v1903 = v1902 + DS;
    const v1904 = v1903 + '*.js';
    const v1905 = [v1904];
    const v1907 = function (event, file) {
        const v1906 = callbacks[event](file);
        v1906;
    };
    const v1908 = {
        match: v1905,
        fn: v1907
    };
    const v1909 = [v1908];
    var bsConf = {};
    bsConf.files = v1909;
    bsConf.notify = false;
    const v1910 = config.bs;
    if (v1910) {
        const v1911 = config.bs;
        bsConf = extend(v1911, bsConf);
    }
    const v1912 = bsConf.proxy;
    const v1913 = !v1912;
    const v1914 = bsConf.server;
    const v1915 = !v1914;
    const v1916 = v1913 && v1915;
    if (v1916) {
        bsConf.server = __callerDir;
    }
    const v1917 = bs.init(bsConf);
    v1917;
    const v1918 = config.watch;
    const v1919 = v1918.length;
    const v1920 = 0 < v1919;
    if (v1920) {
        i = 0
        const v1921 = config.watch;
        const v1922 = v1921.length;
        let v1923 = i < v1922;
        while (v1923) {
            const v1925 = config.source;
            const v1926 = v1925 + DS;
            const v1927 = config.watch;
            const v1928 = v1927.length;
            const v1929 = v1928[i];
            const v1930 = v1926 + v1929;
            const v1931 = bs.watch(v1930);
            const v1935 = function (file) {
                const v1932 = bs.sockets;
                const v1933 = { file: file };
                const v1934 = v1932.emit('browser:reload', v1933);
                v1934;
            };
            const v1936 = v1931.on('change', v1935);
            v1936;
            const v1924 = ++i;
            v1923 = i < v1922;
        }
    }
    const v1937 = process.stdin;
    const v1938 = v1937.resume();
    v1938;
    const onExit = function (options) {
        try {
            const v1939 = currentPath + outputName;
            const v1940 = currentPath + outputName;
            const v1941 = fs.readFileSync(v1940, 'utf-8');
            const v1942 = v1941.replace('BUNS_WATCH_ENABLED = true;', 'BUNS_WATCH_ENABLED = false;');
            const v1943 = fs.writeFileSync(v1939, v1942);
            v1943;
        } catch (e) {
        }
        const v1944 = process.exit();
        v1944;
    };
    ;
    const v1945 = process.on('uncaughtException', onExit);
    v1945;
    const v1946 = process.on('SIGHUP', onExit);
    v1946;
    const v1947 = process.on('SIGINT', onExit);
    v1947;
    const v1948 = process.on('SIGTERM', onExit);
    v1948;
    const v1949 = process.on('exit', onExit);
    v1949;
    const v1950 = process.on('beforeExit', onExit);
    v1950;
};
var buns = {};
buns.build = v1667;
buns.clear = v1679;
buns.init = v1682;
buns.install = v1707;
buns.generate = v1710;
buns.watch = v1951;
let methods;
for (methods in buns) {
    const v1952 = buns[methods];
    exports[methods] = v1952;
}