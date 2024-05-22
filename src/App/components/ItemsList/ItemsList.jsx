import { Component } from 'react';
import { Alert, Pagination, Spin } from 'antd';
import { Offline } from 'react-detect-offline';

import MovieService from '../../services/movieService';
import Item from '../Item/Item';
import { GenresConsumer } from '../GenresContext/GenresContect';

import './items.scss';

export default class ItemsList extends Component {
  movieService = new MovieService();

  state = {
    dataList: null,
    isLoading: true,
    error: false,
    currentPage: 1,
    totalItems: null,
  };

  handleChangePage = (page) => {
    this.setState({ currentPage: page });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) this.renderItems();
    if (this.props !== prevProps) this.renderItems();
  }

  renderItems = async () => {
    this.setState({
      isLoading: true,
      dataList: null,
      error: false,
    });

    try {
      const res = await this.props.fetch(this.state.currentPage);
      const { movies, totalItems } = res;

      this.setState({
        isLoading: false,
        dataList: movies,
        error: false,
        totalItems: totalItems,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error: true,
      });
    }
  };

  componentDidMount() {
    this.renderItems();
  }
  render() {
    const { dataList, isLoading, currentPage, totalItems, error } = this.state;
    const { isRated } = this.props;
    const message = isRated ? 'Вы ничего не оценивали' : 'Ничего не найдено';
    const noEthernetComp = <Alert description="Your ethernet is off..." showIcon={true} type="error" />;
    const errorComp = <Alert description="Oops... it's bad" showIcon={true} type="error" />;
    const cards = dataList?.map((i) => {
      return (
        <GenresConsumer key={i.id}>
          {({ genres, service }) => {
            return <Item service={service} genres={genres} item={i} isRated={isRated} />;
          }}
        </GenresConsumer>
      );
    });
    return (
      <>
        <Pagination
          className="pagination"
          current={currentPage}
          total={totalItems}
          onChange={this.handleChangePage}
          defaultPageSize={20}
          showSizeChanger={false}
          hideOnSinglePage
        />
        {error && errorComp}
        {isLoading ? (
          <div className="items-list">
            <Spin size="large" />
          </div>
        ) : (
          <div className="items-list">{dataList.length ? cards : message}</div>
        )}

        <Offline>{noEthernetComp}</Offline>
      </>
    );
  }
}
