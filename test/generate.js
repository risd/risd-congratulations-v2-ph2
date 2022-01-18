const test = require('tape')
const { spawn } = require('child_process')

Error.strackTraceLimit = 20

const pspawn = (cmd, args) => {
  let stdout = ''
  let stderr = ''
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args)
    p.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    p.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    p.on('close', (code) => {
      if (code !== 0) {
        const msg = stderr.length > 0
          ? stderr
          : stdout
        return reject(new Error(msg))
      }
      resolve(stdout)
    })
  })
}

test('download-data', async (t) => {
  try {
    const data = await pspawn('grunt', ['download-data', '--emitter'])  
    t.ok('download-data:success')
  } catch (stderr) {
    t.ifError(stderr)
  }
  t.end()
})

// test('build-page', async (t) => {
//   try {
//     const page = pspawn('grunt build-page --inFile=pages/index.html --data=./.build/data.json --emitter')  
//     t.ok('build-page:success')
//   } catch (error) {
//     console.error(error)
//     t.fail('build-page:failed')
//   }
//   t.end()
// })

// test('development-serve', async (t) => {
//   t.end()
// })
