import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabayAPI.js';
// import { createGalleryCardsTemplate } from './templates/gallery-cards.js';
let simpleLightbox = new SimpleLightbox('.gallery a');

const searchFormEl = document.querySelector('.search-form');
const galleryDivEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

loadMoreBtnEl.classList.add('is-hidden');

const onSearchFormElSubmit = event => {
  event.preventDefault();

  const { target: searchFormEl } = event;

  pixabayAPI.q = searchFormEl.elements.searchQuery.value;
  pixabayAPI.page = 1;

  pixabayAPI
    .fetchPhotosByQuery()
    .then(({ data }) => {
      console.log(data);
      if (data.hits.length === 0) {
        galleryDivEl.innerHTML = '';
        loadMoreBtnEl.classList.add('is-hidden');
        // alert("Sorry, there are no images matching your search query. Please try again.");
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      Notiflix.Notify.success("Hooray! We found " + data.totalHits + " images.");
// alert("Hooray! We found " + data.totalHits + " images.");
    galleryDivEl.innerHTML = '';
    renderMarkup(data.hits);
    simpleLightbox.refresh();
    // console.log(data.hits);
    // refs.loadMoreBtnEl.disabled = false;
      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });
};

const onLoadMoreBtnElClick = event => {
    pixabayAPI.page += 1;

    pixabayAPI
    .fetchPhotosByQuery()
    .then(({ data }) => {
      Notiflix.Notify.success("Hooray! We found " + data.totalHits + " images.");
      // alert("Hooray! We found " + data.totalHits + " images.");
        renderMarkup(data.hits);
        simpleLightbox.refresh();
        const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
        // console.log(data.totalHits);
        // console.log(pixabayAPI.per_page);

      if (Math.ceil(data.totalHits/pixabayAPI.per_page) === pixabayAPI.page) {
        // console.log(data.totalHits/pixabayAPI.per_page);
        loadMoreBtnEl.classList.add('is-hidden');
        // loadMoreBtnEl.insertAdjacentHTML('afterend', `<p>We're sorry, but you've reached the end of search results.</p>`)
        // alert("We're sorry, but you've reached the end of search results.");
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

function createGalleryCardTemplate({webformatURL, largeImageURL,  tags, likes, views, comments,downloads}) {
    return `<div class="photo-card">
    <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`
}

function createGalleryCardsTemplate(photos) {
    const template = photos.map(createGalleryCardTemplate).join('');
    return template;
}

function renderMarkup(photos) {
    const markup = createGalleryCardsTemplate(photos);
    galleryDivEl.insertAdjacentHTML('beforeend', markup);
  }

searchFormEl.addEventListener('submit', onSearchFormElSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);