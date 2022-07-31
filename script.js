let valorTableroInicial = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
];

let colores = {
    BLANCO: 0,
    VERDE: 1,
    AMARILLO: 2,
    GRIS: 3
};


let respuestas = [
    [],
    [],
    [],
    [],
    [],
];

const filas = 5;
const columnas = 4;

let palabraGanadora;
const fieldsets = document.querySelectorAll('fieldset');

let oportunidades = 5;
let filaPosicionada = 0;
let columnaPosicionada = 0;
let estadoJuego = ' ';
let palabras;

//BLOQUE RELACIONADO RECARGAR PALABRAS Y ELECCION DE PALABRA/////////////////////////////////////////////////////////////////////////

const cargarPalabras = async() => {
    const resp = await fetch('./api.json');
    const data = await resp.json();
    return data;
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
        }
        else{
            numeroAleatorio = Math.floor(Math.random() * palabras.length);
            palabraAleatoria = palabras[numeroAleatorio]
        }
    }
    palabraGanadora = palabraAleatoria
    arrayPalabraGandora = palabraGanadora.split('')
}

//BLOQUE RELACIONADO A ESCRITURA DE LETRA ////////////////////////////////////////////////////////////////////////////

const eventoLetra =  async(event) => {
    if(event.code !== 'Space'){            
        
        if(event.key == 'Enter' && oportunidades >= 1 && respuestas[filaPosicionada].length === 5){
            const existePalabra = await  verificarExistenciaPalabra(filaPosicionada);

            if(existePalabra){
                comprobarRespuesta(filaPosicionada);
                pintarTablero(filaPosicionada);
                fieldsets[filaPosicionada].querySelectorAll('input')[4].style.border = '0px solid white';
                if(verificarEstadoJuego(filaPosicionada)){
                    window.removeEventListener('keyup' , eventoLetra);
                    estadoJuego = 'ganado'

                    // cartel ganado
                    document.getElementsByClassName('mensajeEstadoJuego')[0].innerHTML = '¡¡ Juego Ganado !!';
                    document.getElementsByClassName('mensajeEstadoJuego')[0].style.color = 'rgb(90, 142, 90)';
                    document.getElementsByClassName('cartelEstadoJuego')[0].style.opacity = 1;
                }
                else{
                    oportunidades -= 1;
                    filaPosicionada += 1;
                    columnaPosicionada = 0;
                    seleccionarColumna();
                }
            }
            else{
                document.getElementsByClassName('cartelPalabraNoExiste')[0].style.opacity = 1;
                setTimeout(()=>{
                    document.getElementsByClassName('cartelPalabraNoExiste')[0].style.opacity = 0;
                }, 1000)
            }
        }
        else if(event.key != "Enter" && oportunidades > 0){
            if(((String(event.key).match('[A-Za-z]')) || (String(event.key).toLocaleLowerCase() == 'ñ'))){
                if(estadoJuego == ' '){
                    estadoJuego = 'encurso';
                    comenzarReloj();
                }
                if(event.key === 'Backspace'){
                    escribirLetra(' ');
                }
                else{
                    escribirLetra(String(event.key).toLocaleLowerCase())
                }
                seleccionarColumna();
            }
        }
    }
    
    if(oportunidades == 0){
        window.removeEventListener('keyup' , eventoLetra);

        // cartel juego finalizado
        document.getElementsByClassName('mensajeEstadoJuego')[0].innerHTML = `Juego finalizado, la palabra era: " ${palabraGanadora} "`;
        document.getElementsByClassName('mensajeEstadoJuego')[0].style.color = 'black';
        document.getElementsByClassName('cartelEstadoJuego')[0].style.opacity = 1;

        estadoJuego = 'finalizado';

    }
} 


