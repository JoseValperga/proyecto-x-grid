// src/components/SidePanel.jsx
import FeatureDetails from "./FeatureDetails";
import { tileProviders } from "../config/tileProviders";

function SidePanel({
  layerVisibility,
  onToggleLayer,
  selectedFeature,
  baseMap,
  onBaseMapChange,
  layerDefinitions,
}) {
  return (
    <div className="side-panel">
      <h2>Proyecto X · Capas de protección</h2>

      {/* Checkboxes de capas */}
      <div style={{ marginBottom: "0.75rem" }}>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginBottom: "0.25rem",
          }}
        >
          Capas visibles:
        </p>

        {Object.entries(layerDefinitions).map(([layerId, def]) => (
          <label
            key={layerId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              marginBottom: "0.2rem",
            }}
          >
            <input
              type="checkbox"
              checked={!!layerVisibility[layerId]}
              onChange={() => onToggleLayer(layerId)}
            />
            <span>{def.label}</span>
          </label>
        ))}
      </div>

      {/* Selector de mapa de fondo */}
      <div style={{ marginBottom: "0.75rem" }}>
        <label
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginRight: "0.5rem",
          }}
        >
          Mapa de fondo:
        </label>

        <select
          value={baseMap}
          onChange={(e) => onBaseMapChange(e.target.value)}
          style={{
            padding: "0.3rem 0.5rem",
            borderRadius: "9999px",
            border: "1px solid #d1d5db",
            fontSize: "0.8rem",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          {Object.entries(tileProviders).map(([key, provider]) => (
            <option key={key} value={key}>
              {provider.label}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
        Activá o desactivá capas para superponer áreas públicas, privadas y, en
        el futuro, otras capas como ecorregiones o áreas de conservación. Hacé
        click en una parcela para ver sus datos.
      </p>

      {selectedFeature ? (
        <FeatureDetails layerId={selected.layerId} feature={selected.feature} />
      ) : (
        <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Ninguna parcela seleccionada todavía.
        </div>
      )}
    </div>
  );
}

export default SidePanel;
