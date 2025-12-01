import { useState } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";

const center = [-26.80, -65.30];

// Paleta de colores coherente con el estilo ambiental
const getFillColor = (parcel) => {
  if (parcel.funded) return "#3b82f6aa";              // azul para financiadas
  if (parcel.useType === "Conservación") return "#22c55eaa"; // verde para conservación
  return "#eab308aa";                                 // amarillo para producción
};

const getStrokeColor = (parcel) => {
  if (parcel.funded) return "#1d4ed8";           // borde azul
  if (parcel.useType === "Conservación") return "#166534"; // borde verde
  return "#92400e";                              // borde marrón
};

// NOTA: Coordenadas aproximadas, solo DEMO.
// Todas las parcelas están en un rectángulo chico alrededor del centro.
// Hay rectángulos, pentágonos y triángulos; no deberían solaparse visualmente.
const PARCELS = [
  {
    id: "PX-001",
    name: "Quebrada Norte",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: true,
    shape: "Pentágono",
    coords: [
      [-26.798, -65.312],
      [-26.796, -65.308],
      [-26.799, -65.304],
      [-26.802, -65.306],
      [-26.802, -65.311],
    ],
  },
  {
    id: "PX-002",
    name: "Ladera Norte",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Rectángulo",
    coords: [
      [-26.796, -65.308],
      [-26.794, -65.304],
      [-26.797, -65.300],
      [-26.799, -65.304],
    ],
  },
  {
    id: "PX-003",
    name: "Bosque Alto",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: false,
    shape: "Triángulo",
    coords: [
      [-26.802, -65.311],
      [-26.802, -65.306],
      [-26.806, -65.309],
    ],
  },
  {
    id: "PX-004",
    name: "Corredor Oeste",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: true,
    shape: "Rectángulo",
    coords: [
      [-26.806, -65.312],
      [-26.802, -65.311],
      [-26.806, -65.305],
      [-26.810, -65.307],
    ],
  },
  {
    id: "PX-005",
    name: "Zona de Recarga",
    useType: "Conservación",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Pentágono",
    coords: [
      [-26.799, -65.304],
      [-26.797, -65.300],
      [-26.800, -65.296],
      [-26.804, -65.298],
      [-26.802, -65.302],
    ],
  },
  {
    id: "PX-006",
    name: "Terraza Agrícola",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: true,
    shape: "Rectángulo",
    coords: [
      [-26.804, -65.298],
      [-26.800, -65.296],
      [-26.803, -65.292],
      [-26.807, -65.294],
    ],
  },
  {
    id: "PX-007",
    name: "Borde de Quebrada",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: false,
    shape: "Triángulo",
    coords: [
      [-26.806, -65.305],
      [-26.802, -65.302],
      [-26.806, -65.299],
    ],
  },
  {
    id: "PX-008",
    name: "Mirador Norte",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Pentágono",
    coords: [
      [-26.796, -65.304],
      [-26.794, -65.300],
      [-26.7965, -65.296],
      [-26.799, -65.297],
      [-26.797, -65.3005],
    ],
  },
  {
    id: "PX-009",
    name: "Campo Bajo",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: true,
    shape: "Rectángulo",
    coords: [
      [-26.810, -65.307],
      [-26.806, -65.305],
      [-26.810, -65.300],
      [-26.814, -65.302],
    ],
  },
  {
    id: "PX-010",
    name: "Selva densa",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: false,
    shape: "Rectángulo",
    coords: [
      [-26.810, -65.300],
      [-26.806, -65.299],
      [-26.810, -65.294],
      [-26.814, -65.296],
    ],
  },
  {
    id: "PX-011",
    name: "Terraza Media",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Pentágono",
    coords: [
      [-26.807, -65.294],
      [-26.803, -65.292],
      [-26.805, -65.288],
      [-26.809, -65.289],
      [-26.811, -65.291],
    ],
  },
  {
    id: "PX-012",
    name: "Arroyo Central",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: true,
    shape: "Triángulo",
    coords: [
      [-26.802, -65.302],
      [-26.804, -65.298],
      [-26.806, -65.299],
    ],
  },
  {
    id: "PX-013",
    name: "Bosque Sur",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: false,
    shape: "Rectángulo",
    coords: [
      [-26.814, -65.302],
      [-26.810, -65.300],
      [-26.814, -65.296],
      [-26.818, -65.298],
    ],
  },
  {
    id: "PX-014",
    name: "Zona de transición",
    useType: "Mixto",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Pentágono",
    coords: [
      [-26.818, -65.298],
      [-26.814, -65.296],
      [-26.816, -65.292],
      [-26.820, -65.293],
      [-26.821, -65.296],
    ],
  },
  {
    id: "PX-015",
    name: "Camino de acceso",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: true,
    shape: "Rectángulo",
    coords: [
      [-26.814, -65.296],
      [-26.810, -65.294],
      [-26.812, -65.290],
      [-26.816, -65.292],
    ],
  },
  {
    id: "PX-016",
    name: "Ladera Sur",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: false,
    shape: "Triángulo",
    coords: [
      [-26.818, -65.302],
      [-26.814, -65.302],
      [-26.818, -65.298],
    ],
  },
  {
    id: "PX-017",
    name: "Refugio de fauna",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: true,
    shape: "Pentágono",
    coords: [
      [-26.806, -65.312],
      [-26.802, -65.315],
      [-26.798, -65.314],
      [-26.798, -65.312],
      [-26.802, -65.311],
    ],
  },
  {
    id: "PX-018",
    name: "Borde Este",
    useType: "Mixto",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Rectángulo",
    coords: [
      [-26.802, -65.315],
      [-26.798, -65.318],
      [-26.794, -65.316],
      [-26.798, -65.314],
    ],
  },
  {
    id: "PX-019",
    name: "Planicie alta",
    useType: "Producción sostenible",
    conservationStatus: "En monitoreo",
    funded: false,
    shape: "Rectángulo",
    coords: [
      [-26.794, -65.316],
      [-26.790, -65.314],
      [-26.793, -65.310],
      [-26.797, -65.312],
    ],
  },
  {
    id: "PX-020",
    name: "Humedal estacional",
    useType: "Conservación",
    conservationStatus: "Protegida",
    funded: true,
    shape: "Triángulo",
    coords: [
      [-26.790, -65.314],
      [-26.788, -65.310],
      [-26.793, -65.310],
    ],
  },
];

