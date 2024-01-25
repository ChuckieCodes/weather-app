// open weather key
const apiKey = '20751bd10c695172960f5ae80dd00388';

const searchCityBtn = document.getElementById('searchCityBtn');
const futureForecast = document.querySelector('#futureForecast');
const recentSearch = document.querySelector('#recentSearch');

// date formatter
function format_date(date) {
  const d = new Date(date);

  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('/');
}

function searchCity() {
  // get city from input
  const city = document.getElementById('searchCityField').value;

  // clear past data
  document.querySelector('#futureForecast').innerHTML = '';
  
  // get city weather
  getWeather(city);
}

function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        document.getElementById('tCityDate').innerHTML = `404 City Not Found - ${city}`;
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // update today card
      const todayIcon = `<img alt="icon" src="https://openweathermap.org/img/w/${data?.list[0].weather[0].icon}.png" width="40" height="40" />`;
      document.getElementById('tCityDate').innerHTML = `${data?.city.name}, ${data?.city.country} - ${format_date(data?.list[0].dt_txt)} ${todayIcon}`;
      document.getElementById('tTemperature').innerHTML = `Temperature: ${data?.list[0].main.temp}`;
      document.getElementById('tWind').innerHTML = `Wind: ${data?.list[0].wind.speed} MPH`;
      document.getElementById('tHumidity').innerHTML = `Humidity: ${data?.list[0].main.humidity} %`

      const rows = data.list;

      let i = 1;
      for (let row of rows) {
        // api return with 3hr intervals, only get last instance each day
        if (i % 8 === 0) {
          // check values
          // console.log(`${i} - ${format_date(row.dt_txt)} - ${row.weather[0].icon} - ${row.main.temp} - ${row.main.humidity} - ${row.wind.speed}`);

          // make card for each day
          const boxTmp = document.createElement('div');
          boxTmp.className = 'col card mx-1 p-1';
          
          // write day details
          boxTmp.innerHTML += `<h6>${format_date(row.dt_txt)} <img alt="icon" src="https://openweathermap.org/img/w/${row.weather[0].icon}.png" width="40" height="40" /></h6>
          <p>Temperature: ${row.main.temp}</p>
          <p>Wind: ${row.wind.speed} MPH</p>
          <p>Humidity: ${row.main.humidity} %</p>
          `;

          // write to ui
          futureForecast.appendChild(boxTmp);
        }
        i++;
      }      
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

searchCityBtn.addEventListener('click', searchCity);
