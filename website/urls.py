from django.conf.urls import include, url
from rest_framework.urlpatterns import format_suffix_patterns
from .import views


urlpatterns = [
	url(r'^$', views.index),
	url(r'^pagamento', views.pagamento),
	url(r'^addplano', views.cadastroplano),
	url(r'^assinatura', views.assinatura),

]