function App() {
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const selectedParcel =
    PARCELS.find((p) => p.id === selectedParcelId) || null;

  return (
    <div className="app-container">
      {/* MAPA */}
      <div className="map-panel">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Estilo de mapa con tonos naturales (HOT / Humanitarian) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {PARCELS.map((parcel) => (
            <Polygon
              key={parcel.id}
              positions={parcel.coords}
              pathOptions={{
                color: getStrokeColor(parcel),
                weight: selectedParcelId === parcel.id ? 3 : 1,
                fillColor: getFillColor(parcel),
                fillOpacity: 0.75,
              }}
              eventHandlers={{
                click: () => setSelectedParcelId(parcel.id),
                mouseover: (e) => e.target.setStyle({ weight: 3 }),
                mouseout: (e) =>
                  e.target.setStyle({
                    weight: selectedParcelId === parcel.id ? 3 : 1,
                  }),
              }}
            >
              <Tooltip direction="center">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {parcel.id}
                  </div>
                  <div style={{ fontSize: "0.7rem" }}>{parcel.useType}</div>
                  <div style={{ fontSize: "0.7rem" }}>
                    {parcel.funded ? "Financiada" : "Disponible"}
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          ))}
        </MapContainer>
      </div>

      {/* PANEL LATERAL */}
      <div className="side-panel">
        <h2>Proyecto X · Parcela seleccionada</h2>
        <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          Hacé click sobre un polígono del mapa para ver los datos de esa
          parcela. Cada figura representa una unidad de conservación o
          producción dentro del paisaje.
        </p>

        {selectedParcel ? (
          <div style={{ marginTop: "12px" }}>
            <h3>{selectedParcel.id}</h3>
            <p>
              <strong>Nombre:</strong> {selectedParcel.name}
            </p>
            <p>
              <strong>Forma geométrica:</strong> {selectedParcel.shape}
            </p>
            <p>
              <strong>Uso:</strong> {selectedParcel.useType}
            </p>
            <p>
              <strong>Estado de conservación:</strong>{" "}
              {selectedParcel.conservationStatus}
            </p>
            <p>
              <strong>Financiamiento:</strong>{" "}
              {selectedParcel.funded ? "Financiada ✅" : "Disponible para financiar"}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 8 }}>
              (En una versión conectada a smart contracts, acá consultarías el
              contrato para mostrar quién financia esta parcela, desde cuándo, y
              el historial de cambios.)
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "16px", fontStyle: "italic" }}>
            Ninguna parcela seleccionada todavía.
          </div>
        )}

        <div className="parcel-list">
          <h4>Listado de parcelas</h4>
          {PARCELS.map((parcel) => {
            const bg = selectedParcelId === parcel.id
              ? "#dcfce7"
              : "#ffffff";
            return (
              <div
                key={parcel.id}
                className={
                  "parcel-item" +
                  (parcel.id === selectedParcelId ? " selected" : "")
                }
                onClick={() => setSelectedParcelId(parcel.id)}
                style={{ backgroundColor: bg }}
              >
                <div className="parcel-title">
                  {parcel.id} · {parcel.name}
                </div>
                <div className="parcel-meta">
                  {parcel.useType} · {parcel.conservationStatus} ·{" "}
                  {parcel.funded ? "Financiada ✅" : "Disponible"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
