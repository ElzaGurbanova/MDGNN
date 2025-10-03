'use strict';
const v415 = { value: true };
const v416 = Object.defineProperty(exports, '__esModule', v415);
v416;
var checks = require('@thi.ng/checks');
var errors = require('@thi.ng/errors');
var transducersBinary = require('@thi.ng/transducers-binary');
var associative = require('@thi.ng/associative');
var dot = require('@thi.ng/dot');
var strings = require('@thi.ng/strings');
var api = require('@thi.ng/api');
var $prefixes = require('@thi.ng/prefixes');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
const IS_NODE = checks.isNode();
const NODE_ONLY = () => {
    const v417 = errors.unsupported('only available in NodeJS');
    return v417;
};
const isNode = x => {
    const v418 = checks.isPlainObject(x);
    const v419 = '$id' in x;
    const v420 = v418 && v419;
    return v420;
};
const isRef = x => {
    const v421 = checks.isPlainObject(x);
    const v422 = '$ref' in x;
    const v423 = v421 && v422;
    return v423;
};
const isToEGF = x => {
    const v424 = checks.implementsFunction(x, 'toEGF');
    return v424;
};
const RE_QFN = /^([a-z0-9-_$]*):([a-z0-9-_$.+]+)$/i;
const qualifiedID = (prefixes, id) => {
    const v425 = id[0];
    const v426 = v425 === '<';
    const v427 = id.length;
    const v428 = v427 - 1;
    const v429 = id[v428];
    const v430 = v429 === '>';
    const v431 = v426 && v430;
    if (v431) {
        const v432 = id.length;
        const v433 = v432 - 1;
        const v434 = id.substring(1, v433);
        return v434;
    }
    const v435 = id.indexOf(':');
    const v436 = -1;
    const v437 = v435 !== v436;
    if (v437) {
        const match = RE_QFN.exec(id);
        if (match) {
            const v438 = match[1];
            const prefix = prefixes[v438];
            const v439 = match[2];
            const v440 = prefix + v439;
            const v441 = `unknown prefix: ${ id }`;
            const v442 = errors.illegalArgs(v441);
            let v443;
            if (prefix) {
                v443 = v440;
            } else {
                v443 = v442;
            }
            return v443;
        }
    }
    return id;
};
const defPrefixer = prefixes => {
    const uriToID = new associative.TrieMap();
    const v444 = Object.entries(prefixes);
    const v446 = ([id, url]) => {
        const v445 = uriToID.set(url, id);
        return v445;
    };
    const v447 = v444.forEach(v446);
    v447;
    const v454 = uri => {
        const known = uriToID.knownPrefix(uri);
        const v448 = uriToID.get(known);
        const v449 = v448 + ':';
        const v450 = known.length;
        const v451 = uri.substr(v450);
        const v452 = v449 + v451;
        let v453;
        if (known) {
            v453 = v452;
        } else {
            v453 = undefined;
        }
        return v453;
    };
    return v454;
};
const defVocab = uri => {
    const v456 = (name = '') => {
        const v455 = uri + name;
        return v455;
    };
    return v456;
};
const toEGF = (nodes, prefixes = {}, propFn) => {
    const prefixID = defPrefixer(prefixes);
    const res = [];
    let id;
    for (id in prefixes) {
        const v457 = prefixes[id];
        const v458 = `@prefix ${ id }: ${ v457 }`;
        const v459 = res.push(v458);
        v459;
    }
    const v460 = res.push('');
    v460;
    let node;
    for (node of nodes) {
        const v461 = toEGFNode(node, prefixID, propFn);
        const v462 = res.push(v461, '');
        v462;
    }
    const v463 = res.join('\n');
    return v463;
};
const toEGFNode = (node, prefix, propFn = toEGFProp) => {
    const v464 = isToEGF(node);
    if (v464) {
        const v465 = node.toEGF();
        return v465;
    }
    const v466 = node.$id;
    const v467 = prefix(v466);
    const v468 = node.$id;
    const v469 = v467 || v468;
    const res = [v469];
    const $prop = (p, pid, v) => {
        const v470 = isNode(v);
        const v471 = v.$id;
        const v472 = prefix(v471);
        const v473 = v.$id;
        const v474 = v472 || v473;
        const v475 = isRef(v);
        const v476 = v.$ref;
        const v477 = prefix(v476);
        const v478 = v.$ref;
        const v479 = v477 || v478;
        const v480 = isToEGF(v);
        const v481 = v.toEGF();
        const v482 = propFn(p, v);
        let v483;
        if (v480) {
            v483 = v481;
        } else {
            v483 = v482;
        }
        let v484;
        if (v475) {
            v484 = `-> ${ v479 }`;
        } else {
            v484 = v483;
        }
        let v485;
        if (v470) {
            v485 = `-> ${ v474 }`;
        } else {
            v485 = v484;
        }
        const v486 = `\t${ pid } ` + v485;
        const v487 = res.push(v486);
        return v487;
    };
    let p;
    for (p in node) {
        const v488 = p === '$id';
        if (v488) {
            continue;
        }
        const v489 = prefix(p);
        const pid = v489 || p;
        const val = node[p];
        const v490 = checks.isArray(val);
        if (v490) {
            let v;
            for (v of val) {
                const v491 = $prop(p, pid, v);
                v491;
            }
        } else {
            const v492 = $prop(p, pid, val);
            v492;
        }
    }
    const v493 = res.join('\n');
    return v493;
};
const toEGFProp = (_, val) => {
    const v494 = checks.isString(val);
    const v495 = val.indexOf('\n');
    const v496 = v495 >= 0;
    let v497;
    if (v496) {
        v497 = `>>>${ val }<<<`;
    } else {
        v497 = val;
    }
    const v498 = checks.isNumber(val);
    const v499 = checks.isDate(val);
    const v500 = val.toISOString();
    const v501 = checks.isTypedArray(val);
    const v502 = val.buffer;
    const v503 = val.byteOffset;
    const v504 = val.byteLength;
    const v505 = new Uint8Array(v502, v503, v504);
    const v506 = transducersBinary.base64Encode(v505);
    const v507 = checks.isArray(val);
    const v508 = checks.isPlainObject(val);
    const v509 = v507 || v508;
    const v510 = JSON.stringify(val);
    const v511 = String(val);
    let v512;
    if (v509) {
        v512 = `#json ${ v510 }`;
    } else {
        v512 = v511;
    }
    let v513;
    if (v501) {
        v513 = `#base64 ${ v506 }`;
    } else {
        v513 = v512;
    }
    let v514;
    if (v499) {
        v514 = `#date ${ v500 }`;
    } else {
        v514 = v513;
    }
    let v515;
    if (v498) {
        v515 = `#num ${ val }`;
    } else {
        v515 = v514;
    }
    let v516;
    if (v494) {
        v516 = v497;
    } else {
        v516 = v515;
    }
    return v516;
};
const toDot = (graph, opts) => {
    const nodes = {};
    const edges = [];
    const v517 = opts.filter;
    const v518 = () => {
        return true;
    };
    const filter = v517 || v518;
    const addEdge = (src, prop, val) => {
        const v519 = isRef(val);
        if (v519) {
            const v520 = val.$ref;
            const v521 = {
                src,
                dest: v520,
                label: prop
            };
            const v522 = edges.push(v521);
            v522;
        } else {
            const v523 = val.$id;
            if (v523) {
                const v524 = val.$id;
                const v525 = {
                    src,
                    dest: v524,
                    label: prop
                };
                const v526 = edges.push(v525);
                v526;
            } else {
                const v527 = String(val);
                const v528 = strings.slugify(v527);
                const id = `lit-${ v528 }`;
                const v529 = String(val);
                const v530 = v529.replace(/\n/g, '\\n');
                const v531 = {};
                v531.label = v530;
                nodes[id] = v531;
                const v532 = {
                    src,
                    dest: id,
                    label: prop
                };
                const v533 = edges.push(v532);
                v533;
            }
        }
    };
    const v534 = Object.entries(graph);
    const v550 = ([id, node]) => {
        const v535 = node.name;
        const v536 = node.$id;
        const v537 = v535 || v536;
        const v538 = {};
        v538.label = v537;
        nodes[id] = v538;
        const v539 = Object.entries(node);
        const v548 = ([prop, val]) => {
            const v540 = filter(prop, node);
            const v541 = !v540;
            if (v541) {
                return;
            }
            const v542 = checks.isArray(val);
            const v544 = v => {
                const v543 = addEdge(id, prop, v);
                return v543;
            };
            const v545 = val.forEach(v544);
            const v546 = addEdge(id, prop, val);
            let v547;
            if (v542) {
                v547 = v545;
            } else {
                v547 = v546;
            }
            v547;
        };
        const v549 = v539.forEach(v548);
        v549;
    };
    const v551 = v534.forEach(v550);
    v551;
    const v552 = opts.attribs;
    const v553 = {
        attribs: v552,
        nodes,
        edges
    };
    const v554 = dot.serializeGraph(v553);
    return v554;
};
const v556 = (_, body) => {
    const v555 = Buffer.from(body, 'base64');
    return v555;
};
const v560 = (_, body) => {
    const v557 = transducersBinary.base64Decode(body);
    const v558 = [...v557];
    const v559 = new Uint8Array(v558);
    return v559;
};
let v561;
if (IS_NODE) {
    v561 = v556;
} else {
    v561 = v560;
}
const v563 = (_, body) => {
    const v562 = new Date(body);
    return v562;
};
const v576 = (_, path$1, ctx) => {
    const v564 = ctx.opts;
    const v565 = v564.includes;
    const v566 = IS_NODE && v565;
    if (v566) {
        const v567 = ctx.opts;
        const v568 = v567.root;
        const v569 = strings.unescape(path$1);
        path$1 = path.resolve(v568, v569);
        const v570 = ctx.logger;
        const v571 = v570.debug('loading value from:', path$1);
        v571;
        const v572 = fs.readFileSync(path$1);
        const v573 = v572.toString();
        return v573;
    } else {
        const v574 = ctx.logger;
        const v575 = v574.debug('skipping file value:', path$1);
        v575;
        return path$1;
    }
};
const v585 = (_, body, ctx) => {
    const v577 = ctx.opts;
    const v578 = v577.decrypt;
    const v579 = ['--decrypt'];
    const v580 = { input: body };
    const v581 = child_process.execFileSync('gpg', v579, v580);
    const v582 = v581.toString();
    let v583;
    if (v578) {
        v583 = v582;
    } else {
        v583 = body;
    }
    const v584 = v583.trim();
    return v584;
};
let v586;
if (IS_NODE) {
    v586 = v585;
} else {
    v586 = NODE_ONLY;
}
const v588 = (_, body) => {
    const v587 = strings.maybeParseInt(body, 0, 16);
    return v587;
};
const v591 = (_, body) => {
    const v589 = strings.unescape(body);
    const v590 = JSON.parse(v589);
    return v590;
};
const v595 = (_, body) => {
    const v592 = body.split(/[\n\r\t ]+/g);
    const v593 = strings.unescape;
    const v594 = v592.map(v593);
    return v594;
};
const v597 = (_, body) => {
    const v596 = strings.maybeParseFloat(body, 0);
    return v596;
};
const BUILTINS = {};
BUILTINS.base64 = v561;
BUILTINS.date = v563;
BUILTINS.file = v576;
BUILTINS.gpg = v586;
BUILTINS.hex = v588;
BUILTINS.json = v591;
BUILTINS.list = v595;
BUILTINS.num = v597;
const INCLUDE = '@include ';
const PREFIX = '@prefix ';
const parse = (src, ctx) => {
    const lines = src.split(/\r?\n/);
    const nodes = ctx.nodes;
    const v598 = ctx.opts;
    const usePrefixes = v598.prefixes;
    let i = 0;
    let n = lines.length;
    let v599 = i < n;
    while (v599) {
        const v600 = i++;
        let subj = lines[v600];
        const v601 = subj.length;
        const v602 = !v601;
        const v603 = subj[0];
        const v604 = v603 === ';';
        const v605 = v602 || v604;
        if (v605) {
            continue;
        }
        const v606 = subj[0];
        const v607 = v606 === '@';
        if (v607) {
            const v608 = subj.startsWith(INCLUDE);
            if (v608) {
                const v609 = parseInclude(subj, ctx);
                v609;
                continue;
            } else {
                const v610 = subj.startsWith(PREFIX);
                if (v610) {
                    const v611 = parsePrefix(subj, ctx);
                    const v612 = usePrefixes && v611;
                    v612;
                    continue;
                }
            }
        }
        subj = strings.unescape(subj);
        const v613 = ctx.prefixes;
        const v614 = usePrefixes && (subj = qualifiedID(v613, subj));
        v614;
        const v615 = nodes[subj];
        const v616 = {};
        v616.$id = subj;
        const curr = v615 || (nodes[subj] = v616);
        let v617 = i < n;
        while (v617) {
            let line = lines[i];
            const v618 = line[0];
            const v619 = v618 === '\t';
            const v620 = line.startsWith('    ');
            const v621 = v619 || v620;
            if (v621) {
                i = parseProp(curr, ctx, line, lines, i);
            } else {
                const v622 = line.length;
                const v623 = !v622;
                if (v623) {
                    const v624 = i++;
                    v624;
                    break;
                } else {
                    const v625 = line[0];
                    const v626 = v625 === ';';
                    if (v626) {
                        const v627 = i++;
                        v627;
                    } else {
                        const v628 = `expected property or comment @ line: ${ i }`;
                        const v629 = errors.illegalState(v628);
                        v629;
                    }
                }
            }
            v617 = i < n;
        }
        v599 = i < n;
    }
    const v630 = ctx.opts;
    const v631 = v630.resolve;
    const v632 = ctx.opts;
    const v633 = v632.prune;
    const v634 = v631 && v633;
    const v635 = pruneNodes(ctx);
    const v636 = v634 && v635;
    v636;
    return ctx;
};
const parseInclude = (line, ctx) => {
    const v637 = INCLUDE.length;
    const v638 = line.substr(v637);
    const path$1 = strings.unescape(v638);
    const v639 = ctx.opts;
    const v640 = v639.includes;
    const v641 = IS_NODE && v640;
    if (v641) {
        const v642 = {};
        const v643 = Object.assign(v642, ctx);
        const v644 = ctx.file;
        const v645 = path.dirname(v644);
        const v646 = {};
        const v647 = ctx.prefixes;
        const v648 = Object.assign(v646, v647);
        const v649 = {};
        const v650 = ctx.opts;
        const v651 = Object.assign(v649, v650);
        const v652 = { prune: false };
        const v653 = Object.assign(v651, v652);
        const v654 = {
            cwd: v645,
            prefixes: v648,
            opts: v653
        };
        const v655 = Object.assign(v643, v654);
        const v656 = $parseFile(path$1, v655);
        v656;
    } else {
        const v657 = ctx.logger;
        const v658 = v657.debug('skipping include:', path$1);
        v658;
    }
};
const RE_PREFIX = /^([a-z0-9-_$]*)$/i;
const parsePrefix = (line, ctx) => {
    const v659 = PREFIX.length;
    const idx = line.indexOf(': ', v659);
    const v660 = idx > 0;
    if (v660) {
        const v661 = PREFIX.length;
        const v662 = line.substring(v661, idx);
        const id = strings.unescape(v662);
        const v663 = RE_PREFIX.test(id);
        if (v663) {
            const v664 = idx + 2;
            const v665 = line.substr(v664);
            const v666 = v665.trim();
            const val = strings.unescape(v666);
            const v667 = val.length;
            if (v667) {
                const v668 = ctx.logger;
                const v669 = `declare prefix: ${ id } = ${ val }`;
                const v670 = v668.debug(v669);
                v670;
                const v671 = ctx.prefixes;
                v671[id] = val;
                return;
            }
        }
    }
    const v672 = `invalid prefix decl: ${ line }`;
    const v673 = errors.illegalState(v672);
    v673;
};
const parseTag = (tag, body, ctx) => {
    const v674 = ctx.tags;
    const v675 = v674[tag];
    const v676 = ctx.defaultTag;
    const parser = v675 || v676;
    const v677 = parser(tag, body, ctx);
    const v678 = `missing parser for tag: ${ tag }`;
    const v679 = errors.unsupported(v678);
    let v680;
    if (parser) {
        v680 = v677;
    } else {
        v680 = v679;
    }
    return v680;
};
const parseProp = (node, ctx, line, lines, i) => {
    let idx0;
    const v681 = line[0];
    const v682 = v681 === '\t';
    if (v682) {
        idx0 = 1;
    } else {
        idx0 = 4;
    }
    const v683 = line[idx0];
    const v684 = v683 === ';';
    if (v684) {
        const v685 = ++i;
        return v685;
    }
    let idx = line.indexOf(' ', idx0);
    const v686 = line.substring(idx0, idx);
    let key = strings.unescape(v686);
    const v687 = ctx.opts;
    const v688 = v687.prefixes;
    const v689 = ctx.prefixes;
    const v690 = v688 && (key = qualifiedID(v689, key));
    v690;
    let tag;
    let body;
    const v691 = idx++;
    v691;
    const v692 = line[idx];
    const v693 = v692 === '-';
    const v694 = idx + 1;
    const v695 = line[v694];
    const v696 = v695 === '>';
    const v697 = v693 && v696;
    if (v697) {
        const v698 = ctx.index;
        const v699 = idx + 2;
        const v700 = line.substr(v699);
        const v701 = v700.trim();
        const v702 = strings.unescape(v701);
        const v703 = parseRef(v702, ctx);
        const v704 = addProp(v698, node, key, v703);
        v704;
        const v705 = ++i;
        return v705;
    } else {
        const v706 = line[idx];
        const v707 = v706 === '#';
        if (v707) {
            const tstart = idx + 1;
            idx = line.indexOf(' ', tstart);
            const v708 = line.substring(tstart, idx);
            tag = strings.unescape(v708);
            const v709 = idx++;
            v709;
        }
    }
    const v710 = line[idx];
    const v711 = v710 === '>';
    const v712 = idx + 1;
    const v713 = line[v712];
    const v714 = v713 === '>';
    const v715 = v711 && v714;
    const v716 = idx + 2;
    const v717 = line[v716];
    const v718 = v717 === '>';
    const v719 = v715 && v718;
    if (v719) {
        const v720 = idx + 3;
        body = line.substr(v720);
        idx = body.indexOf('<<<');
        const v721 = idx < 0;
        if (v721) {
            const n = lines.length;
            let closed = false;
            const v722 = ++i;
            let v723 = v722 < n;
            while (v723) {
                line = lines[i];
                idx = line.indexOf('<<<');
                const v724 = idx >= 0;
                if (v724) {
                    const v725 = line.substr(0, idx);
                    body += '\n' + v725;
                    closed = true;
                    const v726 = i++;
                    v726;
                    break;
                } else {
                    body += '\n' + line;
                }
                v723 = v722 < n;
            }
            const v727 = !closed;
            const v728 = errors.illegalState('unterminated value, EOF reached');
            const v729 = v727 && v728;
            v729;
        } else {
            body = body.substr(0, idx);
            const v730 = i++;
            v730;
        }
    } else {
        body = line.substr(idx);
        const v731 = i++;
        v731;
    }
    body = body.trim();
    const v732 = ctx.index;
    const v733 = parseTag(tag, body, ctx);
    const v734 = strings.unescape(body);
    let v735;
    if (tag) {
        v735 = v733;
    } else {
        v735 = v734;
    }
    const v736 = addProp(v732, node, key, v735);
    v736;
    return i;
};
const addProp = (index, acc, key, val) => {
    const exist = acc[key];
    const v737 = acc.$id;
    const v738 = v737 + '~';
    const id = v738 + key;
    const v739 = exist !== undefined;
    if (v739) {
        const v740 = index[id];
        const v741 = ++v740;
        const v742 = v741 > 2;
        const v743 = exist.push(val);
        let v744;
        if (v742) {
            v744 = v743;
        } else {
            v744 = acc[key] = [
                exist,
                val
            ];
        }
        v744;
    } else {
        acc[key] = val;
        index[id] = 1;
    }
};
const parseRef = (id, ctx) => {
    const v745 = ctx.opts;
    const v746 = v745.prefixes;
    const v747 = ctx.prefixes;
    const v748 = v746 && (id = qualifiedID(v747, id));
    v748;
    const v749 = ctx.opts;
    const v750 = v749.resolve;
    const v751 = ctx.nodes;
    const v752 = v751[id];
    const v753 = ctx.nodes;
    const v754 = {};
    v754.$id = id;
    const v755 = v752 || (v753[id] = v754);
    const v758 = function () {
        const v756 = ctx.nodes;
        const v757 = v756[id];
        return v757;
    };
    const v764 = function (o) {
        const v759 = o != null;
        const v760 = o.$ref;
        const v761 = this.$ref;
        const v762 = v760 === v761;
        const v763 = v759 && v762;
        return v763;
    };
    const v765 = {
        $ref: id,
        deref: v758,
        equiv: v764
    };
    let v766;
    if (v750) {
        v766 = v755;
    } else {
        v766 = v765;
    }
    return v766;
};
const pruneNodes = ({nodes, logger}) => {
    let id;
    for (id in nodes) {
        const v767 = nodes[id];
        const keys = Object.keys(v767);
        const v768 = keys.length;
        const v769 = v768 === 1;
        const v770 = keys[0];
        const v771 = v770 === '$id';
        const v772 = v769 && v771;
        if (v772) {
            const v773 = logger.debug('pruning node:', id);
            v773;
            const v774 = nodes[id];
            const v775 = delete v774;
            v775;
        }
    }
};
const initContext = (ctx = {}) => {
    const v776 = {
        decrypt: false,
        includes: true,
        prefixes: false,
        prune: false,
        resolve: false
    };
    const v777 = ctx.opts;
    const opts = Object.assign(v776, v777);
    const v778 = ctx.cwd;
    const v779 = v778 || '.';
    const v780 = ctx.file;
    const v781 = v780 || '';
    const v782 = ctx.files;
    const v783 = [];
    const v784 = v782 || v783;
    const v785 = ctx.nodes;
    const v786 = {};
    const v787 = v785 || v786;
    const v788 = ctx.index;
    const v789 = {};
    const v790 = v788 || v789;
    const v791 = {};
    const v792 = Object.assign(v791, BUILTINS);
    const v793 = ctx.tags;
    const v794 = Object.assign(v792, v793);
    const v795 = ctx.defaultTag;
    const v796 = ctx.prefixes;
    const v797 = {};
    const v798 = ctx.prefixes;
    const v799 = Object.assign(v797, v798);
    const v800 = {};
    const v801 = Object.assign(v800, $prefixes);
    const v802 = $prefixes.VOID;
    const v803 = { void: v802 };
    const v804 = Object.assign(v801, v803);
    let v805;
    if (v796) {
        v805 = v799;
    } else {
        v805 = v804;
    }
    const v806 = ctx.logger;
    const v807 = api.NULL_LOGGER;
    const v808 = v806 || v807;
    const v809 = {};
    v809.cwd = v779;
    v809.file = v781;
    v809.files = v784;
    v809.nodes = v787;
    v809.index = v790;
    v809.tags = v794;
    v809.defaultTag = v795;
    v809.prefixes = v805;
    v809.logger = v808;
    v809.opts = opts;
    return v809;
};
const $parseFile = (path$1, ctx) => {
    const $ctx = initContext(ctx);
    const v810 = $ctx.cwd;
    path$1 = path.resolve(v810, path$1);
    $ctx.file = path$1;
    const v811 = $ctx.files;
    const v812 = v811.includes(path$1);
    if (v812) {
        const v813 = $ctx.logger;
        const v814 = v813.warn('file already processed, skipping:', path$1);
        v814;
        return $ctx;
    }
    const v815 = $ctx.files;
    const v816 = v815.push(path$1);
    v816;
    const v817 = $ctx.logger;
    const v818 = v817.debug('loading file:', path$1);
    v818;
    const v819 = fs.readFileSync(path$1);
    const v820 = v819.toString();
    const v821 = parse(v820, $ctx);
    return v821;
};
const parseFile = (path, ctx) => {
    const res = $parseFile(path, ctx);
    const v822 = res.nodes;
    const v823 = res.prefixes;
    const v824 = {};
    v824.nodes = v822;
    v824.prefixes = v823;
    return v824;
};
const parseString = (src, ctx) => {
    const v825 = initContext(ctx);
    const res = parse(src, v825);
    const v826 = res.nodes;
    const v827 = res.prefixes;
    const v828 = {};
    v828.nodes = v826;
    v828.prefixes = v827;
    return v828;
};
exports.$parseFile = $parseFile;
exports.BUILTINS = BUILTINS;
exports.IS_NODE = IS_NODE;
exports.NODE_ONLY = NODE_ONLY;
exports.defPrefixer = defPrefixer;
exports.defVocab = defVocab;
exports.isNode = isNode;
exports.isRef = isRef;
exports.isToEGF = isToEGF;
exports.parse = parse;
exports.parseFile = parseFile;
exports.parseString = parseString;
exports.qualifiedID = qualifiedID;
exports.toDot = toDot;
exports.toEGF = toEGF;
exports.toEGFNode = toEGFNode;
exports.toEGFProp = toEGFProp;