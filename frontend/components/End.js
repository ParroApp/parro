import React from 'react';
import Navbar from './Navbar';
import axios from 'axios';

class End extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    axios.get('/sendEmail')
    .then(function(res) {

    })
  }
  render() {
    return(
      <div>
        <Navbar />
        <div style={{display: 'flex', alignItems:'center', flexDirection: 'column'}}>
          <div className="container is-fluid">
            <div style={{height: '30px', width: '100%'}}></div>
            <h1 className="title is-3" style={{textAlign: 'center'}}>Thank you for interviewing. We will be following up soon.</h1>
          </div>
          <div className="husky" style={{transform: 'scale(0.75)'}}>
            <div className="mane">
              <div className="coat"></div>
            </div>
            <div className="body">
              <div className="head">
                <div className="ear"></div>
                <div className="ear"></div>
                <div className="face">
                  <div className="eye"></div>
                  <div className="eye"></div>
                  <div className="nose"></div>
                  <div className="mouth">
                    <div className="lips"></div>
                    <div className="tongue"></div>
                  </div>
                </div>
              </div>
              <div className="torso"></div>
            </div>
            <div className="legs">
              <div className="front-legs">
                <div className="leg"></div>
                <div className="leg"></div>
              </div>
              <div className="hind-leg">
              </div>
            </div>
            <div className="tail">
              <div className="tail">
                <div className="tail">
                  <div className="tail">
                    <div className="tail">
                      <div className="tail">
                        <div className="tail"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display:'none'}}>
            <defs>


              <filter id="squiggly-0">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
                <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="2" />
              </filter>
              <filter id="squiggly-1">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="1"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
              </filter>

              <filter id="squiggly-2">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
              </filter>
              <filter id="squiggly-3">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="3"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
              </filter>

              <filter id="squiggly-4">
                <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="4"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    )
  }
}

export default End;
