/// SidePanel.jsx
import FeatureDetails from "./FeatureDetails";

function SidePanel({ activeLayer, onLayerChange, selectedFeature }) {
  const tituloCapa =
    activeLayer === "publica"
      ? "Áreas de Protección Pública"
      : "Áreas de Protección Privada";

  return (
    <div className="side-panel">
      <h2>Proyecto X · {tituloCapa}</h2>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <button
          onClick={() => onLayerChange("publica")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
            backgroundColor: activeLayer === "publica" ? "#111827" : "#e5e7eb",
            color: activeLayer === "publica" ? "white" : "#111827",
          }}
        >
          Áreas públicas
        </button>

        <button
          onClick={() => onLayerChange("privada")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
            backgroundColor: activeLayer === "privada" ? "#111827" : "#e5e7eb",
            color: activeLayer === "privada" ? "white" : "#111827",
          }}
        >
          Áreas privadas
        </button>
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
