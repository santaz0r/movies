import { Component } from 'react';
import debounce from 'lodash.debounce';

import './search.scss';

export default class SearchInput extends Component {
  state = {
    value: '',
  };

  onSubmit = () => {
    if (!this.state.value.trim()) return;
    this.props.onSearch(this.state.value.trim());
  };

  debouncedSubmit = debounce(this.onSubmit, 1000);

  handleChange = (e) => {
    this.setState({ value: e.target.value });
    this.debouncedSubmit();
  };
  render() {
    return (
      <input
        type="text"
        className="search"
        placeholder="What do you need to find?"
        onChange={this.handleChange}
        value={this.state.value}
        maxLength={50}
      />
    );
  }
}
