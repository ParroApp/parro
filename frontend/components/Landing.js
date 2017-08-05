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
    if (this.state.name.trim().length > 0 && this.state.email.trim().length > 0 && this.state.email.indexOf('@') !== -1) {
      this.setState({open: false, complete: true});
      axios.post('/send/demo/email', {
        name: this.state.name,
        email: this.state.email
      })
    } else {
      this.setState({error: true})
    }
  }
  render() {
    return(
      <div className="container is-fluid" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div style={{height: '100px', width: '100%'}}></div>
        <p className="title is-2" style={{textAlign: 'center'}}>Welcome to Parro</p>
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

          {this.state.open ?
            <div style={{width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
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
              {this.state.error && <p className="is-danger">Please enter valid name and email.</p>}
              <div className="control">
                <button className="button is-danger is-medium" onClick={this.onSubmit}>Submit</button>
              </div>
            </div>

             : ''}
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
