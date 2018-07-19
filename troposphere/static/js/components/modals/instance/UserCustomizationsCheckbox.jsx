import React from "react";

export default React.createClass({
    displayName: "UserCustomizationsCheckbox",

    getInitialState: function() {
        return { isSelected: false }
    },

    renderArgs: function() {
        return (
            <div>
                {this.props.args.map((item, index) => {
                    return (
                        <div key={index}>
                            <label>{item.name} :</label>
                            <input
                                type="Name"
                                className="form-control"
                                name={item.name}
                                id={this.props.name}
                                onChange={this.props.onArgChange}
                            />
                            <p>{item.description}</p>
                        </div>
                    );
                })}
            </div>
        );
    },

    onCheckboxChange: function() {
        this.setState({ isSelected: !this.state.isSelected });
        this.props.handleToggle(this.props.name);
    },

    render: function() {
        var args;
        if (this.state.isSelected) args = this.renderArgs();
        return (
            <div>
                <label>
                    <input name={this.props.name} onChange={this.onCheckboxChange} type="checkbox" />
                    {" " + this.props.label}
                </label>
                <p style={{ fontSize: 12 }} >{this.props.description}</p>
                {args}
            </div>
        );
    }
});