const seleccionarColumna = () => {
    if( columnaPosicionada < 5 && oportunidades > 0){
        // pintar la columna en la que estoy
        fieldsets[filaPosicionada].querySelectorAll('input')[columnaPosicionada].style.border = '1px solid rgba(0,0,0,0.5)';
        
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

//BLOQUE RELACIONADO A VERIFICAR RESPUESTA Y PINTAR//////////////////////////////////////////////////////////////////////////////
const comprobarRespuesta = (filaPosicionada) => {
    let cuadroLetras = fieldsets[filaPosicionada].querySelectorAll('input');
    let palabra = palabraGanadora;
    // let palabra = 'alaga';
    let palabraAux = [...palabra]
    let respAux = [];
    cuadroLetras.forEach((cuadro , indice) =>{
        if(cuadro.value == palabraAux[indice]){
            valorTableroInicial[filaPosicionada][indice] = colores.VERDE;
            palabraAux[indice] = ''
            respAux.push('')
        }
        else{
            respAux.push(cuadro.value);
        }
    })
    // palabraAux = palabraAux.filter(value => value != "")
    respAux.map((valor , indice) => {
        if(valor != ''){

            if(palabraAux.includes(valor)){
                valorTableroInicial[filaPosicionada][indice] = colores.AMARILLO;
                respAux[indice] = '';
                let indiceLetraBorrar = palabraAux.indexOf(valor);
                palabraAux[indiceLetraBorrar] = ""
            }
            else{
                valorTableroInicial[filaPosicionada][indice] = colores.GRIS;

            }
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

const verificarEstadoJuego = (fila) => {
    const valorCorrecto = (valor) => valor == 1;
    if(valorTableroInicial[fila].every(valorCorrecto)){
        return true;
    };
}

//BLOQUE RELACIONADO CON EL RELOJ//////////////////////////////////////////////////////////////////////////////
const comenzarReloj = () => {
    let reloj = document.getElementsByClassName('reloj')[0];
    // let segundos = minutos = horas = 0;
    let horas = parseInt(reloj.innerHTML.split(':')[0].toString().trim());
    let minutos = parseInt(reloj.innerHTML.split(':')[1].toString().trim());
    let segundos = parseInt(reloj.innerHTML.split(':')[2].toString().trim());
    let arrancarReloj = setInterval(()=>{
        segundos++;
        if(segundos == 60){
            minutos++;
            segundos=0
        }
        if(minutos == 60){
            minutos=0
            horas++
        }
        reloj.innerHTML = `${(horas < 10)? '0' + horas : horas} : ${(minutos < 10)? '0' + minutos : minutos} : ${(segundos < 10)? '0' + segundos : segundos}`

        
            
        if(estadoJuego == 'ganado' || estadoJuego == 'finalizado'){
            clearInterval(arrancarReloj);
        }

        
    }, 1000)

    
}
//////////////////////////////////////////////////////////////////////////////////////////
const existePartida = (palabra , partidaActual) =>{
    let partidasLocalStorage = JSON.parse(localStorage.getItem('partidasLocalStorage'))
    let jugador = JSON.parse(localStorage.getItem('partidaActual'));
    let partidasJugador = [];
    let existeEstaPartida = false;
    let indiceJugador;
    let indicePartida;
    partidasLocalStorage.map((partida, indice) => {
        if(jugador.nombre == partida.nombre){
            partidasJugador = partida.partidas;
            indiceJugador = indice;
        }
    })

    partidasJugador.map((partida , indice) => {
        if(partida.palabraGanadora == partida.palabraGanadora){
            existeEstaPartida = true;
            indicePartida = indice;
        }
    });

    // agrego nuevo partida
    if(existeEstaPartida == false){
        partidasLocalStorage[indiceJugador].partidas.push(partidaActual)
    }
    else{
        partidasLocalStorage[indiceJugador].partidas[indicePartida] = partidaActual;
        
    }
    localStorage.setItem('partidasLocalStorage' , JSON.stringify(partidasLocalStorage));

}

const traerPartidaEnCurso = (palabraGanadora) => {
    const partidasLocalStorage = JSON.parse(localStorage.getItem('partidasLocalStorage'));
    const partidaActual = JSON.parse(localStorage.getItem('partidaActual'));

    let partidaEnCurso;
    partidasLocalStorage.map((jugador , ijugador)=>{
        if(jugador.nombre == partidaActual.nombre){
            indiceJugador = ijugador;
            jugador.partidas.map((partida)=>{
                if(partida.palabraGanadora == palabraGanadora){
                    partidaEnCurso = partida;
                }
            })
        }
    })
    return partidaEnCurso;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const comenzarJuego = async() => {
    let partidaActual = JSON.parse(localStorage.getItem('partidaActual'));
    document.getElementById('guardar').addEventListener('click' , ()=>{
        let reloj = document.getElementsByClassName('reloj')[0].innerHTML;
        let horas = reloj.split(':')[0].trim();
        let minutos = reloj.split(':')[1].trim();
        let segundos = reloj.split(':')[2].trim();
        
        let tiempo = {
            'horas': horas,
            'minutos': minutos,
            'segundos': segundos
        }

        let partida = {
            palabraGanadora,
            tiempo,
            oportunidades,
            estadoJuego,
            'progreso': {
                'tablero': valorTableroInicial,
                respuestas
            }
        }
        existePartida(palabraGanadora, partida)
    })

    // cargar palabras    
    await cargarPalabras()
    .then(data => {
        palabras = data;
    })

    // elegir palabra ganadora si es una partida nueva / palabraGanadora es la que elegio el jugador
    if(partidaActual.palabra == ""){
        elegirPalabraGanadora();
        partidaActual.palabra = palabraGanadora;
        localStorage.setItem('partidaActual',JSON.stringify({
            'nombre': partidaActual.nombre,
            'palabra': palabraGanadora
        }))
    }
    else{
        palabraGanadora = partidaActual.palabra;
        let partida = traerPartidaEnCurso(palabraGanadora) 
        // seteando con los datos obtenidos
        oportunidades = partida.oportunidades;
        respuestas = [...partida.progreso.respuestas];
        valorTableroInicial = partida.progreso.tablero;
        document.getElementsByClassName('reloj')[0].innerHTML = `${partida.tiempo.horas} : ${partida.tiempo.minutos} : ${partida.tiempo.segundos}`;
        filaPosicionada = 5 - oportunidades;

        let fieldsets = document.getElementsByTagName('fieldset');
        respuestas.map((fila , indice)=>{
            if(fila.length > 0){
                for(let c= 0; c<5 ; c++){
                    fieldsets[indice].querySelectorAll('input')[c].value = fila[c];
                }
            }
        comprobarRespuesta(indice)
        pintarTablero(indice)
        })

    }        
    // seleccionarColumna
    seleccionarColumna();

}


window.onload = () => {
    if(oportunidades > 0){
        window.addEventListener('keyup' , eventoLetra)
        comenzarJuego();
    }
}

