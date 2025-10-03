'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const proc = require('child_process')
const fs = require('fs')

const {rootDir} = require('./util')

const timeout = parseInt(process.env.TIMEOUT) || 100 * 1000
if (Number.isNaN(timeout)) {
  console.error('TIMEOUT env var must be a number.')
  process.exit(1)
}

const executable = path.join(__dirname, '../demo-worker.js') // todo

const worker = (id, payload, cb) => {
  const cwd = path.join(rootDir, id)
  const nodes = path.join(cwd, 'nodes.ndjson')
  const edges = path.join(cwd, 'edges.ndjson')
  const stdoutPath = path.join(cwd, 'export')
  const stderrPath = path.join(cwd, 'log')

  mkdirp(cwd, (err) => {
    if (err) return cb(err)

    const outStream = fs.createWriteStream(stdoutPath)
    const errStream = fs.createWriteStream(stderrPath)

    const child = proc.spawn(executable, [nodes, edges], {
      cwd,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false
    })

    let killed = false
    const killer = setTimeout(() => {
      killed = true
      child.kill('SIGTERM')
      setTimeout(() => child.kill('SIGKILL'), 2000)
    }, timeout)

    child.stdout.pipe(outStream)
    child.stderr.pipe(errStream)

    child.on('error', (e) => {
      clearTimeout(killer)
      outStream.end()
      errStream.end()
      cb(e)
    })

    child.on('close', (code, signal) => {
      clearTimeout(killer)
      outStream.end()
      errStream.end()
      if (killed) return cb(new Error('Process timed out'))
      if (code !== 0) return cb(new Error('Worker exited with code ' + code))
      cb(null)
    })
  })
}

module.exports = worker

