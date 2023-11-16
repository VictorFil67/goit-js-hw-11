import axios from 'axios';

export class PixabayAPI {
  static API_KEY = '40694680-72f66d22c7844ca43ae47eff1';

  constructor() {
    this.q = '';
    this.page = 1;
    this.per_page = 40;

    axios.defaults.baseURL = 'https://pixabay.com/api/';
  }

  fetchPhotosByQuery() {
    const axiosOptions = {
      params: {
        key: PixabayAPI.API_KEY,
        q: this.q,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    };

    return axios.get('', axiosOptions);
}
}