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
 
.controller('SignInCtrl', function($scope, $state, $http, DatosUsuario, $ionicPopup, $timeout, $ionicLoading) {
 
  $scope.signIn = function(user) {
  $timeout( function() {
    $scope.show($ionicLoading);
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
       $scope.hide($ionicLoading); 
      $scope.data = response.data;     
      if(response.data[0].per_rut == user.username) {
       console.log('SignInCtrl');
       console.log('---Usuario OK.');
       $state.go('tabs.home');    
      }
      else {
       $scope.showPopup('Rut o contraseña incorrecta.');
       //alert('Usuario Incorrecto!');
        return;
     }
     }, function(reason) {
       console.log('Error en servicio de autenticación: ' +reason.value);
       $scope.showPopup('No se pudieron validar los datos.');
       $scope.hide($ionicLoading); 
      })
      $scope.$broadcast('scroll.refreshComplete');
      },1000);
      $scope.hide($ionicLoading); 
  }
  $scope.showPopup = function(text) {
   $scope.data = {}
   var myPopup = $ionicPopup.show({
    template: "<h4 class'popup'>"+text+".</h4>"});
    myPopup.then(function(res) {
    console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Identificando...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
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
 
.controller('ModalCtrl', function($scope, $ionicModal) {
  //debugger;
   $scope.fecha = new Date();
   $ionicModal.fromTemplateUrl('templates/ingreso_movimientos.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
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
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);    
  };
  $scope.getDetalleCuenta = function(cuenta) { 
   $scope.date = new Date();
   $scope.datadetalleXcuenta = null; 
   console.log('getDetalleCuenta()');
   console.log('Fecha Actual = '+$scope.date);
   DatosUsuario.cuenta = cuenta;
   $scope.cuenta = cuenta;
   console.log('DatosUsuario.cuenta ='+DatosUsuario.cuenta);
   console.log('typeof($scope.consultafecha) ='+typeof($scope.consultafecha));
 
   if (typeof($scope.consultafecha) != 'undefined' && $scope.consultafecha != null) {
       $scope.mesActual = eval("$scope.consultafecha.getMonth() + 1");
       $scope.anoActual = $scope.consultafecha.getFullYear();
    }
    else {
      $scope.mesActual =  eval("$scope.date.getMonth() + 1");
      $scope.anoActual = $scope.date.getFullYear();
      }
    console.log('Mes a Consultar ='+$scope.mesActual);
    console.log('Año a Consultar ='+$scope.anoActual);
   $http.get("http://www.monroy-ramirez.cl/HomeManager/ws/ws_query.php", {params:{cod_query:'detalleXcuenta', cod_cuenta:cuenta, cod_ano:$scope.anoActual, cod_mes:$scope.mesActual}})
      .then(function (response) {
        $scope.datadetalleXcuenta = response.data;     
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
       //console.log('Retorno desde servicio ='+$scope.datadetalleXcuenta);
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