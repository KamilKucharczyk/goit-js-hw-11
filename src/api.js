import axios from 'axios';
const API_KEY = '39460878-dc736cfcb50ba2857b324878d';
const API_URL = 'https://pixabay.com/api/';

export async function searchImages(userInput, currentPage) {
  const urlEncodedUserInput = userInput.split(' ').join('+');
  let searchParams = new URLSearchParams({
    q: urlEncodedUserInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 49,
    page: currentPage,
  });

  try {
    const response = await axios.get(`${API_URL}&${searchParams}`);
    console.log('search result from API:', response.data);
    return response.data;
  } catch (error) {
    errorInAxios(error);
  }
}

function errorInAxios(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
}
