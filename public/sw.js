if (navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (registrations && registrations.length > 0) {
      for (let registration of registrations) {
        registration.unregister()
      }
      window.location.reload()
    }
  })
}
