const valorTableroInicial = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
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

let palabraGanadora = 'birra';
const arrayPalabraGandora = palabraGanadora.split('');

const respuestas = [
    [],
    [],
    [],
    [],
    [],
    [],
];

// /////////////////////////////////////////////////////////////////////////

const comenzarJuego = () => {
    seleccionarColumna();
    eventoLetra();
    console.log(oportunidades);
};

const eventoLetra = () => {
    window.addEventListener('keyup' , (event) => {
        if(event.code !== 'Space'){            
            if(event.key == 'Enter' && oportunidades > 1 && respuestas[filaPosicionada].length === 5){
                fieldsets[filaPosicionada].querySelectorAll('input')[4].style.border = '0px solid white';
                oportunidades -= 1;
                filaPosicionada += 1;
                columnaPosicionada = 0;
                seleccionarColumna();
            }
            else if(event.key == 'Enter' && oportunidades == 1 && respuestas[filaPosicionada].length === 5){
                fieldsets[filaPosicionada].querySelectorAll('input')[4].style.border = '0px solid white';
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

window.onload = () => {
    comenzarJuego();
}

