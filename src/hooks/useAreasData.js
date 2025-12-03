// useAreasData.js
import { useEffect, useState } from "react";

export function useAreasData() {
  const [publicData, setPublicData] = useState(null);
  const [privateData, setPrivateData] = useState(null);

  // Cargar GeoJSON público
  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const res = await fetch("/data/neatogeo_ProteccionPublica.geojson");
        if (!res.ok) {
          console.error(
            "Error al cargar el GeoJSON público",
            res.statusText
          );
          return;
        }
        const data = await res.json();
        setPublicData(data);
      } catch (err) {
        console.error("Error de red al cargar el GeoJSON público:", err);
      }
    };

    loadPublicData();
  }, []);

  // Cargar GeoJSON privado
  useEffect(() => {
    const loadPrivateData = async () => {
      try {
        const res = await fetch("/data/neatogeo_ProteccionPrivada.geojson");
        if (!res.ok) {
          console.error(
            "Error al cargar el GeoJSON privado",
            res.statusText
          );
          return;
        }
        const data = await res.json();
        setPrivateData(data);
      } catch (err) {
        console.error("Error de red al cargar el GeoJSON privado:", err);
      }
    };

    loadPrivateData();
  }, []);

  return { publicData, privateData };
}
