import { Component } from 'react';
import { format } from 'date-fns';
import { Badge, Rate, Tag } from 'antd';
import { toast } from 'react-toastify';

import imgStub from './no-photo-svgrepo-com.svg';
import './item.scss';

export default class Item extends Component {
  state = {
    genres: this.props.genres.filter((i) => this.props.item.genre_ids.includes(i.id)),
    stars: this.props.item.rating || this.props.item.vote_average,
  };

  cutText = (text) => {
    if (!text)
      return 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae nulla, saepe porro maxime unde sed amet sapiente quas, placeat deleniti natus harum, quasi vitae. Molestiae ea magnam animi quas placeat?';
    if (text.length <= 120) return text;
    const lastSpaceIdx = text.slice(0, 120).lastIndexOf(' ');
    const formatedText = `${text.slice(0, lastSpaceIdx)} ...`;
    return formatedText;
  };

  handleRate = async (rate) => {
    const { id } = this.props.item;
    await this.props.service.addRaiting(id, rate);
    this.props.isRated ? toast.success('Рейтинг обновлен') : toast.success('Этот фильм появится во вкладке Rated');

    this.props.isRated &&
      this.setState({
        stars: rate,
      });
  };

  render() {
    const { title, overview, release_date: date, poster_path: posterPath, vote_average: rating } = this.props.item;
    const { isRated } = this.props;
    const { genres, stars } = this.state;
    const posterURL = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : imgStub;
    const transformedDate = date ? format(new Date(date), 'MMMM d, yyyy') : date;
    const cutedText = this.cutText(overview);
    const rate = rating.toFixed(1);
    const classByRating = (rate) => (rate > 7 ? 'great' : rate > 5 ? 'good' : rate > 3 ? 'not-bad' : 'bad');
    const rateFilmClass = classByRating(rating);
    const myRate = classByRating(stars);
    const badgeColors = {
      bad: '#e90000',
      'not-bad': '#e97e00',
      good: '#e9d100',
      great: '#66e900',
    };
    return (
      <div className="card">
        <img className="card__img" src={posterURL} />
        <div className="card__info">
          <h3 className="card__title">{title}</h3>
          <time className="card__date" dateTime={date}>
            {transformedDate}
          </time>
          <div className="card__genres">
            {genres.length ? genres.map((g) => <Tag key={g.id}>{g.name}</Tag>) : <Tag key={'noGenre'}>Без жанра</Tag>}
          </div>
          <p className="card__descr">{cutedText}</p>
          <Rate
            className="card__stars"
            style={{ fontSize: '16px' }}
            allowHalf
            count={10}
            value={stars}
            onChange={this.handleRate}
          />
          <Badge
            color={badgeColors[rateFilmClass]}
            size="small"
            count={'Общая'}
            style={{ color: '#000' }}
            offset={[-10, -5]}
            className={`card__rating ${rateFilmClass}`}
          >
            <p>{rate}</p>
          </Badge>
          {isRated && (
            <Badge
              className={`card__rating my-rate ${myRate}`}
              color={badgeColors[myRate]}
              style={{ color: '#000' }}
              size="small"
              count={'Ваша'}
              offset={[-10, -5]}
            >
              <p>{stars} </p>
            </Badge>
          )}
        </div>
      </div>
    );
  }
}
