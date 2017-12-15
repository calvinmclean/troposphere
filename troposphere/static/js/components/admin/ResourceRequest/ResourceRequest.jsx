import React from "react";
import _ from "underscore";
import Backbone from "backbone";

import Utils from "actions/Utils";
import stores from "stores";
import { browserHistory } from "react-router";
import ResourceRequestView from "./ResourceRequestView";
import AdminResourceRequestActions from "actions/AdminResourceRequestActions";
import Quota from "models/Quota";
import AllocationSourceConstants from "constants/AllocationSourceConstants";
import IdentityConstants from "constants/IdentityConstants"
import errorHandler from "actions/errorHandler"

export default React.createClass({

    propTypes: {
        selectedRequest: React.PropTypes.object,
        requests: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState() {
        return {
            actionPending: false,
        };
    },

    componentDidMount() {
        stores.StatusStore.addChangeListener(this.updateState);
        stores.AllocationSourceStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.QuotaStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.StatusStore.removeChangeListener(this.updateState);
        stores.AllocationSourceStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.QuotaStore.removeChangeListener(this.updateState);
    },

    updateState() {
        // If new models come along trigger a re-render
        this.forceUpdate();
    },

    onAllocationSave(allocationSource) {
        let { selectedRequest: request } = this.props;
        let promise = Promise.resolve(
            allocationSource.save(allocationSource.pick("compute_allowed"), { patch: true })
        );
        promise
            .then(() => {
                Utils.dispatch(AllocationSourceConstants.UPDATE, {
                    allocation: allocationSource,
                    username: request.get("created_by").username
                })
            })
            .catch(errorHandler);
        return promise;
    },

    onIdentitySave(identity) {
        let { selectedRequest: request } = this.props;
        let quota = new Quota(_.omit(identity.get('quota'), ["id", "uuid"]));
        let promise = Promise.resolve(quota.save())
            .then(
                () => identity.save({ 'quota': quota.pick("id") }, { patch: true })
            );

        promise
            .then(() => {
                Utils.dispatch(IdentityConstants.UPDATE, {
                    identity,
                    username: request.get("created_by").username
                });
            })
            .catch(errorHandler);
        return promise;
    },

    onApprove() {
        let { selectedRequest: request } = this.props;
        let { statuses } = this.fetch();
        let status = statuses.findWhere({
            name: "approved"
        });

        this.setState({ actionPending: true });
        let promise = Promise.resolve(AdminResourceRequestActions.updateRequest(request, status));
        promise
            .then(
                // onSuccess, navigate away
                () => browserHistory.push("/application/admin/resource-requests"),

                // onFailure, action is no longer pending, trigger error handler
                err => {
                    this.setState({ actionPending: false })
                    errorHandler(err);
                }
            );
        return promise;
    },

    onDeny(reason) {
        let { selectedRequest: request } = this.props;
        let { statuses } = this.fetch();

        let status = statuses.findWhere({
            name: "denied"
        });

        this.setState({ actionPending: true });
        let promise = Promise.resolve(
            AdminResourceRequestActions.updateRequest(request, status, reason)
        );
        promise
            .then(
                // onSuccess, navigate away
                () => browserHistory.push("/application/admin/resource-requests"),

                // onFailure, action is no longer pending, trigger error handler
                err => {
                    this.setState({ actionPending: false });
                    errorHandler(err);
                }
            )
        return promise;
    },

    fetch() {
        let { selectedRequest: request } = this.props;
        let statuses = stores.StatusStore.getAll();

        let identities;
        if (request) {
            identities = stores.IdentityStore.fetchWhere({
                username: request.get("created_by").username
            });
        }

        let allocationSources;
        if (request) {
            allocationSources = stores.AllocationSourceStore.fetchWhere({
                "username": request.get("created_by").username
            })
        }

        return {
            allocationSources,
            identities,
            statuses
        };
    },

    render() {
        let { allocationSources, identities } = this.fetch();
        let { selectedRequest } = this.props;
        let { actionPending } = this.state;

        if (actionPending) {
            return (
                <div className="loading"></div>
            );
        }

        let viewProps = {
            request: selectedRequest,
            allocationSources,
            identities,
            onAllocationSave: this.onAllocationSave,
            onIdentitySave: this.onIdentitySave,
            onApprove: this.onApprove,
            onDeny: this.onDeny,
        };

        return (
        <ResourceRequestView {...viewProps} />
        );
    }
});
