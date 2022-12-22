if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: "/"})
        .then( registrado => console.log('Se instaló correctamente... ', registrado) )
        .catch( error => console.log('Falló la instalación... ', error) );
} else {
    console.log('Service Workers no soportados');
}