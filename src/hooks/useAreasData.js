// src/hooks/useAreasData.js
import { useEffect, useState } from "react";

export function useAreasData() {
  const [publicData, setPublicData] = useState(null); // Áreas públicas
  const [privateData, setPrivateData] = useState(null); // Áreas privadas
  const [conservedData, setConservedData] = useState(null);    // Áreas conservadas
  const [ecoregionsData, setEcoregionsData] = useState(null);  // Ecoregiones
  const [tokenizableData, setTokenizableData] = useState(null); //Tokenizables

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

  // Cargar GeoJSON de Áreas Conservadas
  useEffect(() => {
    const loadConservedData = async () => {
      try {
        const res = await fetch("/data/neatogeo_AreasConservadas.geojson");
        if (!res.ok) {
          console.error(
            "Error al cargar el GeoJSON de áreas conservadas",
            res.statusText
          );
          return;
        }
        const data = await res.json();
        setConservedData(data);
      } catch (err) {
        console.error(
          "Error de red al cargar el GeoJSON de áreas conservadas:",
          err
        );
      }
    };

    loadConservedData();
  }, []);

  // Cargar GeoJSON de Ecoregiones
  useEffect(() => {
    const loadEcoregionsData = async () => {
      try {
        const res = await fetch("/data/neatogeo_Ecoregiones_Argentina.geojson");
        if (!res.ok) {
          console.error(
            "Error al cargar el GeoJSON de ecoregiones",
            res.statusText
          );
          return;
        }
        const data = await res.json();
        setEcoregionsData(data);
      } catch (err) {
        console.error(
          "Error de red al cargar el GeoJSON de ecoregiones:",
          err
        );
      }
    };

    loadEcoregionsData();
  }, []);

  // Cargar GeoJSON de Tokenizables
  useEffect(() => {
    const loadTokenizable = async () => {
      try {
        const res = await fetch("/data/prueba_parcelas_tokenizables.geojson");
        if (!res.ok) {
          console.error(
            "Error al cargar GeoJSON de parcelas tokenizables",
            res.statusText
          );
          return;
        }

        const data = await res.json();

        // ✅ Enriquecemos: agregamos un ID estable para UI + tokenización
        const enriched = {
          ...data,
          features: (data.features || []).map((f, i) => ({
            ...f,
            properties: {
              ...(f.properties || {}),
              parcelId: `TK-${String(i + 1).padStart(3, "0")}`, // TK-001, TK-002...
              // tokenId: i + 1, // (opcional) útil cuando mintes
            },
          })),
        };

        setTokenizableData(enriched);
      } catch (err) {
        console.error("Error de red al cargar parcelas tokenizables:", err);
      }
    };

    loadTokenizable();
  }, []);


  return {
    publicData,
    privateData,
    conservedData,
    ecoregionsData,
    tokenizableData
  };
}
