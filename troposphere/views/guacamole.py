import json
import time
import uuid
import hmac
import hashlib
import base64
import requests

from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect

guac_server = 'http://128.196.64.157:8080/guacamole'
secret = 'secret'

# Create UUID for connection ID
conn_id = str(uuid.uuid4())
base64_conn_id = base64.b64encode(conn_id[2:] + "\0" + 'c' + "\0" + 'hmac')

timestamp = int(round(time.time()*1000))

def guacamole(request):

    if request.user.is_authenticated():

        if 'ipAddress' in request.POST and 'protocol' in request.POST:

            ip_address = request.POST['ipAddress']
            protocol = request.POST['protocol']
            atmo_username = request.session.get('username','')

            port = '5901'
            passwd = 'display'
            if protocol == 'ssh':
                port = '22'
                passwd = ''

            message = str(timestamp) + protocol + ip_address + port + atmo_username + passwd
            signature = hmac.new(secret, message, hashlib.sha256).digest().encode("base64").rstrip('\n')

            request_string = ('timestamp=' + str(timestamp)
                              + '&guac.port=' + port
                              + '&guac.username=' + atmo_username
                              + '&guac.password=' + passwd
                              + '&guac.protocol=' + protocol
                              + '&signature=' + signature
                              + '&guac.hostname=' + ip_address
                              + '&id=' + conn_id)

            # Send request and record the result
            request_response = requests.post(guac_server + '/api/tokens', data=request_string)
            token = json.loads(request_response.content)['authToken']

            response = HttpResponseRedirect(guac_server + '/#/client/' + base64_conn_id + '?token=' + token)

            return response
        else:
            raise UnreadablePostError

    else:
        raise PermissionDenied
