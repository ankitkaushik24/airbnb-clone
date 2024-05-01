import countries from "world-countries";

const countriesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
  flag: item.flag,
  latLang: item.latlng,
  region: item.region,
}));

const worldCountries = {
  allCountries: countriesFormatted,
  countryByValue(value: string) {
    return countriesFormatted.find((item) => item.value === value);
  },
};

export default worldCountries;
