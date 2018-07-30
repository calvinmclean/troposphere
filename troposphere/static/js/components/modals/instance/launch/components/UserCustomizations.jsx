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
        // Find the object with the name and then get the index of it
        var index = selectedOptions.indexOf(selectedOptions.find(x => x.name == name));

        if (index == -1) {
          // Create a dict of the args for the newly selected playbook
          var playbookArgs = {};
          this.state.customizations.filter(pb => pb.name == name).map(pb => pb.args.map(arg => playbookArgs[arg.name] = ""));
          var newSelection = {
              "name": name,
              "args": playbookArgs
          }
          selectedOptions.push(newSelection);
        } else {
          selectedOptions.splice(index, 1);
        }
        this.setState({
            selectedOptions: selectedOptions
        });
    },

    enterArguments: function(e) {
        var selectedOptions = this.state.selectedOptions;
        var pbObject = selectedOptions.find(x => x.name == e.target.id);
        var index = selectedOptions.indexOf(pbObject);
        pbObject.args[e.target.name] = e.target.value;
        selectedOptions.splice(index, 1, pbObject);
        this.setState({
            selectedOptions: selectedOptions
        });
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
                        onArgChange={this.enterArguments}
                        key={index}
                    />
                })}
            </div>
        );
    }
});
