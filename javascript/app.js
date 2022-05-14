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
  getCountryByCode(code) {
    return covidData.find((country) => country.code === code);
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
let continentName = document.getElementById('continentName');
const tagscloud = document.getElementById('tagscloud');
const countryName = document.getElementById('countryName');
const map = document.getElementById('map');

const totalCases = document.querySelector('.results #totalCases');
const newCases = document.querySelector('.results #newCases');
const totalDeaths = document.querySelector('.results #totalDeaths');
const newDeaths = document.querySelector('.results #newDeaths');
const totalRecovered = document.querySelector('.results #totalRecovered');
const inCritical = document.querySelector('.results #inCritical');

// console.log('totalCases', totalCases);
const styles = ['tagc1', 'tagc2', 'tagc3'];
let names;

areas.forEach((area) => {
  area.addEventListener('click', (e) => {
    e.preventDefault();
    const continent = e.target.getAttribute('href').slice(1);
    switch (continent) {
      case 'north_america':
        allCases = newCovidData.getAllCasesForContinent('north_america');
        appState.continent = 'north_america';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'orange';
        continentName.style.color = '#90EE90';
        continentName.textContent = 'north america';

        newCovidData.getCountriesByContinent(continent).forEach((country) => {
          const a = document.createElement('a');
          const rand = Math.floor(Math.random() * 3) + 1;
          a.innerText = country.name;
          a.setAttribute('code', country.code);
          a.setAttribute('href', '#');
          a.classList.add(styles[rand - 1]);
          tagscloud.appendChild(a);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(e.target.getAttribute('code'));

            const country = newCovidData.getCountryByCode(
              e.target.getAttribute('code')
            );
            countryName.textContent = country.name;
            totalCases.setAttribute('data-note', country.latest_data.confirmed);
            newCases.setAttribute('data-note', country.today.confirmed);
            totalDeaths.setAttribute('data-note', country.latest_data.deaths);
            newDeaths.setAttribute('data-note', country.today.deaths);
            totalRecovered.setAttribute(
              'data-note',
              country.latest_data.recovered
            );
            inCritical.setAttribute('data-note', country.latest_data.critical);
            drawResults();
          });
        });
        tagscloud.style.display = 'block';
        runTagCloud();
        break;
      case 'south_america':
        allCases = newCovidData.getAllCasesForContinent('south_america');
        appState.continent = 'south_america';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'orange';
        continentName.style.color = 'green';
        continentName.textContent = 'south america';

        newCovidData.getCountriesByContinent(continent).forEach((country) => {
          const a = document.createElement('a');
          const rand = Math.floor(Math.random() * 3) + 1;
          a.innerText = country.name;
          a.setAttribute('code', country.code);
          a.setAttribute('href', '#');
          a.classList.add(styles[rand - 1]);
          tagscloud.appendChild(a);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(e.target.getAttribute('code'));

            const country = newCovidData.getCountryByCode(
              e.target.getAttribute('code')
            );
            countryName.textContent = country.name;
            totalCases.setAttribute('data-note', country.latest_data.confirmed);
            newCases.setAttribute('data-note', country.today.confirmed);
            totalDeaths.setAttribute('data-note', country.latest_data.deaths);
            newDeaths.setAttribute('data-note', country.today.deaths);
            totalRecovered.setAttribute(
              'data-note',
              country.latest_data.recovered
            );
            inCritical.setAttribute('data-note', country.latest_data.critical);
            drawResults();
          });
        });
        tagscloud.style.display = 'block';
        runTagCloud();
        break;
      case 'africa':
        allCases = newCovidData.getAllCasesForContinent('africa');
        appState.continent = 'africa';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'orange';
        continentName.style.color = '#8B8000';
        continentName.textContent = 'africa';

        newCovidData.getCountriesByContinent(continent).forEach((country) => {
          const a = document.createElement('a');
          const rand = Math.floor(Math.random() * 3) + 1;
          a.innerText = country.name;
          a.setAttribute('code', country.code);
          a.setAttribute('href', '#');
          a.classList.add(styles[rand - 1]);
          tagscloud.appendChild(a);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(e.target.getAttribute('code'));

            const country = newCovidData.getCountryByCode(
              e.target.getAttribute('code')
            );
            countryName.textContent = country.name;
            totalCases.setAttribute('data-note', country.latest_data.confirmed);
            newCases.setAttribute('data-note', country.today.confirmed);
            totalDeaths.setAttribute('data-note', country.latest_data.deaths);
            newDeaths.setAttribute('data-note', country.today.deaths);
            totalRecovered.setAttribute(
              'data-note',
              country.latest_data.recovered
            );
            inCritical.setAttribute('data-note', country.latest_data.critical);
            drawResults();
          });
        });
        tagscloud.style.display = 'block';
        runTagCloud();
        break;
      case 'europe':
        allCases = newCovidData.getAllCasesForContinent('europe');
        appState.continent = 'europe';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'orange';
        continentName.style.color = 'red';
        continentName.textContent = 'europe';

        newCovidData.getCountriesByContinent(continent).forEach((country) => {
          const a = document.createElement('a');
          const rand = Math.floor(Math.random() * 3) + 1;
          a.innerText = country.name;
          a.setAttribute('code', country.code);
          a.setAttribute('href', '#');
          a.classList.add(styles[rand - 1]);
          tagscloud.appendChild(a);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(e.target.getAttribute('code'));

            const country = newCovidData.getCountryByCode(
              e.target.getAttribute('code')
            );
            countryName.textContent = country.name;
            totalCases.setAttribute('data-note', country.latest_data.confirmed);
            newCases.setAttribute('data-note', country.today.confirmed);
            totalDeaths.setAttribute('data-note', country.latest_data.deaths);
            newDeaths.setAttribute('data-note', country.today.deaths);
            totalRecovered.setAttribute(
              'data-note',
              country.latest_data.recovered
            );
            inCritical.setAttribute('data-note', country.latest_data.critical);
            drawResults();
          });
        });
        tagscloud.style.display = 'block';
        runTagCloud();
        break;
      case 'australia':
        allCases = newCovidData.getAllCasesForContinent('australia');
        appState.continent = 'australia';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'orange';
        continentName.style.color = 'red';
        continentName.textContent = 'australia';

        newCovidData.getCountriesByContinent(continent).forEach((country) => {
          const a = document.createElement('a');
          const rand = Math.floor(Math.random() * 3) + 1;
          a.innerText = country.name;
          a.setAttribute('code', country.code);
          a.setAttribute('href', '#');
          a.classList.add(styles[rand - 1]);
          tagscloud.appendChild(a);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(e.target.getAttribute('code'));

            const country = newCovidData.getCountryByCode(
              e.target.getAttribute('code')
            );
            countryName.textContent = country.name;
            totalCases.setAttribute('data-note', country.latest_data.confirmed);
            newCases.setAttribute('data-note', country.today.confirmed);
            totalDeaths.setAttribute('data-note', country.latest_data.deaths);
            newDeaths.setAttribute('data-note', country.today.deaths);
            totalRecovered.setAttribute(
              'data-note',
              country.latest_data.recovered
            );
            inCritical.setAttribute('data-note', country.latest_data.critical);
            drawResults();
          });
        });
        tagscloud.style.display = 'block';
        runTagCloud();
        break;
      case 'asia':
        allCases = newCovidData.getAllCasesForContinent('asia');
        appState.continent = 'asia';
        ConfirmedBtn.click();
        ConfirmedBtn.style.backgroundColor = 'orange';
        continentName.style.color = 'orange';
        continentName.textContent = 'asia';

        newCovidData.getCountriesByContinent(continent).forEach((country) => {
          const a = document.createElement('a');
          const rand = Math.floor(Math.random() * 3) + 1;
          a.innerText = country.name;
          a.setAttribute('code', country.code);
          a.setAttribute('href', '#');
          a.classList.add(styles[rand - 1]);
          tagscloud.appendChild(a);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(e.target.getAttribute('code'));

            const country = newCovidData.getCountryByCode(
              e.target.getAttribute('code')
            );
            countryName.textContent = country.name;
            totalCases.setAttribute('data-note', country.latest_data.confirmed);
            newCases.setAttribute('data-note', country.today.confirmed);
            totalDeaths.setAttribute('data-note', country.latest_data.deaths);
            newDeaths.setAttribute('data-note', country.today.deaths);
            totalRecovered.setAttribute(
              'data-note',
              country.latest_data.recovered
            );
            inCritical.setAttribute('data-note', country.latest_data.critical);
            drawResults();
          });
        });
        tagscloud.style.display = 'block';
        runTagCloud();
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
    borderColor: 'orange',
    fill: false,
  },
];
let chart = covidChart(countries, cases, chartjs);

// console.log(north_america);

ConfirmedBtn.addEventListener('click', (e) => {
  let countries = allCases.confirmed.map((country) => country.name);
  let data = allCases.confirmed.map((country) => country.confirmed);
  appState.confirmedBtn = appState.confirmedBtn ? false : true;

  if (appState.confirmedBtn) {
    ConfirmedBtn.style.backgroundColor = 'orange';
    chart.data.labels = countries;
    chart.data.datasets.push({
      data: data,
      borderColor: 'orange',
      fill: false,
    });
  } else {
    ConfirmedBtn.style.backgroundColor = '#fff';
    chart.data.datasets = chart.data.datasets.filter(
      (obj) => obj.borderColor !== 'orange'
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
    CriticalBtn.style.backgroundColor = 'red';
    chart.data.labels = countries;
    chart.data.datasets.push({
      data: data,
      borderColor: 'red',
      fill: false,
    });
  } else {
    CriticalBtn.style.backgroundColor = '#fff';
    chart.data.datasets = chart.data.datasets.filter(
      (obj) => obj.borderColor !== 'red'
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

map.addEventListener('click', (e) => {
  tagscloud.textContent = '';
  tagscloud.style.display = 'none';
});
