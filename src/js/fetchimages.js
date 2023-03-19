import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_Key = 'key=34532945-6dd9e50d65c600f2d5972702b';

export let page = 1;
export let limit = 40;

export async function fetchImages(value) {
  const params = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: limit,
    page: page,
  });

  try {
    const response = await axios.get(
      `${BASE_URL}?${API_Key}&q=${value}&${params}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
