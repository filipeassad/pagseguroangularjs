# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.shortcuts import redirect
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
import requests
import xml.etree.ElementTree as ET
import httplib
import xml.dom.minidom
import dicttoxml
import json
from xml.dom.minidom import parseString

class ApiPagamento(APIView):

	def post(self, request, *args, **kwargs):

		#https://github.com/quandyfactory/dicttoxml 
		#print(request.data)
		#?email=filipeassad@gmail.com&token=F6AF966347B3428D9AB14695384D019A
		url = 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout'
		headers = {'Content-Type':'application/xml; charset=UTF-8'}
		params = {'email':'filipeassad@gmail.com', 'token':'F6AF966347B3428D9AB14695384D019A'}
		

		xml = dicttoxml.dicttoxml(request.data, attr_type=False,custom_root='checkout')
		#print(parseString(xml).toprettyxml())
		r = requests.post(url, params=params, data=xml, headers=headers)

		print(r.text)
		print(r.status_code)

		if r.status_code == 200:
			resultado = ET.fromstring(r.text)
			return HttpResponse(resultado.find('code').text)
		else:
			return HttpResponse("naodeu")


class ApiSessao(APIView):

	def get(self, request, *args, **kwargs):
		
		url = 'https://ws.sandbox.pagseguro.uol.com.br/v2/sessions'
		headers = {'Content-Type':'application/xml; charset=UTF-8'}
		params = {'email':'filipeassad@gmail.com', 'token':'F6AF966347B3428D9AB14695384D019A'}

		r = requests.post(url, params=params, headers=headers)
		print(r.text)
		print(r.status_code)
		if r.status_code == 200:
			resultado = ET.fromstring(r.text)
			return HttpResponse(resultado.find('id').text)
		return HttpResponse("naodeu")

class ApiPagamentoTransparente(APIView):

	def post(self, request, *args, **kwargs):

		#https://github.com/quandyfactory/dicttoxml 
		#print(request.data)
		#?email=filipeassad@gmail.com&token=F6AF966347B3428D9AB14695384D019A
		url = 'https://ws.sandbox.pagseguro.uol.com.br/v2/transactions'
		headers = {'Content-Type':'application/xml; charset=UTF-8'}
		params = {'email':'filipeassad@gmail.com', 'token':'F6AF966347B3428D9AB14695384D019A'}		

		xml = dicttoxml.dicttoxml(request.data, attr_type=False,custom_root='payment')
		#print(parseString(xml).toprettyxml())
		r = requests.post(url, params=params, data=xml, headers=headers)

		#print(r.text)
		print(r.status_code)

		if r.status_code == 200:
			resultado = ET.fromstring(r.text)
			return HttpResponse(resultado.find('code').text)
		else:
			return HttpResponse("naodeu")

class ApiCadastroPlano(APIView):

	def post(self, request, *args, **kwargs):

		url = 'https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/request'
		headers = {'Content-Type':'application/json; charset=UTF-8',
					'accept':'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'	}
		params = {'email':'filipeassad@gmail.com', 'token':'F6AF966347B3428D9AB14695384D019A'}
		r = requests.post(url, params=params, data=json.dumps(request.data), headers=headers)

		print(request.data)
		print(r.text)
		print(r.status_code)

		if r.status_code == 200:
			resultado = json.loads(r.text)
			return HttpResponse(resultado.get('code'))
		else:
			return HttpResponse("naodeu")

class ApiAssinarPlano(APIView):

	def post(self, request, *args, **kwargs):

		url = 'https://ws.sandbox.pagseguro.uol.com.br/pre-approvals'
		headers = {'Content-Type':'application/json; charset=UTF-8',
					'accept':'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'	}
		params = {'email':'filipeassad@gmail.com', 'token':'F6AF966347B3428D9AB14695384D019A'}
		r = requests.post(url, params=params, data=json.dumps(request.data), headers=headers)

		print(request.data)
		print(r.text)
		print(r.status_code)

		if r.status_code == 200:
			resultado = json.loads(r.text)
			return HttpResponse(resultado.get('code'))
		else:
			return HttpResponse("naodeu")