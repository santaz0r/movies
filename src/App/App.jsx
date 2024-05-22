import { Component } from 'react';
import { Spin, Tabs } from 'antd';
import { ToastContainer } from 'react-toastify';

import './App.scss';

import 'react-toastify/dist/ReactToastify.css';
import SearchInput from './components/SearchInput/SearchInput';
import ItemsList from './components/ItemsList/ItemsList';
import { GenresProvider } from './components/GenresContext/GenresContect';
import MovieService from './services/movieService';

const spinStyle = {
  margin: 'auto auto',
  display: 'block',
};

export default class App extends Component {
  movieService = new MovieService();
  state = {
    genres: null,
    error: false,
    isLoading: true,
    activeTab: 'search',
    movieQuery: '',
  };

  getGenres = async () => {
    try {
      const res = await this.movieService.getGenres();
      this.setState({ genres: res, isLoading: false });
    } catch (error) {
      this.setState({ error: true, isLoading: false });
    }
  };

  handleTabChange = (text) => {
    this.setState({ activeTab: text });
  };

  componentDidMount() {
    this.getGenres();
    this.movieService.startSession();
  }
  componentDidCatch() {
    this.setState({
      error: true,
    });
  }

  renderItemsList = () => {
    if (this.state.activeTab === 'search') {
      return (
        <>
          <SearchInput onSearch={this.changeQuery} />
          <ItemsList fetch={(page) => this.movieService.getMovies(this.state.movieQuery, page)} />
        </>
      );
    } else {
      return <ItemsList isRated fetch={(page) => this.movieService.getRatedMovies(page)} />;
    }
  };

  changeQuery = (text) => {
    this.setState({
      movieQuery: text,
    });
  };

  render() {
    const tabs = [
      { key: 'search', label: 'Search' },
      { key: 'rated', label: 'Rated' },
    ];
    const itemsList = this.renderItemsList();
    const { isLoading } = this.state;
    const contextValues = {
      genres: this.state.genres,
      service: this.movieService,
    };

    return (
      <>
        <GenresProvider value={contextValues}>
          <div className="container">
            <div className="wrapper">
              {isLoading ? (
                <Spin style={spinStyle} size="large" />
              ) : (
                <>
                  <Tabs className="tabs" defaultActiveKey="search" items={tabs} onChange={this.handleTabChange} />
                  {itemsList}
                </>
              )}
            </div>
          </div>
        </GenresProvider>
        <ToastContainer />
      </>
    );
  }
}
