/**
 * __.js
 *
 * Utility functions.
 */
const fs = require('fs');
const { execFileSync } = require('child_process');
const shellescape = require('shell-escape');

/**
 * Blinks the screen so we know the positioning is done.
 *
 * @param blinksLeft The number of blinks remaining.
 * @param exit Whether or not we should exit the process once we're done blinking.
 */
const blink = (blinksLeft, exit) => {
  if (blinksLeft >= 0) {
    // xcalib -invert -alter
    execFileSync('xcalib', ['-invert', '-alter'], { stdio: 'ignore' });
    wait(.125);
    blink(blinksLeft - 1, exit);
  } else {
    // try to restore redshift if present
    wait(.125);
    try {
      execFileSync('redshift', ['-o'], { stdio: 'ignore' });
    } catch (_) {
      // ignore if redshift not installed
    }
    if (exit) process.exit();
  }
};

/**
 * Creates an artificial sleep.
 *
 * @param s The time to sleep in seconds
 */
const wait = s => {
  const start = Date.now();
  while (Date.now() - start < s * 1000) { /* busy wait */ }
};

// Accept typical X11 window IDs: hex (e.g. 0x3a00007) or decimal
function isSafeWindowId(id) {
  return typeof id === 'string' && /^[0-9A-Fa-fx]+$/.test(id);
}

/**
 * Gets the window geometry & class names of all open windows.
 *
 * @param windowId The ID of the window.
 * @returns Object Containing the prop geo (X, Y, Width, & Height of the window) and the prop wmClass (the WM_CLASS property of the window).
 */
const getWinInfo = windowId => {
  let wininfo = {};

  if (!isSafeWindowId(windowId)) {
    throw new Error('Invalid window id');
  }

  // Activate the window by ID: wmctrl -ia <id>
  execFileSync('wmctrl', ['-ia', windowId]);
  wait(.125);

  // Get active window id: xprop -root _NET_ACTIVE_WINDOW
  const activeOut = execFileSync('xprop', ['-root', '_NET_ACTIVE_WINDOW'], { encoding: 'utf8' });
  // Example: _NET_ACTIVE_WINDOW(WINDOW): window id # 0x3a00007
  const idMatch = activeOut.match(/(#\s*)?(0x[0-9a-fA-F]+|\d+)/);
  const activeId = idMatch ? idMatch[2] || idMatch[1] : null;

  // WM_CLASS: xprop -id <id> WM_CLASS
  let wmClass = '';
  if (activeId && isSafeWindowId(activeId)) {
    const wmOut = execFileSync('xprop', ['-id', activeId, 'WM_CLASS'], { encoding: 'utf8' });
    // WM_CLASS(STRING) = "instance", "Class"
    const parts = wmOut.split('"').filter(Boolean); // ["WM_CLASS(STRING) = ", instance, ", ", Class, ...]
    if (parts.length >= 4) {
      wmClass = `${parts[1]}.${parts[3]}`;
    }
  }

  // Standard window information: xdotool getactivewindow -> xwininfo -id <id>
  const xdotoolId = execFileSync('xdotool', ['getactivewindow'], { encoding: 'utf8' }).trim();
  const xwininfoOut = execFileSync('xwininfo', ['-id', xdotoolId], { encoding: 'utf8' });

  const lines = xwininfoOut.split('\n');
  const map = {};
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      map[key] = val;
    }
  }

  // Window decoration extents: xprop _NET_FRAME_EXTENTS -id <windowId>
  const extRaw = execFileSync('xprop', ['_NET_FRAME_EXTENTS', '-id', windowId], { encoding: 'utf8' });
  // Example: _NET_FRAME_EXTENTS(CARDINAL) = 1, 1, 28, 1
  const nums = (extRaw.split('=').pop() || '').replace(/\s/g, '').split(',');
  const extents = {
    lb: parseInt(isNaN(nums[0]) ? '0' : nums[0], 10) || 0,
    rb: parseInt(isNaN(nums[1]) ? '0' : nums[1], 10) || 0,
    tb: parseInt(isNaN(nums[2]) ? '0' : nums[2], 10) || 0,
    bb: parseInt(isNaN(nums[3]) ? '0' : nums[3], 10) || 0,
  };

  // Geometry
  const x = (parseInt(map['Absolute upper-left X'], 10) - extents.lb) + '';
  const y = (parseInt(map['Absolute upper-left Y'], 10) - extents.tb) + '';
  const w = (parseInt(map['Width'], 10) + extents.lb + extents.rb) + '';
  const h = (parseInt(map['Height'], 10) + extents.bb) + '';

  wininfo = {
    geo: { x, y, w, h },
    wmClass
  };

  return wininfo;
};

/**
 * Gets the number of connected displays.
 *
 * @returns string The number of connected displays.
 */
const getScreens = () => {
  const xr = execFileSync('xrandr', ['-d', ':0', '-q'], { encoding: 'utf8' });
  const count = xr.split('\n').filter(l => / connected\b/.test(l)).length;
  return String(count);
};

/**
 * Parses a JSON file into a JSON object.
 *
 * @param file The file to be read
 * @returns JSON The contents of the file as a JSON object.
 */
const readJsonFile = (file) => {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(file).toString());
    if (data === '' || !data) data = {};
  } catch (e) { }
  return data;
};

module.exports = {
  blink,
  wait,
  getWinInfo,
  getScreens,
  readJsonFile,
  shellescape
};

