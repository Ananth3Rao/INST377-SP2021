/* eslint-disable linebreak-style */
function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  const mymap = L.map('mapid').setView([38.99, -76.93], 13);
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1IjoiYW5hbnRocmFvMSIsImEiOiJja21jZmM4bmQwYTFjMm9wN3ZwY2Rtdnd5In0.dwL_XhAk4DEJst2B68I2jQ'
    }
  ).addTo(mymap);
  return mymap;
}

async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    return data;
  }
  const resturants = [];
  getData().then((data) => resturants.push(...data));

  function findMatches(matchWord, resturantsAll) {
    return resturantsAll.filter((resturant) => {
      const regex = new RegExp(matchWord, 'gi');
      return resturant.zip.match(regex);
    });
  }
  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');
  const submit = document.querySelector('.button');

  function displayMatches() {
    const matchArray = findMatches(searchInput.value, resturants);
    const html = matchArray
      .map((resturant) => `
        <div class="block">
        <ul>
        <li class="results">
            <span class="name"> ${resturant.name} </span><br />
            <span class="category"> ${resturant.category} </span> <br /> 
        <address class="alpha">
            <span class="address"> ${resturant.address_line_1} </span> <br />
            <span class="city"> ${resturant.city}</span> <br />
            <span class="zip">${resturant.zip}</span> 
        </address>
        </li>
        </ul>
        </div>
        `)
      .join('');
    suggestions.innerHTML = html;
  }
  
  submit.addEventListener('click', displayMatches);
  // and target mapObjectFromFunction to attach markers
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;
