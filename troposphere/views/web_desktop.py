import json
import logging
import time
import uuid
import hmac
import hashlib
import base64
import requests

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect
from django.http.request import UnreadablePostError
from django.shortcuts import render, redirect, render_to_response
from django.template import RequestContext

from itsdangerous import Signer, URLSafeTimedSerializer

guac_server = 'http://128.196.64.144:8080/guacamole'
SECRET_KEY = 'secret'

# Create UUID for connection ID
conn_id = str(uuid.uuid4())
base64_conn_id = base64.b64encode(conn_id[2:] + "\0" + 'c' + "\0" + 'hmac')

timestamp = int(round(time.time()*1000))
passwd = 'display'

def _should_redirect():
    return settings.WEB_DESKTOP['redirect']['ENABLED']

def web_desktop(request):

    if request.user.is_authenticated():

        if 'ipAddress' in request.POST:
            ip_address = request.POST['ipAddress']
            atmo_username = request.session.get('username','')

            message = str(timestamp) + 'vnc' + ip_address + '5902' + atmo_username + passwd
            signature = hmac.new(SECRET_KEY, message, hashlib.sha256).digest().encode("base64").rstrip('\n')

            request_string = ('timestamp=' + str(timestamp)
                              + '&guac.port=5902'
                              + '&guac.username=' + atmo_username
                              + '&guac.password=' + passwd
                              + '&guac.protocol=vnc'
                              + '&signature=' + signature
                              + '&guac.hostname=' + atmo_host
                              + '&id=' + conn_id)

            # Send request and record the result
            request_response = requests.post(guac_server + '/api/tokens', data=request_string)
            token = json.loads(request_response.content)['authToken']

            redirect_url = guac_server + '/#/client/' + base64_conn_id + '?token=' + token
            response = HttpResponseRedirect(redirect_url)

            return response
        else:
            raise UnreadablePostError

    else:
        logger.info("not authenticated: \nrequest:\n %s" % request)
        raise PermissionDenied
