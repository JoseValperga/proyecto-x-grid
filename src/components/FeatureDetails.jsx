// FeatureDetails.jsx

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

export default FeatureDetails;
