if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      console.log('Service worker registered, scope:', registration.scope);
    }).catch(function (error) {
      console.error('Service worker registration failed:', error);
    });
  });
}