import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { smoothScroll } from './smoothScroll';
import { searchImages } from './api';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('#search-form input');

let currentPage = 1;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  await fetchImage();
});

async function fetchImage() {
  try {
    currentPage += 1;
    const searchResult = await searchImages(input.value, currentPage);

    if (searchResult.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 3 * 1000,
          fontSize: '15px',
        }
      );
    } else {
      console.log('search results:', searchResult);
      Notiflix.Notify.success(
        `Hooray! We found ${searchResult.totalHits} images.`,
        {
          timeout: 3 * 1000,
          fontSize: '15px',
        }
      );

      let galleryOfResults = '';
      searchResult.hits.forEach(hit => {
        galleryOfResults += `<div class="photo-card">
        <a href="${hit.largeImageURL}"><img class="img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${hit.downloads}
          </p>
        </div>
      </div>`;
      });
      gallery.innerHTML += galleryOfResults;

      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();

      setTimeout(() => {
        smoothScroll();
      }, 0);

      const lastPage = Math.ceil(searchResult.totalHits / 40);

      if (currentPage === lastPage) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
          {
            timeout: 3 * 1000,
            fontSize: '15px',
          }
        );
        return;
      } else {
        loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

loadMoreBtn.addEventListener('click', fetchImage);
