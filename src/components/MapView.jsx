// src/components/MapView.jsx
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { tileProviders } from "../config/tileProviders";

const defaultCenter = [-26.8, -65.3];

// --- Paleta de colores para ecoregiones ---
const ECOREGION_COLORS = [
  "#e11d48", "#f97316", "#22c55e", "#0ea5e9", "#6366f1",
  "#a855f7", "#facc15", "#14b8a6", "#8b5cf6", "#ec4899",
];

// --- Extraer nombre de ecorregión ---
function getEcoregionName(feature) {
  if (!feature || !feature.properties) return null;

  const props = feature.properties;

  // Si alguna vez viene como campo suelto
  if (props.ECOREGION && typeof props.ECOREGION === "string") {
    return props.ECOREGION.trim();
  }

  // En tu caso viene dentro del HTML de description
  if (typeof props.description === "string") {
    const match = props.description.match(
      /ECOREGION<\/td>\s*<td>([^<]+)<\/td>/i
    );
    if (match && match[1]) return match[1].trim();
  }

  return null;
}

// --- Color estable para cada ecorregión ---
function getColorForEcoregion(name) {
  if (!name) return "#6d28d9";
  let sum = 0;
  for (const c of name) sum += c.charCodeAt(0);
  return ECOREGION_COLORS[sum % ECOREGION_COLORS.length];
}

// --- Label amigable para tooltip ---
function getFeatureLabel(layerId, feature) {
  if (!feature || !feature.properties) return null;
  const props = feature.properties;

  if (layerId === "ecoregiones") {
    const eco = getEcoregionName(feature);
    return eco ? `Ecorregión: ${eco}` : null;
  }

  const name =
    props.NOMBRE ||
    props.Nombre ||
    props.name ||
    props.ID ||
    props.id ||
    null;

  return name ? name.trim() : null;
}

function MapView({ layers, onFeatureSelect, baseMap = "hot" }) {
  const mapRef = useRef(null);
  const selectedLayerRef = useRef(null);

  const currentTile = tileProviders[baseMap] || tileProviders.hot;

  // Ajustar el mapa para mostrar TODAS las capas visibles
  useEffect(() => {
    if (!mapRef.current || !layers || layers.length === 0) return;

    const group = L.featureGroup(
      layers.map((layer) => L.geoJSON(layer.data))
    );

    const bounds = group.getBounds();
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds.pad(0.05));
    }
  }, [layers]);

  // Estilo base por capa
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
        color: baseColor,
        weight: 1,
        fillColor: baseColor,
        fillOpacity: 0.45,
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

  // Marcadores para POINT (si algún dataset trae puntos)
  const getPointMarkerForLayer = (layerId, latlng) => {
    return L.circleMarker(latlng, {
      radius: 6,
      color: "#1f2933",
      weight: 1.5,
      fillColor: "#9ca3af",
      fillOpacity: 0.9,
    });
  };

  // Tooltips + highlight al hacer click
  const onEachFeatureBase = (layerId, feature, leafletLayer) => {
    // Nos aseguramos de no tener popups (rectángulo negro)
    leafletLayer.unbindPopup();

    // Tooltip (solo si hay nombre)
    const label = getFeatureLabel(layerId, feature);
    if (label) {
      leafletLayer.bindTooltip(label, {
        direction: "top",
        sticky: true,
        permanent: false,
        className: "area-tooltip",
      });
    }

    // Guardamos el estilo original de este feature
    const originalStyle = getPolygonStyleForLayer(layerId, feature);

    // Highlight al hacer click
    leafletLayer.on("click", () => {
      // Restaurar selección previa (si la hay)
      if (selectedLayerRef.current) {
        selectedLayerRef.current.setStyle(
          selectedLayerRef.current.originalStyle
        );
      }

      // Guardamos referencia y estilo original
      selectedLayerRef.current = leafletLayer;
      leafletLayer.originalStyle = originalStyle;

      // Aplicar highlight: borde más grueso y relleno más intenso
      leafletLayer.setStyle({
        weight: (originalStyle.weight || 1.5) + 2,
        color: "#ffffff",
        fillColor: originalStyle.fillColor,
        fillOpacity: Math.min(
          (originalStyle.fillOpacity ?? 0.5) + 0.25,
          0.9
        ),
      });

      // Notificar selección al panel lateral
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
          onEachFeature={(feature, leafletLayer) =>
            onEachFeatureBase(layer.id, feature, leafletLayer)
          }
        />
      ))}
    </MapContainer>
  );
}

export default MapView;
