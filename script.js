const valorTableroInicial = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
];

const colores = {
    BLANCO: 0,
    VERDE: 1,
    AMARILLO: 2,
    GRIS: 3
};

const filas = 5;
const columnas = 4;

const fieldsets = document.querySelectorAll('fieldset');

let oportunidades = 5;
let filaPosicionada = 0;
let columnaPosicionada = 0;

let palabraGanadora = elegirPalabraGanadora();
const arrayPalabraGandora = palabraGanadora.split('');
let objetoPalabraGanadora;
var palabras = new Array(13492);

const respuestas = [
    [],
    [],
    [],
    [],
    [],
];

// /////////////////////////////////////////////////////////////////////////

const comenzarJuego = () => {
    cargarPalabras();
    console.log(palabraGanadora);
    convertirArrayEnObjeto();
    seleccionarColumna();
    eventoLetra();
};

const eventoLetra =  () => {
    window.addEventListener('keyup' , async(event) => {
        if(event.code !== 'Space'){            
            if(event.key == 'Enter' && oportunidades > 1 && respuestas[filaPosicionada].length === 5){
                const existePalabra = await  verificarExistenciaPalabra(filaPosicionada);
                if(existePalabra){

                    comprobarRespuesta(filaPosicionada);
                    pintarTablero(filaPosicionada);
                    fieldsets[filaPosicionada].querySelectorAll('input')[4].style.border = '0px solid white';
                    oportunidades -= 1;
                    filaPosicionada += 1;
                    columnaPosicionada = 0;
                    seleccionarColumna();
                    convertirArrayEnObjeto();
                }
                else{
                    console.log('palabra no existente');
                    document.getElementsByClassName('cartelPalabraNoExiste')[0].style.visibility = 'visible';
                    setTimeout(()=>{
                        document.getElementsByClassName('cartelPalabraNoExiste')[0].style.visibility = 'hidden';
                    }, 1000)
                }
            }
            else if(event.key == 'Enter' && oportunidades == 1 && respuestas[filaPosicionada].length === 5){
                comprobarRespuesta(filaPosicionada);
                pintarTablero(filaPosicionada);
                fieldsets[filaPosicionada].querySelectorAll('input')[4].style.border = '0px solid white';
                convertirArrayEnObjeto();
            }
            else{
                if(String(event.key).match('[A-Za-z]')){
                    if(event.key === 'Backspace'){
                        escribirLetra(' ');
                    }
                    else{
                        escribirLetra(event.key)
                    }
                    seleccionarColumna();
                }
            }
        }
    })
}

const seleccionarColumna = () => {
    if( columnaPosicionada < 5 ){
        // pintar la columna en la que estoy
        fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].style.border = '3px solid red';
        
        // despintar columna anterio y siguiente
        if(columnaPosicionada - 1 >= 0){
            fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada - 1].style.border = '0px solid white';
        }
        if(columnaPosicionada + 1 < 5){
            fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada + 1].style.border = '0px solid white';
        }
    }
}

const escribirLetra = (letra) => {
    let cantidadLetras = respuestas[filaPosicionada].length;
    // entre 0 y 5 letras , ademas que letra tenga un caracter (para evitar enter, cntrl, etc)
    if((cantidadLetras < 5 && cantidadLetras >= 0) && letra.length === 1){
            // si se apreto algo distinto a delete
            if(letra !== ' '){                                
                fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].value = letra;
                if(cantidadLetras < 5){
                    if(columnaPosicionada < 4){
                        columnaPosicionada += 1; // evitando desbordamiento para autofocus de cuadro
                    }
                    respuestas[filaPosicionada].push(letra);
                }
            }            
            // si apreto delete pero hay letra escritas
            else if(letra === ' ' && cantidadLetras > 0){
                fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].value = letra;
                columnaPosicionada -= 1;
                respuestas[filaPosicionada].pop();
                if(columnaPosicionada == -1){ 
                    columnaPosicionada = 0 // evitando desbordamiento para autofocus de cuadro
                }
            }
            // si apreto delete para borrar primera letra
            else if(letra === ' ' && cantidadLetras === 0){
                fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].value = letra;
                respuestas[filaPosicionada].pop();
            }        
    }
    // cambiando ultima letra
    else if(cantidadLetras === 5 && letra !== ' ' && letra.length == 1){
        fieldsets[filaPosicionada].querySelectorAll('input')[4].value = letra;
        respuestas[filaPosicionada].pop();
        respuestas[filaPosicionada].push(letra);
    }
    // borrando ultima letra
    else if(cantidadLetras === 5 && cantidadLetras >= 0 && letra === ' '){
        fieldsets[filaPosicionada].querySelectorAll('input')[4].value = letra;
        respuestas[filaPosicionada].pop();
        respuestas[filaPosicionada].pop();
        columnaPosicionada = 3;
    }
}

