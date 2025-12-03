// src/components/MapView.jsx
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { tileProviders } from "../config/tileProviders";

const defaultCenter = [-26.8, -65.3];

function MapView({ activeLayer, data, onFeatureSelect, baseMap = "hot" }) {
  const mapRef = useRef(null);

  // obtener el proveedor según la clave actual
  const currentTile = tileProviders[baseMap] || tileProviders.hot;

  // Ajustar el mapa para mostrar TODO el GeoJSON cada vez que cambia la capa
  useEffect(() => {
    if (!mapRef.current || !data) return;

    const map = mapRef.current;
    const geoJsonLayer = L.geoJSON(data);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.05)); // deja un margen
    }
  }, [data]);

  // Estilo general para las parcelas del GeoJSON (polígonos)
  const geoJsonStyle = () => {
    return activeLayer === "publica"
      ? {
          color: "#166534",
          weight: 1.5,
          fillColor: "#22c55e55",
          fillOpacity: 0.35,
          //fillColor: "#22c55e88",
          //fillOpacity: 0.7,
        }
      : {
          color: "#7c2d12",
          weight: 1.5,
          fillColor: "#f9731688",
          fillOpacity: 0.7,
        };
  };

  // Marcadores para POINT / MULTIPOINT
  const pointToLayer = (feature, latlng) => {
    const isPublic = activeLayer === "publica";
    return L.circleMarker(latlng, {
      radius: 6,
      color: isPublic ? "#166534" : "#7c2d12",
      weight: 1.5,
      fillColor: isPublic ? "#22c55e" : "#f97316",
      fillOpacity: 0.9,
    });
  };

  // Eventos por feature: tooltip + click
  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};
    const name =
      props.NOMBRE ||
      props.Nombre ||
      props.name ||
      props.ID ||
      props.id ||
      "Parcela";

    layer.bindTooltip(name, { direction: "center", permanent: false });

    layer.on("click", () => {
      if (typeof onFeatureSelect === "function") {
        onFeatureSelect(feature);
      }
    });
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={8}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      {/* Mapa de fondo dinámico */}
      <TileLayer attribution={currentTile.attribution} url={currentTile.url} />

      {/* GeoJSON */}
      {data && (
        <GeoJSON
          key={activeLayer}
          data={data}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
        />
      )}
    </MapContainer>
  );
}

export default MapView;
