// 2) Safe Docker logs tail with whitelisted container name & numeric lines, using execSync
const { execSync } = require('child_process');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function dockerTailLogs(containerName, lines = 100) {
  // Container names: letters, digits, ., -, _ (Docker default charset)
  if (!/^[a-zA-Z0-9._-]+$/.test(containerName)) throw new Error('Invalid container name');
  if (!Number.isInteger(lines) || lines < 1 || lines > 10000) throw new Error('Invalid lines');

  const cmd = `docker logs --tail ${lines} -f ${shq(containerName)}`;
  // Caller should handle the stream; here we show once without -f to avoid hanging:
  const onceCmd = `docker logs --tail ${lines} ${shq(containerName)}`;
  const out = execSync(onceCmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return out;
}

// Example:
// console.log(dockerTailLogs('my_api', 200));

