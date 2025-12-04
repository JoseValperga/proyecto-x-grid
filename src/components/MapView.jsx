// src/components/MapView.jsx
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { tileProviders } from "../config/tileProviders";

const defaultCenter = [-26.8, -65.3];

function MapView({ layers, onFeatureSelect, baseMap = "hot" }) {
  const mapRef = useRef(null);

  const currentTile = tileProviders[baseMap] || tileProviders.hot;

  // Ajustar el mapa para mostrar TODAS las capas visibles
  useEffect(() => {
    if (!mapRef.current || !layers || layers.length === 0) return;

    const map = mapRef.current;

    // Creamos un grupo con todos los GeoJSON visibles
    const group = L.featureGroup(
      layers.map((layer) => L.geoJSON(layer.data))
    );

    const bounds = group.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.05));
    }
  }, [layers]);

  // Estilo de polígonos según capa
  const getPolygonStyleForLayer = (layerId) => {
    if (layerId === "publica") {
      return {
        color: "#166534", // borde verde oscuro
        weight: 1.5,
        fillColor: "#22c55e55", // verde más transparente
        fillOpacity: 0.35,
      };
    }

    if (layerId === "privada") {
      return {
        color: "#7c2d12", // borde marrón/rojizo
        weight: 1.5,
        fillColor: "#f9731688", // naranja con algo de transparencia
        fillOpacity: 0.6,
      };
    }

    // default para futuras capas
    return {
      color: "#1f2933",
      weight: 1.5,
      fillColor: "#9ca3af88",
      fillOpacity: 0.5,
    };
  };

  // Marcadores para puntos según capa
  const getPointMarkerForLayer = (layerId, latlng) => {
    if (layerId === "publica") {
      return L.circleMarker(latlng, {
        radius: 6,
        color: "#166534",
        weight: 1.5,
        fillColor: "#22c55e",
        fillOpacity: 0.9,
      });
    }

    if (layerId === "privada") {
      return L.circleMarker(latlng, {
        radius: 6,
        color: "#7c2d12",
        weight: 1.5,
        fillColor: "#f97316",
        fillOpacity: 0.9,
      });
    }

    // default
    return L.circleMarker(latlng, {
      radius: 6,
      color: "#1f2933",
      weight: 1.5,
      fillColor: "#9ca3af",
      fillOpacity: 0.9,
    });
  };

  const onEachFeatureBase = (feature, leafletLayer) => {
    const props = feature.properties || {};
    const name =
      props.NOMBRE ||
      props.Nombre ||
      props.name ||
      props.ID ||
      props.id ||
      "Parcela";

    leafletLayer.bindTooltip(name, {
      direction: "center",
      permanent: false,
    });

    leafletLayer.on("click", () => {
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
        attribution={currentTile.attribution}
        url={currentTile.url}
      />

      {/* Dibujar todas las capas visibles */}
      {layers.map((layer) => (
        <GeoJSON
          key={layer.id}
          data={layer.data}
          style={() => getPolygonStyleForLayer(layer.id)}
          pointToLayer={(feature, latlng) =>
            getPointMarkerForLayer(layer.id, latlng)
          }
          onEachFeature={onEachFeatureBase}
        />
      ))}
    </MapContainer>
  );
}

export default MapView;
