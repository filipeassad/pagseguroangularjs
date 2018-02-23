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

app.controller('AssinaturaCtrl', function($window, $http, $rootScope, $sce, $scope){

	var self = this;

	var urlsessao = "http://127.0.0.1:8000/api/sessao";
	var urlassina = "http://127.0.0.1:8000/api/assinar";
	var codsessao = "";
	var senderhash = "";
	var tamcvv = 3;
	var bandeira = "";
	var valorcompra = 0;
	var semjuros = 0;
	var pagamentocar = {};
	var selecionado = {};

	this.nome = "Mayara Cardoso Beneti";
	this.ddd = "67";
	this.telefone = "999220094";
	this.email = "may.cbeneti@sandbox.pagseguro.com.br";
	this.cpf = "02081955130";

	this.ncartao = "";
	this.dtvalidade = {"hide":true, "texto":""};
	this.nometitular = {"hide":true, "texto":""};
	this.codseguranaca = {"hide":true, "texto":""};

	this.planos = [

		{
			"nome": "Curso de Violão",
			"valor": "R$ 35,50 por mês",
			"codigo": "C98CB43AABAB453994548F89A380F684",
			"img": "../static/img/violao.jpg"
		},

		{
			"nome": "Curso de cavaquinho",
			"valor": "R$ 25,35 por mês",
			"codigo": "954062FC1414C42884D80F954431FF38",
			"img": "../static/img/cavaco.jpg"
		},

		{
			"nome": "Curso de bateria",
			"valor": "R$ 55,35 por mês",
			"codigo": "0D954C8686867E2BB4D6FFB7F7B9F71C",
			"img": "../static/img/bateria.jpg"
		}

	];

	this.isLoading = false;

	$http({method: 'GET', url: urlsessao }).
	        success(function(data, status, headers, config) {
	            
	            if(data != "naodeu"){
	            	
	            	codsessao = data; 
	            	PagSeguroDirectPayment.setSessionId(codsessao);

	            	PagSeguroDirectPayment.getPaymentMethods({
					    success: function(response) {		

					    	pagamentocar = response.paymentMethods.CREDIT_CARD;		    	
					    	self.isLoading = true;
					    	$scope.$apply();

					    },
					    error: function(response) {
					    },
					    complete: function(response) {
					    }
					});				
	            	
	            }else{
	            	alert("não deu pra pegar a sessao!");
	            }
	    	}).error(function(data, status, headers, config) {
	        	console.log("Não Funcionou");

	});

	this.selplano = function(plano){
		selecionado = plano;
	}

	this.tamanhocvv = function(){
		if(this.codseguranaca.texto.length > tamcvv){
			this.codseguranaca.texto = this.codseguranaca.texto.substr(0,tamcvv);
		}
	}

	this.verificacartao = function(){

		PagSeguroDirectPayment.getBrand({

			cardBin: self.ncartao,
		    success: function(response) {		    	
		    	
				self.nometitular.hide = false; 
				self.codseguranaca.hide = false;
				
				if(response.brand.expirable){
					self.dtvalidade.hide = false;
				}else{
					self.dtvalidade.hide = true;
				}
				
				bandeira = response.brand.name;
				tamcvv = response.brand.cvvSize;
				
				$scope.$apply();

		    },
		    error: function(response) {
				self.dtvalidade.hide = true;
				self.nometitular.hide = true; 
				self.codseguranaca.hide = true;	
				$scope.$apply();			
		    },
		    complete: function(response) {
		        //tratamento comum para todas chamadas
		    }
		});
		    
	}

	this.assinar = function(){		
		senderhash = PagSeguroDirectPayment.getSenderHash();
		PagSeguroDirectPayment.createCardToken({
		    cardNumber: self.ncartao,
		    cvv: self.codseguranaca.texto,
		    brand: bandeira,
		    expirationMonth: self.dtvalidade.texto.getMonth() + 1 ,
		    expirationYear: self.dtvalidade.texto.getFullYear(),
		    success: function(response) {		    	

		    	console.log(response.card.token);

		    	var header = "Content-Type: application/json; charset=UTF-8";
		    	var dataFile = {
		    			"plan":selecionado.codigo,
						"sender": {
							"name":self.nome,
							"email":self.email,
							"hash":senderhash,
							"phone":{
								"areaCode":self.ddd,
								"number":self.telefone
							},
							"documents":[
								{
									"type":"CPF",
									"value": "11475714734"
								}
							],
							"address": {
								"street": "Av. Pagseguro",
								"number": "9999",
								"complement": "99 andar",
								"district": "Jardim Internet",
								"city":"Cidade Exemplo",
								"state": "SP",
								"country": "BRA",
								"postalCode": "99999999"
							}

						},
						"paymentMethod":{
							"type": "CREDITCARD",
							"creditCard":{
								"token":response.card.token + "",
								"holder":{
									"name": self.nometitular.texto,
									"birthDate": "20/12/1990",
									"documents": [
										{
											"type":"CPF",
											"value": "11475714734"	
										}
									],
									"billingAddress": {
										"street": "Av. Pagseguro",
										"number": "9999",
										"complement": "99 andar",
										"district": "Jardim Internet",
										"city":"Cidade Exemplo",
										"state": "SP",
										"country": "BRA",
										"postalCode": "99999999"
									},
									"phone":{
										"areaCode":self.ddd,
										"number":self.telefone
									}
								}								
							}
						}
						/*"shipping":{
							"address": {
								"street": "Av. Pagseguro",
								"number": "9999",
								"complement": "99 andar",
								"district": "Jardim Internet",
								"city":"Cidade Exemplo",
								"state": "SP",
								"country": "BRA",
								"postalCode": "99999999"
							}
						},*/	

				};

				$http({method: 'POST', url: urlassina, data: dataFile, headers: header }).
		            success(function(data, status, headers, config) {
		            	//$window.location.href = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=' + data.code;
		            	if(data != "naodeu"){
		            		console.log(data);
		            		alert("Assinatura efetuada com sucesso!");
		            	}else{
		            		alert("Não deu certo");
		            	}	            	
		            	
		            }).
		            error(function(data, status, headers, config) {
		            	 alert("Integração com o pagSeguro não funcionou!");
		            }); 		


		    },
		    error: function(response) {
		    	alert("Problemas com o cartão de crédito!");
		    },
		    complete: function(response) {
		        //tratamento comum para todas chamadas
		    }
		});
	}


});