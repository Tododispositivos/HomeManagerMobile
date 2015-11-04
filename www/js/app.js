// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('HomeManagerMobile', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    console.log('Plataforma: ',ionic.Platform.platform());
    console.log('Versión: ',ionic.Platform.version());
  });
}) 

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: 'templates/admin.html'
     })
    .state('bancos', {
      url: '/bancos',
      templateUrl: 'templates/bancos.html',
      controller: 'bancoCtrl'
     })
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.cuentas', {
      url: '/cuentas',
      views: {
        'home-tab': {
          templateUrl: 'templates/cuentas.html',
          controller: 'CuentasTabCtrl'
        }
      }
    })
    .state('tabs.cuentasdetalle', {
      url: '/cuentasdetalle',
      views: {
        'home-tab': {
          templateUrl: 'templates/cuentas_detalle.html',
          controller: 'CuentasTabCtrl'
        }
      }
    })
    .state('tabs.pdf', {
      url: '/pdf',
      views: {
        'home-tab': {
          templateUrl: 'templates/prueba_pdf.html',
          controller: 'TestController'
        }
      }
    })
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/eventhome",
      views: {
        'menuContent' :{
          templateUrl: "templates/event-home.html"
        }
      }
    })
   $urlRouterProvider.otherwise('/sign-in');
})

.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow All.
    '*'
  ])})

.factory('DatosUsuario', function() {
  return {
      rut :'',
      nombre:'',
      adm:'',
      por:'',
      nivel:'',
      familia:'',
      email:''
  };
})

.controller('SignInCtrl', function($scope, $state, $http, DatosUsuario, $ionicPopup, $timeout) {
  
  $scope.signIn = function(user) {
    $http.get("http://www.monroy-ramirez.cl/HomeManager/ws/ws_query.php", {params:{cod_query:'login', login_user:user.username, login_pass:user.password}})
    .then(function (response) {
      DatosUsuario.rut    = response.data[0].per_rut;
      DatosUsuario.nombre = response.data[0].per_nom;
      DatosUsuario.adm    = response.data[0].per_adm;
      DatosUsuario.por    = response.data[0].per_por;
      DatosUsuario.nivel  = response.data[0].per_nivel;
      DatosUsuario.familia= response.data[0].cod_familia;
      DatosUsuario.email  = response.data[0].per_email1;   
      DatosUsuario.cuenta = '';      
      $scope.data = response.data;      
      if(response.data[0].per_rut == user.username) {
       console.log('SignInCtrl');
       console.log('---Usuario OK.');
       $state.go('tabs.home');     
      }
      else {
       $scope.showPopup();
       //alert('Usuario Incorrecto!'); 
        return;
     }
     })    
  }


 $scope.showPopup = function() {
   $scope.data = {}
   var myPopup = $ionicPopup.show({
    template: "<style>.popup { color:#000000;}</style>Rut o contraseña incorrecta."});
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };
})

  


.controller('HomeTabCtrl', function($scope, DatosUsuario, $ionicSlideBoxDelegate) {
  $scope.rut = DatosUsuario.rut;
  $scope.nombre = DatosUsuario.nombre;
  $scope.adm = DatosUsuario.adm;
  $scope.por = DatosUsuario.por;
  $scope.nivel = DatosUsuario.nivel;
  $scope.familia = DatosUsuario.familia;
  $scope.email = DatosUsuario.email;
  $scope.date = new Date();
  console.log('HomeTabCtrl');
  console.log('Datos Usuario:', DatosUsuario.nombre);
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  $scope.update = function() {
    $ionicSlideBoxDelegate.update();
  }; 
  
 
})

