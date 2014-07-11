/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceRow.react'
  ],
  function (React, Backbone, InstanceRow) {

    return React.createClass({

      propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div>
            <div className="header">
              <i className="glyphicon glyphicon-tasks"></i>
              <h2>Instances</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th><div className="resource-checkbox"></div></th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Size</th>
                  <th>Provider</th>
                </tr>
              </thead>
              <tbody>
                <InstanceRow/>
                <InstanceRow/>
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
