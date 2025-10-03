'use strict';
const v414 = { value: true };
const v415 = Object.defineProperty(exports, '__esModule', v414);
v415;
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
    const v416 = errors.unsupported('only available in NodeJS');
    return v416;
};
const isNode = x => {
    const v417 = checks.isPlainObject(x);
    const v418 = '$id' in x;
    const v419 = v417 && v418;
    return v419;
};
const isRef = x => {
    const v420 = checks.isPlainObject(x);
    const v421 = '$ref' in x;
    const v422 = v420 && v421;
    return v422;
};
const isToEGF = x => {
    const v423 = checks.implementsFunction(x, 'toEGF');
    return v423;
};
const RE_QFN = /^([a-z0-9-_$]*):([a-z0-9-_$.+]+)$/i;
const qualifiedID = (prefixes, id) => {
    const v424 = id[0];
    const v425 = v424 === '<';
    const v426 = id.length;
    const v427 = v426 - 1;
    const v428 = id[v427];
    const v429 = v428 === '>';
    const v430 = v425 && v429;
    if (v430) {
        const v431 = id.length;
        const v432 = v431 - 1;
        const v433 = id.substring(1, v432);
        return v433;
    }
    const v434 = id.indexOf(':');
    const v435 = -1;
    const v436 = v434 !== v435;
    if (v436) {
        const match = RE_QFN.exec(id);
        if (match) {
            const v437 = match[1];
            const prefix = prefixes[v437];
            const v438 = match[2];
            const v439 = prefix + v438;
            const v440 = `unknown prefix: ${ id }`;
            const v441 = errors.illegalArgs(v440);
            let v442;
            if (prefix) {
                v442 = v439;
            } else {
                v442 = v441;
            }
            return v442;
        }
    }
    return id;
};
const defPrefixer = prefixes => {
    const uriToID = new associative.TrieMap();
    const v443 = Object.entries(prefixes);
    const v445 = ([id, url]) => {
        const v444 = uriToID.set(url, id);
        return v444;
    };
    const v446 = v443.forEach(v445);
    v446;
    const v453 = uri => {
        const known = uriToID.knownPrefix(uri);
        const v447 = uriToID.get(known);
        const v448 = v447 + ':';
        const v449 = known.length;
        const v450 = uri.substr(v449);
        const v451 = v448 + v450;
        let v452;
        if (known) {
            v452 = v451;
        } else {
            v452 = undefined;
        }
        return v452;
    };
    return v453;
};
const defVocab = uri => {
    const v455 = (name = '') => {
        const v454 = uri + name;
        return v454;
    };
    return v455;
};
const toEGF = (nodes, prefixes = {}, propFn) => {
    const prefixID = defPrefixer(prefixes);
    const res = [];
    let id;
    for (id in prefixes) {
        const v456 = prefixes[id];
        const v457 = `@prefix ${ id }: ${ v456 }`;
        const v458 = res.push(v457);
        v458;
    }
    const v459 = res.push('');
    v459;
    let node;
    for (node of nodes) {
        const v460 = toEGFNode(node, prefixID, propFn);
        const v461 = res.push(v460, '');
        v461;
    }
    const v462 = res.join('\n');
    return v462;
};
const toEGFNode = (node, prefix, propFn = toEGFProp) => {
    const v463 = isToEGF(node);
    if (v463) {
        const v464 = node.toEGF();
        return v464;
    }
    const v465 = node.$id;
    const v466 = prefix(v465);
    const v467 = node.$id;
    const v468 = v466 || v467;
    const res = [v468];
    const $prop = (p, pid, v) => {
        const v469 = isNode(v);
        const v470 = v.$id;
        const v471 = prefix(v470);
        const v472 = v.$id;
        const v473 = v471 || v472;
        const v474 = isRef(v);
        const v475 = v.$ref;
        const v476 = prefix(v475);
        const v477 = v.$ref;
        const v478 = v476 || v477;
        const v479 = isToEGF(v);
        const v480 = v.toEGF();
        const v481 = propFn(p, v);
        let v482;
        if (v479) {
            v482 = v480;
        } else {
            v482 = v481;
        }
        let v483;
        if (v474) {
            v483 = `-> ${ v478 }`;
        } else {
            v483 = v482;
        }
        let v484;
        if (v469) {
            v484 = `-> ${ v473 }`;
        } else {
            v484 = v483;
        }
        const v485 = `\t${ pid } ` + v484;
        const v486 = res.push(v485);
        return v486;
    };
    let p;
    for (p in node) {
        const v487 = p === '$id';
        if (v487) {
            continue;
        }
        const v488 = prefix(p);
        const pid = v488 || p;
        const val = node[p];
        const v489 = checks.isArray(val);
        if (v489) {
            let v;
            for (v of val) {
                const v490 = $prop(p, pid, v);
                v490;
            }
        } else {
            const v491 = $prop(p, pid, val);
            v491;
        }
    }
    const v492 = res.join('\n');
    return v492;
};
const toEGFProp = (_, val) => {
    const v493 = checks.isString(val);
    const v494 = val.indexOf('\n');
    const v495 = v494 >= 0;
    let v496;
    if (v495) {
        v496 = `>>>${ val }<<<`;
    } else {
        v496 = val;
    }
    const v497 = checks.isNumber(val);
    const v498 = checks.isDate(val);
    const v499 = val.toISOString();
    const v500 = checks.isTypedArray(val);
    const v501 = val.buffer;
    const v502 = val.byteOffset;
    const v503 = val.byteLength;
    const v504 = new Uint8Array(v501, v502, v503);
    const v505 = transducersBinary.base64Encode(v504);
    const v506 = checks.isArray(val);
    const v507 = checks.isPlainObject(val);
    const v508 = v506 || v507;
    const v509 = JSON.stringify(val);
    const v510 = String(val);
    let v511;
    if (v508) {
        v511 = `#json ${ v509 }`;
    } else {
        v511 = v510;
    }
    let v512;
    if (v500) {
        v512 = `#base64 ${ v505 }`;
    } else {
        v512 = v511;
    }
    let v513;
    if (v498) {
        v513 = `#date ${ v499 }`;
    } else {
        v513 = v512;
    }
    let v514;
    if (v497) {
        v514 = `#num ${ val }`;
    } else {
        v514 = v513;
    }
    let v515;
    if (v493) {
        v515 = v496;
    } else {
        v515 = v514;
    }
    return v515;
};
const toDot = (graph, opts) => {
    const nodes = {};
    const edges = [];
    const v516 = opts.filter;
    const v517 = () => {
        return true;
    };
    const filter = v516 || v517;
    const addEdge = (src, prop, val) => {
        const v518 = isRef(val);
        if (v518) {
            const v519 = val.$ref;
            const v520 = {
                src,
                dest: v519,
                label: prop
            };
            const v521 = edges.push(v520);
            v521;
        } else {
            const v522 = val.$id;
            if (v522) {
                const v523 = val.$id;
                const v524 = {
                    src,
                    dest: v523,
                    label: prop
                };
                const v525 = edges.push(v524);
                v525;
            } else {
                const v526 = String(val);
                const v527 = strings.slugify(v526);
                const id = `lit-${ v527 }`;
                const v528 = String(val);
                const v529 = v528.replace(/\n/g, '\\n');
                const v530 = {};
                v530.label = v529;
                nodes[id] = v530;
                const v531 = {
                    src,
                    dest: id,
                    label: prop
                };
                const v532 = edges.push(v531);
                v532;
            }
        }
    };
    const v533 = Object.entries(graph);
    const v549 = ([id, node]) => {
        const v534 = node.name;
        const v535 = node.$id;
        const v536 = v534 || v535;
        const v537 = {};
        v537.label = v536;
        nodes[id] = v537;
        const v538 = Object.entries(node);
        const v547 = ([prop, val]) => {
            const v539 = filter(prop, node);
            const v540 = !v539;
            if (v540) {
                return;
            }
            const v541 = checks.isArray(val);
            const v543 = v => {
                const v542 = addEdge(id, prop, v);
                return v542;
            };
            const v544 = val.forEach(v543);
            const v545 = addEdge(id, prop, val);
            let v546;
            if (v541) {
                v546 = v544;
            } else {
                v546 = v545;
            }
            v546;
        };
        const v548 = v538.forEach(v547);
        v548;
    };
    const v550 = v533.forEach(v549);
    v550;
    const v551 = opts.attribs;
    const v552 = {
        attribs: v551,
        nodes,
        edges
    };
    const v553 = dot.serializeGraph(v552);
    return v553;
};
const v555 = (_, body) => {
    const v554 = Buffer.from(body, 'base64');
    return v554;
};
const v559 = (_, body) => {
    const v556 = transducersBinary.base64Decode(body);
    const v557 = [...v556];
    const v558 = new Uint8Array(v557);
    return v558;
};
let v560;
if (IS_NODE) {
    v560 = v555;
} else {
    v560 = v559;
}
const v562 = (_, body) => {
    const v561 = new Date(body);
    return v561;
};
const v575 = (_, path$1, ctx) => {
    const v563 = ctx.opts;
    const v564 = v563.includes;
    const v565 = IS_NODE && v564;
    if (v565) {
        const v566 = ctx.opts;
        const v567 = v566.root;
        const v568 = strings.unescape(path$1);
        path$1 = path.resolve(v567, v568);
        const v569 = ctx.logger;
        const v570 = v569.debug('loading value from:', path$1);
        v570;
        const v571 = fs.readFileSync(path$1);
        const v572 = v571.toString();
        return v572;
    } else {
        const v573 = ctx.logger;
        const v574 = v573.debug('skipping file value:', path$1);
        v574;
        return path$1;
    }
};
const v583 = (_, body, ctx) => {
    const v576 = ctx.opts;
    const v577 = v576.decrypt;
    const v578 = `echo "${ body }" | gpg --decrypt`;
    const v579 = child_process.execSync(v578);
    const v580 = v579.toString();
    let v581;
    if (v577) {
        v581 = v580;
    } else {
        v581 = body;
    }
    const v582 = v581.trim();
    return v582;
};
let v584;
if (IS_NODE) {
    v584 = v583;
} else {
    v584 = NODE_ONLY;
}
const v586 = (_, body) => {
    const v585 = strings.maybeParseInt(body, 0, 16);
    return v585;
};
const v589 = (_, body) => {
    const v587 = strings.unescape(body);
    const v588 = JSON.parse(v587);
    return v588;
};
const v593 = (_, body) => {
    const v590 = body.split(/[\n\r\t ]+/g);
    const v591 = strings.unescape;
    const v592 = v590.map(v591);
    return v592;
};
const v595 = (_, body) => {
    const v594 = strings.maybeParseFloat(body, 0);
    return v594;
};
const BUILTINS = {};
BUILTINS.base64 = v560;
BUILTINS.date = v562;
BUILTINS.file = v575;
BUILTINS.gpg = v584;
BUILTINS.hex = v586;
BUILTINS.json = v589;
BUILTINS.list = v593;
BUILTINS.num = v595;
const INCLUDE = '@include ';
const PREFIX = '@prefix ';
const parse = (src, ctx) => {
    const lines = src.split(/\r?\n/);
    const nodes = ctx.nodes;
    const v596 = ctx.opts;
    const usePrefixes = v596.prefixes;
    let i = 0;
    let n = lines.length;
    let v597 = i < n;
    while (v597) {
        const v598 = i++;
        let subj = lines[v598];
        const v599 = subj.length;
        const v600 = !v599;
        const v601 = subj[0];
        const v602 = v601 === ';';
        const v603 = v600 || v602;
        if (v603) {
            continue;
        }
        const v604 = subj[0];
        const v605 = v604 === '@';
        if (v605) {
            const v606 = subj.startsWith(INCLUDE);
            if (v606) {
                const v607 = parseInclude(subj, ctx);
                v607;
                continue;
            } else {
                const v608 = subj.startsWith(PREFIX);
                if (v608) {
                    const v609 = parsePrefix(subj, ctx);
                    const v610 = usePrefixes && v609;
                    v610;
                    continue;
                }
            }
        }
        subj = strings.unescape(subj);
        const v611 = ctx.prefixes;
        const v612 = usePrefixes && (subj = qualifiedID(v611, subj));
        v612;
        const v613 = nodes[subj];
        const v614 = {};
        v614.$id = subj;
        const curr = v613 || (nodes[subj] = v614);
        let v615 = i < n;
        while (v615) {
            let line = lines[i];
            const v616 = line[0];
            const v617 = v616 === '\t';
            const v618 = line.startsWith('    ');
            const v619 = v617 || v618;
            if (v619) {
                i = parseProp(curr, ctx, line, lines, i);
            } else {
                const v620 = line.length;
                const v621 = !v620;
                if (v621) {
                    const v622 = i++;
                    v622;
                    break;
                } else {
                    const v623 = line[0];
                    const v624 = v623 === ';';
                    if (v624) {
                        const v625 = i++;
                        v625;
                    } else {
                        const v626 = `expected property or comment @ line: ${ i }`;
                        const v627 = errors.illegalState(v626);
                        v627;
                    }
                }
            }
            v615 = i < n;
        }
        v597 = i < n;
    }
    const v628 = ctx.opts;
    const v629 = v628.resolve;
    const v630 = ctx.opts;
    const v631 = v630.prune;
    const v632 = v629 && v631;
    const v633 = pruneNodes(ctx);
    const v634 = v632 && v633;
    v634;
    return ctx;
};
const parseInclude = (line, ctx) => {
    const v635 = INCLUDE.length;
    const v636 = line.substr(v635);
    const path$1 = strings.unescape(v636);
    const v637 = ctx.opts;
    const v638 = v637.includes;
    const v639 = IS_NODE && v638;
    if (v639) {
        const v640 = {};
        const v641 = Object.assign(v640, ctx);
        const v642 = ctx.file;
        const v643 = path.dirname(v642);
        const v644 = {};
        const v645 = ctx.prefixes;
        const v646 = Object.assign(v644, v645);
        const v647 = {};
        const v648 = ctx.opts;
        const v649 = Object.assign(v647, v648);
        const v650 = { prune: false };
        const v651 = Object.assign(v649, v650);
        const v652 = {
            cwd: v643,
            prefixes: v646,
            opts: v651
        };
        const v653 = Object.assign(v641, v652);
        const v654 = $parseFile(path$1, v653);
        v654;
    } else {
        const v655 = ctx.logger;
        const v656 = v655.debug('skipping include:', path$1);
        v656;
    }
};
const RE_PREFIX = /^([a-z0-9-_$]*)$/i;
const parsePrefix = (line, ctx) => {
    const v657 = PREFIX.length;
    const idx = line.indexOf(': ', v657);
    const v658 = idx > 0;
    if (v658) {
        const v659 = PREFIX.length;
        const v660 = line.substring(v659, idx);
        const id = strings.unescape(v660);
        const v661 = RE_PREFIX.test(id);
        if (v661) {
            const v662 = idx + 2;
            const v663 = line.substr(v662);
            const v664 = v663.trim();
            const val = strings.unescape(v664);
            const v665 = val.length;
            if (v665) {
                const v666 = ctx.logger;
                const v667 = `declare prefix: ${ id } = ${ val }`;
                const v668 = v666.debug(v667);
                v668;
                const v669 = ctx.prefixes;
                v669[id] = val;
                return;
            }
        }
    }
    const v670 = `invalid prefix decl: ${ line }`;
    const v671 = errors.illegalState(v670);
    v671;
};
const parseTag = (tag, body, ctx) => {
    const v672 = ctx.tags;
    const v673 = v672[tag];
    const v674 = ctx.defaultTag;
    const parser = v673 || v674;
    const v675 = parser(tag, body, ctx);
    const v676 = `missing parser for tag: ${ tag }`;
    const v677 = errors.unsupported(v676);
    let v678;
    if (parser) {
        v678 = v675;
    } else {
        v678 = v677;
    }
    return v678;
};
const parseProp = (node, ctx, line, lines, i) => {
    let idx0;
    const v679 = line[0];
    const v680 = v679 === '\t';
    if (v680) {
        idx0 = 1;
    } else {
        idx0 = 4;
    }
    const v681 = line[idx0];
    const v682 = v681 === ';';
    if (v682) {
        const v683 = ++i;
        return v683;
    }
    let idx = line.indexOf(' ', idx0);
    const v684 = line.substring(idx0, idx);
    let key = strings.unescape(v684);
    const v685 = ctx.opts;
    const v686 = v685.prefixes;
    const v687 = ctx.prefixes;
    const v688 = v686 && (key = qualifiedID(v687, key));
    v688;
    let tag;
    let body;
    const v689 = idx++;
    v689;
    const v690 = line[idx];
    const v691 = v690 === '-';
    const v692 = idx + 1;
    const v693 = line[v692];
    const v694 = v693 === '>';
    const v695 = v691 && v694;
    if (v695) {
        const v696 = ctx.index;
        const v697 = idx + 2;
        const v698 = line.substr(v697);
        const v699 = v698.trim();
        const v700 = strings.unescape(v699);
        const v701 = parseRef(v700, ctx);
        const v702 = addProp(v696, node, key, v701);
        v702;
        const v703 = ++i;
        return v703;
    } else {
        const v704 = line[idx];
        const v705 = v704 === '#';
        if (v705) {
            const tstart = idx + 1;
            idx = line.indexOf(' ', tstart);
            const v706 = line.substring(tstart, idx);
            tag = strings.unescape(v706);
            const v707 = idx++;
            v707;
        }
    }
    const v708 = line[idx];
    const v709 = v708 === '>';
    const v710 = idx + 1;
    const v711 = line[v710];
    const v712 = v711 === '>';
    const v713 = v709 && v712;
    const v714 = idx + 2;
    const v715 = line[v714];
    const v716 = v715 === '>';
    const v717 = v713 && v716;
    if (v717) {
        const v718 = idx + 3;
        body = line.substr(v718);
        idx = body.indexOf('<<<');
        const v719 = idx < 0;
        if (v719) {
            const n = lines.length;
            let closed = false;
            const v720 = ++i;
            let v721 = v720 < n;
            while (v721) {
                line = lines[i];
                idx = line.indexOf('<<<');
                const v722 = idx >= 0;
                if (v722) {
                    const v723 = line.substr(0, idx);
                    body += '\n' + v723;
                    closed = true;
                    const v724 = i++;
                    v724;
                    break;
                } else {
                    body += '\n' + line;
                }
                v721 = v720 < n;
            }
            const v725 = !closed;
            const v726 = errors.illegalState('unterminated value, EOF reached');
            const v727 = v725 && v726;
            v727;
        } else {
            body = body.substr(0, idx);
            const v728 = i++;
            v728;
        }
    } else {
        body = line.substr(idx);
        const v729 = i++;
        v729;
    }
    body = body.trim();
    const v730 = ctx.index;
    const v731 = parseTag(tag, body, ctx);
    const v732 = strings.unescape(body);
    let v733;
    if (tag) {
        v733 = v731;
    } else {
        v733 = v732;
    }
    const v734 = addProp(v730, node, key, v733);
    v734;
    return i;
};
const addProp = (index, acc, key, val) => {
    const exist = acc[key];
    const v735 = acc.$id;
    const v736 = v735 + '~';
    const id = v736 + key;
    const v737 = exist !== undefined;
    if (v737) {
        const v738 = index[id];
        const v739 = ++v738;
        const v740 = v739 > 2;
        const v741 = exist.push(val);
        let v742;
        if (v740) {
            v742 = v741;
        } else {
            v742 = acc[key] = [
                exist,
                val
            ];
        }
        v742;
    } else {
        acc[key] = val;
        index[id] = 1;
    }
};
const parseRef = (id, ctx) => {
    const v743 = ctx.opts;
    const v744 = v743.prefixes;
    const v745 = ctx.prefixes;
    const v746 = v744 && (id = qualifiedID(v745, id));
    v746;
    const v747 = ctx.opts;
    const v748 = v747.resolve;
    const v749 = ctx.nodes;
    const v750 = v749[id];
    const v751 = ctx.nodes;
    const v752 = {};
    v752.$id = id;
    const v753 = v750 || (v751[id] = v752);
    const v756 = function () {
        const v754 = ctx.nodes;
        const v755 = v754[id];
        return v755;
    };
    const v762 = function (o) {
        const v757 = o != null;
        const v758 = o.$ref;
        const v759 = this.$ref;
        const v760 = v758 === v759;
        const v761 = v757 && v760;
        return v761;
    };
    const v763 = {
        $ref: id,
        deref: v756,
        equiv: v762
    };
    let v764;
    if (v748) {
        v764 = v753;
    } else {
        v764 = v763;
    }
    return v764;
};
const pruneNodes = ({nodes, logger}) => {
    let id;
    for (id in nodes) {
        const v765 = nodes[id];
        const keys = Object.keys(v765);
        const v766 = keys.length;
        const v767 = v766 === 1;
        const v768 = keys[0];
        const v769 = v768 === '$id';
        const v770 = v767 && v769;
        if (v770) {
            const v771 = logger.debug('pruning node:', id);
            v771;
            const v772 = nodes[id];
            const v773 = delete v772;
            v773;
        }
    }
};
const initContext = (ctx = {}) => {
    const v774 = {
        decrypt: false,
        includes: true,
        prefixes: false,
        prune: false,
        resolve: false
    };
    const v775 = ctx.opts;
    const opts = Object.assign(v774, v775);
    const v776 = ctx.cwd;
    const v777 = v776 || '.';
    const v778 = ctx.file;
    const v779 = v778 || '';
    const v780 = ctx.files;
    const v781 = [];
    const v782 = v780 || v781;
    const v783 = ctx.nodes;
    const v784 = {};
    const v785 = v783 || v784;
    const v786 = ctx.index;
    const v787 = {};
    const v788 = v786 || v787;
    const v789 = {};
    const v790 = Object.assign(v789, BUILTINS);
    const v791 = ctx.tags;
    const v792 = Object.assign(v790, v791);
    const v793 = ctx.defaultTag;
    const v794 = ctx.prefixes;
    const v795 = {};
    const v796 = ctx.prefixes;
    const v797 = Object.assign(v795, v796);
    const v798 = {};
    const v799 = Object.assign(v798, $prefixes);
    const v800 = $prefixes.VOID;
    const v801 = { void: v800 };
    const v802 = Object.assign(v799, v801);
    let v803;
    if (v794) {
        v803 = v797;
    } else {
        v803 = v802;
    }
    const v804 = ctx.logger;
    const v805 = api.NULL_LOGGER;
    const v806 = v804 || v805;
    const v807 = {};
    v807.cwd = v777;
    v807.file = v779;
    v807.files = v782;
    v807.nodes = v785;
    v807.index = v788;
    v807.tags = v792;
    v807.defaultTag = v793;
    v807.prefixes = v803;
    v807.logger = v806;
    v807.opts = opts;
    return v807;
};
const $parseFile = (path$1, ctx) => {
    const $ctx = initContext(ctx);
    const v808 = $ctx.cwd;
    path$1 = path.resolve(v808, path$1);
    $ctx.file = path$1;
    const v809 = $ctx.files;
    const v810 = v809.includes(path$1);
    if (v810) {
        const v811 = $ctx.logger;
        const v812 = v811.warn('file already processed, skipping:', path$1);
        v812;
        return $ctx;
    }
    const v813 = $ctx.files;
    const v814 = v813.push(path$1);
    v814;
    const v815 = $ctx.logger;
    const v816 = v815.debug('loading file:', path$1);
    v816;
    const v817 = fs.readFileSync(path$1);
    const v818 = v817.toString();
    const v819 = parse(v818, $ctx);
    return v819;
};
const parseFile = (path, ctx) => {
    const res = $parseFile(path, ctx);
    const v820 = res.nodes;
    const v821 = res.prefixes;
    const v822 = {};
    v822.nodes = v820;
    v822.prefixes = v821;
    return v822;
};
const parseString = (src, ctx) => {
    const v823 = initContext(ctx);
    const res = parse(src, v823);
    const v824 = res.nodes;
    const v825 = res.prefixes;
    const v826 = {};
    v826.nodes = v824;
    v826.prefixes = v825;
    return v826;
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