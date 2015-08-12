define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Checkbox = require('./Checkbox.react');

  return React.createClass({

    propTypes: {
      resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      resourceRows: React.PropTypes.node.isRequired,
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      children: React.PropTypes.node.isRequired
    },

    toggleCheckbox: function (e) {
      var isChecked = this.areAllResourcesSelected();

      this.props.resources.each(function (resource) {
        if (!isChecked) {
          this.props.onResourceSelected(resource);
        } else {
          this.props.onResourceDeselected(resource);
        }
      }.bind(this));
    },

    areAllResourcesSelected: function () {
      var allResourcesSelected = true;
      this.props.resources.each(function (resource) {
        if (!this.props.selectedResources.get(resource)) allResourcesSelected = false;
      }.bind(this));
      return allResourcesSelected;
    },

    render: function () {
      var resourceRows = this.props.resourceRows;

      return (
        <table className="table table-hover">
          <thead>
          <tr onClick={this.toggleCheckbox}>
            <th><Checkbox isChecked={this.areAllResourcesSelected()}/></th>
            {this.props.children}
          </tr>
          </thead>
          <tbody>
          {resourceRows}
          </tbody>
        </table>
      );
    }

  });

});
