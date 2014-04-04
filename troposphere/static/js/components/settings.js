define(['react', 'components/page_header', 'components/common/gravatar', 'controllers/notifications'],
    function(React, PageHeader, Gravatar, Notifications) {

    var IconOption = React.createClass({
        render: function() {
            return React.DOM.li({className: this.props.selected ? 'selected' : ''},
                React.DOM.a({
                        href: "#",
                        onClick: _.partial(this.props.onClick, this.props.type),
                    },
                    Gravatar({hash: '4dada4e6ac8298336c7063ae603ea86d', type: this.props.type}),
                    React.DOM.br(),
                    this.props.text));
        }
    });

    var IconSelect = React.createClass({
        getInitialState: function() {
            return {
                selected: this.props.profile.get('settings')['icon_set']
            };
        },
        handleClick: function(icon_type, e) {
            e.preventDefault();
            this.props.profile.save({icon_set: icon_type}, {
                patch: true,
                success: function() {
                    Notifications.notify("Updated", "Your icon preference was changed successfully.", {type: "success"});
                    this.setState({selected: icon_type});
                }.bind(this),
                error: function() {
                    Notifications.notify("Error", "Your icon preference was not changed successfully.", {type: "danger"});
                }
            });
        },
        render: function() {
            return React.DOM.ul({id: 'icon-set-select'}, _.map(this.props.icons, function(text, type) {
                return IconOption({
                    type: type, 
                    text: text, 
                    selected: type == this.state.selected, 
                    onClick: this.handleClick});
            }.bind(this)));
        }
    });

    var icons = {
        'default': 'Identicons',
        retro: 'Retro',
        robot: 'Robots',
        unicorn: 'Unicorns',
        monster: 'Monsters',
        wavatar: 'Wavatars'
    };

    return React.createClass({
        render: function() {
            return React.DOM.div({},
                PageHeader({title: "Settings"}),
                React.DOM.h2({}, "Notifications"),
                React.DOM.h2({}, "Appearance"),
                React.DOM.p({}, "Image and instance icon set:"),
                IconSelect({icons: icons, profile: this.props.profile}));
        }
    });

});
