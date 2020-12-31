// CONTROL POR VOZ - FUNCIONANDO
export function setupVoz() {
    console.log("SetupVoz");
    let lang = navigator.language || 'es-MX';
    let speechRec = new p5.SpeechRec(lang, gotSpeech);

    let continuous = true;
    let interim = true;
    speechRec.start(continuous, interim);

    function gotSpeech() {
        if (speechRec.resultValue) {
            console.log(speechRec.resultString);
            if (speechRec.resultString == "Pausa" || speechRec.resultString == "pausa") {
                myVideo.pause();
            } else if (speechRec.resultString == "Reproducir" || speechRec.resultString == "reproducir" || speechRec.resultString == "Play" || speechRec.resultString == "play") {
                myVideo.play();
            }
        }
    }
}