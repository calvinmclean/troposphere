import time
import requests

logger = logging.getLogger(__name__)

def report_image(request):
    """
    Redirect image report action to Atmosphere so the image info can be updated
    """
    if not request.user.is_authenticated():
        raise PermissionDenied

    # Check that all parameters are received
    if not all(field in request.POST for field in ['image_id', 'username'])
        return failure_response(
                status.HTTP_400_BAD_REQUEST,
                "POST does not contain the required data")

    # data to send to Atmosphere
    destination = \
        "{api_root}/report_image/{image_id}?username={username}&timestamp={timestamp}" \
        .format(
            api_root=settings.API_V2_ROOT,
            image_id=request.POST['image_id'],
            username=request.POST['username'],
            timestamp=time.time()
        )

    # Send data to Atmosphere
    return requests.get(destination)
