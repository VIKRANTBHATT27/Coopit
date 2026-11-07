import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { patientService } from "../../services/serviceFile";

const Map = () => {

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await patientService.getAllPatients();
        setPatients(result.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };
    
    fetchPatients();
  }, []);
  
  patients.map((patient) => console.log(patient));

// const markers = [
//   { id: 1, position: [8.5241, 76.9366], name: 'Thiruvananthapuram' },
//   { id: 2, position: [9.9678, 76.2673], name: 'Kochi' },
//   { id: 3, position: [11.2588, 75.7804], name: 'Kozhikode' },
//   { id: 4, position: [10.5276, 76.2144], name: 'Thrissur' },
//   { id: 5, position: [9.5916, 76.5132], name: 'Kottayam' },
//   { id: 6, position: [9.4981, 76.3315], name: 'Alappuzha' },
// ];

const markers = patients.map((patient) => ({
  id: patient.id,
  position: [patient.latitude, patient.longitude],
  name: patient.name,
}));

// const floodTiffUrl = '../../../public/flood_25yr.tif';

return (
  <MapContainer center={[10.05, 77.09]} zoom={8} style={{ height: '87vh', width: '85vw' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {/* {markers.map((m) => (
      <Marker key={m.id} position={m.position}>
        <Popup>{m.name}</Popup>
      </Marker>
    ))} */}
    {/* <Flood25YrLayer /> */}
    
  </MapContainer>
);
};
export default Map;