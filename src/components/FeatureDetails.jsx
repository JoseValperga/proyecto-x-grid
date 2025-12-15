// FeatureDetails.jsx - Procesa los archivos geojason para eliminar scripts y atributos peligrosos

function getSanitizedHtmlDescription(props) {
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
}
/*
function FeatureDetails({ feature }) {
  const props = feature.properties || {};
  const title =
    props.NOMBRE ||
    props.Nombre ||
    props.name ||
    "Parcela seleccionada";

  const geometryType = feature.geometry?.type || "Desconocido";

  const htmlDesc = getSanitizedHtmlDescription(props);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>

      <p style={{ fontSize: "0.9rem", color: "#374151" }}>
        <strong>Tipo de geometría:</strong> {geometryType}
      </p>

      <h4 style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>Detalle</h4>

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
        {htmlDesc ? (
          <div
            style={{ fontSize: "0.8rem", lineHeight: "1.25rem" }}
            dangerouslySetInnerHTML={{ __html: htmlDesc }}
          />
        ) : (
          <>
            {props &&
              Object.entries(props).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {String(value)}
                </p>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
  */

function FeatureDetails({ layerId, feature }) {
  const props = feature?.properties || {};
  const geometryType = feature?.geometry?.type || "Desconocido";

  // títulos por capa
  const title = (() => {
    if (layerId === "tokenizables")
      return props.parcelId || "Parcela tokenizable";
    if (layerId === "ecoregiones") return "Ecorregión";
    return props.NOMBRE || props.Nombre || props.name || "Parcela seleccionada";
  })();

  const htmlDesc = getSanitizedHtmlDescription(props);

  // “chips” / resumen por capa (simple y útil)
  const layerLabel =
    {
      publica: "Pública",
      privada: "Privada",
      conservadas: "Conservadas",
      ecoregiones: "Ecoregiones",
      tokenizables: "Tokenizables",
    }[layerId] || layerId;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.25rem" }}>{title}</h3>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#6b7280",
          marginBottom: "0.5rem",
        }}
      >
        <strong>Capa:</strong> {layerLabel} · <strong>Geometría:</strong>{" "}
        {geometryType}
      </p>

      {/* Bloque específico para tokenizables */}
      {layerId === "tokenizables" && (
        <div
          style={{
            marginBottom: "0.75rem",
            fontSize: "0.9rem",
            color: "#374151",
          }}
        >
          <p>
            <strong>parcelId:</strong> {props.parcelId || "-"}
          </p>
          {/* Futuro: status / minted / txHash */}
        </div>
      )}

      <h4 style={{ marginTop: "0.75rem", marginBottom: "0.25rem" }}>Detalle</h4>

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
        {htmlDesc ? (
          <div
            style={{ fontSize: "0.8rem", lineHeight: "1.25rem" }}
            dangerouslySetInnerHTML={{ __html: htmlDesc }}
          />
        ) : (
          <>
            {Object.entries(props).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default FeatureDetails;
