//import { setupVoz } from './controlVoz.js';

var myVideo = document.getElementById("reproductor");
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var btnStart = document.getElementById("btnStart");

let listaFiduciales = ['./assets/multimedia/minuto 0-color-figura.png', './assets/multimedia/minuto 1-color-figura.png', './assets/multimedia/minuto 2-color-figura.png', './assets/multimedia/minuto 3-color-figura.png', './assets/multimedia/minuto 4-color-figura.png', './assets/multimedia/minuto 5-color-figura.png', './assets/multimedia/minuto 6-color-figura.png', './assets/multimedia/Minuto7-color.png', './assets/multimedia/minuto 8-color-figura.png', './assets/multimedia/minuto 9-color-figura.png'];

let listaImagenesBase = ['./assets/multimedia/minuto0.png', './assets/multimedia/Minuto1.png', './assets/multimedia/Minuto2.png', './assets/multimedia/Minuto3.png', './assets/multimedia/Minuto4.png', './assets/multimedia/Minuto5.png', './assets/multimedia/Minuto6.png', './assets/multimedia/Minuto7.png', './assets/multimedia/Minuto8.png', './assets/multimedia/Minuto9.png'];


// Setup inicial
var temporizador = 60;
var pausaPorFiducial = true;
let controlPorFiduciales = false;
let controlPorVoz = true;
window.onload = setupInicial;
document.getElementById("divReproductor").style.display = "none";

function setupInicial() {
   myVideo.pause();
}


// MENU PRINCIPAL
function usarVoz() { // FUNCIONANDO
   console.log("Voz");
   controlPorFiduciales = false;
   controlPorVoz = true;
   console.log("control por voz = " + controlPorVoz);
   console.log("control por fiduciales = " + controlPorFiduciales);
   document.getElementById("btnObjetos").classList.remove("active");
   document.getElementById("btnVoz").classList.add("active");
   document.getElementById("lblAviso").innerText = "UTILIZA AUDIFONOS PARA TENER UNA MEJOR EXPERIENCIA, DE OTRA FORMA PODRIAN NO FUNCIONAR LOS COMANDOS POR VOZ";
}

function usarFiduciales() { // FUNCIONANDO
   console.log("Fiduciales");
   controlPorFiduciales = true;
   controlPorVoz = false;
   console.log("control por voz = " + controlPorVoz);
   console.log("control por fiduciales = " + controlPorFiduciales);
   document.getElementById("btnObjetos").classList.add("active");
   document.getElementById("btnVoz").classList.remove("active");
   document.getElementById("lblAviso").innerText = "PROCURA ESTAR EN UNA ZONA ILUMINADA";
}

btnStart.addEventListener('click', function () { // FUNCIONANDO
   document.getElementById("divReproductor").style.display = "flex";
   console.log("Comenzar");
   console.log("control por voz = " + controlPorVoz);
   console.log("control por fiduciales = " + controlPorFiduciales);
   if (controlPorVoz == true) {
      setupVoz();
      document.getElementById("contenedorControlPorFiduales").style.display = "none";
      myVideo.src = "./assets/multimedia/ricitos-de-oro.mp4";
      document.getElementById("contenedorReproductor").classList.add('is-fullhd');
      document.getElementById("contenedorReproductor").classList.remove('is-four-fifths');
   } else if (controlPorFiduciales == true) {
      document.getElementById("contenedorControlPorFiduales").style.display = "block";
      //setupFiduciales();
      document.getElementById("contenedorReproductor").classList.add('is-four-fifths');
      document.getElementById("contenedorReproductor").classList.remove('is-fullhd');
   }
   document.getElementById('divMenuPrincipal').scrollIntoView();
});

// CONTROL POR VOZ - FUNCIONANDO
function setupVoz() {
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

// CONTROL POR BOTONES
myVideo.addEventListener('click', function (e) { // FUNCIONANDO
   e.preventDefault();
   this[this.paused ? this.pause() : this.play()]();
});

// CONTROL POR FIDUCIALES
var contadorFiduciales = 0;

var video, canvas, context, imageData, detector, posit;
var renderer1, renderer2, renderer3;
var scene1, scene2, scene3, scene4;
var camera1, camera2, camera3, camera4;
var plane1, plane2, model, texture;
var step = 0.0;

var modelSize = 35.0; //millimeters

myVideo.ontimeupdate = function() {
   if(Math.floor(myVideo.currentTime) == temporizador){
      myVideo.pause();
   }
};

function onLoad() {
   video = document.getElementById("video");
   canvas = document.getElementById("canvas");
   context = canvas.getContext("2d");

   // canvas.width = window.innerWidth * .68;
   // canvas.height = window.innerHeight * .68;
   canvas.width = parseInt(canvas.style.width);
   canvas.height = parseInt(canvas.style.height);

   if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
   }

   if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
         var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

         if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
         }

         return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
         });
      }
   }

   navigator.mediaDevices
      .getUserMedia({
         video: true
      })
      .then(function (stream) {
         if ("srcObject" in video) {
            video.srcObject = stream;
         } else {
            video.src = window.URL.createObjectURL(stream);
         }
      })
      .catch(function (err) {
         console.log(err.name + ": " + err.message);
      });

   detector = new AR.Detector();
   posit = new POS.Posit(modelSize, canvas.width);

   createRenderers();
   createScenes();

   requestAnimationFrame(tick);
};

