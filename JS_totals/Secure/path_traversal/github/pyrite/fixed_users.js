import { loadUser, loadUsers, saveUser, saveUsers, syncUsers, userTemplate } from '../lib/user.js';

function safeDecode(s) {
  try { return decodeURIComponent(String(s)); } catch { return String(s); }
}

// Allow only simple IDs: letters, numbers, underscore, hyphen (adjust as needed)
function isValidUserId(id) {
  if (typeof id !== 'string') return false;
  const decoded = safeDecode(id);
  if (!decoded || decoded.length > 128) return false;
  if (decoded.includes('\0')) return false;                 // no NUL bytes
  if (decoded.includes('/') || decoded.includes('\\')) return false; // no path separators
  if (decoded.includes('..')) return false;                 // no dot-dot segments
  return /^[A-Za-z0-9_-]+$/.test(decoded);                  // allowlist
}

export default function (app) {

  app.get('/api/users', async function (req, res) {
    const users = await loadUsers();
    res.end(JSON.stringify(users));
  });

  app.get('/api/users/template', async function (req, res) {
    res.end(JSON.stringify(userTemplate()));
  });

  app.get('/api/users/:userid', async function (req, res) {
    const userId = safeDecode(req.params.userid);

    if (!isValidUserId(userId)) {
      res.status(400).end(JSON.stringify({ error: 'invalid user id' }));
      return;
    }

    const users = await loadUsers();
    const user = users.find((i) => i.id === userId);

    if (!user) {
      res.status(404).send({ error: 'user not found' });
      return;
    }
    res.end(JSON.stringify(user));
  });

  app.post('/api/users/:userid', async function (req, res) {
    const userId = safeDecode(req.params.userid);

    if (!isValidUserId(userId)) {
      res.status(400).end(JSON.stringify({ error: 'invalid user id' }));
      return;
    }

    // TODO: Schema validation
    const userData = req.body;
    await saveUser(userId, userData);
    await syncUsers();
    const user = await loadUser(userId);
    res.end(JSON.stringify(user));
  });

  app.get('/api/users/:userid/delete', async function (req, res) {
    const userId = safeDecode(req.params.userid);

    if (!isValidUserId(userId)) {
      res.status(400).end(JSON.stringify({ error: 'invalid user id' }));
      return;
    }

    const users = await loadUsers();
    for (let [index, user] of users.entries()) {
      if (user.id === userId) {
        users.splice(index, 1);
      }
    }

    await saveUsers(users);
    await syncUsers();

    res.end(JSON.stringify({ status: 'ok' }));
  });

}

