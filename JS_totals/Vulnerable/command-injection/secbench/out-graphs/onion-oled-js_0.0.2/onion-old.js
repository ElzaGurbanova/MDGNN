var Promise = require('promise');
const v43 = require('child_process');
const v44 = v43.exec;
var exec = Promise.denodeify(v44);
var oledExecutable = '/usr/sbin/oled-exp';
const v47 = function () {
    const v45 = oledExecutable + ' -i';
    const v46 = exec(v45);
    return v46;
};
const v50 = function () {
    const v48 = oledExecutable + ' -c';
    const v49 = exec(v48);
    return v49;
};
const v54 = function (mode) {
    const v51 = oledExecutable + ' power ';
    const v52 = v51 + mode;
    const v53 = exec(v52);
    return v53;
};
const v56 = function () {
    const v55 = OLEDExpr.power('on');
    return v55;
};
const v58 = function () {
    const v57 = OLEDExpr.power('off');
    return v57;
};
const v64 = function (row, col) {
    const v59 = oledExecutable + ' cursor ';
    const v60 = v59 + row;
    const v61 = v60 + ',';
    const v62 = v61 + col;
    const v63 = exec(v62);
    return v63;
};
const v68 = function (mode) {
    const v65 = oledExecutable + ' invert ';
    const v66 = v65 + mode;
    const v67 = exec(v66);
    return v67;
};
const v80 = function (string, row, col) {
    let cursor;
    const v69 = row !== undefined;
    const v70 = col !== undefined;
    const v71 = v69 && v70;
    const v72 = ' cursor ' + row;
    const v73 = v72 + ',';
    const v74 = v73 + col;
    if (v71) {
        cursor = v74;
    } else {
        cursor = '';
    }
    const v75 = oledExecutable + cursor;
    const v76 = v75 + ' write "';
    const v77 = v76 + string;
    const v78 = v77 + '"';
    const v79 = exec(v78);
    return v79;
};
const v84 = function (direction) {
    const v81 = oledExecutable + ' write ';
    const v82 = v81 + direction;
    const v83 = exec(v82);
    return v83;
};
var OLEDExpr = {};
OLEDExpr.initialize = v47;
OLEDExpr.clear = v50;
OLEDExpr.power = v54;
OLEDExpr.powerOn = v56;
OLEDExpr.powerOff = v58;
OLEDExpr.cursor = v64;
OLEDExpr.invert = v68;
OLEDExpr.write = v80;
OLEDExpr.scroll = v84;
module.exports = OLEDExpr;