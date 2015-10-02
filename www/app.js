// MODULE
var picalApp = angular.module('picalApp', ['ngRoute', 'ngResource', 'firebase', 'ngDialog']);

var opt = {};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        canvasMain = document.getElementById("camera");
        CanvasCamera.initialize(canvasMain);
        // define options
        opt = {
            quality: 100,
            destinationType: CanvasCamera.DestinationType.DATA_URL,
            encodingType: CanvasCamera.EncodingType.JPEG,
            saveToPhotoAlbum:true,
            correctOrientation:true,
            width:640,
            height:480
        };
        //CanvasCamera.start(opt);
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function checkLocale() {
    navigator.globalization.getLocaleName(
        function (locale) {alert('locale: ' + locale.value + '\n');},
        function () {alert('Error getting locale\n');}
    );
}

function onTakePicture() {
    console.log("Take a picture");
    CanvasCamera.takePicture(onTakeSuccess);
}

function onTakeSuccess(data) {
    alert("Photo taken")
}



