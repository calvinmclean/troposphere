import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import UserCustomizations from "./launch/components/UserCustomizations";

export default React.createClass({
    displayName: "InstanceUserCustomizationsModal",

    mixins: [BootstrapModalMixin],

    getInitialState: function() {
        return {
            selectedOptions: []
        }
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.selectedOptions);
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">User Customizations (beta)</h1>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.confirm}>
                                <UserCustomizations selectedOptions={this.state.selectedOptions} instance={this.props.instance} />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <RaisedButton
                                style={{marginRight: "10px"}}
                                onTouchTap={this.cancel}
                                label="Cancel"
                            />
                            <RaisedButton
                                primary
                                onTouchTap={this.confirm}
                                label="Submit"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
