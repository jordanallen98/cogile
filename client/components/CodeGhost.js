import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

class CodeGhost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replayStarted : false
    };
  }

  static propTypes = {
  };

  static defaultProps = {
  };

  componentDidMount() {
    this.editor = ace.edit('codeGhost');
    this.editor.setShowPrintMargin(false);
    this.editor.setOptions({
      fontSize: '12pt',
      minLines: 15,
      maxLines: 15,
      dragEnabled: false
    });
    this.editor.setTheme("ace/theme/twilight");
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

    // Get most recent recording from localStorage
    this.record = JSON.parse(localStorage.getItem('replay'));
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
    if (this.props.singleGame === 'STARTED_GAME' && !this.state.replayStarted) {
      this.startGhostReplay();
      this.setState({
        replayStarted: true
      });
    } else if (this.props.singleGame === null) { // If game was reset
      this.editor.setValue('');

      // Clears all settimeouts if any still exist
      var id = window.setTimeout(function() {}, 0);
      while (id--) {
          window.clearTimeout(id);
      }
    }
  }

  render() {
    const style = {fontSize: '14px !important', border: '1px solid lightgray'};

    return React.DOM.div({
      id: 'codeGhost',
      style: style,
      className: 'col-md-6'
    });
  }
}

export default CodeGhost;