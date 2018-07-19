import InstanceConstants from "constants/InstanceConstants";
import InstanceState from "models/InstanceState";
import Utils from "../Utils";
import InstanceActionRequest from "models/InstanceActionRequest";

export default {
    userCustomizations: function(params) {
        if (!params.instance) throw new Error("Missing instance");

        var instance = params.instance,
            instanceState = new InstanceState({
                status_raw: "active - deploying_user_customizations",
                status: "active",
                activity: "deploying_user_customizations"
            }),
            originalState = instance.get("state"),
            actionRequest = new InstanceActionRequest({
                instance: instance
            });

        instance.set({
            state: instanceState
        });
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });

        actionRequest
            .save(null, {
                attrs: {
                    action: "userCustomizations",
                    selectedOptions: params.selectedOptions
                }
            })
            .done(function() {
                instance.set({
                    state: instanceState
                });
            })
            .fail(function(response) {
                instance.set({
                    state: originalState
                });
                Utils.displayError({
                    title:
                        "The call to install extra features has failed.",
                    response: response
                });
            })
            .always(function() {
                Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
                    instance: instance
                });
                Utils.dispatch(InstanceConstants.POLL_INSTANCE_WITH_DELAY, {
                    instance: instance,
                    delay: 15 * 1000
                });
            });
    }
};
