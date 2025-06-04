$(function() {
  if (!navigator.geolocation) {
    $('#location').text('A böngésző nem támogatja a geolokációt.');
    return;
  }
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
});

function onGeoSuccess(pos) {
  const lat = pos.coords.latitude.toFixed(2);
  const lon = pos.coords.longitude.toFixed(2);
  $('#location').text(`Helyzet: ${lat}°, ${lon}°`);
  fetchForecast(lat, lon);
}

function onGeoError() {
  $('#location').text('Nem sikerült a helymeghatározás.');
}

function fetchForecast(lat, lon) {
  const url = 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json';
  $.getJSON(url)
    .done(data => {
      const prob = computeProbability(lat, lon, data);
      renderForecast(prob);
    })
    .fail(() => {
      $('#forecast').text('Nem sikerült lekérni az adatokat.');
    });
}

function computeProbability(lat, lon, data) {
  let closest = null;
  let minDist = Infinity;
  data.forEach(pt => {
    const d = Math.hypot(pt.lat - lat, pt.lon - lon);
    if (d < minDist) {
      minDist = d;
      closest = pt;
    }
  });
  return closest ? Math.round(closest.probability) : null;
}

function renderForecast(prob) {
  if (prob == null) {
    $('#forecast').text('Nincs elérhető adat.');
    return;
  }
  let html = '';
  for (let i = 0; i < 24; i++) {
    html += `<div class="hour"><span>${i+1}. óra</span><strong>${prob}%</strong></div>`;
  }
  $('#forecast').html(html);
}
