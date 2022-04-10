// check if broswer support service worker and register service worker
if ('serviceWorker' in navigator) {

  // services worker place can control the scope
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.error("service worler not registered", err.message))
}

// install event 

