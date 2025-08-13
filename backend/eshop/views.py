from rest_framework.response import Response
from rest_framework.decorators import api_view 
from django.http import JsonResponse

def health(request):
    return JsonResponse({"Status":"ok", "app":"Amazon clone"})
