'use strict'

const POS_ZERO = [0, 0]
const POS_MAP_CENTER = [43.3191259, -0.3663409]

const tableDataRow = document.getElementById('tableHeadRow')
const tableBody = document.getElementById('tableBody')


const map = L.map('map').setView(POS_MAP_CENTER, 14.3)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

const selectLocation = L.marker(POS_ZERO).addTo(map)

// on click get position
map.on('click', async (e) => {
  const lat = e.latlng.lat
  const long = e.latlng.lng

  selectLocation.setLatLng(e.latlng)

  const data = await getForecast([lat, long])


  createHeadRow(Object.keys(data.hourly))
  createDataRows(Object.values(data.hourly))
})

async function getForecast(pos) {
  try {

    const lat = pos[0]
    const long = pos[1]

    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation,visibility&timezone=auto`

    const resp = await fetch(API_URL)
    const json = await resp.json();

    return json
  } catch (error) {
    console.log(error)
  }
}


function createHeadRow(columns) {
  tableHeadRow.replaceChildren()

  for (let i = 0; i < columns.length; i++) {
    const th = document.createElement('th')
    th.textContent = columns[i]

    tableHeadRow.append(th)
  }
}

function createDataRows(columns) {
  tableBody.replaceChildren()

  for (let i = 0; i < columns[0].length; i++) {
    const tr = document.createElement('tr')

    for (let j = 0; j < columns.length; j++) {
      const td = document.createElement('td')
      td.textContent = columns[j][i]

      tr.append(td)
    }

    tableBody.append(tr)
  }

}