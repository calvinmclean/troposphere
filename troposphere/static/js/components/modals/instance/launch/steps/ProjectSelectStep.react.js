if (!define(function (require) {

    var React = require('react/addons'),
      Backbone = require('backbone'),
      _ = require('underscore'),
      stores = require('stores'),
      ProjectActions = require('actions/ProjectActions'),
      ProjectListView = require('components/common/project/ProjectListView.react');

    var ENTER_KEY = 13;

    return React.createClass({
      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model),
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired,
        onFinished: React.PropTypes.func.isRequired,
      },

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function () {
        var projectId, projectName;
        if (this.props.project) {
          project = this.props.project;
          projectId = project.id;
          projectName = project.get('name');
        } else {
          // No project information passed in
          project = null;
          projectId = -999; //Designates 'first-time-call'
          projectName = null;
        }
        return {
          project: project,
          //State-Based variables
          isLoading: false,
          createSelected: false,
          callback: null,
          projectId: projectId,
          projectName: projectName
        }
      },
      isSubmittable: function () {
        return (
          this.state.projectId > 0
        );
      },
      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.ProjectVolumeStore.addChangeListener(this.updateState);
        stores.ProjectInstanceStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.ProjectVolumeStore.removeChangeListener(this.updateState);
        stores.ProjectInstanceStore.removeChangeListener(this.updateState);
      },
      //
      // Internal Modal Callbacks
      // ------------------------
      //
      confirmLaunch: function () {
        this.confirm(this.props.onFinished, {project: this.state.project});
      },
      confirmNext: function () {
        this.confirm(this.props.onNext, {project: this.state.project});
      },
      confirmCreate: function (new_project) {
        this.setState({project: new_project, projectId: new_project.id});
        this.confirm(this.props.onNext, {project: new_project});
      },
      onBack: function () {
        this.props.onPrevious({project: this.state.project});
      },

      confirm: function (callback, new_project) {
        if (new_project) {
          //After running 'createProjectAndComplete', 'createProjectCompleted'
          // confirm will be called and passed a project object
          callback(new_project);
        } else {
          this.createProjectAndComplete();
        }
        return true;
      },
      createProjectAndComplete: function () {
        //Call-callback after project create
        ProjectActions.create(
          {
            name: this.state.projectName,
            description: "Project generated by Instance Launch."
          },
          this.createProjectCompleted);
        this.setState({isLoading: true, callback: this.confirmCreate});
      },
      createProjectCompleted: function (project) {
        this.state.callback(project);
      },

      onProjectChange: function (project) {
        this.setState({projectId: project.id, project: project, createSelected: false});
      },

      onProjectIDChange: function (e) {
        var newProjectId = e.target.value;
        this.setState({projectId: newProjectId});

      },

      onProjectNameChange: function (e) {
        this.setState({projectName: e.target.value});
      },

      renderProjectSelectionForm: function (projects) {
        if (this.state.projectId == -999) {
          this.state.project = projects.first();
          this.state.projectId = projects.first().id;
        }
        if (projects.length > 0) {
          return (
            <ProjectListView
              selectedProject={this.state.project}
              projects={projects}
              onProjectClicked={this.onProjectChange}
              onCreateClicked={this.showProjectCreate}
              onHideClicked={this.hideProjectCreate}
              useRouter={false}
              showCreate={this.state.createSelected}
              />
          )
        }
      },
      showProjectCreate: function () {
        this.setState({createSelected: true, projectId: -1});
      },
      hideProjectCreate: function () {
        this.setState({createSelected: false});
      },

      renderProjectCreationForm: function (projects) {
        if (this.state.createSelected) {
          return (
            <div className='form-group'>
              <div className="col-sm-12">

                <input
                  type="text"
                  className="form-control"
                  value={this.state.projectName}
                  onChange={this.onProjectNameChange}
                  placeholder="Enter project name..."
                  />
                <button type="button" className="btn btn-primary" onClick={this.createProjectAndComplete}>
                  Create
                </button>
              </div>
            </div>
          )
        }
      },

      renderBody: function () {
        var projects = stores.ProjectStore.getAll();

        if (!projects) {
          return (<div className="loading"></div>);
        }
        if (this.state.isLoading) {
          return (
            <div className="container">
              <div className="loading"></div>
              <div>Creating your New Project {this.state.projectName}</div>
            </div>)
        }
        this.state.projectId = this.state.projectId || projects.first().id;
        this.state.project = projects.get(this.state.projectId);
        return (
          <div role='form'>
            <div className="modal-section form-horizontal">
              <h4>Select a Project for your new Instance</h4>
              {this.renderProjectCreationForm(projects)}

              <div className='form-group'>
                <div className="col-sm-12">
                  {this.renderProjectSelectionForm(projects)}
                </div>
              </div>
            </div>
          </div>
        );
      },

      render: function () {

        return (
          <div>
            {this.renderBody()}
            <div className="modal-footer">
              <button type="button" className="btn btn-default pull-left" onClick={this.props.onPrevious}>
                <span className="glyphicon glyphicon-chevron-left"></span>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={this.confirmLaunch}
                      disabled={!this.isSubmittable()}>
                Launch
              </button>
              <button type="button" className="btn btn-danger" onClick={this.confirmNext}
                      disabled={!this.isSubmittable()}>
                Advanced Configuration
              </button>
            </div>
          </div>
        );
      }
    });
  })) {

}
