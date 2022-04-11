// listen to the online event, if it is fired, reload the page
window.addEventListener('online', () => {
  window.location.reload()
})

// set interval to periodicity check the online status
async function checkNetworkAndReload() {
  try {
    const response = await fetch('.')
    if (response.status >= 200 && response.status < 500) {
      window.location.reload()
      return
    }
  } catch (err) {
    // Do nothing, still offline
  }
  window.setTimeout(checkNetworkAndReload, 2500)
}