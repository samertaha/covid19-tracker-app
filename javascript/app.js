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
    return allCountries
      .map((country) => {
        return { name: country.name, confirmed: country.latest_data.confirmed };
      })
      .sort((a, b) => a.confirmed - b.confirmed);
  },
  getRecoveredCasesInContinent(continent) {
    const allCountries = this.getCountriesByContinent(continent);
    return allCountries
      .map((country) => {
        return { name: country.name, recovered: country.latest_data.recovered };
      })
      .sort((a, b) => a.recovered - b.recovered);
  },
  getCriticalCasesInContinent(continent) {
    const allCountries = this.getCountriesByContinent(continent);
    return allCountries
      .map((country) => {
        return { name: country.name, critical: country.latest_data.critical };
      })
      .sort((a, b) => a.critical - b.critical);
  },
  getDeathsCasesInContinent(continent) {
    const allCountries = this.getCountriesByContinent(continent);
    return allCountries
      .map((country) => {
        return { name: country.name, deaths: country.latest_data.deaths };
      })
      .sort((a, b) => a.deaths - b.deaths);
  },
  getAllCasesForContinent(continent) {
    const confirmed = this.getConfirmedCasesInContinent(continent);
    const recovered = this.getRecoveredCasesInContinent(continent);
    const critical = this.getCriticalCasesInContinent(continent);
    const deaths = this.getDeathsCasesInContinent(continent);
    return {
      confirmed: confirmed,
      recovered: recovered,
      critical: critical,
      deaths: deaths,
    };
  },
};
// console.log(newCovidData.getConfirmedCasesInContinent('north_america'));
// console.log(newCovidData.getRecoveredCasesInContinent('north_america'));
// console.log(newCovidData.getCriticalCasesInContinent('north_america'));
// console.log(newCovidData.getDeathsCasesInContinent('north_america'));

const areas = document.querySelectorAll('area');
let allCases;
let appState = {
  continent: '',
  loading: false,
  confirmedBtn: true,
  recoveredBtn: false,
  criticalBtn: false,
  deathsBtn: false,
};
let north_america = document.querySelector("area[href='#north_america']");

const ConfirmedBtn = document.getElementById('ConfirmedBtn');
const RecoveredBtn = document.getElementById('RecoveredBtn');
const CriticalBtn = document.getElementById('CriticalBtn');
const DeathsBtn = document.getElementById('DeathsBtn');

areas.forEach((area) => {
  area.addEventListener('click', (e) => {
    e.preventDefault();
    const continent = e.target.getAttribute('href').slice(1);
    switch (continent) {
      case 'north_america':
        allCases = newCovidData.getAllCasesForContinent('north_america');
        appState.continent = 'north_america';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'red';
        console.log('area clicked automatically');
        break;
      case 'south_america':
        allCases = newCovidData.getAllCasesForContinent('south_america');
        appState.continent = 'south_america';
        ConfirmedBtn.click();
        break;
      case 'africa':
        allCases = newCovidData.getAllCasesForContinent('africa');
        appState.continent = 'africa';
        ConfirmedBtn.click();
        break;
      case 'europe':
        allCases = newCovidData.getAllCasesForContinent('europe');
        appState.continent = 'europe';
        ConfirmedBtn.click();
        break;
      case 'australia':
        allCases = newCovidData.getAllCasesForContinent('australia');
        appState.continent = 'australia';
        ConfirmedBtn.click();
        break;
      case 'asia':
        allCases = newCovidData.getAllCasesForContinent('asia');
        appState.continent = 'asia';
        ConfirmedBtn.click();
        break;
      case 'antarctica':
        break;
      default:
        break;
    }
  });
});

north_america.click();

let countries = allCases.confirmed.map((country) => country.name);
let data = allCases.confirmed.map((country) => country.confirmed);
let chartjs = document.querySelector('canvas#canvas').getContext('2d');
let cases = [
  {
    data: data,
    borderColor: 'red',
    fill: false,
  },
];
let chart = covidChart(countries, cases, chartjs);

// console.log(north_america);

ConfirmedBtn.addEventListener('click', (e) => {
  let countries = allCases.confirmed.map((country) => country.name);
  let data = allCases.confirmed.map((country) => country.confirmed);
  appState.confirmedBtn = appState.confirmedBtn ? false : true;

  console.log('hello');
  if (appState.confirmedBtn) {
    console.log(appState.confirmedBtn);
    ConfirmedBtn.style.backgroundColor = 'red';
    chart.data.labels = countries;
    chart.data.datasets.push({
      data: data,
      borderColor: 'red',
      fill: false,
    });
  } else {
    ConfirmedBtn.style.backgroundColor = '#fff';
    chart.data.datasets = chart.data.datasets.filter(
      (obj) => obj.borderColor !== 'red'
    );
  }
  chart.update();
});

RecoveredBtn.addEventListener('click', (e) => {
  let countries = allCases.confirmed.map((country) => country.name);
  let data = allCases.recovered.map((country) => country.recovered);
  appState.recoveredBtn = appState.recoveredBtn ? false : true;

  console.log('hello');
  if (appState.recoveredBtn) {
    console.log(appState.confirmedBtn);
    RecoveredBtn.style.backgroundColor = 'green';
    chart.data.labels = countries;
    chart.data.datasets.push({
      data: data,
      borderColor: 'green',
      fill: false,
    });
  } else {
    RecoveredBtn.style.backgroundColor = '#fff';
    chart.data.datasets = chart.data.datasets.filter(
      (obj) => obj.borderColor !== 'green'
    );
  }
  chart.update();
});

CriticalBtn.addEventListener('click', (e) => {
  let countries = allCases.critical.map((country) => country.name);
  let data = allCases.critical.map((country) => country.critical);
  appState.criticalBtn = appState.criticalBtn ? false : true;

  console.log('hello');
  if (appState.criticalBtn) {
    CriticalBtn.style.backgroundColor = 'orange';
    chart.data.labels = countries;
    chart.data.datasets.push({
      data: data,
      borderColor: 'orange',
      fill: false,
    });
  } else {
    CriticalBtn.style.backgroundColor = '#fff';
    chart.data.datasets = chart.data.datasets.filter(
      (obj) => obj.borderColor !== 'orange'
    );
  }
  chart.update();
});
DeathsBtn.addEventListener('click', (e) => {
  let countries = allCases.deaths.map((country) => country.name);
  let data = allCases.deaths.map((country) => country.deaths);
  appState.deathsBtn = appState.deathsBtn ? false : true;

  if (appState.deathsBtn) {
    DeathsBtn.style.backgroundColor = 'black';
    DeathsBtn.style.color = 'white';
    chart.data.labels = countries;
    chart.data.datasets.push({
      data: data,
      borderColor: 'black',
      fill: false,
    });
  } else {
    DeathsBtn.style.backgroundColor = '#fff';
    DeathsBtn.style.color = '#000';
    chart.data.datasets = chart.data.datasets.filter(
      (obj) => obj.borderColor !== 'black'
    );
  }
  chart.update();
});
