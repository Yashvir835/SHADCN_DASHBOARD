"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapContainer as LeafletMapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaLocationDot } from "react-icons/fa6";

  // creating the marker for the map
  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  })

const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const AddBusiness = () => {
  const { register, handleSubmit, watch } = useForm();
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const searchLocation = async () => {
    const location = watch("location");
    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon } = results[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setMarkerPosition(newCenter);
      } else {
        alert("Couldn't find the location. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Failed to search for location. Please try again.");
    }
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Business</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Business Name</label>
          <input
            {...register("business")}
            placeholder="Your Business Name"
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Location</label>
          <div className="flex items-center space-x-2">
            <input
              {...register("location")}
              placeholder="Search an address"
              className="border rounded w-full px-2 py-1"
            />
            <button type="button" onClick={searchLocation} className="bg-blue-500 text-white px-4 py-1 rounded">
              Search
            </button>
          </div>
        </div>

        <div className="h-96 mt-4">
          <LeafletMapContainer
            center={mapCenter as L.LatLngExpression}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markerPosition && <Marker position={markerPosition as L.LatLngExpression} icon={customIcon} />}
            <ChangeMapView center={mapCenter} />
          </LeafletMapContainer>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBusiness;
