import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs';
import { renderGalleryMarkup } from './createmarkup';
import { fetchImages } from './fetchimages';

const lightbox = new SimpleLightbox('.gallery a');

const hideBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'none');
const showBtnLoadMore = () => (refs.loadMoreBtn.style.display = 'block');
hideBtnLoadMore();

let page = 1;
let perPage = 40;

export async function onFormSubmit(e) {
  e.preventDefault();

  let request = refs.form.elements.searchQuery.value.trim();
  page = 1;
  cleanGallery();

  if (request === '') {
    hideBtnLoadMore();
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (!request) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    cleanGallery();
    hideBtnLoadMore();
    return;
  }

  try {
    const galleryItems = await fetchImages(request, page);

    let totalPages = galleryItems.data.totalHits;

    renderGalleryMarkup(galleryItems.data.hits);
    lightbox.refresh();
    showBtnLoadMore();
    Notiflix.Notify.success(`Hooray! We found ${totalPages} images.`);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  // e.target.reset();
  lightbox.refresh();
}

export async function onClickBtnLoadMore() {
  page += 1;
  let request = refs.form.elements.searchQuery.value.trim();

  try {
    const galleryItems = await fetchImages(request, page);

    const totalPages = galleryItems.data.totalHits;

    if (Math.ceil(totalPages / perPage < page)) {
      hideBtnLoadMore();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    renderGalleryMarkup(galleryItems.data.hits);

    showBtnLoadMore();
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  lightbox.refresh();
}

function cleanGallery() {
  refs.gallery.innerHTML = '';
  page = 1;
  hideBtnLoadMore();
}
