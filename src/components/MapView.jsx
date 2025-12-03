// MapView.jsx
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";

const defaultCenter = [-26.8, -65.3];

function MapView({ activeLayer, data, onFeatureSelect }) {
  const mapRef = useRef(null);

  // Ajustar el mapa para mostrar TODO el GeoJSON cada vez que cambian los datos
  useEffect(() => {
    if (!mapRef.current || !data) return;

    const map = mapRef.current;
    const geoJsonLayer = L.geoJSON(data);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.05)); // pequeño margen
    }
  }, [data]);

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

  // Marcadores para POINT / MULTIPOINT
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors, Tiles &copy; Humanitarian OSM Team'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {/* Solo renderizamos la capa cuando hay datos */}
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
