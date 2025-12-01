// src/App.jsx
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Rectangle, Tooltip } from "react-leaflet";

function App() {
  // Centro de las Yungas (aprox) para el demo
  const center = [-26.8, -65.3];

  // Configuración del "paisaje" que vamos a cuadricular
  // (esto es una caja geográfica ficticia para el demo)
  const boundsConfig = {
    latMin: -26.84,
    latMax: -26.76,
    lngMin: -65.34,
    lngMax: -65.26,
  };

  // Definimos cuántas filas y columnas queremos en la grilla
  // (podés pensar que cada celda ~ 1 ha a nivel conceptual)
  const rows = 5;
  const cols = 5;

  // Estado para la parcela seleccionada
  const [selectedParcelId, setSelectedParcelId] = useState(null);

  // Generamos las parcelas de la grilla solo una vez (useMemo)
  const parcels = useMemo(() => {
    const parcelsArray = [];
    const latStep = (boundsConfig.latMax - boundsConfig.latMin) / rows;
    const lngStep = (boundsConfig.lngMax - boundsConfig.lngMin) / cols;

    let counter = 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const lat1 = boundsConfig.latMin + row * latStep;
        const lat2 = lat1 + latStep;
        const lng1 = boundsConfig.lngMin + col * lngStep;
        const lng2 = lng1 + lngStep;

        // ID ficticio de parcela
        const parcelId = `YNG-01-${String(counter).padStart(4, "0")}`;

        // Estado ambiental y de financiación de ejemplo
        const isConservation = (row + col) % 2 === 0;
        const isFunded = counter % 3 === 0; // cada 3 parcelas: financiada

        parcelsArray.push({
          id: parcelId,
          row,
          col,
          bounds: [
            [lat1, lng1],
            [lat2, lng2],
          ],
          useType: isConservation ? "Conservación" : "Producción sostenible",
          conservationStatus: isConservation ? "Protegida" : "En monitoreo",
          funded: isFunded,
        });

        counter++;
      }
    }

    return parcelsArray;
  }, [
    boundsConfig.latMax,
    boundsConfig.latMin,
    boundsConfig.lngMax,
    boundsConfig.lngMin,
    rows,
    cols,
  ]);

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || null;

  // Función para elegir color según estado
  const getFillColor = (parcel) => {
    if (parcel.funded) {
      // Financiada: azul brillante
      return "#3b82f6aa"; // azul con transparencia
    }
    if (parcel.useType === "Conservación") {
      // Conservación: verde vivo
      return "#22c55eaa";
    }
    // Producción sostenible: amarillo intenso
    return "#eab308aa";
  };

  const getStrokeColor = (parcel) => {
    if (parcel.funded) return "#1d4ed8"; // azul oscuro
    if (parcel.useType === "Conservación") return "#166534"; // verde oscuro
    return "#92400e"; // marrón para producción
  };

  return (
    <div className="app-container">
      {/* Mapa con cuadrícula */}
      <div className="map-panel">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Capa base (puede ser otra, pero esta es suficiente para el demo) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {/*parcels.map((parcel) => (
            <Rectangle
              key={parcel.id}
              bounds={parcel.bounds}
              pathOptions={{
                color: getStrokeColor(parcel),
                weight: selectedParcelId === parcel.id ? 3 : 1,
                fillColor: getFillColor(parcel),
                fillOpacity: 0.7,
              }}
              eventHandlers={{
                click: () => setSelectedParcelId(parcel.id),
                mouseover: (e) => {
                  e.target.setStyle({ weight: 3 });
                },
                mouseout: (e) => {
                  e.target.setStyle({
                    weight: selectedParcelId === parcel.id ? 3 : 1,
                  });
                },
              }}
            >
              <Tooltip direction="center" permanent={false}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "600", fontSize: "0.8rem" }}>
                    {parcel.id}
                  </div>
                  <div style={{ fontSize: "0.7rem" }}>{parcel.useType}</div>
                  <div style={{ fontSize: "0.7rem" }}>
                    {parcel.funded ? "Financiada" : "Disponible"}
                  </div>
                </div>
              </Tooltip>
            </Rectangle>
          ))*/}
          
          {/* Dibujamos cada parcela como un rectángulo clickable */}
          {parcels.map((parcel) => {
            const isSelected = selectedParcelId === parcel.id;

            return (
              <Rectangle
                key={parcel.id}
                bounds={parcel.bounds}
                pathOptions={{
                  color: isSelected ? "#ef4444" : getStrokeColor(parcel), // rojo bien visible
                  weight: isSelected ? 5 : 1, // borde mucho más grueso
                  fillColor: getFillColor(parcel),
                  fillOpacity: isSelected ? 0.9 : 0.7, // más “llena” la seleccionada
                }}
                eventHandlers={{
                  click: () => setSelectedParcelId(parcel.id),
                }}
              >
                <Tooltip direction="center" permanent={false}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "600", fontSize: "0.8rem" }}>
                      {parcel.id}
                    </div>
                    <div style={{ fontSize: "0.7rem" }}>{parcel.useType}</div>
                    <div style={{ fontSize: "0.7rem" }}>
                      {parcel.funded ? "Financiada" : "Disponible"}
                    </div>
                  </div>
                </Tooltip>
              </Rectangle>
            );
          })}
        </MapContainer>
      </div>

      {/* Panel lateral con datos de la parcela */}
      <div className="side-panel">
        <h2>Proyecto X · Demo de Parcela</h2>
        <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          Hacé click en una celda del mapa para ver los datos de esa “hectárea”
          de paisaje.
        </p>

        {selectedParcel ? (
          <div style={{ marginTop: "12px" }}>
            <h3>{selectedParcel.id}</h3>
            <p>
              <strong>Uso:</strong> {selectedParcel.useType}
            </p>
            <p>
              <strong>Estado de conservación:</strong>{" "}
              {selectedParcel.conservationStatus}
            </p>
            <p>
              <strong>Estado de financiación:</strong>{" "}
              {selectedParcel.funded
                ? "Financiada ✅"
                : "Disponible para financiar"}
            </p>
            <p>
              <strong>Posición en la cuadrícula:</strong> fila{" "}
              {selectedParcel.row + 1}, columna {selectedParcel.col + 1}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              (En un siguiente paso, acá se va a conectar con el smart contract
              para ver el dueño del token, fecha de financiación, etc.)
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "16px", fontStyle: "italic" }}>
            Ninguna parcela seleccionada todavía.
          </div>
        )}

        {/* Lista rápida de parcelas abajo */}
        <div className="parcel-list">
          <h4>Parcelas en este paisaje</h4>
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className={
                "parcel-item" +
                (parcel.id === selectedParcelId ? " selected" : "")
              }
              onClick={() => setSelectedParcelId(parcel.id)}
            >
              <div className="parcel-title">{parcel.id}</div>
              <div className="parcel-meta">
                {parcel.useType} · {parcel.conservationStatus} ·{" "}
                {parcel.funded ? "Financiada ✅" : "Disponible"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
