const Transform = require('stream').Transform
const child_process = require('child_process')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const isArray = require('lodash').isArray
const isBuffer = require('lodash').isBuffer

function splitArgs(str) {
  if (!str) return []
  const out = []
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  let m
  while ((m = re.exec(str))) out.push(m[1] || m[2] || m[3])
  return out
}

function SerialStream(options) {
  if (!(this instanceof SerialStream)) {
    return new SerialStream(options)
  }

  Transform.call(this, options)

  this.reconnect = options.reconnect || true
  this.reconnectDelay = 1000
  this.serial = null
  this.options = options
  this.maxPendingWrites = options.maxPendingWrites || 5
  this.start()
  this.isFirstError = true

  const createDebug = options.createDebug || require('debug')
  this.debug = createDebug('signalk:streams:serialport')
}

require('util').inherits(SerialStream, Transform)

SerialStream.prototype.start = function () {
  const that = this

  if (this.serial !== null) {
    this.serial.unpipe(this)
    this.serial.removeAllListeners()
    this.serial = null
  }

  if (this.reconnect === false) {
    return
  }

  if (process.env.PRESERIALCOMMAND) {
    const parts = splitArgs(process.env.PRESERIALCOMMAND)
    if (parts.length > 0) {
      const cmd = parts[0]
      const args = parts.slice(1).concat([String(this.options.device)])
      // no shell => no injection via pipes/redirection
      child_process.execFileSync(cmd, args, { stdio: 'ignore' })
    }
  }

  this.serial = new SerialPort({
    path: this.options.device,
    baudRate: this.options.baudrate
  })

  this.serial.on(
    'open',
    function () {
      this.reconnectDelay = 1000
      this.options.app.setProviderStatus(
        this.options.providerId,
        `Connected to ${this.options.device}`
      )
      this.isFirstError = true
      const parser = new ReadlineParser()
      this.serial.pipe(parser).pipe(this)
    }.bind(this)
  )

  this.serial.on(
    'error',
    function (x) {
      this.options.app.setProviderError(this.options.providerId, x.message)
      if (this.isFirstError) {
        console.log(x.message)
      }
      this.debug(x.message)
      this.isFirstError = false
      this.scheduleReconnect()
    }.bind(this)
  )
  this.serial.on(
    'close',
    function () {
      this.options.app.setProviderError(
        this.options.providerId,
        'Closed, reconnecting...'
      )
      this.scheduleReconnect()
    }.bind(this)
  )

  let pendingWrites = 0
  const stdOutEvent = this.options.toStdout
  if (stdOutEvent) {
    ;(isArray(stdOutEvent) ? stdOutEvent : [stdOutEvent]).forEach((event) => {
      const onDrain = () => {
        pendingWrites--
      }

      that.options.app.on(event, (d) => {
        if (pendingWrites > that.maxPendingWrites) {
          that.debug('Buffer overflow, not writing:' + d)
          return
        }
        that.debug('Writing:' + d)
        if (isBuffer(d)) {
          that.serial.write(d)
        } else {
          that.serial.write(d + '\r\n')
        }
        setImmediate(() => {
          that.options.app.emit('connectionwrite', {
            providerId: that.options.providerId
          })
        })
        pendingWrites++
        that.serial.drain(onDrain)
      })
    })
  }
}

SerialStream.prototype.end = function () {
  this.serial.close()
}

SerialStream.prototype._transform = function (chunk, encoding, done) {
  this.push(chunk)
  done()
}

SerialStream.prototype.scheduleReconnect = function () {
  this.reconnectDelay *= this.reconnectDelay < 60 * 1000 ? 1.5 : 1
  const msg = `Not connected (retry delay ${(
    this.reconnectDelay / 1000
  ).toFixed(0)} s)`
  this.debug(msg)
  this.options.app.setProviderStatus(this.options.providerId, msg)
  setTimeout(this.start.bind(this), this.reconnectDelay)
}

module.exports = SerialStream

