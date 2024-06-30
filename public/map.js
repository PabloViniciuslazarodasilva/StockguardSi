document.addEventListener('DOMContentLoaded', function() {
    var pucMinasBarreiro = [-19.964606, -44.198509];
    var map = L.map('map').setView(pucMinasBarreiro, 15);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    L.marker(pucMinasBarreiro).addTo(map)
      .bindPopup('PUC Minas Barreiro')
      .openPopup();
  });