app.config(['$httpProvider', '$interpolateProvider',
    function($httpProvider, $interpolateProvider) {
    /* for compatibility with django teplate engine */
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
    /* csrf */
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    //$httpProvider.defaults.withCredentials = true;
}]);

app.controller('IndexCtrl', function($window, $http, $rootScope, $sce, $scope){

	//"email":"filipeassad@gmail.com",
	//"token":"F6AF966347B3428D9AB14695384D019A",

	//var urlpag = "https://ws.sandbox.pagseguro.uol.com.br/v2/checkout/?email=filipeassad@gmail.com"+
	//"&token=F6AF966347B3428D9AB14695384D019A";

	var urlpag = "http://127.0.0.1:8000/api/pagamento";

	$scope.nomeCom = "Mayara Cardoso Beneti";
	$scope.dddCom = "67";
	$scope.telefoneCom = "999220094";
	$scope.emailCom = "may.cbeneti@gmail.com";
	$scope.ruaCom = "";
	$scope.numeroCom = "";
	$scope.complementoCom = "";
	$scope.bairroCom = "";
	$scope.cidadeCom = "";
	$scope.estadoCom = "";
	$scope.paisCom = "";
	$scope.cepCom = "";

	$scope.produtos = [

		{	
			"id":"0001",
			"img": "../static/img/hd-imagem.jpg" , 
			"nome": "HD de 1TB", 
			"precoesc":"R$ 250,00",
			"preco": "250.00",
			"selecionado": false,
			"quantidade": 0
		},

		{	
			"id":"0002",
			"img": "../static/img/memoria-imagem.jpg" , 
			"nome": "Memória 8GB", 
			"precoesc":"R$ 120,00",
			"preco": "120.00",
			"selecionado": false,
			"quantidade": 0
		},

		{	
			"id":"0003",
			"img": "../static/img/processador-imagem.jpg" , 
			"nome": "Core I7", 
			"precoesc":"R$ 1350,00",
			"preco": "1350.00",
			"selecionado": false,
			"quantidade": 0
		}

	];

	$scope.seleciona = function(pro){
		pro.selecionado = !pro.selecionado;
	}

	$scope.comprar = function(){

		//meuip: 192.168.1.96

		var header = "Content-Type: application/json; charset=UTF-8";
		var dataFile = {
				"sender": {
					"name":$scope.nomeCom,
					"email":$scope.emailCom,
					"phone":{
						"areaCode":$scope.dddCom,
						"number":$scope.telefoneCom
					}
				},
				"ip": "192.168.1.96",
				"currency":"BRL",
				"items":[]										
		};		

		for(var i=0; i < $scope.produtos.length; i++){
			if($scope.produtos[i].selecionado == true){
				dataFile.items.push({	
										"id":$scope.produtos[i].id, 
										"description":$scope.produtos[i].nome,
										"amount":$scope.produtos[i].preco,
										"quantity":$scope.produtos[i].quantidade
									 
									});
			}
		}
		
		/*
		var item = 1;
		for(var i=0; i < $scope.produtos.length; i++){

			console.log("" + item);

			if($scope.produtos[i].selecionado == true){
				dataFile["itemId"+ item] = $scope.produtos[i].id;
				dataFile["itemDescription"+ item] = $scope.produtos[i].nome;
				dataFile["itemAmount"+ item] = $scope.produtos[i].preco;
				dataFile["itemQuantity"+ item] = $scope.produtos[i].quantidade;
				item++;
			}			

		}*/

		$http({method: 'POST', url: urlpag, data: dataFile, headers: header }).
            success(function(data, status, headers, config) {
            	//$window.location.href = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=' + data.code;
            	if(data != "naodeu"){
            		console.log(data)
            		$window.location.href = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=' + data;
            	}else{
            		alert("Não deu certo");
            	}
            	
            }).
            error(function(data, status, headers, config) {
            	 alert("Integração com o pagSeguro não funcionou!");
            }); 

	}
	

});