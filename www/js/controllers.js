// CONTROLLERS
//console.log('Loading controllers.js');

picalApp.controller('splashController', ['$scope', 'settings', function($scope, settings) {
    //
}]);

picalApp.controller('homeController', ['$scope', '$interval' , 'settings', '$firebaseObject', function($scope, $interval, settings, $firebaseObject) {
    console.log('Starting homeController');
    //
    var data = new Firebase("https://pical.firebaseio.com");
    var dataObject = $firebaseObject(data);
    dataObject.$bindTo($scope, "data");
    
    //console.log($scope);
    
    $scope.$watch('data.LastMomentTitle', function() {
        //console.log('onTakePicture();');
    });
    $scope.$watch('data.NextEventUtc', function() {
        settings.nextEventUtc = parseInt($scope.data.NextEventUtc);
    });
    if (settings.maxSyncAttempts == "0" ) {
        settings.maxSyncAttempts = "17";
    }
    //console.log('maxSyncAttempts is set to:', settings.maxSyncAttempts);
    $interval(function(){ $scope.timeTillNextEvent = settings.calcTimeRemaining()}, 1000);
}]);

picalApp.controller('syncController', ['$scope', 'settings' , '$http', '$location' , function($scope, settings, $http, $location) {
    console.log('Starting syncController');
    $scope.syncAttempts = 0;
    $scope.minTripTime = 999999;
    getSyncData('http://www.sharoger.com/time.pl');
    
    function getSyncData(url) {
        var beforeTrip = new Date().getTime();
        $http
        .get(url)
        .success(function(response) {
            $scope.syncAttempts++;
            var afterTrip = new Date().getTime();
            var tripTime = afterTrip - beforeTrip;
            // only continue doing calcs if this trip time is quicker than all previous attempts
            if (tripTime < parseInt($scope.minTripTime)) {
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
            //console.log($scope.syncAttempts, $scope.minTripTime, tripTime);
            if ($scope.syncAttempts < parseInt(settings.minSyncAttempts)) {
                getSyncData(url);
            } else {
                if ($scope.syncAttempts < parseInt(settings.maxSyncAttempts) && tripTime > 500) {
                    if (tripTime > 500) {
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

picalApp.controller('loginController', ['$scope', 'settings', function($scope, settings) {

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

picalApp.controller('pastController', ['$scope', 'settings', function($scope, settings) {
    //
}]);

picalApp.controller('nextController', ['$scope', 'settings', function($scope, settings) {
    console.log(settings.nextEvent); 
    $scope.timeTillNextEvent = settingsService.timeTillNextEvent();
}]);

picalApp.controller('testController', ['$scope', 'settings', function($scope, settings) {
    console.log('Starting testController');
    //
}]);
