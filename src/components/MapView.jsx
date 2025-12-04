// src/components/MapView.jsx
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { tileProviders } from "../config/tileProviders";

const defaultCenter = [-26.8, -65.3];

// Paleta de colores para ecoregiones
const ECOREGION_COLORS = [
  "#e11d48", // rosa fuerte
  "#f97316", // naranja
  "#22c55e", // verde
  "#0ea5e9", // celeste
  "#6366f1", // azul violáceo
  "#a855f7", // violeta
  "#facc15", // amarillo
  "#14b8a6", // turquesa
  "#8b5cf6", // lila
  "#ec4899", // magenta
];

// Extrae el nombre de la ecorregión desde las properties/description
function getEcoregionName(feature) {
  if (!feature || !feature.properties) return null;
  const props = feature.properties;

  // Si en algún momento el GeoJSON trae ECOREGION como campo separado
  if (props.ECOREGION && typeof props.ECOREGION === "string") {
    return props.ECOREGION.trim();
  }

  // Si viene embebido en el HTML de "description"
  if (typeof props.description === "string") {
    const match = props.description.match(
      /ECOREGION<\/td>\s*<td>([^<]+)<\/td>/i
    );
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

// Asigna un color estable según el nombre de la ecorregión
function getColorForEcoregion(name) {
  if (!name) return "#6d28d9"; // fallback
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  const idx = Math.abs(sum) % ECOREGION_COLORS.length;
  return ECOREGION_COLORS[idx];
}

function MapView({ layers, onFeatureSelect, baseMap = "hot" }) {
  const mapRef = useRef(null);

  const currentTile = tileProviders[baseMap] || tileProviders.hot;

  // Ajustar el mapa para mostrar TODAS las capas visibles
  useEffect(() => {
    if (!mapRef.current || !layers || layers.length === 0) return;

    const map = mapRef.current;
    const group = L.featureGroup(
      layers.map((layer) => L.geoJSON(layer.data))
    );

    const bounds = group.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.05));
    }
  }, [layers]);

  // Estilo de polígonos según capa (+ feature para ecoregiones)
  const getPolygonStyleForLayer = (layerId, feature) => {
    if (layerId === "publica") {
      return {
        color: "#166534",
        weight: 1.5,
        fillColor: "#22c55e55",
        fillOpacity: 0.35,
      };
    }

    if (layerId === "privada") {
      return {
        color: "#7c2d12",
        weight: 1.5,
        fillColor: "#f9731688",
        fillOpacity: 0.6,
      };
    }

    if (layerId === "conservadas") {
      return {
        color: "#1d4ed8",
        weight: 1.5,
        fillColor: "#60a5fa66",
        fillOpacity: 0.5,
      };
    }

    if (layerId === "ecoregiones") {
      const name = getEcoregionName(feature);
      const baseColor = getColorForEcoregion(name);

      return {
        color: baseColor,     // borde
        weight: 1,
        fillColor: baseColor, // mismo color
        fillOpacity: 0.45,    // pero translúcido
      };
    }

    // default
    return {
      color: "#1f2933",
      weight: 1.5,
      fillColor: "#9ca3af88",
      fillOpacity: 0.5,
    };
  };

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

    if (layerId === "conservadas") {
      return L.circleMarker(latlng, {
        radius: 6,
        color: "#1d4ed8",
        weight: 1.5,
        fillColor: "#60a5fa",
        fillOpacity: 0.9,
      });
    }

    if (layerId === "ecoregiones") {
      // Si alguna vez vienen puntos de ecorregiones, usamos un marcador acorde
      return L.circleMarker(latlng, {
        radius: 6,
        color: "#6d28d9",
        weight: 1.5,
        fillColor: "#a855f7",
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

      {layers.map((layer) => (
        <GeoJSON
          key={layer.id}
          data={layer.data}
          style={(feature) => getPolygonStyleForLayer(layer.id, feature)}
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
