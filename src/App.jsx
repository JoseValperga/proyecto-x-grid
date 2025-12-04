// src/App.jsx
import { useState } from "react";
import "./styles.css";
import SidePanel from "./components/SidePanel";
import MapView from "./components/MapView";
import { useAreasData } from "./hooks/useAreasData";
import { LAYER_DEFINITIONS } from "./config/layersConfig";

function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  // 🗺️ mapa de fondo
  const [baseMap, setBaseMap] = useState("hot"); // "hot" | "osm" | "esriSat" | ...

  // ✅ visibilidad de capas (multi-capa)
  const [layerVisibility, setLayerVisibility] = useState({
    publica: true,
    privada: false,
  });

  // Datos GeoJSON
  const { publicData, privateData } = useAreasData();

  // Construimos las capas que realmente se van a dibujar
  const layersForMap = [];

  if (layerVisibility.publica && publicData) {
    layersForMap.push({
      id: "publica",
      data: publicData,
    });
  }

  if (layerVisibility.privada && privateData) {
    layersForMap.push({
      id: "privada",
      data: privateData,
    });
  }

  const handleToggleLayer = (layerId) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
    setSelectedFeature(null); // limpiamos selección al cambiar visibilidad
  };

  return (
    <div className="app-container">
      {/* Mapa */}
      <div className="map-panel">
        <MapView
          layers={layersForMap}
          baseMap={baseMap}
          onFeatureSelect={setSelectedFeature}
        />
      </div>

      {/* Panel lateral */}
      <SidePanel
        layerVisibility={layerVisibility}
        onToggleLayer={handleToggleLayer}
        selectedFeature={selectedFeature}
        baseMap={baseMap}
        onBaseMapChange={setBaseMap}
        layerDefinitions={LAYER_DEFINITIONS}
      />
    </div>
  );
}

export default App;
