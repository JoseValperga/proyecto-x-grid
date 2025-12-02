import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "./styles.css";

function App() {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // "publica" o "privada"
  const [activeLayer, setActiveLayer] = useState("publica");

  // GeoJSON de áreas públicas y privadas cargados por fetch (ubicados en public/data/)
  const [publicData, setPublicData] = useState(null);
  const [privateData, setPrivateData] = useState(null);

  // Cargar GeoJSON público
  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const res = await fetch("/data/neatogeo_ProteccionPublica.geojson");
        if (!res.ok) {
          console.error("Error al cargar el GeoJSON público", res.statusText);
          return;
        }
        const data = await res.json();
        setPublicData(data);
      } catch (err) {
        console.error("Error de red al cargar el GeoJSON público:", err);
      }
    };

    loadPublicData();
  }, []);

  // Cargar GeoJSON privado
  useEffect(() => {
    const loadPrivateData = async () => {
      try {
        const res = await fetch("/data/neatogeo_ProteccionPrivada.geojson");
        if (!res.ok) {
          console.error("Error al cargar el GeoJSON privado", res.statusText);
          return;
        }
        const data = await res.json();
        setPrivateData(data);
      } catch (err) {
        console.error("Error de red al cargar el GeoJSON privado:", err);
      }
    };

    loadPrivateData();
  }, []);

  const currentData =
    activeLayer === "publica" ? publicData : privateData;

  // Ajustar el mapa para mostrar TODO el GeoJSON cada vez que cambia la capa
  useEffect(() => {
    if (!mapRef.current || !currentData) return;

    const map = mapRef.current;
    const geoJsonLayer = L.geoJSON(currentData);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.05)); // pequeño margen
    }
  }, [currentData]);

  // Estilo general para las parcelas del GeoJSON (polígonos)
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

  // Marcadores para POINT / MULTIPOINT (evitamos el icono por defecto de Leaflet)
  const pointToLayer = (feature, latlng) => {
    const isPublic = activeLayer === "publica";

    return L.circleMarker(latlng, {
      radius: 6,
      color: isPublic ? "#166534" : "#7c2d12", // borde
      weight: 1.5,
      fillColor: isPublic ? "#22c55e" : "#f97316", // relleno
      fillOpacity: 0.9,
    });
  };

  // ---- helper: obtener HTML de description y sanearlo para poder renderizarlo ----
  const getSanitizedHtmlDescription = (props) => {
    if (!props) return "";

    let rawDesc = "";

    // Puede venir como string o como objeto con @value
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

    let cleaned = rawDesc;

    // 1) eliminar <script> ... </script>
    cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    // 2) eliminar atributos tipo onclick="...", onmouseover="...", etc.
    cleaned = cleaned.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");

    // 3) evitar javascript: en href o src
    cleaned = cleaned.replace(
      /(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi,
      ""
    );

    return cleaned.trim();
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

          {/* Solo renderizamos la capa cuando hay datos */}
          {currentData && (
            <GeoJSON
              key={activeLayer}
              data={currentData}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
              pointToLayer={pointToLayer}
            />
          )}
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
              Detalle
            </h4>

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
              {(() => {
                const htmlDesc = getSanitizedHtmlDescription(
                  selectedFeature.properties
                );

                if (htmlDesc) {
                  // Aprovechamos las etiquetas HTML de la descripción (públicas o privadas)
                  return (
                    <div
                      style={{ fontSize: "0.8rem", lineHeight: "1.25rem" }}
                      dangerouslySetInnerHTML={{ __html: htmlDesc }}
                    />
                  );
                }

                // Si no hay description, mostramos propiedades como lista clave–valor
                return (
                  <>
                    {selectedFeature.properties &&
                      Object.entries(selectedFeature.properties).map(
                        ([key, value]) => (
                          <p key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </p>
                        )
                      )}
                  </>
                );
              })()}
            </div>
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
