import json
import logging
import time
import uuid
import hmac
import hashlib
import base64
import requests

guac_server = 'http://192.168.0.60:8080/guacamole'
SECRET_KEY = 'secret'

# Create UUID for connection ID
conn_id = str(uuid.uuid4())
base64_conn_id = base64.b64encode(conn_id[2:] + "\0" + 'c' + "\0" + 'hmac')

timestamp = int(round(time.time()*1000))

passwd = 'display'

atmo_host = '192.168.0.60'
atmo_username = 'calvinmclean'

message = str(timestamp) + 'vnc' + atmo_host + '5902' + atmo_username + passwd
signature = hmac.new(SECRET_KEY, message, hashlib.sha256).digest().encode("base64").rstrip('\n')

print 'Message is: ' + message + '\n'
print 'Signature is: ' + signature + '\n'

request_string = ('timestamp=' + str(timestamp) +
                 '&guac.port=5902&guac.username=' + atmo_username +
                 '&guac.password=' + passwd +
                 '&guac.protocol=vnc&signature=' + signature +
                 '&guac.hostname=' + atmo_host +
                 '&id=' + conn_id)

print 'Request string is: ' + request_string + '\n'

# Send request and record the result
request_response = requests.post(guac_server + '/api/tokens', data=request_string)
token = json.loads(request_response.content)['authToken']

print 'Token is: ' + token + '\n'

print 'URL is: http://192.168.0.60:8080/guacamole/#/client/' + base64_conn_id + '?token=' + token
