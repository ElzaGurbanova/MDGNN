import fs from 'fs-extra'
import path from 'path'
import { syncUsers } from '../lib/user.js'
import { groupTemplate, loadGroup, loadGroups, pingGroups, saveGroup, syncGroup } from '../lib/group.js'

function safeDecode(s) {
  try { return decodeURIComponent(String(s)); } catch { return String(s); }
}

// Allow only simple, filename-safe IDs (adjust as needed)
function isValidGroupId(id) {
  if (typeof id !== 'string') return false;
  const decoded = safeDecode(id).trim();
  if (!decoded || decoded.length > 128) return false;
  if (decoded.includes('\0')) return false;               // no NULs
  if (decoded.includes('/') || decoded.includes('\\')) return false; // no path separators
  if (decoded.includes('..')) return false;               // no dot-dot
  return /^[A-Za-z0-9_-]+$/.test(decoded);                // allow-list
}

export default function(app) {

  app.get('/api/groups', async function(req, res) {
    const { groupsData, groupNames } = await loadGroups()
    await pingGroups(groupNames)
    res.end(JSON.stringify(groupsData))
  })

  app.get('/api/groups/public', async function(req, res) {
    const { groupsData, groupNames } = await loadGroups(true)
    await pingGroups(groupNames)
    res.end(JSON.stringify(groupsData))
  })

  app.get('/api/groups/template', async function(req, res) {
    res.end(JSON.stringify(groupTemplate()))
  })

  app.get('/api/groups/:groupid', async function(req, res) {
    const groupId = safeDecode(req.params.groupid)

    if (!isValidGroupId(groupId)) {
      res.status(400).end(JSON.stringify({ error: 'invalid group id' }))
      return
    }

    const groupData = await loadGroup(groupId)
    if (!groupData) {
      res.end(JSON.stringify(groupTemplate(groupId)))
      return
    }

    res.end(JSON.stringify(groupData))
  })

  app.post('/api/groups/:groupid', async function(req, res) {
    const groupIdParam = safeDecode(req.params.groupid)

    if (!isValidGroupId(groupIdParam)) {
      res.status(400).end(JSON.stringify({ error: 'invalid group id' }))
      return
    }

    // TODO: Schema validation
    const { data, groupId } = await saveGroup(groupIdParam, req.body)
    await syncGroup(groupId, data)
    await syncUsers()

    const group = await loadGroup(groupId)
    group._name = groupIdParam
    group._newName = groupId
    await pingGroups([groupId])
    res.end(JSON.stringify(group))
  })

  app.get('/api/groups/:groupid/delete', async function(req, res) {
    const groupId = safeDecode(req.params.groupid)

    if (!isValidGroupId(groupId)) {
      res.status(400).end(JSON.stringify({ error: 'invalid group id' }))
      return
    }

    // Resolve the groups directory canonically to prevent symlink escapes
    const groupsRoot = await fs.realpath(path.resolve(app.config.sfu.path.groups))
    const candidate = path.join(groupsRoot, `${groupId}.json`)
    const rel = path.relative(groupsRoot, candidate)
    const inside = rel && !rel.startsWith('..') && !path.isAbsolute(rel)

    if (!inside) {
      res.status(400).end(JSON.stringify({ error: 'invalid path' }))
      return
    }

    app.logger.info(`removing group file ${candidate}`)
    await fs.remove(candidate)

    const { groupNames } = await loadGroups()
    await syncUsers()
    await pingGroups([groupId])
    res.end(JSON.stringify(groupNames))
  })

}

