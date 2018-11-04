import React from "react";
import Question from "./Question";
import "../stylesheets/Questions.css";
import Summary from "./Summary";
import Header from "./Header";
import Timer from "./Timer";
class Questions extends React.Component {
	constructor(props) {
		super(props);
		this.state = { questions: [], index: 0, loading: true, count: 0 };
	}
	toSubmit = async (id, value) => {
		let qs = this.state.questions;
		qs[this.state.index].selected = value;
		await this.setState({
			questions: qs,
			count: this.state.count + 1
		});
		await setTimeout(() => {
			let index = this.state.index + 1;
			this.setState({ index: index });
		}, 500);
	};
	timeout = () => {
		this.setState({ index: this.state.questions.length });
	};
	componentDidMount = async () => {
		const urls = {
			HTML:
				"https://raw.githubusercontent.com/danielpoehle/Quizard/master/data/questions_html.json",
			CSS:
				"https://raw.githubusercontent.com/danielpoehle/Quizard/master/data/questions_css.json",
			JS:
				"https://raw.githubusercontent.com/danielpoehle/Quizard/master/data/questions_js.json"
		};
		const response = await fetch(urls[this.props.match.params.topic]);
		if (response.ok) {
			const qs = await response.json();
			this.setState({ questions: qs.questions, loading: false });
		} else alert("No questions found");
	};
	render() {
		const question = this.state.questions[this.state.index];
		if (this.state.loading)
			return (
				<div>
					<Header />
					<h1>Loading questions..</h1>.
				</div>
			);
		else if (this.state.index < this.state.questions.length)
			return (
				<div>
					<Header />
					<div className="questions">
						<Timer timeout={this.timeout} total={this.state.questions.length} />
						<Question
							id={question.id}
							key={question.id}
							question={question.question}
							options={question.options}
							toSubmit={this.toSubmit}
						/>
					</div>
				</div>
			);
		else
			return (
				<div>
					<Header />
					<Summary
						submitted={this.state.count}
						total={this.state.questions.length}
					/>
				</div>
			);
	}
}

export default Questions;
