import ModalHelpers from "components/modals/ModalHelpers";

import InstanceUserCustomizationsModal from "components/modals/instance/InstanceUserCustomizationsModal";
import actions from "actions";

export default {
    userCustomizations: function(instance) {
        ModalHelpers.renderModal(InstanceUserCustomizationsModal, null, function(selectedOptions) {
            actions.InstanceActions.userCustomizations({
                instance: instance,
                selectedOptions: selectedOptions
            });
        });
    }
};