.controller('CuentasTabCtrl', function($scope, $state, DatosUsuario, $http, $timeout, $ionicSlideBoxDelegate) {
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  $scope.update = function() {
    $ionicSlideBoxDelegate.update();
  }; 
  $scope.getCuentas = function() { 
     console.log('getCuentas()');
     $scope.getCuentasFamiliares();
     $scope.getMisCuentas();
     };
  $scope.getCuentasFamiliares = function() { 
    $http.get("http://www.monroy-ramirez.cl/HomeManager/ws/ws_query.php", {params:{cod_query:'cuentasXfamilia', user_fam:DatosUsuario.familia}})
    .then(function (response) {
      console.log('getCuentasFamiliares()');
      $scope.dataq4 = response.data;    
      $scope.date = new Date(); 
      $ionicSlideBoxDelegate.$getByHandle('image-viewer').update(); 
    })};
  $scope.getMisCuentas = function() { 
   $http.get("http://www.monroy-ramirez.cl/HomeManager/ws/ws_query.php", {params:{cod_query:'cuentasXrut', login_user:DatosUsuario.rut}})
      .then(function (response) {
        console.log('getMisCuentas()');
        $scope.dataq3 = response.data;      
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update(); 
       })};
  $scope.refreshCuentas = function() {
    console.log('refreshCuentas()');
    $timeout( function() {
      $scope.getCuentas();
      //$scope.getCuentasFamiliares();
      //$scope.getMisCuentas();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);     
  };
  $scope.getDetalleCuenta = function(cuenta) { 
   $scope.date = new Date();
   DatosUsuario.cuenta = cuenta;
   console.log('DatosUsuario.cuenta ='+DatosUsuario.cuenta);
   $scope.mesActual = $scope.date.getMonth();
   $scope.anoActual = $scope.date.getFullYear();
   $http.get("http://www.monroy-ramirez.cl/HomeManager/ws/ws_query.php", {params:{cod_query:'detalleXcuenta', cod_cuenta:cuenta, cod_ano:$scope.anoActual, cod_mes:$scope.mesActual}})
      .then(function (response) {
        $scope.datadetalleXcuenta = response.data;      
    })};
  $scope.refreshDetalleCuenta = function() {
      console.log('refreshDetalleCuenta('+DatosUsuario.cuenta+')');
      $timeout( function() {
        $scope.getDetalleCuenta(DatosUsuario.cuenta);
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);     
  };
})

.controller('bancoCtrl', function($scope, $http, DatosUsuario) {
    $http.get("http://www.monroy-ramirez.cl/HomeManager/ws/ws_query.php", {params:{cod_query:'bancosXfamilia', user_fam:DatosUsuario.familia}})
    .then(function (response) {
      console.log('bancoCtrl');
      $scope.data = response.data;      
    });
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
   $scope.attendees = [
    { firstname: 'Nicolas', lastname: 'Cage' },
    { firstname: 'Jean-Claude', lastname: 'Van Damme' },
    { firstname: 'Keanu', lastname: 'Reeves' },
    { firstname: 'Steven', lastname: 'Seagal' }
  ];
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

/*.controller('PDFCtrl', [ '$scope', 'PDFViewerService', function($scope, pdf) {
    $scope.viewer = pdf.Instance("viewer");
    $scope.nextPage = function() {
        $scope.viewer.nextPage();
    };
    $scope.prevPage = function() {
        $scope.viewer.prevPage();
    };
    $scope.pageLoaded = function(curPage, totalPages) {
        $scope.currentPage = curPage;
        $scope.totalPages = totalPages;
    };
}])

.controller('TestController', [ '$scope', 'PDFViewerService', '$sce', function($scope, pdf, $sce) {
  console.log('TestController: new instance');
  $scope.pdfURL = $sce.trustAsResourceUrl("http://www.monroy-ramirez.cl/HomeManager/angular/Invoice.pdf");
  $scope.instance = pdf.Instance("viewer");
  $scope.nextPage = function() {
    $scope.instance.nextPage();
  };
  $scope.prevPage = function() {
    $scope.instance.prevPage();
  };
  $scope.gotoPage = function(page) {
    $scope.instance.gotoPage(page);
  };
  $scope.pageLoaded = function(curPage, totalPages) {
    $scope.currentPage = curPage;
    $scope.totalPages = totalPages;
  };
  $scope.loadProgress = function(loaded, total, state) {
    console.log('loaded =', loaded, 'total =', total, 'state =', state);
  };
}])*/