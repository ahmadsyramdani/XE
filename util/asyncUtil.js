
function setImmediatePromise () {
  return new Promise((resolve) => {
    setImmediate(() => resolve())
  })
}

module.exports = { setImmediatePromise }
