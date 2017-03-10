import json
import time
import uuid
import hmac
import hashlib
import base64
import requests

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect

guac_server = settings.GUACAMOLE['SERVER_URL']
secret = settings.GUACAMOLE['SECRET_KEY']


def guacamole(request):

    if request.user.is_authenticated():

        # Create UUID for connection ID
        conn_id = str(uuid.uuid4())
        base64_conn_id = base64.b64encode(conn_id[2:] + "\0" + 'c' + "\0" + 'hmac')

        # Create timestamp that looks like: 1489181545018
        timestamp = str(int(round(time.time()*1000)))

        if 'ipAddress' in request.POST and 'protocol' in request.POST:

            # Get IP, protocol, and username from request that was sent from button click
            ip_address = request.POST['ipAddress']
            protocol = request.POST['protocol']
            atmo_username = request.session.get('username','')

            # Change some parameters depending on SSH or VNC protocol
            # Note: passwd is hardcoded to 'display'. This doesn't seem ideal but it is
            #       done the same in web_desktop.py
            port = '5901'
            passwd = 'display'
            if protocol == 'ssh':
                port = '22'
                passwd = ''

            # Concatenate info for a message
            message = timestamp + protocol + ip_address + port + atmo_username + passwd

            # Hash the message into a signature
            signature = hmac.new(secret, message, hashlib.sha256).digest().encode("base64").rstrip('\n')

            # Build the POST request
            request_string = ('timestamp=' + timestamp
                              + '&guac.port=' + port
                              + '&guac.username=' + atmo_username
                              + '&guac.password=' + passwd
                              + '&guac.protocol=' + protocol
                              + '&signature=' + signature
                              + '&guac.hostname=' + ip_address
                              + '&id=' + conn_id)

            # Send request to Guacamole backend and record the result
            request_response = requests.post(guac_server + '/api/tokens', data=request_string)
            token = json.loads(request_response.content)['authToken']

            return HttpResponseRedirect(guac_server + '/#/client/' + base64_conn_id + '?token=' + token)
        else:
            raise UnreadablePostError

    else:
        raise PermissionDenied
