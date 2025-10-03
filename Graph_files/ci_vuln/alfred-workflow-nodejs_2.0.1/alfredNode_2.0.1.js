const v249 = require('child_process');
const exec = v249.exec;
const _ = require('underscore');
const utils = require('util');
const events = require('events');
const storage = require('node-persist');
const keychain = require('keychain');
const fuzzy = require('fuzzy');
const applescript = require('node-osascript');
const v296 = function () {
    let _items = [];
    let _name = 'AlfredWfNodeJs';
    const clearItems = function () {
        _items = [];
        const v250 = clearItemsData();
        v250;
    };
    const addItem = function (item) {
        const v251 = saveItemData(item);
        v251;
        const v252 = item.hasSubItems;
        if (v252) {
            const v253 = item.title;
            const v254 = Utils.SUB_ACTION_SEPARATOR;
            item.autocomplete = v253 + v254;
        }
        const v255 = item.feedback();
        const v256 = _items.push(v255);
        v256;
    };
    const feedback = function () {
        const v257 = Storage.get('usage');
        const v258 = {};
        const usage = v257 || v258;
        const v264 = item => {
            const v259 = item;
            const title = v259.title;
            const v260 = usage[title];
            const v261 = usage[title];
            const v262 = 0 - v261;
            let v263;
            if (v260) {
                v263 = v262;
            } else {
                v263 = 0;
            }
            item.count = v263;
        };
        const v265 = _.each(_items, v264);
        v265;
        const sortedItems = _.sortBy(_items, 'count');
        const v268 = item => {
            const v266 = item.count;
            const v267 = delete v266;
            v267;
        };
        const v269 = _.each(sortedItems, v268);
        v269;
        const v270 = { items: sortedItems };
        const ret = JSON.stringify(v270);
        const v271 = console.log(ret);
        v271;
        return ret;
    };
    const v272 = function (name) {
        _name = name;
    };
    const v273 = function () {
        return _name;
    };
    const v280 = function (title, subtitle) {
        const v274 = clearItems();
        v274;
        const v275 = ICONS.INFO;
        const v276 = {
            title,
            subtitle,
            icon: v275
        };
        const v277 = new Item(v276);
        const v278 = addItem(v277);
        v278;
        const v279 = feedback();
        return v279;
    };
    const v287 = function (title, subtitle) {
        const v281 = clearItems();
        v281;
        const v282 = ICONS.WARNING;
        const v283 = {
            title,
            subtitle,
            icon: v282
        };
        const v284 = new Item(v283);
        const v285 = addItem(v284);
        v285;
        const v286 = feedback();
        return v286;
    };
    const v294 = function (title, subtitle) {
        const v288 = clearItems();
        v288;
        const v289 = ICONS.ERROR;
        const v290 = {
            title,
            subtitle,
            icon: v289
        };
        const v291 = new Item(v290);
        const v292 = addItem(v291);
        v292;
        const v293 = feedback();
        return v293;
    };
    const v295 = {};
    v295.setName = v272;
    v295.getName = v273;
    v295.addItem = addItem;
    v295.clearItems = clearItems;
    v295.feedback = feedback;
    v295.info = v280;
    v295.warning = v287;
    v295.error = v294;
    return v295;
};
const Workflow = v296();
const v328 = function () {
    const eventEmitter = new events.EventEmitter();
    const v302 = function (action, handler) {
        const v297 = !action;
        const v298 = !handler;
        const v299 = v297 || v298;
        if (v299) {
            return;
        }
        const v300 = `action-${ action }`;
        const v301 = eventEmitter.on(v300, handler);
        v301;
    };
    const v308 = function (action, handler) {
        const v303 = !action;
        const v304 = !handler;
        const v305 = v303 || v304;
        if (v305) {
            return;
        }
        const v306 = `menuItemSelected-${ action }`;
        const v307 = eventEmitter.on(v306, handler);
        v307;
    };
    const v324 = function (action, query) {
        const v309 = !query;
        const v310 = Utils.SUB_ACTION_SEPARATOR;
        const v311 = query.indexOf(v310);
        const v312 = -1;
        const v313 = v311 === v312;
        const v314 = v309 || v313;
        if (v314) {
            const v315 = `action-${ action }`;
            const v316 = eventEmitter.emit(v315, query);
            v316;
        } else {
            const v317 = Utils.SUB_ACTION_SEPARATOR;
            const tmp = query.split(v317);
            const v318 = tmp[0];
            const selectedItemTitle = v318.trim();
            const v319 = tmp[1];
            query = v319.trim();
            const v320 = saveUsage(query, selectedItemTitle);
            v320;
            const v321 = `menuItemSelected-${ action }`;
            const v322 = getItemData(selectedItemTitle);
            const v323 = eventEmitter.emit(v321, query, selectedItemTitle, v322);
            v323;
        }
    };
    const v326 = function () {
        const v325 = eventEmitter.removeAllListeners();
        v325;
    };
    const v327 = {};
    v327.onAction = v302;
    v327.onMenuItemSelected = v308;
    v327.handle = v324;
    v327.clear = v326;
    return v327;
};
const ActionHandler = v328();
const Item = function (data) {
    data = _removeEmptyProperties(data);
    let key;
    for (key in data) {
        const v329 = data[key];
        this[key] = v329;
    }
};
const v330 = Item.prototype;
const v348 = function () {
    const v331 = this.arg;
    const v332 = _updateArg(v331);
    this.arg = v332;
    const v333 = this.uid;
    const v334 = this.arg;
    const v335 = this.valid;
    const v336 = v335 === true;
    let v337;
    if (v336) {
        v337 = 'YES';
    } else {
        v337 = 'NO';
    }
    const v338 = this.autocomplete;
    const v339 = this.title;
    const v340 = this.subtitle;
    const v341 = this.type;
    const v342 = this.icon;
    const v343 = {};
    v343.path = v342;
    const v344 = this.quicklookurl;
    const v345 = this.text;
    const v346 = this.mods;
    const v347 = {
        uid: v333,
        arg: v334,
        valid: v337,
        autocomplete: v338,
        title: v339,
        subtitle: v340,
        type: v341,
        icon: v343,
        quicklookurl: v344,
        text: v345,
        mods: v346
    };
    const item = _removeEmptyProperties(v347);
    return item;
};
v330.feedback = v348;
const v375 = function () {
    const v349 = storage.initSync();
    v349;
    const v355 = function (key, value, ttl) {
        const v350 = new Date();
        const v351 = v350.getTime();
        const v352 = -1;
        const v353 = ttl || v352;
        const obj = {};
        obj.data = value;
        obj.timestamp = v351;
        obj.ttl = v353;
        const v354 = storage.setItemSync(key, obj);
        v354;
    };
    const v367 = function (key) {
        const obj = storage.getItemSync(key);
        if (obj) {
            const v356 = obj;
            const ttl = v356.ttl;
            const v357 = obj;
            const timestamp = v357.timestamp;
            const v358 = -1;
            const v359 = ttl === v358;
            if (v359) {
                const v360 = obj.data;
                return v360;
            }
            const v361 = new Date();
            const now = v361.getTime();
            const v362 = now - timestamp;
            const v363 = v362 < ttl;
            if (v363) {
                const v364 = obj.data;
                return v364;
            }
            const v365 = () => {
            };
            const v366 = storage.removeItemSync(key, v365);
            v366;
        }
        return undefined;
    };
    const v371 = function (key) {
        const v368 = storage.getItem(key);
        if (v368) {
            const v369 = () => {
            };
            const v370 = storage.removeItemSync(key, v369);
            v370;
        }
    };
    const v373 = function () {
        const v372 = storage.clearSync();
        v372;
    };
    const v374 = {};
    v374.set = v355;
    v374.get = v367;
    v374.remove = v371;
    v374.clear = v373;
    return v374;
};
const Storage = v375();
const v398 = function () {
    const v379 = function (key, value) {
        const v376 = Storage.get('settings');
        const v377 = {};
        const settings = v376 || v377;
        settings[key] = value;
        const v378 = Storage.set('settings', settings);
        v378;
    };
    const v381 = function (key) {
        const settings = Storage.get('settings');
        if (settings) {
            const v380 = settings[key];
            return v380;
        }
        return undefined;
    };
    const v384 = function (key) {
        const settings = Storage.get('settings');
        if (settings) {
            const v382 = settings[key];
            const v383 = delete v382;
            v383;
        }
    };
    const v386 = function () {
        const v385 = Storage.remove('settings');
        v385;
    };
    const v392 = function (username, password) {
        const v387 = Workflow.getName();
        const v388 = {
            account: username,
            service: v387,
            password
        };
        const v390 = err => {
            const v389 = console.log(err);
            v389;
        };
        const v391 = keychain.setPassword(v388, v390);
        v391;
    };
    const v396 = function (username, callback) {
        const v393 = Workflow.getName();
        const v394 = {
            account: username,
            service: v393
        };
        const v395 = keychain.getPassword(v394, callback);
        v395;
    };
    const v397 = {};
    v397.set = v379;
    v397.get = v381;
    v397.remove = v384;
    v397.clear = v386;
    v397.setPassword = v392;
    v397.getPassword = v396;
    return v397;
};
const Settings = v398();
const v455 = function () {
    const v404 = function (query, list, keyBuilder) {
        const v399 = !query;
        if (v399) {
            return list;
        }
        const options = {};
        options.extract = keyBuilder;
        const v400 = fuzzy.filter(query, list, options);
        const v402 = item => {
            const v401 = item.original;
            return v401;
        };
        const v403 = v400.map(v402);
        return v403;
    };
    const v406 = function (script, handler) {
        const v405 = applescript.execute(script, handler);
        v405;
    };
    const v409 = function (path, varibale, handler) {
        const v407 = applescript.executeFile;
        const v408 = v407.apply(this, arguments);
        v408;
    };
    const v410 = {};
    v410.execute = v406;
    v410.executeFile = v409;
    const v412 = function (data) {
        const ret = _updateArg(data);
        const v411 = console.log(ret);
        v411;
        return ret;
    };
    const v421 = function (key, value) {
        const v413 = key !== undefined;
        const v414 = value !== undefined;
        const v415 = v413 && v414;
        if (v415) {
            const v416 = typeof value;
            const v417 = v416 === 'object';
            if (v417) {
                const v419 = JSON.stringify(value);
                v418.key = v419;
            } else {
                const v420 = process.env;
                v420.key = value;
            }
        }
    };
    const v425 = function (key) {
        const v422 = process.env;
        const v423 = v422[key];
        const v424 = _toObjectIfJSONString(v423);
        return v424;
    };
    const v426 = {};
    v426.set = v421;
    v426.get = v425;
    const v437 = function (key, value, callback) {
        const v427 = key !== undefined;
        const v428 = value !== undefined;
        const v429 = v427 && v428;
        if (v429) {
            const setCommand = utils.format('/usr/libexec/PlistBuddy -c "Set :variables:%s "%s"" info.plist', key, value);
            const v435 = err => {
                if (err) {
                    const addCommand = utils.format('/usr/libexec/PlistBuddy -c "Add :variables:%s string "%s"" info.plist', key, value);
                    const v432 = e => {
                        if (callback) {
                            const v430 = _toUndefinedIfNull(e);
                            const v431 = callback(v430);
                            v431;
                        }
                    };
                    const v433 = exec(addCommand, v432);
                    v433;
                } else {
                    if (callback) {
                        const v434 = callback(undefined);
                        v434;
                    }
                }
            };
            const v436 = exec(setCommand, v435);
            v436;
        }
    };
    const v442 = function (key, callback) {
        const getCommand = utils.format('/usr/libexec/PlistBuddy -c "Print :variables:%s" info.plist', key);
        const v440 = (err, stdout) => {
            if (err) {
                const v438 = callback(err);
                v438;
            } else {
                const value = stdout.trim();
                const v439 = callback(undefined, value);
                v439;
            }
        };
        const v441 = exec(getCommand, v440);
        v441;
    };
    const v447 = function (key, callback) {
        const getCommand = utils.format('/usr/libexec/PlistBuddy -c "Delete :variables:%s" info.plist', key);
        const v445 = err => {
            if (callback) {
                const v443 = _toUndefinedIfNull(err);
                const v444 = callback(v443);
                v444;
            }
        };
        const v446 = exec(getCommand, v445);
        v446;
    };
    const v452 = function (callback) {
        const clearCommand = '/usr/libexec/PlistBuddy -c "Delete :variables" info.plist';
        const v450 = err => {
            if (callback) {
                const v448 = _toUndefinedIfNull(err);
                const v449 = callback(v448);
                v449;
            }
        };
        const v451 = exec(clearCommand, v450);
        v451;
    };
    const v453 = {};
    v453.set = v437;
    v453.get = v442;
    v453.remove = v447;
    v453.clear = v452;
    const v454 = {};
    v454.SUB_ACTION_SEPARATOR = ' $>';
    v454.filter = v404;
    v454.applescript = v410;
    v454.generateVars = v412;
    v454.envVars = v426;
    v454.wfVars = v453;
    return v454;
};
const Utils = v455();
const v457 = function () {
    const ICON_ROOT = '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/';
    const v456 = {};
    v456.ACCOUNT = `${ ICON_ROOT }Accounts.icns`;
    v456.BURN = `${ ICON_ROOT }BurningIcon.icns`;
    v456.CLOCK = `${ ICON_ROOT }Clock.icns`;
    v456.COLOR = `${ ICON_ROOT }ProfileBackgroundColor.icns`;
    v456.EJECT = `${ ICON_ROOT }EjectMediaIcon.icns`;
    v456.ERROR = `${ ICON_ROOT }AlertStopIcon.icns`;
    v456.FAVORITE = `${ ICON_ROOT }ToolbarFavoritesIcon.icns`;
    v456.GROUP = `${ ICON_ROOT }GroupIcon.icns`;
    v456.HELP = `${ ICON_ROOT }HelpIcon.icns`;
    v456.HOME = `${ ICON_ROOT }HomeFolderIcon.icns`;
    v456.INFO = `${ ICON_ROOT }ToolbarInfo.icns`;
    v456.NETWORK = `${ ICON_ROOT }GenericNetworkIcon.icns`;
    v456.NOTE = `${ ICON_ROOT }AlertNoteIcon.icns`;
    v456.SETTINGS = `${ ICON_ROOT }ToolbarAdvanced.icns`;
    v456.SWIRL = `${ ICON_ROOT }ErasingIcon.icns`;
    v456.SWITCH = `${ ICON_ROOT }General.icns`;
    v456.SYNC = `${ ICON_ROOT }Sync.icns`;
    v456.TRASH = `${ ICON_ROOT }TrashIcon.icns`;
    v456.USER = `${ ICON_ROOT }UserIcon.icns`;
    v456.WARNING = `${ ICON_ROOT }AlertCautionBadgeIcon.icns`;
    v456.WEB = `${ ICON_ROOT }BookmarkIcon.icns`;
    return v456;
};
const ICONS = v457();
const _removeEmptyProperties = function (data) {
    let key;
    for (key in data) {
        let value = data[key];
        const v458 = typeof value;
        const v459 = v458 === 'object';
        if (v459) {
            value = _removeEmptyProperties(value);
            const v460 = Object.keys(value);
            const v461 = v460.length;
            const v462 = !v461;
            if (v462) {
                value = null;
            }
        }
        const v463 = value === undefined;
        const v464 = value === null;
        const v465 = v463 || v464;
        if (v465) {
            const v466 = data[key];
            const v467 = delete v466;
            v467;
        }
    }
    return data;
};
const saveItemData = function (item) {
    const v468 = item.data;
    if (v468) {
        const v469 = Storage.get('wfData');
        const v470 = {};
        const wfData = v469 || v470;
        const v471 = item.title;
        const v472 = item.data;
        wfData[v471] = v472;
        const v473 = Storage.set('wfData', wfData);
        v473;
    }
};
const clearItemsData = function () {
    const v474 = Storage.remove('wfData');
    v474;
};
const getItemData = function (itemTitle) {
    const v475 = typeof itemTitle;
    const v476 = v475 === 'string';
    const v477 = itemTitle.normalize();
    if (v476) {
        itemTitle = v477;
    } else {
        itemTitle = itemTitle;
    }
    const wfData = Storage.get('wfData');
    const v478 = wfData[itemTitle];
    let v479;
    if (wfData) {
        v479 = v478;
    } else {
        v479 = undefined;
    }
    return v479;
};
const saveUsage = function (query, itemTitle) {
    const v480 = !query;
    if (v480) {
        const v481 = Storage.get('usage');
        const v482 = {};
        const usage = v481 || v482;
        const v483 = usage[itemTitle];
        const count = v483 || 0;
        usage[itemTitle] = count + 1;
        const v484 = Storage.set('usage', usage);
        v484;
    }
};
const _updateArg = function (data) {
    const v485 = typeof data;
    const v486 = v485 === 'object';
    if (v486) {
        const _arg = data.arg;
        const _variables = data.variables;
        const v487 = {};
        v487.arg = _arg;
        v487.variables = _variables;
        const v488 = { alfredworkflow: v487 };
        const v489 = JSON.stringify(v488);
        return v489;
    }
    return data;
};
const _toUndefinedIfNull = function (x) {
    const v490 = x === null;
    let v491;
    if (v490) {
        v491 = undefined;
    } else {
        v491 = x;
    }
    return v491;
};
const _toObjectIfJSONString = function (str) {
    try {
        str = JSON.parse(str);
    } catch (err) {
    }
    return str;
};
const v495 = function () {
    const v492 = process.argv;
    const action = v492[2];
    const v493 = process.argv;
    const query = v493[3];
    const v494 = ActionHandler.handle(action, query);
    v494;
};
const v496 = {};
v496.storage = Storage;
v496.workflow = Workflow;
v496.actionHandler = ActionHandler;
v496.settings = Settings;
v496.Item = Item;
v496.utils = Utils;
v496.ICONS = ICONS;
v496.run = v495;
module.exports = v496;