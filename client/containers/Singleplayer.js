import React, { Component } from 'react';
import CodeEditor from './CodeEditor';
import CodePrompt from '../components/CodePrompt';
import CodeGhost from '../components/CodeGhost';
import Timer from './Timer';
import levenshtein from './../lib/levenshtein';
import ProgressBar from '../components/ProgressBar';
import { connect } from 'react-redux';
import { changeLevel } from '../actions/index';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import LevelSelect from './LevelSelect';

class Singleplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      puzzleName: 'N/A',
      currentPuzzle: 'N/A',
      minifiedPuzzle: 'N/A',
      gameFinished: false,
      progress: 0
    };
  };

  componentDidUpdate() {
    if (this.props.currentLevel) {

      if (this.state.puzzleName !== this.props.currentLevel.currentLevel) {
        axios.get('api/getPrompt/?puzzleName=' + this.props.currentLevel.currentLevel)
          .then(function(res) {
            var data = res.data;
            var minifiedPuzzle = data.replace(/\s/g,'');

            this.setState({
              puzzleName: this.props.currentLevel.currentLevel,
              currentPuzzle: data,
              minifiedPuzzle: minifiedPuzzle
            });

          }.bind(this));
      }
    }
  }

  componentWillMount() {
    $.material.init();

    if (this.props.params.puzzleName) {
      axios.get('api/getPrompt/?puzzleName=' + this.props.params.puzzleName)
        .then(function(res) {
          var data = res.data;
          var minifiedPuzzle = data.replace(/\s/g,'');

          this.props.changeLevel({'currentLevel': this.props.params.puzzleName})

          this.setState({
            puzzleName: this.props.params.puzzleName,
            currentPuzzle: data,
            minifiedPuzzle: minifiedPuzzle
          });
        }.bind(this));
    } else {
      axios.get('api/getPrompt')
        .then(function(res) {
          var data = res.data;
          var minifiedPuzzle = data.replace(/\s/g,'');

          this.props.changeLevel({'currentLevel': '00-forloop'})

          this.setState({
            puzzleName: '00-forloop',
            currentPuzzle: data,
            minifiedPuzzle: minifiedPuzzle
          });
        }.bind(this));
    }
  };

  saveTimeElapsed(tenthSeconds, seconds, minutes) {
    // Sweet Alert with Info
    swal({
      title: 'Sweet!',
      text: 'You completed the challenge with a time of ' + minutes + ':' + seconds + '.' + tenthSeconds
    });
  }

  calculateProgress(playerCode) {
    var totalChars = this.state.minifiedPuzzle.length;
    var distance = levenshtein(this.state.minifiedPuzzle, playerCode);

    var percentCompleted = Math.floor(((totalChars - distance) / totalChars) * 100);

    this.setState({
      progress: percentCompleted
    });
  };

  render() {
    return (
      <div>
        <Timer
          saveTimeElapsed={this.saveTimeElapsed.bind(this)} />
        <LevelSelect />
        <CodePrompt puzzle={this.state.currentPuzzle} />
        <CodeEditor
          puzzle={this.state.currentPuzzle}
          minifiedPuzzle={this.state.minifiedPuzzle}
          calculateProgress={this.calculateProgress.bind(this)} />
        <CodeGhost singleGame={this.props.singleGame} currentLevel={this.state.puzzleName}/>
        <ProgressBar percentComplete={this.state.progress} />
      </div>
    )
  };
}

function mapStateToProps(state) {
  return {
    singleGame: state.singleGame,
    SavedUsername: state.SavedUsername,
    currentLevel: state.currentLevel
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({changeLevel: changeLevel}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Singleplayer)
