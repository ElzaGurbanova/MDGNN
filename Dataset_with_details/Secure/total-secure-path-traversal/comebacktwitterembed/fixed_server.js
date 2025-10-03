const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();
const port = 3088;
const tempDir = path.join(__dirname, 'temp');

// Ensure temp dir exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Canonical base for all saved content
const SAVES_ROOT = fs.realpathSync(path.resolve('saves'));

function isInside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function antiDirectoryTraversalAttack(userInput) {
  const invalidPathPattern = /(\.\.(\/|\\|$))/;
  const raw = String(userInput || '');

  // Quick reject on NULs or obvious traversal
  if (raw.includes('\0') || invalidPathPattern.test(raw)) {
    throw new Error('不正なパスが検出されました。');
  }

  // Build and resolve under the canonical SAVES_ROOT
  const joinedPath = path.join(SAVES_ROOT, raw);
  let realPath;
  try {
    realPath = fs.realpathSync(joinedPath); // follows symlinks
  } catch (err) {
    throw new Error('不正なパスが検出されました。');
  }

  // Enforce containment (also prevents prefix tricks)
  if (!isInside(SAVES_ROOT, realPath)) {
    throw new Error('不正なパスが検出されました。');
  }
  return realPath;
}

// Safely add a single file to the archive if it's still under baseDir
function addFileIfSafe(archive, baseDir, absPath, nameInZip) {
  try {
    const real = fs.realpathSync(absPath);
    if (isInside(baseDir, real) && fs.existsSync(real) && fs.statSync(real).isFile()) {
      archive.file(real, { name: nameInZip });
      return true;
    }
  } catch (_) {}
  return false;
}

// GET raw data file
app.get('/data/:userid/:tweetID/:filename', (req, res) => {
  const { userid, tweetID, filename } = req.params;
  let filePath = path.join(userid, tweetID, filename);

  try {
    filePath = antiDirectoryTraversalAttack(filePath);
  } catch (e) {
    return res.status(418).send('File not found');
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(418).send('File not found');
    } else {
      res.sendFile(filePath);
    }
  });
});

// Download all files for a tweet as a zip
app.get('/download/:userid/:tweetID', (req, res) => {
  const { userid, tweetID } = req.params;
  let dirPath = path.join(userid, tweetID);

  try {
    dirPath = antiDirectoryTraversalAttack(dirPath);
  } catch (e) {
    return res.status(418).send('File not found');
  }

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!files || files.length === 0) {
      res.status(418).send('No files to download');
      return;
    }

    const zipName = `${userid}_${tweetID}_files.zip`;
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', () => {
      res.status(500).send('Error creating zip file');
    });

    res.attachment(zipName);
    archive.pipe(res);

    files.forEach((file) => {
      const abs = path.join(dirPath, file);
      try {
        const st = fs.lstatSync(abs); // lstat to detect symlinks
        if (st.isDirectory()) {
          // Add only files inside this subdir; skip symlinks that escape
          const files2 = fs.readdirSync(abs);
          files2.forEach((file2) => {
            const abs2 = path.join(abs, file2);
            addFileIfSafe(archive, dirPath, abs2, `${file}/${file2}`);
          });
        } else {
          addFileIfSafe(archive, dirPath, abs, file);
        }
      } catch (_) {
        /* skip problematic entries */
      }
    });

    archive.finalize();
  });
});

// Download all files for a user as a zip
app.get('/download/:userid', (req, res) => {
  const { userid } = req.params;
  let dirPath;
  try {
    dirPath = antiDirectoryTraversalAttack(userid);
  } catch (e) {
    return res.status(418).send('File not found');
  }

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!files || files.length === 0) {
      res.status(418).send('No files to download');
      return;
    }

    const zipName = `${userid}_files.zip`;
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', () => {
      res.status(500).send('Error creating zip file');
      return;
    });

    res.attachment(zipName);
    archive.pipe(res);

    files.forEach((file) => {
      const abs = path.join(dirPath, file);
      try {
        const st = fs.lstatSync(abs);
        if (st.isDirectory()) {
          const files2 = fs.readdirSync(abs);
          files2.forEach((file2) => {
            const abs2 = path.join(abs, file2);
            addFileIfSafe(archive, dirPath, abs2, `${file}/${file2}`);
          });
        } else {
          addFileIfSafe(archive, dirPath, abs, file);
        }
      } catch (_) {
        /* skip problematic entries */
      }
    });

    archive.finalize();
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

