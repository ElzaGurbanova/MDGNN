import { JSDOM } from 'jsdom';
import { promisify } from 'util';
import imageSize from 'image-size';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { mkdirpSync } from 'fs-extra';
const sizeOf = promisify(imageSize);
const execPromise = promisify(exec);
const isThumbnail = function (filename) {
    const v91 = filename.match(/-thumb.jpg$/i);
    const v92 = filename.match(/-still[0-9]*.jpg$/i);
    const v93 = v91 || v92;
    const v94 = filename.match(/-submovie[0-9]*.jpg$/i);
    const v95 = v93 || v94;
    return v95;
};
const heroWidths = [
    1280,
    640
];
const thumbWidths = [
    900,
    450
];
const extension = {};
extension.jpeg = 'jpg';
extension.avif = 'avif';
const sizedName = function (filename, width, format) {
    const ext = extension[format];
    const v96 = !ext;
    if (v96) {
        const v97 = new Error(`Unknown format ${ format }`);
        throw v97;
    }
    const v102 = _ => {
        const v98 = '-' + width;
        const v99 = v98 + 'w';
        const v100 = v99 + '.';
        const v101 = v100 + ext;
        return v101;
    };
    const v103 = filename.replace(/\.\w+$/, v102);
    return v103;
};
const srcset = async function (filename, format) {
    let widths;
    const v104 = isThumbnail(filename);
    if (v104) {
        widths = thumbWidths;
    } else {
        widths = heroWidths;
    }
    const v106 = w => {
        const v105 = resize(filename, w, format);
        return v105;
    };
    const v107 = widths.map(v106);
    const names = await Promise.all(v107);
    const v108 = format === 'jpeg';
    const v109 = filename.match(/-thumb.jpg$/i);
    const v110 = v108 && v109;
    if (v110) {
        await resize(filename, 1200, format);
    }
    const v113 = (n, i) => {
        const v111 = widths[i];
        const v112 = `${ n } ${ v111 }w`;
        return v112;
    };
    const v114 = names.map(v113);
    const v115 = v114.join(', ');
    return v115;
};
;
const resize = async function (filename, width, format) {
    const out = sizedName(filename, width, format);
    const v116 = '.cache' + out;
    const v117 = fs.existsSync(v116);
    if (v117) {
        return out;
    }
    const v118 = `node ./compressImage.js ${ filename } ${ width } ${ format }`;
    await execPromise(v118);
    return out;
};
const processImage = async function (img, outputPath) {
    let src = img.getAttribute('src');
    const v119 = src.startsWith('http');
    if (v119) {
        return;
    }
    const v120 = /^\.+\//.test(src);
    if (v120) {
        const v121 = path.dirname(outputPath);
        const v122 = path.resolve(v121, src);
        const v123 = path.relative('./.cache/', v122);
        src = '/' + v123;
        const v124 = path.sep;
        const v125 = v124 == '\\';
        if (v125) {
            src = src.replace(/\\/g, '/');
        }
    }
    const srcFilename = `./src${ src }`;
    const cachedFilename = `.cache${ src }`;
    const cachedFilenameDirectory = path.dirname(cachedFilename);
    const v126 = fs.existsSync(cachedFilenameDirectory);
    const v127 = !v126;
    if (v127) {
        const v128 = mkdirpSync(cachedFilenameDirectory);
        v128;
    }
    let dimensions;
    const v129 = fs.existsSync(cachedFilename);
    const v130 = !v129;
    if (v130) {
        const v131 = src.endsWith('svg');
        if (v131) {
            const v132 = fs.copyFileSync(srcFilename, cachedFilename);
            v132;
        }
    }
    try {
        dimensions = await sizeOf(srcFilename);
    } catch (e) {
        const v133 = e.message;
        const v134 = console.warn(v133, src);
        v134;
        return;
    }
    const v135 = img.getAttribute('width');
    const v136 = !v135;
    if (v136) {
        const v137 = dimensions.width;
        const v138 = img.setAttribute('width', v137);
        v138;
        const v139 = dimensions.height;
        const v140 = img.setAttribute('height', v139);
        v140;
    }
    const v141 = dimensions.type;
    const v142 = v141 == 'svg';
    if (v142) {
        return;
    }
    const v143 = img.tagName;
    const v144 = v143 == 'IMG';
    if (v144) {
        const v145 = img.setAttribute('decoding', 'async');
        v145;
        const v146 = img.setAttribute('loading', 'lazy');
        v146;
        const doc = img.ownerDocument;
        const picture = doc.createElement('picture');
        const avif = doc.createElement('source');
        const jpeg = doc.createElement('source');
        await setSrcset(avif, src, 'avif');
        const v147 = avif.setAttribute('type', 'image/avif');
        v147;
        await setSrcset(jpeg, src, 'jpeg');
        const v148 = jpeg.setAttribute('type', 'image/jpeg');
        v148;
        const v149 = picture.appendChild(avif);
        v149;
        const v150 = picture.appendChild(jpeg);
        v150;
        const v151 = jpeg.getAttribute('srcset');
        const v152 = v151.split(' ');
        const v153 = v152[0];
        const v154 = img.setAttribute('src', v153);
        v154;
        const v155 = img.parentElement;
        const v156 = v155.replaceChild(picture, img);
        v156;
        const v157 = picture.appendChild(img);
        v157;
    } else {
        const v158 = img.getAttribute('srcset');
        const v159 = !v158;
        if (v159) {
            await setSrcset(img, src, 'jpeg');
        }
    }
};
const setSrcset = async function (img, src, format) {
    const v160 = img.setAttribute('srcset', await srcset(src, format));
    v160;
    const v161 = isThumbnail(src);
    const v163 = width => {
        const v162 = `(max-width: ${ width }px) ${ width }px`;
        return v162;
    };
    const v164 = thumbWidths.map(v163);
    const v165 = v164.join(', ');
    const v166 = v165 + ', 100vw';
    const v168 = width => {
        const v167 = `(max-width: ${ width }px) ${ width }px`;
        return v167;
    };
    const v169 = heroWidths.map(v168);
    const v170 = v169.join(', ');
    const v171 = v170 + ', 100vw';
    let v172;
    if (v161) {
        v172 = v166;
    } else {
        v172 = v171;
    }
    const v173 = img.setAttribute('sizes', v172);
    v173;
};
export default const processImagesAndWriteFile = async function (templateFilename, templateString) {
    let content = templateString;
    const dom = new JSDOM(content);
    const v174 = dom.window;
    const v175 = v174.document;
    const v176 = v175.querySelectorAll('img');
    const images = [...v176];
    const v177 = images.length;
    const v178 = v177 > 0;
    if (v178) {
        let i;
        for (i of images) {
            await processImage(i, templateFilename);
        }
        content = dom.serialize();
    }
    const v179 = { encoding: 'utf8' };
    const v180 = fs.writeFileSync(templateFilename, content, v179);
    v180;
};