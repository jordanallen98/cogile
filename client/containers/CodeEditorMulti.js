import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { startGame, endGame } from '../actions/index';
import { bindActionCreators } from 'redux';

class CodeEditorMulti extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    mode: PropTypes.string,
    puzzle: PropTypes.string,
    minifiedPuzzle: PropTypes.string,
    timerOn: PropTypes.bool
  };

  static defaultProps = {
    mode: 'javascript',
    puzzle: ''
  };

  componentDidMount() {
    this.editor = ace.edit('codeEditor');
    this.editor.setShowPrintMargin(false);
    this.editor.setTheme("ace/theme/twilight");
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.getSession().setTabSize(2);
    this.editor.$blockScrolling = Infinity;

    this.editor.setOptions({
      minLines: 25,
      maxLines: 50,
      enableBasicAutocompletion: true,
      enableSnippets: false,
      enableLiveAutocompletion: false
    });

    // autocomplete tries to fire on every input
    this.editor.commands.on("afterExec", function(e) {
      if (e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) {
        this.editor.execCommand("startAutocomplete")
      }
    }.bind(this));

    // should lock CodeEditor to read-only until timer begins
    this.editor.setReadOnly(true);

    this.editor.getSession().on("change", function() {
      var code = this.editor.getSession().getValue().replace(/\s/g,'');
      this.props.calculateProgress(code);

      if (code === this.props.minifiedPuzzle) {
        // calling endGame action
        this.props.endGame();

        this.editor.setReadOnly(true);
      }
    }.bind(this));

    // prevents copy pasting the whole thing
    this.editor.on("paste", function(e) {
      if (e.text === this.props.puzzle) {
        var shuffled = e.text.split('').sort(function(){return 0.5-Math.random()}).join('');
        e.text = "Nice try, here's your copied text :P\n" + shuffled;
      }
    }.bind(this));
  };

  componentDidUpdate() {
    // once game starts
    if (this.props.multiGame === 'START_GAME') {
      // focus goes to CodeEditor and read-only disabled
      this.editor.setReadOnly(false);
      this.editor.focus();
    }
  }

  render() {
    const style = {fontSize: '14px !important', border: '1px solid lightgray'};
    
    return React.DOM.div({
      id: 'codeEditor',
      style: style,
      className: 'col-md-6'
    });
  }
}

function mapStateToProps(state) {
  return {
    multiGame: state.multiGame
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({startGame: startGame, endGame: endGame}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditorMulti);