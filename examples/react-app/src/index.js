import React from "react";
import ReactDOM from "react-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3456";

class App extends React.Component {
    constructor () {
        super();
        this.state = {target: null};
    }
    async componentWillMount () {
        const response = await fetch(`${API_URL}/target`);
        const target = await response.text();
        this.setState({target});
    }
    render () {
        const {target} = this.state;
        return (
            target
            ? <div>{`Hello ${target}!`}</div>
            : <div>{"Loading"}</div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
