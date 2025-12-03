// src/components/SidePanel.jsx
import FeatureDetails from "./FeatureDetails";
import { tileProviders } from "../config/tileProviders";

function SidePanel({
  activeLayer,
  onLayerChange,
  selectedFeature,
  baseMap,
  onBaseMapChange,
}) {
  const tituloCapa =
    activeLayer === "publica"
      ? "Áreas de Protección Pública"
      : "Áreas de Protección Privada";

  return (
    <div className="side-panel">
      <h2>Proyecto X · {tituloCapa}</h2>

      {/* Botón para cambiar entre pública / privada */}
      <div style={{ marginBottom: "0.75rem" }}>
        <button
          onClick={() =>
            onLayerChange(activeLayer === "publica" ? "privada" : "publica")
          }
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
            backgroundColor: "#111827",
            color: "white",
          }}
        >
          {activeLayer === "publica"
            ? "Ver áreas privadas"
            : "Ver áreas públicas"}
        </button>
      </div>

      {/* Selector de mapas de fondo */}
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
        Hacé click en una parcela del mapa para ver sus datos. Los polígonos
        provienen directamente de los archivos GeoJSON generados a partir de los
        KMZ de ProYungas para áreas de protección{" "}
        {activeLayer === "publica" ? "pública" : "privada"}.
      </p>

      {selectedFeature ? (
        <FeatureDetails feature={selectedFeature} />
      ) : (
        <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Ninguna parcela seleccionada todavía.
        </div>
      )}
    </div>
  );
}

export default SidePanel;
