from django.conf.urls import include, url
from rest_framework.urlpatterns import format_suffix_patterns
from .import views

urlpatterns = [
	url(r'^pagamento', views.ApiPagamento.as_view()),
	url(r'^sessao', views.ApiSessao.as_view()),
	url(r'^pagar', views.ApiPagamentoTransparente.as_view()),	
	url(r'^planocriator', views.ApiCadastroPlano.as_view()),	
	url(r'^assinar', views.ApiAssinarPlano.as_view()),
]