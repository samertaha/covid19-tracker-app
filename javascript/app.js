import { allCountries } from '../data/countries_data.js';
import { covidData } from '../data/covid_data.js';

const globe = {
  theSevenContinents: {
    north_america: ['Northern America', 'Caribbean'],
    south_america: ['South America', 'Central America'],
    africa: ['Africa'],
    europe: ['Europe'],
    australia: ['Oceania'],
    asia: ['Asia'],
    antarctica: [''],
  },
  allCountries: allCountries,
  getRegionByCountryCode(code) {
    const country = this.allCountries.find((country) => country.cca2 === code);
    return { region: country.region, subregion: country.subregion };
  },
};
// console.log(globe.getCountriesByContinent('north_america'));
// console.log(allCountries);
// console.log(covidData);
const newCovidData = {
  covidData: covidData,
  CovidDataWithRegion() {
    return this.covidData.map((covidCountry) => {
      const regionInfo = globe.getRegionByCountryCode(covidCountry.code);
      return { ...covidCountry, ...regionInfo };
    });
  },
  getCountriesByContinent(continent) {
    const withRegion = this.CovidDataWithRegion();
    return withRegion.filter((country) => {
      return (
        globe.theSevenContinents[continent].includes(country.region) ||
        globe.theSevenContinents[continent].includes(country.subregion)
      );
    });
  },
  getConfirmedCasesInContinent(continent) {
    const allCountries = this.getCountriesByContinent(continent);
    return allCountries.map((country) => {
      name: country.name;
      confirmed: country.latest_data.confirmed;
    });
  },
};
