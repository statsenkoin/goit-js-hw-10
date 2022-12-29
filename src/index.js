import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBoxRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

addStyles();

searchBoxRef.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  const inputStr = e.target.value.trim();
  if (!inputStr) {
    updateMarkup('', '');
  } else {
    fetchCountries(inputStr).then(createMarkup).catch(createErrorMessage);
  }
}

function createMarkup(countriesArr) {
  if (countriesArr.length > 10) {
    createInfoMessage();
  } else if (countriesArr.length === 1) {
    createCountryInfoMarkup(countriesArr);
  } else {
    createCountryListMarkup(countriesArr);
  }
}

function createCountryInfoMarkup(country) {
  const [
    {
      name: countryName,
      capital,
      population,
      flags: { svg },
      languages,
    },
  ] = country;
  const langsStr = languages.map(({ name }) => name).join(', ');

  const markup = `<div class="country-wrapper">
        <img src="${svg}" alt="${countryName}" width=50/>
        <h1>${countryName}</h1>
      </div>
      <h2>Capital: <span>${capital}</span></h2>
      <h2>Population: <span>${population}</span></h2>
      <h2>Languages: <span>${langsStr}</span></h2>`;

  updateMarkup('', markup);
}

function createCountryListMarkup(countriesList) {
  const markup = countriesList
    .map(
      ({ name, flags: { svg } }) =>
        `<li>
            <img src="${svg}" alt="${name}" width=50/>
            <h2>${name}</h2>
        </li>`
    )
    .join('');

  updateMarkup(markup, '');
}

function createErrorMessage(error) {
  const strErr = 'Oops, there is no country with that name';
  // updateMarkup('', '');
  // Notify.failure(strErr);

  console.log('error :>> ', error.message);
  if (error.message === '404') {
    updateMarkup('', '');
    Notify.failure(strErr);
  }
}
function createInfoMessage() {
  const strTooMany =
    'Too many matches found. Please enter a more specific name.';
  updateMarkup('', '');
  Notify.info(strTooMany);
}

function updateMarkup(countryListMarkup, countryInfoMarkup) {
  countryInfoRef.innerHTML = countryInfoMarkup;
  countryListRef.innerHTML = countryListMarkup;
}

function addStyles() {
  const extraStyles = `<style>
        body {margin: 10px;}
        h1 {display: inline}
        h2 {margin: 0;}
        ul {list-style: none;padding: 0}
        li {display: flex;padding: 5px}
        img {margin-right: 10px;}
        span {font-weight: 400;}
    </style>`;
  document.head.insertAdjacentHTML('beforeend', extraStyles);
}
