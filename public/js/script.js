// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.log("Error getting location", error);
//     },
//     {
//       enableHighAccuracy: true,
//       maximumAge: 0,
//       timeout: 5000,
//     }
//   );
// }

// const map = L.map("map").setView([0, 0], 16);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "SanketYoProgrammer"
  
// }).addTo(map);


// const markers = {};

// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude } = data;
//     map.setView([latitude, longitude]);
    
//     if(markers[id]){
//       markers[id].setLatLng([latitude, longitude]);
//     }
//     else {
//       markers[id] = L.marker([latitude, longitude]).addTo(map);
//     }
// });


// socket.on("user-disconnected", (id) => {
//   if (markers[id]) {
//     map.removeLayer(markers[id]);
//     delete markers[id];
//   }
// })









const socket = io();

const map = L.map("map").setView([20, 80], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "SanketYoProgrammer",
}).addTo(map);

const markers = {};

// 🔐 Persistent user ID
let localId = localStorage.getItem("local-user-id");
if (!localId) {
  localId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("local-user-id", localId);
}

// 🎨 Persistent color
let localColor = localStorage.getItem("local-user-color");
if (!localColor) {
  localColor = getRandomColor();
  localStorage.setItem("local-user-color", localColor);
}

function getRandomColor() {
  const colors = [
    "red", "blue", "green", "orange", "purple", "brown", "black", "cadetblue"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 🧠 Function to generate SVG marker with color
function createColoredMarkerIcon(color) {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `;
  return L.icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svgIcon),
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", {
        latitude,
        longitude,
        userId: localId,
        color: localColor
      });
    },
    (error) => {
      console.log("Location error", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

socket.on("receive-location", ({ userId, latitude, longitude, color }) => {
  if (!markers[userId]) {
    const marker = L.marker([latitude, longitude], {
      icon: createColoredMarkerIcon(color)
    }).addTo(map);

    markers[userId] = marker;
  } else {
    markers[userId].setLatLng([latitude, longitude]);
  }

  if (userId === localId) {
    map.setView([latitude, longitude], 16);
  }
});
