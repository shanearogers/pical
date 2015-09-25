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
    
        .otherwise({
        redirectTo: '/sync'
    });
});
