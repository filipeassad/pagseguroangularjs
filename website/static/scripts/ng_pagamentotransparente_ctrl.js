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

app.controller('PagamentoCtrl', function($window, $http, $rootScope, $sce, $scope){

	var self = this;

	var urlpag = "http://127.0.0.1:8000/api/sessao";
	var urlenviar = "http://127.0.0.1:8000/api/pagar";
	var codsessao = "";
	var senderhash = "";
	var tamcvv = 3;
	var bandeira = "";
	var valorcompra = 0;
	var semjuros = 0;

	this.nomeCom = "Mayara Cardoso Beneti";
	this.dddCom = "67";
	this.telefoneCom = "999220094";
	this.emailCom = "may.cbeneti@sandbox.pagseguro.com.br";
	this.cpfCom = "02081955130";
	this.ncartao = "";
	this.tptpagamentos = [];
	this.dtvalidade = {"hide":true, "texto":""};
	this.nometitular = {"hide":true, "texto":""};
	this.codseguranaca = {"hide":true, "texto":""};
	this.parcelamento = {"lista": [], "hide": true, "selecionado":{}};
	this.formcartao = true;
	this.formboleto = true;

	//listatest.push({"nome":"Cartão de Crédito", "img":"../static/img/cartao.png"});

	this.produtos = [

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

	//{"nome":"Cartão de Crédito", "img":"../static/img/cartao.png"}, {"nome":"Débito Online", "img":"../static/img/debito.png"}, {"nome":"Boleto", "img":"../static/img/barcode.png"}
	
	this.isLoading = false;
	$http({method: 'GET', url: urlpag }).
	        success(function(data, status, headers, config) {
	            
	            if(data != "naodeu"){
	            	
	            	codsessao = data; 
	            	PagSeguroDirectPayment.setSessionId(codsessao);

	            	PagSeguroDirectPayment.getPaymentMethods({
					    success: function(response) {					    	
					    	self.tptpagamentos.push({"nome": "Cartão de Crédito", "img":"../static/img/cartao.png", "objpag": response.paymentMethods.CREDIT_CARD});
					    	self.tptpagamentos.push({"nome": "Débito Online", "img":"../static/img/debito.png", "objpag": response.paymentMethods.ONLINE_DEBIT});
					    	self.tptpagamentos.push({"nome": "Boleto", "img":"../static/img/barcode.png", "objpag": response.paymentMethods.BOLETO});
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

	// METODOS DE CLIQUE

	this.seleciona = function(pro){
		pro.selecionado = !pro.selecionado;
		this.calculavalor();
	}

	this.selecionapag = function(pag){
		if(pag.nome == "Cartão de Crédito"){
			this.formcartao = false;
			this.formboleto = true;
		}else if(pag.nome = "Boleto"){
			this.formboleto = false;
			this.formcartao = true;
		}
		else{
			this.formcartao = true;
			this.formboleto = true;
		}
	}

	this.comprar = function(){		
		senderhash = PagSeguroDirectPayment.getSenderHash();
		PagSeguroDirectPayment.createCardToken({
		    cardNumber: self.ncartao,
		    cvv: self.codseguranaca.texto,
		    brand: bandeira,
		    expirationMonth: self.dtvalidade.texto.getMonth() + 1 ,
		    expirationYear: self.dtvalidade.texto.getFullYear(),
		    success: function(response) {		    	

		    	var header = "Content-Type: application/json; charset=UTF-8";
		    	var dataFile = {
		    			"mode":"default",
						"currency":"BRL",
						"receiverEmail":"filipeassad@gmail.com",
						"sender": {
							"hash":senderhash,
							"name":self.nomeCom,
							"email":self.emailCom,
							"phone":{
								"areaCode":self.dddCom,
								"number":self.telefoneCom
							},
							"documents":
								{
									"document": {
										"type":"CPF",
										"value": "11475714734"
									}
								}
						},
						"ip": "192.168.1.96",
						"items":[],
						"method":"creditCard",
						"creditCard":{
							"token":response.card.token,
							"installment":{
								"quantity":self.parcelamento.selecionado.quantity,
								"noInterestInstallmentQuantity":semjuros,
								"value":parseFloat(self.parcelamento.selecionado.installmentAmount + "").toFixed(2)
							},
							"holder":{
								"name": self.nometitular.texto,
								"documents": {
									"document":{
										"type":"CPF",
										"value": "11475714734"	
									}
								}
							},
							"billingAddress": {
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
						"shipping":{
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

				};

				for(var i=0; i < self.produtos.length; i++){
					if(self.produtos[i].selecionado == true){
						dataFile.items.push({	
												"id":self.produtos[i].id, 
												"description":self.produtos[i].nome,
												"amount":self.produtos[i].preco,
												"quantity":self.produtos[i].quantidade											 
											});
					}
				}

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


		    },
		    error: function(response) {
		    	alert("Problemas com o cartão de crédito!");
		    },
		    complete: function(response) {
		        //tratamento comum para todas chamadas
		    }
		});
	}

	this.gerarboleto = function(){

		var header = "Content-Type: application/json; charset=UTF-8";
    	var dataFile = {
    			"mode":"default",
				"currency":"BRL",
				"receiverEmail":"filipeassad@gmail.com",
				"sender": {
					"hash":senderhash,
					"name":self.nomeCom,
					"email":self.emailCom,
					"phone":{
						"areaCode":self.dddCom,
						"number":self.telefoneCom
					},
					"documents":
						{
							"document": {
								"type":"CPF",
								"value": "11475714734"
							}
						}
				},
				"ip": "192.168.1.96",
				"items":[],
				"method":"boleto",
				"shipping":{
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

		};

		for(var i=0; i < self.produtos.length; i++){
			if(self.produtos[i].selecionado == true){
				dataFile.items.push({	
										"id":self.produtos[i].id, 
										"description":self.produtos[i].nome,
										"amount":self.produtos[i].preco,
										"quantity":self.produtos[i].quantidade											 
									});
			}
		}

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

	this.calculavalor = function(){
		valorcompra = 0;
		for(i = 0; i < this.produtos.length; i++){
			if(this.produtos[i].selecionado){
				valorcompra = (parseFloat(this.produtos[i].preco) * this.produtos[i].quantidade)   + valorcompra;
			}
		}		
	}

	//METODOS DE ONCHANGE

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

				PagSeguroDirectPayment.getInstallments({
				    amount: valorcompra,
				    brand: bandeira,
				    success: function(response) {
				    	
				    	self.parcelamento.hide = false;
				    	if(response.installments[bandeira].length > 0){
				    		self.parcelamento.lista = response.installments[bandeira];
				    		self.parcelamento.selecionado = response.installments[bandeira][0];	
				    		for(i = 0; i < self.parcelamento.lista.length; i++){
				    			self.parcelamento.lista[i]["rotulo"] = self.parcelamento.lista[i].quantity 
				    													+ "x de R$" 
				    													+ self.parcelamento.lista[i].installmentAmount
				    													+ " total: R$"
				    													+ self.parcelamento.lista[i].totalAmount;
				    		}
				    	}
				    	semjuros = response.installments.quantity;
				    	$scope.$apply();				    	
				    },
				    error: function(response) {
				        self.parcelamento.hide = true;
				        $scope.$apply();
				    },
				    complete: function(response) {
				        //tratamento comum para todas chamadas
				    }
				});
				
				$scope.$apply();

		    },
		    error: function(response) {
				self.dtvalidade.hide = true;
				self.nometitular.hide = true; 
				self.codseguranaca.hide = true;	
				self.parcelamento.hide = true;
				$scope.$apply();			
		    },
		    complete: function(response) {
		        //tratamento comum para todas chamadas
		    }
		});
		    
	}

});