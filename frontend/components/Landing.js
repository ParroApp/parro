import React from 'react';

class BusinessLanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      submit: false,
      name: '',
      email: '',
      complete: false,
      error: false
    }
    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onClick() {
    this.setState({open: !this.state.open})
  }
  onSubmit() {
    console.log('SENDING', this.state.name, this.state.email);
    if (this.state.name.trim().length > 0 && this.state.email.trim().length > 0) {
      this.setState({open: false, complete: true});
    } else {
      this.setState({error: true})
    }
  }
  render() {
    return(
      <div className="container is-fluid" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div style={{height: '100px', width: '100%'}}></div>
        <p className="title is-2" style={{textAlign: 'center'}}>Welcome to Parro</p>
        <svg width="270" height="240" viewBox="0 0 270 240" xmlns="http://www.w3.org/2000/svg"><title>parro</title><defs>
          <linearGradient x1="50%" y1="0%" y2="2.68%" id="a"><stop stopColor="#03A272" offset="0%"/><stop stopColor="#03A272" offset="0%"/><stop stopColor="#01A674" offset="0%"/><stop stopColor="#049A6C" offset="100%"/></linearGradient>
        </defs><g fill="none" fillRule="evenodd"><path d="M236.298 79.234C236.298 47.528 205.654 16 174 16v63.234h62.298z" fill="#FCB400"/><path d="M207.497 79c0 17.048-16.477 34-33.497 34V79h33.497z" fill="#F1A227"/>
          <ellipse id="eye" fill="#3A3A3A" cx="155.766" cy="61.426" rx="14.121" ry="14.145"/>

          <path d="M174.196 113c-.29 6.982-3 22.945-18.43 49.102-21.597 36.61-71.435 29.12-71.435 29.12s.83 10.817-8.306 24.962c-9.137 14.144-34.056 8.32-34.056 8.32l31.564-78.21s-2.887 2.143-12.46-5.825c-9.572-7.97-9.967-15.81-9.967-15.81l17.443.832s-3.338.203-17.443-14.144C37 97 32 80.563 32 80.563l19.105 1.664s-8.553-10.266-10.8-16.64C32 42 33.662 23.983 33.662 23.983l71.437 39.938s.42-9.27 5.403-18.422c4.984-9.152 12-18 32-25.5 13.96-5.235 31.5-4 31.5-4l-.025.003C147.43 16.283 126 37.89 126 64.5c0 26.684 21.55 48.335 48.196 48.5z" fill="#01A674"/><path d="M158.5 111s-10.5 22-39 29-46 6.5-46 6.5l-8 20.5s44.5 1.5 63.5-11 29.5-45 29.5-45z" fill="url(#a)"/></g>
        </svg>
        <div style={{height: '10px', width: '100%'}}></div>
        <p className="subtitle is-4" style={{textAlign: 'center',width: '50%'}}>Parro is an automated tech interviewing platform
          helping businesses screen technical applicants efficiently and guiding applicants through a seamless interview process.
        </p>
        <div style={{height: '20px', width: '100%'}}></div>
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile notification is-child" style={{width: '50%', textAlign: 'left'}}>
            <p className="subtitle is-5">
            <ul>
              <li>
                <span className="icon">
                  <i className="fa fa-commenting-o"></i>
                </span>
                <span><strong> Behavioral:</strong> Companies provide us with their behavioral questions. Responses are recorded and
              bound with time limits.</span>
              </li>
              <div style={{height: '10px', width: '100%'}}></div>
              <li>
                <span className="icon">
                  <i className="fa fa-code"></i>
                </span>
                <span><strong> Technical:</strong> Equipped with a code editor, multiple
              languages, a timer, and the ability to ask questions live.</span>
              </li>

              <div style={{height: '10px', width: '100%'}}></div>

              <li>
                <span className="icon">
                  <i className="fa fa-question-circle"></i>
                </span>
                <span><strong> Q&A:</strong> Applicants can ask role and company specific questions, and Parro will analyze the question
              and respond with the best fit answer from the company.</span>
              </li>
              <div style={{height: '10px', width: '100%'}}></div>

              <li>
                <span className="icon">
                  <i className="fa fa-bar-chart"></i>
                </span>
                <span><strong> Analytics:</strong> Responses are analyzed throughout the interview, and at the end,
              recruiters are given summary analytics on the applicant's performance as well as behavioral metrics.</span>
              </li>
            </ul>
          </p>
          </div>
        </div>
        </div>
        <button onClick={() => this.onClick()} className="button is-primary is-large">
          <span className="icon">
            <i className="fa fa-rocket"></i>
          </span>
           <span> DEMO IT NOW</span></button>
          <div style={{height: '50px', width: '100%'}}></div>

          {this.state.open &&
            (<div style={{width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input is-danger is-medium" type="text"
                    placeholder="full name" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
                  <span className="icon is-small is-left">
                    <i className="fa fa-user"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input is-danger is-medium"
                    type="text" placeholder="you@email.com"
                    value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
                  <span className="icon is-small is-left">
                    <i className="fa fa-envelope"></i>
                  </span>
                </div>
              </div>
              {this.state.error && (<div><p className="is-danger">⚠️ Please enter valid name and email.</p> <div style={{height: '5px', width: '100%'}}></div></div>)}
              <div className="control">
                <button className="button is-danger is-medium" onClick={this.onSubmit}>Submit</button>
              </div>
            </div>)}
          {this.state.complete &&
            <div>
              <p className="title is-4">🚀 Please check your email for a link to the demo.</p>
            </div>
          }
      </div>

    )
  }
}

export default BusinessLanding;
