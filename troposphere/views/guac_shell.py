import json
import time
import uuid
import hmac
import hashlib
import base64
import requests

from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect

guac_server = 'http://128.196.64.144:8080/guacamole'
secret = 'secret'

# Create UUID for connection ID
conn_id = str(uuid.uuid4())
base64_conn_id = base64.b64encode(conn_id[2:] + "\0" + 'c' + "\0" + 'hmac')

timestamp = int(round(time.time()*1000))

def guac_shell(request):

    if request.user.is_authenticated():

        if 'ipAddress' in request.POST:

            ip_address = request.POST['ipAddress']
            atmo_username = request.session.get('username','')

            message = str(timestamp) + 'ssh' + ip_address + '22' + atmo_username
            signature = hmac.new(secret, message, hashlib.sha256).digest().encode("base64").rstrip('\n')

            request_string = ('timestamp=' + str(timestamp)
                              + '&guac.port=22'
                              + '&guac.username=' + atmo_username
                              + '&guac.protocol=ssh'
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
