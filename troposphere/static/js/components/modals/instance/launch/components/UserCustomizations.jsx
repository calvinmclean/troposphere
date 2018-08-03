import React from "react";
import Glyphicon from "components/common/Glyphicon";
import UserCustomizationsCheckbox from "./UserCustomizationsCheckbox";

export default React.createClass({

    getInitialState: function() {
        return {
            selectedOptions: this.props.selectedOptions,
            customizations: require("customizations.json")
        }
    },

    toggleCheckbox: function(name) {
        var selectedOptions = this.state.selectedOptions;
        // Get the index of this item in the list
        var index = selectedOptions.indexOf(name);

        // Modify the props.instance object to immediately reflect changes in UI
        if (this.props.instance) {
            this.modifyInstanceObject(name);
        }

        // Add the new item if it is not in the list, remove if it is
        if (index == -1) {
          selectedOptions.push(name);
        } else {
          selectedOptions.splice(index, 1);
        }
        this.setState({
            selectedOptions: selectedOptions
        });
    },

    modifyInstanceObject: function(name) {
        var index = this.state.selectedOptions.indexOf(name);
        var instanceUserCustomizations = this.props.instance.attributes.user_customizations;

        if (index == -1) {
            instanceUserCustomizations.push(name);
        } else {
            instanceUserCustomizations.splice(instanceUserCustomizations.indexOf(name), 1);
        }
        this.props.instance.attributes.user_customizations = instanceUserCustomizations;
    },

    render: function() {
        return (
            <div>
                <p className="alert alert-warning">
                    <Glyphicon name="warning-sign" /> <strong>NOTE</strong>
                    {
                        " Selections cannot be undone. Selected customizations will be run again on 'redeploy' or 'reboot'."
                    }
                </p>
                <p>{"Select the programs to install or actions to perform on your instance:"}</p>
                {this.state.customizations.map((item, index) => {
                    return <UserCustomizationsCheckbox
                        label={item.label}
                        name={item.name}
                        description={item.description}
                        args={item.args}
                        handleToggle={this.toggleCheckbox}
                        key={index}
                        instance={this.props.instance}
                    />
                })}
            </div>
        );
    }
});
