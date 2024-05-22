export default class MovieService {
  #token =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDMwMjRkYjgwMjAyOGNhOTdkMGQ4YzYwOGQ5OGZmZiIsInN1YiI6IjY2NDc3Y2NhODg4MjFmN2UxNjJmNDU2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.33KLPRFCFjdVQZjQ8EuCDgS4sXrKrKpr6g6LhXl-rlQ';
  #moviesURL = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&';
  #genresURL = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
  #guestSessionURL = 'https://api.themoviedb.org/3/authentication/guest_session/new';
  #ratedMoviesURL = 'https://api.themoviedb.org/3/guest_session';
  #addRateURL = 'https://api.themoviedb.org/3/movie';
  SESSION_ID = 'session_id';

  async getResource(url) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this.#token,
      },
    };
    try {
      const res = await fetch(url, options);

      // if (!res.ok) {
      //   throw new Error(`Could not fetch ${url},
      //   received ${res.status}`);
      // }
      const data = await res.json();
      return data;
    } catch (error) {
      alert('вруби ВПН если что');
    }
  }

  async postResource(url, rating) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this.#token,
      },
      body: `{"value":${rating}}`,
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`Could not fetch ${url},
        received ${res.status}`);
      }

      const body = await res.json();
      return body;
    } catch (err) {
      console.log(err);
    }
  }

  async startSession() {
    if (sessionStorage.getItem(this.SESSION_ID)) return;
    try {
      const res = await this.getResource(this.#guestSessionURL);
      sessionStorage.setItem(this.SESSION_ID, res.guest_session_id);
    } catch (error) {
      console.log(error);
    }
  }

  async getMovies(title, page) {
    const res = await this.getResource(`${this.#moviesURL}query=${title}&page=${page}`);
    return { movies: res.results, totalItems: res.total_results };
  }

  async getGenres() {
    const res = await this.getResource(this.#genresURL);
    return res.genres;
  }

  async getRatedMovies(page = 1) {
    const sessionId = sessionStorage.getItem(this.SESSION_ID);

    const res = await this.getResource(`${this.#ratedMoviesURL}/${sessionId}/rated/movies?language=en-US&page=${page}`);

    return { movies: res.results || [], totalItems: res.total_results || 0 };
  }

  async addRaiting(movieId, rating) {
    const sessionId = sessionStorage.getItem(this.SESSION_ID);
    const res = await this.postResource(`${this.#addRateURL}/${movieId}/rating?guest_session_id=${sessionId}`, rating);
    return res;
  }
}
