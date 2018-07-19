import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import UserCustomizationsCheckbox from "./UserCustomizationsCheckbox";

export default React.createClass({
    displayName: "InstanceUserCustomizationsModal",

    mixins: [BootstrapModalMixin],

    getInitialState: function() {
        return {
            customizations: require("customizations.json"),
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

    toggleCheckbox: function(name) {
        // Find the object with the name and then get the index of it
        var index = this.state.selectedOptions.indexOf(this.state.selectedOptions.find(x => x.name == name));

        if (index == -1) {
          // Create a dict of the args for the newly selected playbook
          var playbookArgs = {};
          this.state.customizations.filter(pb => pb.name == name).map(pb => pb.args.map(arg => playbookArgs[arg.name] = ""));
          var newSelection = {
              "name": name,
              "args": playbookArgs
          }
          this.state.selectedOptions.push(newSelection);
        } else {
          this.state.selectedOptions.splice(index, 1);
        }
    },

    enterArguments: function(e) {
        var pbObject = this.state.selectedOptions.find(x => x.name == e.target.id);
        var index = this.state.selectedOptions.indexOf(pbObject);
        pbObject.args[e.target.name] = e.target.value;
        this.state.selectedOptions.splice(index, 1, pbObject);
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        // var customizations = require("customizations.json");
        return (
            <div>
                <p>{"Select the programs to install or actions to perform on your instance:"}</p>
                {this.state.customizations.map((item, index) => {
                    return <UserCustomizationsCheckbox
                        label={item.label}
                        name={item.name}
                        description={item.description}
                        args={item.args}
                        handleToggle={this.toggleCheckbox}
                        onArgChange={this.enterArguments}
                        key={index}
                    />
                })}
            </div>
        );
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
                                {this.renderBody()}
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
