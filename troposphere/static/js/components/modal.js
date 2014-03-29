define(['react', 'modal'], function(React, Modal) {

    var ModalComponent = React.createClass({
        getInitialState: function() {
            return {
                header: '',
                body: '',
                onConfirm: function() {},
                onCancel: function() {},
                okButtonText: 'Confirm',
                visible: false
            };
        },
        componentDidMount: function() {
            Modal.events.on('alert', function(e) {
                var newState = {
                    header: e.header,
                    body: e.body,
                    visible: true
                };

                _.extend(newState, e.options);
                this.setState(newState);
            }.bind(this));
        },
        close: function() {
            this.setState({'visible': false});
        },
        render: function() {
            var className = 'modal fade' + (this.state.visible ? ' in' : '');
            return React.DOM.div({
                    id: 'application-modal',
                    className: className,
                    tabIndex: '-1',
                    role: 'dialog',
                    'aria-hidden': !this.state.visible,
                    style: {display: this.state.visible ? 'block' : 'none'}
                },
                React.DOM.div({className: 'modal-dialog'},
                    React.DOM.div({className: 'modal-content'},
                        React.DOM.div({className: 'modal-header'},
                            React.DOM.button({
                                type: 'button',
                                className: 'close',
                                onClick: this.close,
                                'aria-hidden': 'true'
                                }, '\u00d7'),
                            React.DOM.h4({
                                className: 'modal-title'
                                }, this.state.header)),
                        this.state.body)));
        }
    });

    return ModalComponent;
});
