import React from "react";
import stores from "stores";

export default React.createClass({
    displayName: "UserCustomizationsCheckbox",

    getInitialState: function() {
        return {
            isSelected: false,
            previouslySelected: this.checkPreviouslySelected()
        }
    },

    checkPreviouslySelected: function() {
        if (this.props.instance == null) return false;
        var previousCustomizations = this.props.instance.attributes.user_customizations;
        return (previousCustomizations.indexOf(this.props.name) != -1);
    },

    onCheckboxChange: function() {
        this.setState({ isSelected: !this.state.isSelected });
        this.props.handleToggle(this.props.name);
    },

    render: function() {
        var inputTag = <input name={this.props.name} onChange={this.onCheckboxChange} type="checkbox" />;
        if (this.state.previouslySelected) {
            inputTag = <input type="checkbox" disabled="disabled" checked/>
        }

        return (
            <div>
                <label>
                    {inputTag}
                    {" " + this.props.label}
                </label>
                <p style={{ fontSize: 12 }} >{this.props.description}</p>
            </div>
        );
    }
});
