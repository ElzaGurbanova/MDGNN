function onHashChange() {
  // sanitize hash to a safe, relative path
  const raw = location.hash.slice(1);
  let hashSafe;

  try {
    hashSafe = sanitizeHash(raw);
  } catch {
    hashSafe = COR.defaultFile;
    location.hash = hashSafe;
    return;
  }

  COR.hash = hash = hashSafe;

  //console.log("hash", hash, "url", COR.pathContent);

  if (/\.(md|txt|ini)$/i.test(hash)) {
    if (hash.startsWith('@@')) {
      COR.hash = hash.slice(2);

      console.log("notesy", COR.hash);

      divMainContent.innerHTML =
        `<iframe id=ifr class="iframe-resize" src="${COR.pathApps}./ggpf/github-get-put-file.html"><iframe>`;
    } else {
      console.log("getHTMLfromURL", hash);
      getHTMLfromURL(hash);
    }
  } else if (/\.(jpg|jpeg|png|gif|svg|ico|bmp|tiff|webp)$/i.test(hash)) {
    console.log("img", hash);
    divMainContent.innerHTML = `<img src="${COR.pathContent}${hash}" ></img>`;
  } else if (hash === "LICENSE") {
    console.log("getHTMLfromURL", hash);
    getHTMLfromURL(hash);
  } else {
    console.log("else", COR.urlPathContent + hash);
    divMainContent.innerHTML = `<iframe id=ifr class="iframe-resize" src="${COR.urlPathContent}${hash}" ></iframe>`;
  }

  setFileVisible();
}

function getHTMLfromURL(hash = COR.hash) {
  //console.log("hash", COR.pathContent + COR.hash);

  showdown.setFlavor("github");
  const options = { openLinksInNewWindow: false, excludeTrailingPunctuationFromURLs: true, ghMention: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true };

  const xhr = new XMLHttpRequest();
  xhr.open("get", COR.pathContent + hash, true);
  xhr.onload = () => {
    let txt = xhr.responseText;
    txt = txt.replace(/<!--@@@/g, "").replace(/@@@-->/g, "");
    divMainContent.innerHTML = new showdown.Converter(options).makeHtml(txt);
    window.scrollTo(0, 0);
  };
  xhr.onerror = () => {
    const safeHashForHtml = escapeHtml(hash);
    divMainContent.innerHTML = `
      <div style="padding: 20px; color: #d73a49; background: #ffeaea; border: 1px solid #d73a49; border-radius: 4px;">
        <h3>Network Error</h3>
        <p>Failed to load file: ${safeHashForHtml}</p>
        <p>Please check your internet connection and try again.</p>
        <button onclick="onHashChange()" style="margin-top: 10px; padding: 5px 10px;">Retry</button>
      </div>
    `;
  };
  xhr.send(null);

  let title = hash.split("/").pop()
    .split("-")
    .filter(x => x.length > 0)
    //.map((x) => (x.charAt(0).toUpperCase() + x.slice(1)))
    .join(" ");
  document.title = `${COR.menuTitle}: ` + title;
}

/* ---------- helpers: sanitize & escape ---------- */

/**
 * Ensures `value` is a safe, relative path for content fetching:
 * - decodes percent-encoding once
 * - normalizes backslashes to '/'
 * - disallows leading slash, empty segments, '.' or '..'
 * - allows only [A-Za-z0-9._-/]
 */
function sanitizeHash(value) {
  const raw = String(value || '');
  let dec;
  try {
    dec = decodeURIComponent(raw);
  } catch {
    // if decoding fails, use raw but still validate
    dec = raw;
  }

  // normalize and trim
  let v = dec.replace(/\\/g, '/').trim();

  // default / empty
  if (!v) throw new Error('empty');

  // must be relative (no leading slash) and simple characters only
  if (v.startsWith('/')) throw new Error('absolute path not allowed');
  if (!/^[A-Za-z0-9._\-\/]+$/.test(v)) throw new Error('invalid chars');

  const parts = v.split('/');
  // no empty segments (//), no dot segments
  if (parts.some(seg => seg === '' || seg === '.' || seg === '..')) {
    throw new Error('dot segments not allowed');
  }

  return v;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

