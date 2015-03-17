define(function (require) {

  var React = require('react'),
      Moment = require('moment');

  return React.createClass({
    displayName: "Time",

    propTypes: {
      date: React.PropTypes.instanceOf(Date),
      showAbsolute: React.PropTypes.bool,
      showRelative: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        showAbsolute: true,
        showRelative: true
      };
    },

    render: function () {
      var title = Moment(this.props.date).format();
      var dateTime = Moment(this.props.date).utc().format();

      var text = "";
      var moment = Moment(this.props.date);
      var absoluteText = moment.format("MMM D, YYYY");
      var relativeText = moment.fromNow();

      if (this.props.showAbsolute) {
        text += absoluteText;
        if (this.props.showRelative)
          text += " (" + relativeText + ")";
      } else if (this.props.showRelative) {
        text += relativeText;
      }

      return (
        <time title={title} dateTime={dateTime}>
          {text}
        </time>
      );
    }

  });

});
