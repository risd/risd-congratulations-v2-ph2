const test = require('tape')
const pspawn = require('./pspawn.js')

test('javascript', async (t) => {
  try {
    const output = await pspawn('grunt', ['browserify:client'])
    t.ok('built client javascript')
  } catch (error) {
    t.ifError(error)
  }
  
  t.end()
})

test('styles', async (t) => {
  try {
    await pspawn('grunt', ['sass'])
    t.ok('built sass')
  } catch (error) {
    t.ifError(error)
  }

  try {
    await pspawn('grunt', ['postcss'])
    t.ok('built postcss')
  } catch (error) {
    t.ifError(error)
  }

  t.end()
})
