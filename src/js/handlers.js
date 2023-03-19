import { fetchImages, limit, page } from './fetchImages';
import { refs } from './refs';
import Notiflix from 'notiflix';
import { createGalleryMarkup, renderGalleryMarkup } from './createmarkup';
import axios from 'axios';

const hideBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'none');
const showBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'block');
hideBtnLoadMore();

export async function onFormSubmit(e) {
  e.preventDefault();

  const request = refs.input.value.trim();
  console.log(request);
  page = 1;
  cleanGallery();

  try {
    const images = await fetchImages(request);

    let totalPages = images.data.totalHits;
    if (totalPages === 0) {
      hideBtnLoadMore();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (!request) {
      hideBtnLoadMore();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalPages === 1) {
      hideBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} image.`);
    } else if (totalPages > 1 && totalPages <= 40) {
      hideBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} images.`);
    } else if (totalPages > 40) {
      showBtnLoadMore();
      Notiflix.Notify.success(`Hooray! We found ${totalPages} images.`);
    }

    renderGalleryMarkup(images.data.hits, refs.gallery);
  } catch (error) {
    console.log(error);
  }

  e.target.reset();
}

refs.loadMoreBtn.addEventListener('click', onClickBtnLoadMore);

export async function onClickBtnLoadMore() {
  const request = refs.input.value.trim();
  page += 1;
  try {
    const loadMore = await fetchImages(request);
    let totalPages = loadMore.data.totalHits;

    renderGalleryMarkup(loadMore.data.hits, refs.gallery);
    if (page > totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      hideBtnLoadMore();
      form.reset();
    }
  } catch (error) {
    console.log(error);
  }

  fetchImages(request, page);
  showBtnLoadMore();
}

function cleanGallery() {
  refs.gallery.innerHTML = '';
  page = 1;
  hideBtnLoadMore();
}
