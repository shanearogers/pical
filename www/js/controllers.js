// CONTROLLERS
//console.log('Loading controllers.js');

//============================================
picalApp.controller('splashController', ['$scope', 'settings', function($scope, settings) {
    console.log('Starting splashController');
    //
}]);
    

//============================================
picalApp.controller('homeController', ['$scope', '$interval' , 'settings', '$firebaseObject', 'ngDialog', function($scope,   $interval,    settings,   $firebaseObject,   ngDialog) {
    console.log('Starting homeController');
    
    var data = new Firebase("https://pical.firebaseio.com");
    var dataObject = $firebaseObject(data);
    dataObject.$bindTo($scope, "data");
    console.log($scope);
          
    $scope.$watch('data.LastEvent.Title', function() {
        //console.log('onTakePicture();');
    });

    $scope.$watch('data.NextEvent.Utc', function() {
        //console.log($scope.data.NextEvent);
        settings.nextEventUtc = parseInt($scope.data.NextEvent.Utc);
    });

    $scope.$watch('data.NextEvent.Attending', function() {
        settings.nextEventAttending = parseInt($scope.data.NextEvent.Attending);
    });
    
    if (settings.maxSyncAttempts == "0" ) {
        settings.maxSyncAttempts = "17";
    }

    var ticker = $interval(function(){ $scope.timeTillNextEvent = settings.calcTimeRemaining(); }, 1000);
    
    $scope.$on('$destroy', function () { 
        $interval.cancel(ticker); 
    });
          
    $scope.myInterval = 500;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    $scope.addSlide = function(i) {
        slides.push({ image: 'http://www.sharoger.com/pical/images/image-' + (i + 1) + '.jpg' });
    };
    for (var i=0; i<4; i++) {
        $scope.addSlide(i);
    }
    
    $scope.open = function () {
        ngDialog.open({
            template: 'pages/popup.htm',
            controller: 'dialogController',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            plain: false,
            closeByDocument: false,
            showClose: true
        });
    };
    
}]);


//============================================
picalApp.controller('syncController', ['$scope', 'settings' , '$http', '$location' , function($scope, settings, $http, $location) {
    console.log('Starting syncController');

    $scope.syncAttempts = 0;
    $scope.minTripTime = 999999;
    getSyncData('http://www.sharoger.com/time.pl');
    
    function getSyncData(url) {
        var beforeTrip = new Date().getTime();
        var thresholdMilliseconds = 500;
        $http
            .get(url)
            .success(function(response) {
                // calculate trip time
            $scope.syncAttempts++;
            var afterTrip = new Date().getTime();
            var tripTime = parseInt(afterTrip - beforeTrip);
            // only continue doing calcs if this trip time is quicker than all previous attempts
            if (tripTime < $scope.minTripTime) {
                $scope.minTripTime = tripTime;
                var midTrip = beforeTrip + Math.floor((tripTime / 2));
                var serverTime = response; //Math.floor(response * 1000);
                $scope.localTimeBeforeTrip = beforeTrip;
                $scope.localTimeAfterTrip = afterTrip;
                $scope.tripTime = tripTime;
                $scope.midTrip = midTrip;
                $scope.serverTime = serverTime;
                $scope.serverOffset = serverTime - midTrip;
            }
        
            if ($scope.syncAttempts < parseInt(settings.minSyncAttempts)) {
                getSyncData(url);
            } else {
                if ($scope.syncAttempts < parseInt(settings.maxSyncAttempts) && 
                    tripTime > thresholdMilliseconds) {
                    if (tripTime > thresholdMilliseconds) {
                        getSyncData(url);
                    } else {
                        $scope.syncAttempts = parseInt(settings.maxSyncAttempts);
                    }
                } else {
                    $location.path('/home');
                }
            }
        });
    }
}]);


//============================================
picalApp.controller('loginController', [
    '$scope', 'settings', function(
     $scope,   settings) {
    $scope.submit = function () {
        if ($scope.newEmail && $scope.newPassword) {
            var ref = new Firebase("https://pical-proto.firebaseio.com");
            ref.createUser({
                email    : $scope.newEmail,
                password : $scope.newPassword
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    $scope.newPassword;
                    $scope.login();
                }
            });
        }
    }
    
    $scope.login = function () {
        var ref = new Firebase("https://pical-proto.firebaseio.com");
        ref.authWithPassword({
            email    : $scope.newEmail,
            password : $scope.newPassword
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }
}]);


//============================================
picalApp.controller('dialogController', ['$scope', 'settings', '$location', 'ngDialog', function($scope, settings, $location, ngDialog) {
    //
    $scope.signup = function () {
        ngDialog.close();
        $location.path('/signup');
    };
}]);


//============================================
picalApp.controller('nextController', ['$scope', 'settings', function($scope, settings) {
    console.log(settings.nextEvent); 
    $scope.timeTillNextEvent = settingsService.timeTillNextEvent();
}]);


//============================================
picalApp.controller('testController', ['$scope', 'settings', function($scope, settings) {
    console.log('Starting testController');
    //
}]);


//============================================
picalApp.controller('signupController', ['$scope', 'settings', function($scope, settings) {
    console.log('Starting signupController');
    //
}]);

