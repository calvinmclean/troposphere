import time
import requests
import logging

logger = logging.getLogger(__name__)

def report_image(request):
    """
    Redirect image report action to Atmosphere so the image info can be updated
    """
    if not request.user.is_authenticated():
        raise PermissionDenied

    # Check that all parameters are received
    if not all(field in request.POST for field in ['image_id', 'username']):
        return failure_response(
                status.HTTP_400_BAD_REQUEST,
                "POST does not contain the required data (image_id, username)")

    auth_token = request.session.get('access_token')

    # data to send to Atmosphere
    report_image_route = \
        "{api_root}/image_report/{image_id}?username={username}&timestamp={timestamp}" \
        .format(
            api_root=settings.API_V2_ROOT,
            image_id=request.POST['image_id'],
            username=request.POST['username'],
            timestamp=time.time()
        )

    headers = {
        'Authorization': "Token %s" % auth_token,
        'Accept': 'application/json',
    }

    response = requests.get(report_image_route, headers=headers, verify=False)

    try:
        # Raise exceptions for HTTP errors
        response.raise_for_status()
    except HTTPError as exc:
        status_code = exc.response.status_code
        if status_code == 404:
            return failure_response(
                    status.HTTP_404_NOT_FOUND,
                    "image %s not found " % request.POST['image_id'])

        logger.exception("Failed to report image using Atmosphere API: Response: %s", response)

        return failure_response(
                status.HTTP_503_SERVICE_UNAVAILABLE,
                "Failed to report image. Please retry your request.")
