#! /usr/bin/env node

const { exec } = require('child_process')
const { resolve, relative } = require('path')
const shellEsc = require('shell-escape')
const chalk = require('chalk')
let spinner = require('./spinner')

const error = (...args) => console.error(chalk.red(...args))
const info = (...args) => console.log(chalk.blue(...args))

const tsSeedProjectRepo = 'git@github.com:zeusdeux/ts-seed-project.git'
const tsSeedProjectGithubLink = 'https://github.com/zeusdeux/ts-seed-project'

spinner.start('Validating folder name')

const folderName = process.argv[2]

if (!folderName) {
  spinner.fail(status('Please provide a folder to create a Typescript project in.'))
  process.exit(1)
}
const absolutePathToNewTSProject = resolve(folderName)
const relativePathToNewTSProject = relative(process.cwd(), absolutePathToNewTSProject)


spinner.succeed('Valid folder name')
spinner.start(`Cloning ${tsSeedProjectRepo} into "${relativePathToNewTSProject}"`)
exec(`git clone ${shellEsc([tsSeedProjectRepo])} ${shellEsc([absolutePathToNewTSProject])}`, (err, stdout, stderr) => {
  if (err) {
    handleError(err, stderr)
  }
  spinner.succeed('Clone successful')

  spinner.start('Installing dependencies...')

  let msgTimeout = setTimeout(() => {
    spinner.setMsg('Waiting on npm install to complete...')
    msgTimeout = setTimeout(() => {
      spinner.setMsg('Almost there...')
      msgTimeout = setTimeout(() => {
        spinner.setMsg('Just a little longer...')
        msgTimeout = setTimeout(() => {
          spinner.setMsg('C\'mon npm install...')
          msgTimeout = setTimeout(() => {
            spinner.setMsg('Gravity exerted by node_modules growing...')
            msgTimeout = setTimeout(() => {
              spinner.setMsg('Approaching singularity...')
              msgTimeout = setTimeout(() => {
                spinner.setMsg('Goodbye world...')
                msgTimeout = setTimeout(() => {
                  spinner.setMsg('Ok, this is just silly now...')
                }, 8000)
              }, 3000)
            }, 3000)
          }, 15000)
        }, 5000)
      }, 5000)
    }, 13000)
  }, 15000)

  exec('npm install', {
    cwd: absolutePathToNewTSProject,
    env: {
      ...process.env,
      NO_UPDATE_NOTIFIER: true
    }
  }, (err, stdout, stderr) => {
    clearTimeout(msgTimeout)

    if (err) {
      handleError(err, stderr)
    }

    spinner.succeed(`Success! Typescript project initialized in ${relativePathToNewTSProject}`)
    info('Next step -> run the following to initialize information such as author, etc.')
    info(`\ncd ${relativePathToNewTSProject} && npm init`)
    info(`\nFor more info on what was setup on your behalf, visit: ${tsSeedProjectGithubLink}`)
    info('Happy coding!')
    process.exit(0)
  })
})

function handleError(err, stderr) {
  spinner.fail('Initialization of Typescript project failed')
  error(err.message)
  process.exit(1)
}
