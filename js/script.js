/***** VARIABLES *****/
const
    divGeneral = document.querySelector('#div-general'),
    etiquetaImgHoy = document.querySelector('.div__hoy img'),
    etiquetasImgSemana = document.querySelectorAll('.div__semana img'),
    formularioTexto = document.querySelector('#formulario-texto'), 
    formularioPredefinido = document.querySelector('#formulario-predefinido'),
    formCiudad = document.querySelector('#form-ciudad'),
    temperaturaActual = document.querySelector('#temperatura-actual'),
    ciudad = document.querySelector('#ciudad'),
    dia = document.querySelector('#dia'),
    temperaturas = document.querySelector('#temperaturas'),
    codigoImagen = document.querySelector('#codigo-imagen'),
    dia1 = document.querySelector('#dia-1'),
    dia2 = document.querySelector('#dia-2'),
    dia3 = document.querySelector('#dia-3'),
    semana = [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
    error = document.querySelector('.error'),
    appId = '4a0478f04ab4be834158d26ebbe8efed' // ID de la API https://openweathermap.org/
;

let
    seleccionarCiudad = formCiudad.options[formCiudad.selectedIndex].textContent,
    ciudadEscrita = document.querySelector('#ciudad-escrita'),
    urlHoy,
    urlSemana
;

var
    check = document.querySelector('#guardar-ciudad')
;
/***** FIN VARIABLES *****/


/***** EVENTOS *****/
window.addEventListener('load', () => {
 
    try {

        pintarFormularioPredefinido();

        formularioTexto.addEventListener('submit', validarCiudad);

        formularioPredefinido.addEventListener('change', () => {

            seleccionarCiudad = formCiudad.options[formCiudad.selectedIndex].textContent;

            limpiarHTML();

            llamadaApi(seleccionarCiudad);
            
        });
        
    } catch (error) { console.log(error); }
    
})
/***** FIN EVENTOS *****/


/***** FUNCIONES *****/
// Pintar el formulario predefinido recogiendo datos del localstorage
function pintarFormularioPredefinido() {

    const ciudades = JSON.parse(localStorage.getItem('Ciudades')) ?? []; // Recoge datos del localstorage y si no existe crea el array

    ciudades.forEach( ciudad => {

        const opcion = document.createElement('option');

        opcion.value = ciudad.toUpperCase().substr(0, 3);

        opcion.textContent = ciudad;

        formCiudad.appendChild(opcion);
        
    });

}

// Validar ciudad para quitar el evento predefinido al hacer el submit en 'Obtener Clima'
function validarCiudad(e) {

    e.preventDefault();

    if (ciudadEscrita.value === '') {
        
        mostrarError();

        return;

    }

    llamadaApi(ciudadEscrita.value);   

}

// Llamar a la api de clima
function llamadaApi(nombreCiudad) {

    // URLs para conectarse a la APIs
    urlHoy = `https://api.openweathermap.org/data/2.5/weather?q=${nombreCiudad}&appid=${appId}`;
    urlSemana = `https://api.openweathermap.org/data/2.5/forecast/?q=${nombreCiudad}&appid=${appId}`;

    // Conectar con los datos del clima de hoy
    fetch(urlHoy)
        .then( respuesta => respuesta.json() )
        .then( datos => {

            if (datos.cod === '404') {

                mostrarError();

                return;

            }

            guardarCiudad(nombreCiudad);

            registrarCiudad();

            cargarClimaHoy(datos);

            limpiarHTML();

            // Conectar con los datos del clima de los próximos días
            fetch(urlSemana)
                .then( respuesta => respuesta.json() )
                .then( datos => {

                    cargarClimaSemana(datos);
                    
                })
                .catch( error => { console.log(error); })

        })
        .catch( error => { console.log(error); });

}

// Dibujar clima de hoy
function cargarClimaHoy(datos) {

    // Mostramos las etiquetas img
    etiquetaImgHoy.classList.remove('ocultar__imagen');
    etiquetaImgHoy.classList.add('mostrar__imagen');

    // Dibujamos el día de hoy
    temperaturaActual.textContent = calcularGrados(datos.main.temp) + 'º';
    ciudad.textContent = datos.name;
    dia.textContent = 'Hoy';
    temperaturas.textContent = 'Máx.: ' + calcularGrados(datos.main.temp_max) + 'º,  Mín.: ' + calcularGrados(datos.main.temp_min) + 'º,  Humedad: ' + datos.main.humidity;
    codigoImagen.src = `http://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png`;

}

// Dibujar clima de los siguientes 3 días
function cargarClimaSemana(datos) {

    // Mostramos las etiquetas img
    etiquetasImgSemana.forEach( imagen => {
        imagen.classList.remove('ocultar__imagen');
        imagen.classList.add('mostrar__imagen');
    });
    
    // Dibujamos cada día
    dia1.querySelector('img').src = `http://openweathermap.org/img/wn/${datos.list[8].weather[0].icon}@2x.png`;
    dia1.querySelector('.dia').textContent = extraerDiaSemana(new Date().getDay() + 1);
    dia1.querySelector('.temperatura').textContent = calcularGrados(datos.list[8].main.temp) + 'º';

    dia2.querySelector('img').src = `http://openweathermap.org/img/wn/${datos.list[16].weather[0].icon}@2x.png`;
    dia2.querySelector('.dia').textContent = extraerDiaSemana(new Date().getDay() + 2);
    dia2.querySelector('.temperatura').textContent = calcularGrados(datos.list[16].main.temp) + 'º';

    dia3.querySelector('img').src = `http://openweathermap.org/img/wn/${datos.list[24].weather[0].icon}@2x.png`;
    dia3.querySelector('.dia').textContent = extraerDiaSemana(new Date().getDay() + 3);
    dia3.querySelector('.temperatura').textContent = calcularGrados(datos.list[24].main.temp) + 'º';

}

// Extraer día de la semana
function extraerDiaSemana(dia) {

    // Extraer los siguientes 3 días cuando sea jueves, viernes o sábado
    switch (dia) {
        case 7:
            dia = 0;
        break;

        case 8:
            dia = 1;
        break;

        case 9:
            dia = 2;
        break;
    }

    return semana[dia];

}

// Calcular los grados de kelvin a celsius
function calcularGrados(grados) {

    return parseInt(grados - 273.15);

}

// Limpiar el html
function limpiarHTML() {

    ciudadEscrita.value = '';

    check.checked = false;

    formularioPredefinido.reset();

}

// Registrar ciudad en el Local Storage
function registrarCiudad() {

    const nueva_ciudad = formCiudad.options[formCiudad.options.length-1].textContent;

    const ciudades = JSON.parse(localStorage.getItem('Ciudades')) ?? []; // Recoge datos del localstorage y si no existe crea el array
    
    const existe_ciudad = existeCiudad(ciudades, nueva_ciudad);

    if (nueva_ciudad !== '--Selecciona una ciudad--' && existe_ciudad != false) {

        localStorage.setItem('Ciudades', JSON.stringify([...ciudades, nueva_ciudad])); // Agregar datos en localstorage

    }

}

// Comprobar si ya existe la ciudad en el formulario predefinido
function existeCiudad(ciudades, nombreCiudad) {

    let cnt = 0;

    ciudades.forEach( ciudad => {

        if (ciudad === nombreCiudad) {

            cnt++;

        }

    })

    if (cnt > 0) {

        return false;

    } else {

        return true;

    }

}

// Guardar la ciudad en el formulario predefinido
function guardarCiudad(nombreCiudad) {

    const ciudadFormateada = nombreCiudad[0].toUpperCase() + nombreCiudad.substr(1).toLowerCase();

    const ciudadesGuardadas = JSON.parse(localStorage.getItem('Ciudades')) ?? []; // Recoge datos del localstorage y si no existe crea el array

    const coincidenciaCiudad = existeCiudad(ciudadesGuardadas, ciudadFormateada);

    if (check.checked && coincidenciaCiudad == false && ciudadEscrita.value !== '') { // Checkbox 'Guardar Ciudad ' seleccionado && Ya existe la ciudad && Ciudad escrita no está vacío

        mostrarError("Ya está guardada esta ciudad.");

    } else if (check.checked && coincidenciaCiudad == true) { // Checkbox 'Guardar Ciudad ' seleccionado && No existe la ciudad

        const opcion = document.createElement('option');

        opcion.value = ciudadEscrita.value.toUpperCase().substr(0, 3);

        opcion.textContent = ciudadEscrita.value[0].toUpperCase() + ciudadEscrita.value.substr(1).toLowerCase();

        formCiudad.appendChild(opcion);
        
    }

    const ultima_ciudad = formCiudad.options[formCiudad.options.length-1].textContent;
    
    if (formCiudad.options[formCiudad.options.length-1].textContent !== '--Selecciona una ciudad--'){

        ciudadesGuardadas.push(ultima_ciudad);

    }

}

// Mostrar un error
function mostrarError(texto) {

    if (ciudadEscrita.value === '') {

        error.textContent = 'Introduce el nombre de una ciudad.';

    } else {

        error.textContent = 'Esta ciudad no existe.';

    }

    if (texto === 'Ya está guardada esta ciudad.') {
        error.textContent = texto;
    }

    error.style.display = 'block';

    setTimeout(() => {

        error.style.display = 'none';

    }, 3000);

}
/***** FIN FUNCIONES *****/