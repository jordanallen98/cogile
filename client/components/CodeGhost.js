import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { syncPlayersStatuses, getUsername } from '../actions/index';
import { bindActionCreators } from 'redux';
import levenshtein from './../lib/levenshtein';
import axios from 'axios';
import helperFunctions from '../utils/helperFunctions';

class CodeGhost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLevel: null,
      replayStarted : false
    };

    this.highScoreUser = '';
    this.pendingGetRequest = false;
  }

  static propTypes = {
  };

  static defaultProps = {
  };

  componentDidMount() {
    this.record = {};

    this.editor = ace.edit('codeGhost');
    this.editor.setShowPrintMargin(false);
    this.editor.setOptions({
      fontSize: '11pt',
      minLines: 12,
      maxLines: 12,
      dragEnabled: false
    });
    this.editor.setTheme("ace/theme/tomorrow_night");
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.setReadOnly(true);
    this.editor.$blockScrolling = Infinity;
    
    // Disables Selection of Text to Prevent Copy/Paste
    // Comment out for development purposes
    this.editor.on('changeSelection', function(e) {
      this.editor.selection.setSelectionRange({
        start: {
          row: 0,
          column: 0
        },
        end: {
          row: 0,
          column: 0
        }
      });
    }.bind(this));

    this.editor.getSession().on("change", function(e) {
      var value = this.editor.getSession().getValue();

      var code = value.replace(/\s/g,'');

      this.props.calculateProgress(code, true);
    }.bind(this)); 
  }

  // Plays back replay stored in this.record on game start
  startGhostReplay() {

    this.playbackClosure = function(value) {
      return function() {
        this.editor.setValue(value);
      }.bind(this);
    }.bind(this);
    
    var mark = null;

    for (var timeStamp in this.record) {
      if (mark) {
        var timeout = timeStamp - mark;
      } else {
        var timeout = 0;
        mark = timeStamp;
      }

      setTimeout(this.playbackClosure(this.record[timeStamp]), timeout);
    }
  }

  componentDidUpdate() {
    if (this.props.currentLevel && !this.pendingGetRequest) {
      if (Object.keys(this.record).length === 0 || this.props.currentLevel.currentLevel !== this.previousLevel) {
        this.pendingGetRequest = true;

        axios.get('api/getHighScore/?promptName=' + this.props.currentLevel.currentLevel)
          .then(function(res) {
            if (res.data !== '') {
              this.record = {};
              this.record = JSON.parse(res.data.recording).recording;
              this.props.fetchRecordUsername(res.data.username);
              this.pendingGetRequest = false;

            } else {
              this.record = {
                recording: {
                  '1': 'No replay loaded'
                },
                duration: 999999999999
              };
              this.pendingGetRequest = false;
            }
            this.previousLevel = this.props.currentLevel.currentLevel;
          }.bind(this));

      }
    }

    // On game start, start the ghost replay
    if (this.props.singleGame === 'STARTED_GAME' && !this.state.replayStarted) {
      this.startGhostReplay();
      this.setState({
        replayStarted: true
      });
    } else if (this.props.singleGame === null && this.state.replayStarted) { // If game was reset
      this.editor.setValue('');

      this.setState({
        replayStarted: false
      });

      // Clears all settimeouts if any still exist
      var id = window.setTimeout(function() {}, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    }
  }

  render() {
    const style = {fontSize: '14px !important', border: '5px solid #181818'};

    return React.DOM.div({
      id: 'codeGhost',
      style: style,
      className: 'col-sm-6'
    });
  }
}

function mapStateToProps(state) {
  return {
    singleGame: state.singleGame,
    currentLevel: state.currentLevel
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUsername: getUsername
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeGhost);
