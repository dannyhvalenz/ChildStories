var myVideo = document.getElementById("reproductor");
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

let listaFiduciales = ['./assets/multimedia/minuto 0-color-figura.png', './assets/multimedia/minuto 1-color-figura.png', './assets/multimedia/minuto 2-color-figura.png', './assets/multimedia/minuto 3-color-figura.png', './assets/multimedia/minuto 4-color-figura.png', './assets/multimedia/minuto 5-color-figura.png', './assets/multimedia/minuto 6-color-figura.png', './assets/multimedia/Minuto7-color.png', './assets/multimedia/minuto 8-color-figura.png','./assets/multimedia/minuto 9-color-figura.png'];

let listaImagenesBase = ['./assets/multimedia/minuto0.png', './assets/multimedia/Minuto1.png', './assets/multimedia/Minuto2.png', './assets/multimedia/Minuto3.png', './assets/multimedia/Minuto4.png', './assets/multimedia/Minuto5.png', './assets/multimedia/Minuto6.png', './assets/multimedia/Minuto7.png', './assets/multimedia/Minuto8.png','./assets/multimedia/Minuto9.png'];

let contadorFiducial = 0;
context.drawImage(listaImagenesBase[contadorFiducial], 0, 0, 500, 500);

myVideo.addEventListener('click', function(e){
   e.preventDefault();
   this[this.paused ? reproducirVideo() : pausarVideo()]();
});

function pausarVideo() {
   myVideo.pause();
   canvas.style.background = listaImagenesBase[contadorFiducial];
   canvas.style.visibility = "visible";
   myVideo.style.visibility = "hidden";
}

function reproducirVideo () {
   myVideo.play();
   canvas.style.visibility = "hidden";
   myVideo.style.visibility = "visible";
}


//// Reconocimiento de voz
//function setup () {
//   let lang = navigator.language || 'es-MX';
//   let speechRec = new p5.SpeechRec(lang, gotSpeech);
//   
//   let continuous = true;
//   let interim = true;
//   speechRec.start(continuous, interim);
//   
//   function gotSpeech() {
//      if (speechRec.resultValue) {
//         console.log(speechRec.resultString);
//         if (speechRec.resultString == "Pausa" || speechRec.resultString == "pausa") {
//            myVideo.pause();
//         } else if (speechRec.resultString == "Reproducir" || speechRec.resultString == "reproducir" || speechRec.resultString == "Play" || speechRec.resultString == "play") {
//            myVideo.play();
//         }
//      }
//   }
//}