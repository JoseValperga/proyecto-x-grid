// App.jsx
import { useState } from "react";
import "./styles.css";
import SidePanel from "./components/SidePanel";
import MapView from "./components/MapView";
import { useAreasData } from "./hooks/useAreasData";


function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeLayer, setActiveLayer] = useState("publica"); // "publica" o "privada"

  // 🗺️ nuevo estado: mapa de fondo
  const [baseMap, setBaseMap] = useState("hot"); // "hot" | "osm" | "esriSat"

  // Carga de datos (hook separado)
  const { publicData, privateData } = useAreasData();
  const currentData = activeLayer === "publica" ? publicData : privateData;

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    setSelectedFeature(null); // limpiamos selección al cambiar de capa
  };

  return (
    <div className="app-container">
      {/* Mapa */}
      <div className="map-panel">
        <MapView
          activeLayer={activeLayer}
          data={currentData}
          baseMap={baseMap}              // 👉 pasamos baseMap
          onFeatureSelect={setSelectedFeature}
        />
      </div>

      {/* Panel lateral */}
      <SidePanel
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
        selectedFeature={selectedFeature}
        baseMap={baseMap}               // 👉 lo ve el panel
        onBaseMapChange={setBaseMap}    // 👉 y esto permite cambiarlo
      />
    </div>
  );
}

export default App;
