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

let oportunidades = 6;
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
};

const eventoLetra = () => {
    window.addEventListener('keyup' , (event) => {
        if(event.code !== 'Space'){
            
            if(event.key == 'Enter' && oportunidades > 0 && respuestas[filaPosicionada].length === 5){
                console.log('siguiente');
            }
            else{
                if(event.key === 'Backspace'){
                    escribirLetra(' ');
                }
                else{
                    escribirLetra(event.key)
                }
                seleccionarColumna();
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
            fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada - 1].style.border = '3px solid white';
        }
        if(columnaPosicionada + 1 < 5){
            fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada + 1].style.border = '3px solid white';
        }
    }
}

const escribirLetra = (letra) => {
    let cantidadLetras = respuestas[filaPosicionada].length;
    
    // si hay al menos 5 letras y la letra es un caracter
    if((cantidadLetras < 5 && cantidadLetras >= 0) && letra.length === 1){
    
        // si la letra machea o es un espacio(delete)
        if(String(letra).match('[A-Za-z]') || letra === ' '){
            
            // si la letra no es para borrar
            if(letra !== ' '){                
                
                // escribo la letra
                fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].value = letra;

                if(cantidadLetras < 5){
                    if(columnaPosicionada < 4){
                        columnaPosicionada += 1;
                    }
                    respuestas[filaPosicionada].push(letra);
                }
            }
            
            else if(letra === ' ' && cantidadLetras > 0){
                fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].value = letra;
                columnaPosicionada -= 1;
                respuestas[filaPosicionada].pop();
                if(columnaPosicionada == -1){ columnaPosicionada = 0}
            }
            else if(letra === ' ' && cantidadLetras === 0){
                fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].value = letra;
                respuestas[filaPosicionada].pop();
            }
        }
    }
    // borrando ultima letra
    else if(cantidadLetras === 5 && letra !== ' '){
        fieldsets[filaPosicionada].querySelectorAll('input')[4].value = letra;
        respuestas[filaPosicionada].pop();
        respuestas[filaPosicionada].push(letra);
    }
    // cambiando ultima letra
    else if(cantidadLetras === 5 && cantidadLetras >= 0 && letra === ' '){
        fieldsets[filaPosicionada].querySelectorAll('input')[4].value = letra;
        respuestas[filaPosicionada].pop();
        respuestas[filaPosicionada].pop();
        columnaPosicionada = 3;
    }
    console.log(respuestas);
}

window.onload = () => {
    comenzarJuego();
}

