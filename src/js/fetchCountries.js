const BASE_URL = 'https://restcountries.com/v2';
const endPoint = 'name';
const searchFields = 'fields=name,capital,population,flags,languages';

export function fetchCountries(country) {
  return fetch(`${BASE_URL}/${endPoint}/${country}?${searchFields}`).then(
    responce => {
      if (!responce.ok) throw new Error(responce.status);
      return responce.json();
    }
  );
}
