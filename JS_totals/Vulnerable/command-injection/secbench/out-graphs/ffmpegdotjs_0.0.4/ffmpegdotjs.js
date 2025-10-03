const v135 = require('child_process');
const exec = v135.exec;
const fs = require('fs');
const v146 = (input, output) => {
    const v144 = function (resolve, reject) {
        const v136 = fs.existsSync(input);
        if (v136) {
            const v137 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } -ss 00:00:21 -vsync 0 -frames:v 1 ${ output }_%03d.png`;
            const v140 = (error, stdout, stderr) => {
                if (error) {
                    const v138 = reject(error);
                    v138;
                    return;
                }
                const v139 = resolve(output);
                v139;
            };
            const v141 = exec(v137, v140);
            v141;
        } else {
            const v142 = new Error('ffmpegdotjs could not find file');
            const v143 = reject(v142);
            v143;
        }
    };
    const v145 = new Promise(v144);
    return v145;
};
const v157 = (input, output) => {
    const v155 = function (resolve, reject) {
        const v147 = fs.existsSync(input);
        if (v147) {
            const v148 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } ${ output }.mp4`;
            const v151 = (error, stdout, stderr) => {
                if (error) {
                    const v149 = reject(error);
                    v149;
                    return;
                }
                const v150 = resolve(stdout);
                v150;
            };
            const v152 = exec(v148, v151);
            v152;
        } else {
            const v153 = new Error('ffmpegdotjs could not find file');
            const v154 = reject(v153);
            v154;
        }
    };
    const v156 = new Promise(v155);
    return v156;
};
const v168 = (input, output) => {
    const v166 = function (resolve, reject) {
        const v158 = fs.existsSync(input);
        if (v158) {
            const v159 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } -ss 15 -t 5 -vf scale=320:180 ${ output }.gif`;
            const v162 = (error, stdout, stderr) => {
                if (error) {
                    const v160 = reject(error);
                    v160;
                    return;
                }
                const v161 = resolve(stdout);
                v161;
            };
            const v163 = exec(v159, v162);
            v163;
        } else {
            const v164 = new Error('ffmpegdotjs could not find file');
            const v165 = reject(v164);
            v165;
        }
    };
    const v167 = new Promise(v166);
    return v167;
};
const v179 = (input, output) => {
    const v177 = function (resolve, reject) {
        const v169 = fs.existsSync(input);
        if (v169) {
            const v170 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } -f mp3 -ab 192000 -vn ${ output }.mp3`;
            const v173 = (error, stdout, stderr) => {
                if (error) {
                    const v171 = reject(error);
                    v171;
                    return;
                }
                const v172 = resolve(stdout);
                v172;
            };
            const v174 = exec(v170, v173);
            v174;
        } else {
            const v175 = new Error('ffmpegdotjs could not find file');
            const v176 = reject(v175);
            v176;
        }
    };
    const v178 = new Promise(v177);
    return v178;
};
const v191 = (input, output) => {
    const v189 = function (resolve, reject) {
        const v180 = fs.existsSync(input);
        if (v180) {
            const v181 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } -vcodec h264 -acodec mp3 ${ output }.mp4`;
            const v185 = (error, stdout, stderr) => {
                if (error) {
                    const v182 = reject(error);
                    v182;
                    return;
                }
                const v183 = output + '.mp4';
                const v184 = resolve(v183);
                v184;
            };
            const v186 = exec(v181, v185);
            v186;
        } else {
            const v187 = new Error('ffmpegdotjs could not find file');
            const v188 = reject(v187);
            v188;
        }
    };
    const v190 = new Promise(v189);
    return v190;
};
const v204 = (input1, input2, start, end, x, y, output) => {
    const v202 = function (resolve, reject) {
        const v192 = fs.existsSync(input1);
        const v193 = fs.existsSync(input2);
        const v194 = v192 && v193;
        if (v194) {
            const v195 = `ffmpeg -hide_banner -loglevel quiet -i ${ input1 } -i ${ input2 } -filter_complex "[0:v][1:v] overlay=${ x }:${ y }:enable='between(t,${ start },${ end })'" -pix_fmt yuv420p -c:a copy ${ output }.mp4`;
            const v198 = (error, stdout, stderr) => {
                if (error) {
                    const v196 = reject(error);
                    v196;
                    return;
                }
                const v197 = resolve(stdout);
                v197;
            };
            const v199 = exec(v195, v198);
            v199;
        } else {
            const v200 = new Error('ffmpegdotjs could not find file');
            const v201 = reject(v200);
            v201;
        }
    };
    const v203 = new Promise(v202);
    return v203;
};
const v217 = (input1, input2, x, y, output) => {
    const v215 = function (resolve, reject) {
        const v205 = fs.existsSync(input1);
        const v206 = fs.existsSync(input2);
        const v207 = v205 && v206;
        if (v207) {
            const v208 = `ffmpeg -hide_banner -loglevel quiet -i ${ input1 } -i ${ input2 } -filter_complex "[0:v][1:v] overlay=${ x }:${ y }" -codec:a copy ${ output }.mp4`;
            const v211 = (error, stdout, stderr) => {
                if (error) {
                    const v209 = reject(error);
                    v209;
                    return;
                }
                const v210 = resolve(stdout);
                v210;
            };
            const v212 = exec(v208, v211);
            v212;
        } else {
            const v213 = new Error('ffmpegdotjs could not find file');
            const v214 = reject(v213);
            v214;
        }
    };
    const v216 = new Promise(v215);
    return v216;
};
const v228 = (input, text, x, y, output) => {
    const v226 = function (resolve, reject) {
        const v218 = fs.existsSync(input);
        if (v218) {
            const v219 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } -vf 'drawtext=fontfile=/asset/times-new-roman.ttf:fontsize=64:fontcolor=white:borderw=3:bordercolor=black:box=0:text=${ text }:x=${ x }:y=${ y }' ${ output }.mp4`;
            const v222 = (error, stdout, stderr) => {
                if (error) {
                    const v220 = reject(error);
                    v220;
                    return;
                }
                const v221 = resolve('test.mp4');
                v221;
            };
            const v223 = exec(v219, v222);
            v223;
        } else {
            const v224 = new Error('ffmpegdotjs could not find file');
            const v225 = reject(v224);
            v225;
        }
    };
    const v227 = new Promise(v226);
    return v227;
};
const v242 = (input, audio, output) => {
    const v240 = function (resolve, reject) {
        const v229 = fs.existsSync(input);
        const v230 = fs.existsSync(audio);
        const v231 = v229 && v230;
        if (v231) {
            const v232 = `ffmpeg -hide_banner -loglevel quiet -i ${ input } -i ${ audio } -map 0:0 -map 1:0 -vcodec copy -acodec copy ${ output }.mp4`;
            const v236 = (error, stdout, stderr) => {
                if (error) {
                    const v233 = reject(error);
                    v233;
                    return;
                }
                const v234 = `${ output }.mp4`;
                const v235 = resolve(v234);
                v235;
            };
            const v237 = exec(v232, v236);
            v237;
        } else {
            const v238 = new Error('ffmpegdotjs could not find file');
            const v239 = reject(v238);
            v239;
        }
    };
    const v241 = new Promise(v240);
    return v241;
};
const v256 = (audio, image, output) => {
    const v254 = function (resolve, reject) {
        const v243 = fs.existsSync(audio);
        const v244 = fs.existsSync(image);
        const v245 = v243 && v244;
        if (v245) {
            const v246 = `ffmpeg -hide_banner -loglevel quiet -i ${ audio } -loop 1 -f image2 -i ${ image } -t 188 ${ output }.mp4`;
            const v250 = (error, stdout, stderr) => {
                if (error) {
                    const v247 = reject(error);
                    v247;
                    return;
                }
                const v248 = `${ output }.mp4`;
                const v249 = resolve(v248);
                v249;
            };
            const v251 = exec(v246, v250);
            v251;
        } else {
            const v252 = new Error('ffmpegdotjs could not find file');
            const v253 = reject(v252);
            v253;
        }
    };
    const v255 = new Promise(v254);
    return v255;
};
const v268 = (input, start, duration, output) => {
    const v266 = function (resolve, reject) {
        const v257 = fs.existsSync(input);
        if (v257) {
            const v258 = `ffmpeg -hide_banner -loglevel quiet -ss ${ start } -i ${ input } -t ${ duration } -c copy ${ output }.mp4`;
            const v262 = (error, stdout, stderr) => {
                if (error) {
                    const v259 = reject(error);
                    v259;
                    return;
                }
                const v260 = `${ output }.mp4`;
                const v261 = resolve(v260);
                v261;
            };
            const v263 = exec(v258, v262);
            v263;
        } else {
            const v264 = new Error('ffmpegdotjs could not find file');
            const v265 = reject(v264);
            v265;
        }
    };
    const v267 = new Promise(v266);
    return v267;
};
const ffmpegjs = {};
ffmpegjs.generateimage = v146;
ffmpegjs.convertvideo = v157;
ffmpegjs.generategif = v168;
ffmpegjs.extractaudio = v179;
ffmpegjs.compressvideo = v191;
ffmpegjs.addoverlayimagetime = v204;
ffmpegjs.addoverlayimage = v217;
ffmpegjs.addoverlaytext = v228;
ffmpegjs.addaudiotovideo = v242;
ffmpegjs.addaudiotoimage = v256;
ffmpegjs.trimvideo = v268;
module.exports = ffmpegjs;