const convertirArrayEnObjeto = () => {
    objetoPalabraGanadora = {};
    arrayPalabraGandora.map(letra => {
        if(letra in objetoPalabraGanadora){
            objetoPalabraGanadora[letra] += 1;
        }
        else{
            objetoPalabraGanadora[letra] = 1;
        }
    })
}
const comprobarRespuesta = (filaPosicionada) => {
    let cuadrosLetras = fieldsets[filaPosicionada].querySelectorAll('input');

    cuadrosLetras.forEach((cuadro , indice) => {
    
        if(cuadro.value === arrayPalabraGandora[indice]){
            if(objetoPalabraGanadora[cuadro.value] > 0){
                valorTableroInicial[filaPosicionada][indice] = colores.VERDE
            }
            else{
                valorTableroInicial[filaPosicionada][indice] = colores.VERDE;
                let indiceLetraAnterior = respuestas[filaPosicionada].indexOf(cuadro.value);
                valorTableroInicial[filaPosicionada][indiceLetraAnterior] = colores.GRIS;
            }

        }
        else if(palabraGanadora.includes(cuadro.value)){
            if(objetoPalabraGanadora[cuadro.value] > 0){
                valorTableroInicial[filaPosicionada][indice] = colores.AMARILLO
                objetoPalabraGanadora[cuadro.value] -= 1;
            }
        }
        else{
            valorTableroInicial[filaPosicionada][indice] = colores.GRIS
        }
    })
}

const verificarExistenciaPalabra = (fila) => {
    const respuestaUsuario =  respuestas[fila].join('');
    return palabras.includes(respuestaUsuario);
}

const pintarTablero = (fila) => {
    let cuadrosValor = valorTableroInicial[fila];
    let inputs = fieldsets[fila].querySelectorAll('input');
    cuadrosValor.map((valor , indice) => {
        switch(valor){
            case colores.VERDE:
                inputs[indice].classList = 'verde';
                break;
            case colores.AMARILLO:
                inputs[indice].classList = 'amarillo';
                break;
            case colores.GRIS:
                inputs[indice].classList = 'gris';
                break;
            default:
                break;
        }
    })
}

const cargarPalabras = async() =>{
    const resp = await fetch('./api.json');
    const data = await resp.json();
    data.forEach((palabra , indice) => {
            palabras[indice] = palabra
    });
    elegirPalabraGanadora(palabras);
}

const elegirPalabraGanadora = () => {
    let numeroAleatorio = Math.floor(Math.random() * palabras.length);
    let palabraAleatoria = palabras[numeroAleatorio]
    let tildes = ['á','é','í','ó','ú'];
    let contieneTilde = true;
    while(contieneTilde == true ){
        for(let i= 0; i < 5 ; i++){
            if(tildes.includes(palabraAleatoria[i])){
                contieneTilde = true;
                break;
            }
            else{
                contieneTilde = false;
            }
        }
        if(contieneTilde == false){
            console.log(`N°:${numeroAleatorio} - Palabra: ${palabraAleatoria} - valorTilde: ${contieneTilde}`);
        }
        else{
            console.log(`N°:${numeroAleatorio} - Palabra: ${palabraAleatoria} - valorTilde: ${contieneTilde}`);
            console.log('cambiando palabra');
            numeroAleatorio = Math.floor(Math.random() * palabras.length);
            palabraAleatoria = palabras[numeroAleatorio]
        }
    }
    return palabraAleatoria;
}

window.onload = () => {
    comenzarJuego();
}