function tick() {
   requestAnimationFrame(tick);

   if (video.readyState === video.HAVE_ENOUGH_DATA) {
      snapshot();

      var markers = detector.detect(imageData);
      //drawCorners(markers);
      actualizarCamaraConFiducial(markers);

      render();
   }
};

function snapshot() {
   context.drawImage(video, 0, 0, canvas.width, canvas.height);
   imageData = context.getImageData(0, 0, canvas.width, canvas.height);
};

function createRenderers() {
   renderer1 = new THREE.WebGLRenderer();
   renderer1.setClearColor(0xffff00, 1);
   renderer1.setSize(canvas.width, canvas.height);
   scene1 = new THREE.Scene();
   camera1 = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 1, 1000);
   scene1.add(camera1);

   renderer2 = new THREE.WebGLRenderer();
   renderer2.setClearColor(0xffff00, 1);
   renderer2.setSize(canvas.width, canvas.height);
   scene2 = new THREE.Scene();
   camera2 = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 1, 1000);
   scene2.add(camera2);

   renderer3 = new THREE.WebGLRenderer();
   renderer3.setClearColor(0xffffff, 1);
   renderer3.setSize(canvas.width, canvas.height);
   document.getElementById("contenedorConFiducial").appendChild(renderer3.domElement);

   scene3 = new THREE.Scene();
   camera3 = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
   scene3.add(camera3);

   scene4 = new THREE.Scene();
   camera4 = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 1, 1000);
   scene4.add(camera4);
};

function render() {
   renderer1.clear();
   renderer1.render(scene1, camera1);

   renderer2.clear();
   renderer2.render(scene2, camera2);

   renderer3.autoClear = false;
   renderer3.clear();
   renderer3.render(scene3, camera3);
   renderer3.render(scene4, camera4);
};

function createScenes() {
   plane1 = createPlane();
   scene1.add(plane1);

   plane2 = createPlane();
   scene2.add(plane2);

   texture = createTexture();
   scene3.add(texture);

   model = createModel();
   scene4.add(model);
};

function createPlane() {
   var object = new THREE.Object3D(),
      geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
      material = new THREE.MeshNormalMaterial(),
      mesh = new THREE.Mesh(geometry, material);

   object.eulerOrder = 'YXZ';

   object.add(mesh);

   return object;
};

function createTexture() {
   var texture = new THREE.ImageUtils.loadTexture(listaImagenesBase[contadorFiduciales]),
      object = new THREE.Object3D(),
      geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
      material = new THREE.MeshBasicMaterial({
         map: texture,
         depthTest: false,
         depthWrite: false
      }),
      mesh = new THREE.Mesh(geometry, material);

   object.position.z = -1;
   object.add(mesh);

   return object;
};

function createModel() {
   var object = new THREE.Object3D(),
      geometry = new THREE.PlaneGeometry(5, 5, 5),
      texture = THREE.ImageUtils.loadTexture(listaFiduciales[contadorFiduciales]),
      material = new THREE.MeshBasicMaterial({
         map: texture,
         depthTest: false,
         depthWrite: false,
         transparent: true
      }),
      mesh = new THREE.Mesh(geometry, material);

   object.add(mesh);

   return object;
};

function actualizarCamaraConFiducial(markers) {
   var corners, corner, pose, i;

   if (markers.length > 0) {
      corners = markers[0].corners;

      for (i = 0; i < corners.length; ++i) {
         corner = corners[i];

         corner.x = corner.x - (canvas.width / 2);
         corner.y = (canvas.height / 2) - corner.y;
      }

      pose = posit.pose(corners);

      updateObject(plane1, pose.bestRotation, pose.bestTranslation);
      updateObject(plane2, pose.alternativeRotation, pose.alternativeTranslation);
      updateObject(model, pose.bestRotation, pose.bestTranslation);

   }

   texture.children[0].material.map.needsUpdate = true;
};

function updateObject(object, rotation, translation) {
   object.scale.x = modelSize;
   object.scale.y = modelSize;
   object.scale.z = modelSize;

   object.rotation.x = -Math.asin(-rotation[1][2]);
   object.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
   object.rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);

   object.position.x = translation[0];
   object.position.y = translation[1];
   object.position.z = -translation[2];
   if (pausaPorFiducial == true) {
      if ((translation[0] | 0) >= -8 && (translation[0] | 0) <= 30 && (translation[1] | 0) >= -18 && (translation[1] | 0) <= 8) {
         alert("entro");
         contadorFiduciales += 1;
         temporizador += 60;
         console.log("contadorFiduciales = " + contadorFiduciales);
         createTexture();
         createModel();
         myVideo.play();
         renderer3.clear();
         pausaPorFiducial = !pausaPorFiducial;
      }
   }

};

window.onload = onLoad;