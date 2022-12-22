// Obtiene los datos del caché
const 
    nombre_cache = 'app-clima-v1',
    archivos = [
    '/',
    '/assets/icons/weather.png',
    '/assets/icons/weather2.png',
    '/manifest.json',
    '/html/index.html',
    '/css/styles.css',
    '/css/reset.css',
    '/js/pwa.js',
    '/js/script.js'
];

// Se instala el Service Worker
self.addEventListener('install', e => {

    console.log('Service Worker instalado.');

    // Espera a que se descarguen todos los archivos del cache
    e.waitUntil(
        caches.open(nombre_cache)
            .then( cache => {
                // Cachear
                cache.addAll(archivos);
            })
    )

});

// Se activa el Service Worker
self.addEventListener('activate', e => {

    console.log('Service Worker activado.');

    e.waitUntil(
        caches.keys()
            .then( keys => {
                // Elimina las anteriores sesiones de cache para que solo prevalezca la última
                return Promise.all(
                    keys.filter( key => key !== nombre_cache )
                    .map ( key => caches.delete(key) )
                )

            })
    )

});

// Evento fetch para descargar archivos en estatico
self.addEventListener('fetch', e => {

    console.log('Fetch... ', e);

    e.respondWith((async () => {

        const respuesta_cache = await caches.match(e.request); // Recogemos del cache un array de datos o vacio
        
        if (respuesta_cache) {
          return respuesta_cache;
        }

        const respuesta = await fetch(e.request); // Recogemos la respuesta con los datos

        if (!respuesta || respuesta.status !== 200) {
            return respuesta;
        }
      
        return respuesta;

    })());

});