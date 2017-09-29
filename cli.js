const fs = require('fs')
const program = require('commander')
const unzip = require('unzip')
const pretty = require('prettysize')
const log = console.log
const chalk = require('chalk')
const inquirer = require('inquirer')
const request = require('request')
const progress = require('request-progress')
const ProgressBar = require('progress')

const baseUrl = 'https://files.resin.io/resinos'

const error = (msg, err) => {
  log(chalk.red('Error') + msg);
  log(err)
}

const urlMap = {
  'raspberry-pi3': baseUrl + '/raspberrypi3/2.3.0%2Brev1.dev/image/resin.img.zip',
  'raspberry-pi2': baseUrl + '/raspberry-pi2/2.2.0%2Brev1.dev/image/resin.img.zip',
  'raspberry-pi0': baseUrl + '/raspberry-pi/2.2.0%2Brev1.dev/image/resin.img.zip',
  'raspberry-pi1': baseUrl + '/raspberry-pi/2.2.0%2Brev1.dev/image/resin.img.zip'
}

const questions = [
  {
    type: 'list',
    name: 'target',
    message: 'What is your hardware platform?',
    choices: [
      {
        name: 'Raspberry Pi Zero',
        value: 'raspberry-pi0',
      },
      {
        name: 'Raspberry Pi 1',
        value: 'raspberry-pi1',
      },
      {
        name: 'Raspberry Pi 2',
        value: 'raspberry-pi2',
      },
      {
        name: 'Raspberry Pi 3',
        value: 'raspberry-pi3',
      }
    ]
  }
]

const downloadWithProgress = target => {
  const url = urlMap[target]

  const targetFile = 'downloads/resinos-'+target+'.img'

  let bar = null
  let lastData = 0
  progress(request(url))
  .on('progress', state => {
    if (bar === null) {
      bar = new ProgressBar(`  ${targetFile} [:bar] :speed/s :percent ETA: :etas`, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: state.size.total
      })
    }
    bar.tick(state.size.transferred - lastData, {speed: pretty(state.speed)})
    lastData = state.size.transferred
  })
  .on('error', err => {
    error('failed to download', err)
  })
  .on('end', () => {
    log()
    log(chalk.green('downloaded'))
  })
  .pipe(unzip.Parse())
  .on('entry', (entry) => {
    if (entry.path == 'resin.img') {
      entry.pipe(fs.createWriteStream(targetFile))
    } else {
      log('ignoring ' + entry.path)
      entry.autodrain()
    }
  })
}

const download = (env, options) => {
  inquirer.prompt(questions)
  .then(answer => downloadWithProgress(answer.target))
}

const flash = (env, options) => {
}

program
  .version(require('./package.json').version)

program
  .command('download')
  .description('download the OONI Probe IoT base image')
  .action(download)

program
  .command('flash')
  .description('flash an SD card with OONI Probe IoT')
  .action(flash)

program.parse(process.argv)
