const test = require('tape')
const { spawn } = require('child_process')

Error.strackTraceLimit = 20

const pspawn = async (cmd, args) => {
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

test('build-page', async (t) => {
  try {
    await pspawn('grunt', [
      'build-page',
      '--inFile=pages/index.html',
      '--data=./.build/data.json',
      '--emitter'
    ])
    t.ok('build-page:success')
  } catch (error) {
    console.error(error)
    t.fail('build-page:failed')
  }
  t.end()
})

test('build-pages', async (t) => {
  try {
    await pspawn('grunt', [
      'build-pages',
      '--data=./.build/data.json',
      '--emitter'
    ])
    t.ok('build-pages:success')
  } catch (error) {
    console.error(error)
    t.fail('build-pages:failed')
  }
  t.end()
})

test('build-template', async (t) => {
  try {
    await pspawn('grunt', [
      'build-template',
      '--inFile=templates/universalpages/individual.html',
      '--data=./.build/data.json',
      '--emitter'
    ])
    t.ok('build-template:success')
  } catch (error) {
    console.error(error)
    t.fail('build-template:failed')
  }
  t.end()
})

test('build-templates', async (t) => {
  try {
    await pspawn('grunt', [
      'build-templates',
      '--data=./.build/data.json',
      '--emitter'
    ])
    t.ok('build-templates:success')
  } catch (error) {
    console.error(error)
    t.fail('build-templates:failed')
  }
  t.end()
})

test('build-page-cms', async (t) => {
  try {
    await pspawn('grunt', [
      'build-page-cms',
      '--data=./.build/data.json',
      '--emitter'
    ])
    t.ok('build-page-cms:success')
  } catch (error) {
    console.error(error)
    t.fail('build-page-cms:failed')
  }
  t.end()
})

// test('development-serve', async (t) => {
//   t.end()
// })

test('build-static', async (t) => {
  try {
    await pspawn('grunt', [
      'build-static',
      '--data=./.build/data.json',
      '--emitter'
    ])
    t.ok('build-static:success')
  } catch (error) {
    console.error(error)
    t.fail('build-static:failed')
  }
  t.end()
})
