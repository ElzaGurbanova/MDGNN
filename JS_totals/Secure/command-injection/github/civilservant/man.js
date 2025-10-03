const { execFile } = require('child_process')
module.exports = {
  commands: {
    man: {
      help: 'look up a man page',
      usage: ['page'],
      command: function (bot, msg) {
        const page = String(msg.args.page || '').trim()
        if (!page || page.startsWith('-')) {
          bot.say(msg.to, 'Invalid man page')
          return
        }
        const c = execFile('man', ['-f', page])
        let out = ''
        c.stdout.on('data', function (data) { out += data.toString() })
        c.stderr.on('data', function (data) { out += data.toString() }) // include both streams
        c.on('close', function () {
          bot.say(msg.to, out)
        })
      }
    }
  }
}

