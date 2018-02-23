# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.shortcuts import redirect

# Create your views here.

def index(request):
	return render(request, 'index.html')

def pagamento(request):
	return render(request, 'pagamentotransparente.html')

def cadastroplano(request):
	return render(request, 'criarplano.html')

def assinatura(request):
	return render(request, 'assinatura.html')
