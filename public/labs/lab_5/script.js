/* eslint-disable quotes */
/* eslint-disable linebreak-style */
function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  const mymap = L.map("mapid").setView([38.99, -76.93], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiYW5hbnRocmFvMSIsImEiOiJja21jZmM4bmQwYTFjMm9wN3ZwY2Rtdnd5In0.dwL_XhAk4DEJst2B68I2jQ"
    }
  ).addTo(mymap);
  return mymap;
}

async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  async function getData() {
    const response = await fetch("/api");
    const data = await response.json();
    return data;
  }
  const resturants = [];
  getData().then((data) => resturants.push(...data));

  function findMatches(matchWord, resturantsAll) {
    return resturantsAll.filter((resturant) => {
      const regex = new RegExp(matchWord, "gi");
      return resturant.zip.match(regex);
    });
  }
  const searchInput = document.querySelector(".search");
  const suggestions = document.querySelector(".suggestions");
  const submit = document.querySelector(".button");

  function getID(array) {
    const IDarray = array.map((rest) => rest.establishment_id);
    return IDarray;
  }

  function displayMatches(event) {
    event.preventDefault();
    const matchArray = findMatches(searchInput.value, resturants);
    const eIDs = getID(matchArray);
    const unique = new Set(eIDs);
    const uniqueArray = Array.from(unique);
    const topFiveIDs = uniqueArray.slice(0, 5);
    const topFive = topFiveIDs.map((id) => matchArray.find((rest) => rest.establishment_id === id));
    if (topFive.length > 0) {
      const html = topFive
        .map(
          (resturant) => `
        <div class="block">
        <ul>
        <li class="results">
            <span class="name"> ${resturant.name} </span><br />
            <span class="address"> ${resturant.address_line_1} </span> <br />
            <span class="city"> ${resturant.city}</span> <br />
            <span class="zip">${resturant.zip}</span> 
        </address>
        </li>
        </ul>
        </div>
        `
        )
        .join("");
      suggestions.innerHTML = html;
      mapObjectFromFunction.setView(
        topFive[0].geocoded_column_1.coordinates.reverse()
      );
      topFive.forEach((rest) => {
        const coord = rest.geocoded_column_1.coordinates.reverse();
        L.marker(coord).addTo(mapObjectFromFunction);
      });
    }
  }

  function checkLength() {
    if (searchInput.value.length === 0) {
      suggestions.innerHTML = ``;
    }
  }

  submit.addEventListener("click", displayMatches); // Event listener for button
  searchInput.addEventListener("keyup", checkLength); // Event listener when search is empty
  // and target mapObjectFromFunction to attach markers
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;
