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

app.controller('CriarPlanoCtrl', function($window, $http, $rootScope, $sce, $scope){

	var self = this;
	var codsessao = "";
	var urlpag = "http://127.0.0.1:8000/api/sessao";
	var urlenviar = "http://127.0.0.1:8000/api/planocriator";


	this.nome = "";
	this.duracao = "";
	this.valor = "";

	this.periodos = ["WEEKLY","MONTHLY","BIMONTHLY","TRIMONTHLY","SEMIANNUALLY","YEARLY"];
	this.selecionado = "WEEKLY";

	/*$http({method: 'GET', url: urlpag }).
	        success(function(data, status, headers, config) {
	            
	            if(data != "naodeu"){	            	
	            	codsessao = data;
	            }else{
	            	alert("não deu pra pegar a sessao!");
	            }
	    	}).error(function(data, status, headers, config) {
	        	console.log("Não Funcionou");

	});*/

	this.cadastrar = function(){

		var header = "Content-Type: application/json; charset=UTF-8";

		var dataFile = {

			"preApproval": {
				"name": self.nome,
				"charge": "AUTO",
				"period": self.selecionado,
				"amountPerPayment": self.valor.toFixed(2),
				"expiration":{
					"value": parseInt(self.duracao),
					"unit": "YEARS"
				}
			},
			"receiver": {
				"email":"filipeassad@gmail.com"
			}

		};

		$http({method: 'POST', url: urlenviar, data: dataFile, headers: header }).
		            success(function(data, status, headers, config) {
		            	//$window.location.href = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=' + data.code;
		            	if(data != "naodeu"){
		            		console.log(data);
		            		alert("Pagamento efetuado com sucesso!");
		            	}else{
		            		alert("Não deu certo");
		            	}	            	
		            	
		            }).
		            error(function(data, status, headers, config) {
		            	 alert("Integração com o pagSeguro não funcionou!");
		            }); 

	}

});