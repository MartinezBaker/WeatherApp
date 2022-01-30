import React from "react";

class SearchInput extends React.Component {
  state = {
    inputValue: ""
  };

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const value = this.state.inputValue;
    this.props.handleSubmit(value);
    this.setState({ inputValue: "" });
  };
  render() {
    return (
      <div>
        <h3>Search For Other Cities</h3>
        <form onSubmit={this.handleSubmit}>
          <input
            className="input"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
        </form>
      </div>
    );
  }
}

export default SearchInput;
