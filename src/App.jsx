// App.jsx
import { useState } from "react";
import "./styles.css";
import SidePanel from "./components/SidePanel";
import MapView from "./components/MapView";
import { useAreasData } from "./hooks/useAreasData"; // ajustá la ruta si lo pusiste en /hooks

function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeLayer, setActiveLayer] = useState("publica"); // "publica" o "privada"

  // 🚚 Carga de datos movida al hook
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
          onFeatureSelect={setSelectedFeature}
        />
      </div>

      {/* Panel lateral */}
      <SidePanel
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
        selectedFeature={selectedFeature}
      />
    </div>
  );
}

export default App;
