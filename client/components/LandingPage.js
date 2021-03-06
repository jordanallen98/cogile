import React, { Component } from 'react';
import LandingPageInfoBox from './LandingPageInfoBox';

class LandingPage extends Component {

  componentWillMount() {
    this.content  = {
      boxOneTitle: 'Learn By Typing',
      boxOneText: 'Become a faster and more efficient coder, whether you are an experienced or beginner software engineer. One way to improve is to practice writing more lines of code. Why not learn and have competitive fun at the same time?',
      boxTwoTitle: 'Race Against Your Friends',
      boxTwoText: 'Everyone loves friendly competition. We help you display your coding prowess by competing against your friends in real time. Stretch those fingers and challenge your friends!',
      boxThreeTitle: 'About',
      boxThreeText: 'Nimblecode was created by four software engineers at Makersquare, an immersive software engineering program in Los Angeles, CA.  Are you looking to hire? Check out our Github pages in our Contact page above!',
      boxFourTitle: 'JS, Python, and More!',
      boxFourText: 'We are four full stack JavaScript developers, but we understand that you may have a different favorite language.  Currently we only have lessons in JS, with Python under development.  If you would like to see nimblecode support more languages, let us know!'
    };
  }


  render() {
    return (
      <div>
        <h1 className="text-center tagline">How fast can you code?</h1>
        <div className="row">
            <div className="col-sm-12 text-center" id="landingVideo"><img id="codingGif" src="../assets/coding.gif" /></div>
        </div>
        <div className="container-fluid">
          <div className="row">
              <div className="col-sm-12 text-center">
                <a href="/#/singleplayer/00-forLoop" className="btn btn-raised btn-primary landing-btn">Start Now!</a>
                <a href="/#/multiplayer" className="btn btn-raised btn-primary landing-btn">Challenge a Friend</a>
              </div>
          </div>
        </div>
        <div className="container-fluid landing-info-container landing-content">
          <div className="row">
              <div className="col-sm-1"></div>
              <LandingPageInfoBox title={this.content.boxOneTitle} text={this.content.boxOneText} />
              <div className="col-sm-2"></div>
              <LandingPageInfoBox title={this.content.boxTwoTitle} text={this.content.boxTwoText} />
              <div className="col-sm-1"></div>
          </div>
          <div className="row">
              <div className="col-sm-1"></div>
              <LandingPageInfoBox title={this.content.boxThreeTitle} text={this.content.boxThreeText} />
              <div className="col-sm-2"></div>
              <LandingPageInfoBox title={this.content.boxFourTitle} text={this.content.boxFourText} />
              <div className="col-sm-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
