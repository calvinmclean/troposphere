import React from "react";

export default React.createClass({
    displayName: "UserCustomizationsCheckbox",

    getInitialState: function() {
        return { isSelected: false }
    },

    onCheckboxChange: function() {
        this.setState({ isSelected: !this.state.isSelected });
        this.props.handleToggle(this.props.name);
    },

    render: function() {
        return (
            <div>
                <label>
                    <input name={this.props.name} onChange={this.onCheckboxChange} type="checkbox" />
                    {" " + this.props.label}
                </label>
                <p style={{ fontSize: 12 }} >{this.props.description}</p>
            </div>
        );
    }
});
