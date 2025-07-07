import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapPreview = ({ lat, lng }) => {
  const position = [lat, lng];

  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={false}
      className="rounded-lg mt-3"
      style={{ height: "180px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>You visited here!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapPreview;
