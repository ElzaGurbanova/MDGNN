import express from 'express'
import mime from 'mime-types'
import path from 'path'
import fs from 'fs/promises'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = express.Router()

router.get('/download/:filename', requireAuth, requireAdmin, async (req, res) => {
  const filename = req.params.filename

  // 🛡️ Prevent path traversal via name
  if (!/^[a-zA-Z0-9_\-.]+$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' })
  }

  // Resolve against a fixed base directory
  const baseDir = path.resolve('uploads')
  const targetPath = path.resolve(baseDir, filename)

  try {
    // Ensure the path exists
    await fs.access(targetPath)

    // Reject symlinks
    const lst = await fs.lstat(targetPath)
    if (lst.isSymbolicLink()) {
      return res.status(400).json({ error: 'Invalid file (symlink not allowed)' })
    }

    // Enforce containment after following any filesystem indirections
    const realBase = await fs.realpath(baseDir).catch(() => baseDir)
    const realTarget = await fs.realpath(targetPath)
    const rel = path.relative(realBase, realTarget)
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return res.status(400).json({ error: 'Invalid file path' })
    }

    // Detect file type
    const ext = path.extname(filename).toLowerCase()
    const mimeType = mime.lookup(ext) || 'application/octet-stream'

    // Set Content-Disposition
    if (['.jpg', '.jpeg', '.png', '.pdf'].includes(ext)) {
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    }
    res.setHeader('Content-Type', mimeType)
    res.setHeader('X-Content-Type-Options', 'nosniff')

    // Serve the canonical file path
    res.sendFile(realTarget)
  } catch (err) {
    console.error('[File Download] Error:', err)
    res.status(404).json({ error: 'File not found or access denied.' })
  }
})

export default router

