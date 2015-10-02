// ROUTES
//console.log('Loading routes.js');

picalApp.config(function($routeProvider) {
    $routeProvider
        
        .when('/home', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    
        .when('/sync', {
        templateUrl: 'pages/sync.htm',
        controller: 'syncController'
    })
    
        .when('/signup', {
        templateUrl: 'pages/signup.htm',
        controller: 'signupController'
    })
    
        .otherwise({
        redirectTo: '/sync'
    });
});
