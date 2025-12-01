import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "./styles.css";

import proteccionPublica from "./data/proteccion_publica.json";
import proteccionPrivada from "./data/proteccion_privada.json";

function App() {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // "publica" o "privada"
  const [activeLayer, setActiveLayer] = useState("publica");

  const currentData =
    activeLayer === "publica" ? proteccionPublica : proteccionPrivada;

  // Ajustar el mapa para mostrar TODO el GeoJSON cada vez que cambia la capa
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const geoJsonLayer = L.geoJSON(currentData);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.05)); // pequeño margen
    }
  }, [currentData]);

  // Estilo general para las parcelas del GeoJSON
  const geoJsonStyle = () => {
    if (activeLayer === "publica") {
      return {
        color: "#166534", // borde verde oscuro
        weight: 1.5,
        fillColor: "#22c55e88", // verde con transparencia
        fillOpacity: 0.7,
      };
    } else {
      return {
        color: "#7c2d12", // borde marrón/rojizo
        weight: 1.5,
        fillColor: "#f9731688", // naranja con transparencia
        fillOpacity: 0.7,
      };
    }
  };

  // Cómo tratamos cada feature: click + tooltip
  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};
    const name =
      props.NOMBRE ||
      props.Nombre ||
      props.name ||
      props.ID ||
      props.id ||
      "Parcela";

    layer.bindTooltip(name, {
      direction: "center",
      permanent: false,
    });

    layer.on("click", () => {
      setSelectedFeature(feature);
    });
  };

  const defaultCenter = [-26.8, -65.3];

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    setSelectedFeature(null); // limpiamos selección al cambiar de capa
  };

  const tituloCapa =
    activeLayer === "publica"
      ? "Áreas de Protección Pública"
      : "Áreas de Protección Privada";

  // ---- helper para limpiar la descripción HTML de las privadas ----
  const getCleanPrivateDescription = (props) => {
    if (!props) return "";

    let rawDesc = "";

    if (typeof props.description === "string") {
      rawDesc = props.description;
    } else if (
      props.description &&
      typeof props.description === "object" &&
      typeof props.description["@value"] === "string"
    ) {
      rawDesc = props.description["@value"];
    }

    if (!rawDesc) return "";

    // quitamos etiquetas HTML y normalizamos espacios
    const withoutTags = rawDesc.replace(/<[^>]+>/g, " ");
    return withoutTags.replace(/\s+/g, " ").trim();
  };

  return (
    <div className="app-container">
      {/* Mapa */}
      <div className="map-panel">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors, Tiles &copy; Humanitarian OSM Team'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {/* key fuerza a React-Leaflet a recrear la capa cuando cambia */}
          <GeoJSON
            key={activeLayer}
            data={currentData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>

      {/* Panel lateral */}
      <div className="side-panel">
        <h2>Proyecto X · {tituloCapa}</h2>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button
            onClick={() => handleLayerChange("publica")}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 500,
              backgroundColor:
                activeLayer === "publica" ? "#111827" : "#e5e7eb",
              color: activeLayer === "publica" ? "white" : "#111827",
            }}
          >
            Áreas públicas
          </button>

          <button
            onClick={() => handleLayerChange("privada")}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 500,
              backgroundColor:
                activeLayer === "privada" ? "#111827" : "#e5e7eb",
              color: activeLayer === "privada" ? "white" : "#111827",
            }}
          >
            Áreas privadas
          </button>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          Hacé click en una parcela del mapa para ver sus datos. Los polígonos
          provienen directamente de los archivos GeoJSON generados a partir de
          los KMZ de ProYungas para áreas de protección{" "}
          {activeLayer === "publica" ? "pública" : "privada"}.
        </p>

        {selectedFeature ? (
          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>
              {selectedFeature.properties?.NOMBRE ||
                selectedFeature.properties?.Nombre ||
                selectedFeature.properties?.name ||
                "Parcela seleccionada"}
            </h3>

            <p style={{ fontSize: "0.9rem", color: "#374151" }}>
              <strong>Tipo de geometría:</strong>{" "}
              {selectedFeature.geometry?.type || "Desconocido"}
            </p>

            <h4 style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>
              Propiedades
            </h4>

            {activeLayer === "publica" ? (
              // Vista bonita para las públicas: lista clave–valor
              <div
                style={{
                  backgroundColor: "#e5e7eb",
                  padding: "8px",
                  borderRadius: "8px",
                  maxHeight: "260px",
                  overflowY: "auto",
                  fontSize: "0.8rem",
                  lineHeight: "1.3rem",
                }}
              >
                {selectedFeature.properties &&
                  Object.entries(selectedFeature.properties).map(
                    ([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </p>
                    )
                  )}
              </div>
            ) : (
              // Vista amigable para las privadas
              <div
                style={{
                  backgroundColor: "#e5e7eb",
                  padding: "8px",
                  borderRadius: "8px",
                  maxHeight: "260px",
                  overflowY: "auto",
                  fontSize: "0.8rem",
                }}
              >
                <p>
                  <strong>Nombre:</strong>{" "}
                  {selectedFeature.properties?.name ??
                    selectedFeature.properties?.NOMBRE ??
                    "Sin nombre"}
                </p>
                {getCleanPrivateDescription(selectedFeature.properties) && (
                  <p style={{ marginTop: "0.5rem" }}>
                    <strong>Descripción:</strong>{" "}
                    {getCleanPrivateDescription(selectedFeature.properties)}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
            Ninguna parcela seleccionada todavía.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
