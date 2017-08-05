import React from 'react';
// import '../assets/stylesheets/base.scss';
// import 'bulma/css/bulma.css';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const clarity = [
      {words: 5, clarity: 0.996},
      {words: 10, clarity:  0.238},
      {words: 15, clarity: 0.264},
      {words: 20, clarity: 1},
      {words: 25, clarity: 0.723},
      {words: 30, clarity: 0.557},
      {words: 35, clarity: 0.385},
      {words: 40, clarity: 0.185},
      {words: 45, clarity: 0.985},
];

const speed = [
      {words: 5, speed: 0.26},
      {words: 10, speed:  0.238},
      {words: 15, speed: 0.264},
      {words: 20, speed: 0.4},
      {words: 25, speed: 0.723},
      {words: 30, speed: 0.557},
      {words: 35, speed: 0.65},
      {words: 40, speed: 0.25},
      {words: 45, speed: 0.55},
];




class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,

    }

  }
  componentDidMount() {
    // this is where I will grab the data
    const data = {
      "pauses": {
        "data": [
          0.3599999999999999,
          0.7999999999999998,
          1.4300000000000006
        ],
        "preview": 3
      },
      "wordFrequency": {
        "data": [
          [
            "I",
            2
          ],
          [
            "like",
            2
          ],
          [
            "save",
            2
          ],
          [
            "hi",
            1
          ],
          [
            "armed",
            1
          ],
          [
            "earn",
            1
          ],
          [
            "clean",
            1
          ],
          [
            "thank",
            1
          ],
          [
            "you",
            1
          ]
        ],
        "preview": 12
      },
      "speed": {
        "data": [
          84.74576271186442,
          75,
          65.78947368421052,
          81.30081300813006,
          86.45533141210375,
          71.77033492822967,
          89.02077151335314
        ],
        "preview": 46.1735406048243
      },
      "clarity": {
        "data": [
          0.996,
          0.238,
          0.801,
          0.264,
          1,
          0.421,
          0.723,
          0.557,
          0.385,
          0.416,
          0.663,
          0.16,
          0.831
        ],
        "preview": 57.34615384615386
      },
      "duration": 8.97,
      "cursingCount": 0
    }

    if (!data) {
      this.setState({show: false})
    }
  }
  render() {
    var date = (new Date).toISOString().substring(0,10)
    return (
      <div>
      <section className="hero is-info">
        <div className="hero-body">
          <div className="container is-fluid">
            <h1 className="title">
              Report for <strong>Caroline Okun</strong>
            </h1>
            <h2 className="subtitle">
              Feedback for Caroline Okun (#1337) from {date}
            </h2>
          </div>
        </div>
      </section>
      {
        this.state.show ?
      <div className="container is-fluid">
        <h1 className="title"></h1>
        <div className="tile is-ancestor">
          <div className="tile is-3 is-parent is-vertical">
            <article className="tile is-child notification is-info">
              <p className="title is-4"><strong>Behavioral Summary</strong></p>
              <p className="subtitle is-6">Behavioral summary report for the most recent round.</p>
              <table className="is-full">
                <tbody>
                  <tr>
                    <td><strong>SCORE</strong></td>
                    <td>76</td>
                  </tr>
                  <tr>
                    <td><strong>CLARITY</strong></td>
                    <td>57.34</td>
                  </tr>
                  <tr>
                    <td><strong>TIME</strong></td>
                    <td>8.97</td>
                  </tr>
                  <tr>
                    <td><strong>PAUSES</strong></td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td><strong>SPEED</strong></td>
                    <td>46.17</td>
                  </tr>
                  <tr>
                    <td><strong>CURSING COUNT</strong></td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </article>
            <article className="tile is-child notification is-primary">
              <p className="title is-4"><strong>Technical Summary</strong></p>
              <p className="subtitle is-6">Technical summary for the round.</p>
              <div className="content">
                <table>
                  <tbody>
                    <tr>
                      <td><strong>SCORE</strong></td>
                      <td>47%</td>
                    </tr>
                    <tr>
                      <td><strong>TEST CASES PASSED</strong></td>
                      <td>15/18</td>
                    </tr>
                    <tr>
                      <td><strong>TIME</strong></td>
                      <td>3:04</td>
                    </tr>
                    <tr>
                      <td><strong>SPEED</strong></td>
                      <td>35:19</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </div>
          <div className="tile is-4 is-parent is-vertical">
            <article className="tile is-child notification">
              <p className="title is-4"><strong>Most frequently used words</strong></p>
              <p className="subtitle is-6">Your top 10 most frequently said words.</p>
              <table>
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>I</td>
                    <td className="is-4">
                      <progress className="progress is-primary" value="8" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>GOOGLE</td>
                    <td>
                      <progress className="progress is-info" value="5" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>PENN</td>
                    <td>
                      <progress className="progress is-success" value="4" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>COMPUTER</td>
                    <td>
                      <progress className="progress is-warning" value="4" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>SCIENCE</td>
                    <td>
                      <progress className="progress is-danger" value="3" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>GIRL</td>
                    <td>
                      <progress className="progress is-primary" value="3" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>MEN</td>
                    <td>
                      <progress className="progress is-info" value="2" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>GENDER</td>
                    <td>
                      <progress className="progress is-success" value="2" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>TEAM</td>
                    <td>
                      <progress className="progress is-warning" value="2" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>GLAD</td>
                    <td>
                      <progress className="progress is-danger" value="1" max="10"></progress>
                    </td>
                  </tr>
                </tbody>
              </table>
            </article>
            <article className="tile is-child notification">
              <p className="title is-4"><strong>Hesitation words</strong></p>
              <p className="subtitle is-6">Your top 3 most frequently used hesitation words.</p>
              <table>
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>LIKE</td>
                    <td>
                      <progress className="progress is-info" value="9" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>UM</td>
                    <td>
                      <progress className="progress is-success" value="5" max="10"></progress>
                    </td>
                  </tr>
                  <tr>
                    <td>UH</td>
                    <td>
                      <progress className="progress is-warning" value="4" max="10"></progress>
                    </td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>
          <div className="tile is-5 is-parent is-vertical">
            <article className="tile is-child notification">
              <p className="title is-4"><strong>Clarity</strong></p>
              <p className="subtitle is-6">(per 5 words)</p>

              <LineChart width={500} height={300} data={clarity}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="words"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clarity" stroke="#ff3860" activeDot={{r: 8}}/>
              </LineChart>
            </article>
            <article className="tile is-child notification">
              <p className="title is-4"><strong>Speaking speed</strong></p>
              <p className="subtitle is-6">(words per minute)</p>
              <LineChart width={500} height={300} data={speed}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="words"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="speed" stroke="#23d160" activeDot={{r: 8}}/>
              </LineChart>
            </article>

          </div>
        </div>
      </div> :
      <div className="container is-fluid">
        <h1 className="title is-1"></h1>
        <div className="notification is-warning">
          Looks like you don't have any previous rounds. To get started with your first round,
          click the <strong>Practice</strong> button above.
        </div>
      </div>
      }
      </div>
    );
  }
};


export default Analytics;
