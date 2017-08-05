var React = require('react');
var CodeMirror = require('react-codemirror');
var axios = require('axios');

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/lib/codemirror.css');

var defaults = {
	javascript: `function solve(input) {
  	// Write your solution here:

}
`,
  python: '# Write your code here:',
  java: '// Write your code here:',
  c: '// Write your code here:',
};

class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			code: defaults.javascript,
			readOnly: false,
			mode: 'javascript',
			questionId: this.props.questionId,
		};
  }

	updateCode(newCode) {
		this.setState({
			code: newCode
		});
    console.log(this.state.code);
	}

	changeMode(e) {
		var mode = e.target.value;
		this.setState({
			mode: mode,
			code: defaults[mode],
		});
	}

	toggleReadOnly() {
		this.setState({
			readOnly: !this.state.readOnly
		}, () => this.refs.editor.focus());
	}

  handleSubmit(code, language) {
		console.log('here');
		var self = this;
	console.log('THIS.STATE', this.state);
    axios.post('http://localhost:3000/run_code', {
			code: code,
			language: language,
			questionId: this.state.questionId
		}).then(function(resp) {
			console.log('self', self);
			console.log('resp', resp);
			self.props.makeMessage(resp);
		})
		.catch(err => {
			console.log(err);
		})
  }

	clear() {
		this.setState({code: `function solve(input) {
			// Write your solution for Question 2 here:

	}
	`})
	}

	render() {
		var options = {
			lineNumbers: true,
			readOnly: this.state.readOnly,
			mode: this.state.mode
		};

		return (
			<div>
				<CodeMirror value={this.state.code} onChange={this.updateCode.bind(this)} options={options} autoFocus={true} />
				<div style={{ marginTop: 10 }}>
					<div className="field">
					  <label className="label">Choose your language</label>
					  <div className="control">
					    <div className="select">
					      <select>
									<option value="javascript">JavaScript</option>
									<option value="c">C++</option>
									<option value="java">Java</option>
									<option value="python">Python</option>
					      </select>
					    </div>
							<button onClick={() => (this.handleSubmit(this.state.code, 'javascript'))} className="button is-primary">
								<span className="icon">
									<i className="fa fa-code"></i>
								</span>
								<span>Run Code</span>
							</button>
					  </div>
					</div>
				</div>
			</div>
		);
	}
};

export default Code;
