import { isObject, isArray, reduce, camelCase } from 'lodash-es';
import { api } from 'src/boot/axios';

export const camelCaseKeys = (obj) => {
  if (!isObject(obj)) {
    return obj;
  } if (isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  }
  return reduce(obj, (r, v, k) => ({
    ...r,
    [camelCase(k)]: camelCaseKeys(v),
  }), {});
};

export const toUTCDateTime = (str) => str.replace(/^(\d\d\d\d-\d\d-\d\d).*$/, '$1T00:00:00');

export const formatDate = (str) => {
  if (!str) {
    return '';
  }
  const parts = [{ day: 'numeric' }, { month: 'short' }];

  return parts.map((part) => {
    const formatter = new Intl.DateTimeFormat('en', part);
    return formatter.format(new Date(str));
  }).join(' ');
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') {
    return '';
  }

  const formatter = new Intl.NumberFormat('en-Us');

  return formatter.format(number);
};

export const fetchCovid19Data = (options = {}) => {
  console.log('fetchCovid19Data', options);
  const params = options?.countryCode
    ? {
      params: {
        from: options.from,
        to: options.to,
      },
    }
    : null;
  const endpoint = options?.countryCode
    ? `https://api.covid19api.com/total/country/${options?.countryCode}`
    : 'https://api.covid19api.com/summary';

  return api.get(endpoint, params);

  // return camelCaseKeys(response?.data?.Countries ?? []);
};

export const fetchCovid19DataByCountry = (countryCode) => {
  const options = {
    countryCode,
    from: toUTCDateTime(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    to: toUTCDateTime(new Date(Date.now()).toISOString()),
  };

  return fetchCovid19Data(options);
};

export const fetchCountryData = (countryCode) => {
  const options = {
    method: 'GET',
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}`,
    headers: {
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
      'x-rapidapi-key': 'a000d60552mshc64ed25c0e7de1fp16fd6ajsnb4d2a3c354f6',
    },
  };
  return api.request(options);
};

export const handleError = () => {
  console.log('handle Error');

  return () => {};
};
