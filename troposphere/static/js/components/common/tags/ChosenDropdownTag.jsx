import React from "react";
import Backbone from "backbone";
import classNames from "classnames";

export default React.createClass({
    displayName: "ChosenDropdownTag",

    propTypes: {
        tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onTagSelected: React.PropTypes.func.isRequired,
        propertyName: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            propertyName: "name"
        };
    },

    getInitialState: function() {
        return {
            isMouseOver: false
        };
    },

    onMouseEnter: function() {
        this.setState({
            isMouseOver: true
        });
    },

    onMouseLeave: function() {
        this.setState({
            isMouseOver: false
        });
    },

    onTagSelected: function() {
        this.props.onTagSelected(this.props.tag);
    },

    render: function() {
        var tag = this.props.tag,
            classes = classNames({
                "active-result": true,
                highlighted: this.state.isMouseOver
            });

        return (
            <li
                className={classes}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onTagSelected}>
                {tag.get(this.props.propertyName)}
            </li>
        );
    }
});
