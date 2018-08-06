import React from "react";
import Backbone from "backbone";

import Tooltip from "react-tooltip";

const deployError =
    "Performing a 'hard reboot' will sometimes fix a 'deploy_error' on an instance";

const userDeployError =
    "'user_deploy_error' was caused by a failure in non-critical tasks and your instance still functions normally";

var Activity = React.createClass({
    displayName: "Activity",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState() {
        return {
            opacity: "0.68"
        };
    },
    onMouseOver() {
        this.setState({
            opacity: "1"
        });
    },
    onMouseOut() {
        this.setState(this.getInitialState());
    },

    render() {
        var instance = this.props.instance,
            stylez = {
                textTransform: "capitalize"
            },
            attention,
            activity = instance.get("state").get("activity") || "N/A";

        var errorType;
        if (activity && activity === "deploy_error") {
            errorType = deployError;
        } else if (activity && activity === "user_deploy_error") {
            errorType = userDeployError;
        }

        if (errorType) {
            let rand = Math.random() + "",
                {opacity} = this.state,
                marginLeft = "10px",
                color = "darkorange";

            attention = (
                <span>
                    <span
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        style={{opacity, marginLeft, color}}
                        data-tip={errorType}
                        className="glyphicon glyphicon-info-sign"
                        data-for={rand}
                        aria-hidden="true"
                    />
                    <Tooltip
                        id={rand}
                        place="top"
                        effect="solid"
                        delayHide={2250}
                    />
                </span>
            );
        }

        return (
            <span style={stylez}>
                {activity}
                {attention}
            </span>
        );
    }
});

export default Activity;
