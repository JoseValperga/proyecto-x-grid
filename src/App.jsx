import { useState, useRef } from "react";
import "./styles.css";
import SidePanel from "./components/SidePanel";
import MapView from "./components/MapView";
import { useAreasData } from "./hooks/useAreasData";
import { LAYER_DEFINITIONS } from "./config/layersConfig";

function App() {
  //const [selectedFeature, setSelectedFeature] = useState(null);
  const [selected, setSelected] = useState(null); // { layerId, feature } | null

  // Mapa de fondo
  const [baseMap, setBaseMap] = useState("hot");

  // Visibilidad de capas
  const [layerVisibility, setLayerVisibility] = useState({
    publica: true,
    privada: false,
    conservadas: false,
    ecoregiones: false,
    tokenizables: false,
  });

  // Datos GeoJSON
  const {
    publicData,
    privateData,
    conservedData,
    ecoregionsData,
    tokenizableData,
  } = useAreasData();

  // Construimos las capas visibles para el mapa
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

  if (layerVisibility.conservadas && conservedData) {
    layersForMap.push({
      id: "conservadas",
      data: conservedData,
    });
  }

  if (layerVisibility.ecoregiones && ecoregionsData) {
    layersForMap.push({
      id: "ecoregiones",
      data: ecoregionsData,
    });
  }

  if (layerVisibility.tokenizables && tokenizableData) {
    layersForMap.push({
      id: "tokenizables",
      data: tokenizableData,
    });
  }

  const handleToggleLayer = (layerId) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
    //setSelectedFeature(null);
    setSelected(null);
  };

  return (
    <div className="app-container">
      {/* Mapa */}
      <div className="map-panel">
        {/*}
        <MapView
          layers={layersForMap}
          baseMap={baseMap}
          onFeatureSelect={setSelectedFeature}
        />
        */}
        <MapView
          layers={layersForMap}
          baseMap={baseMap}
          onFeatureSelect={setSelected}
        />
      </div>

      {/* Panel lateral */}
      {/*
      <SidePanel
        layerVisibility={layerVisibility}
        onToggleLayer={handleToggleLayer}
        selectedFeature={selectedFeature}
        baseMap={baseMap}
        onBaseMapChange={setBaseMap}
        layerDefinitions={LAYER_DEFINITIONS}
      />
      */}
      <SidePanel
        layerVisibility={layerVisibility}
        onToggleLayer={handleToggleLayer}
        selected={selected}
        baseMap={baseMap}
        onBaseMapChange={setBaseMap}
        layerDefinitions={LAYER_DEFINITIONS}
      />
    </div>
  );
}

export default App;
