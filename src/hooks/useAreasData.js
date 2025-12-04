// src/hooks/useAreasData.js
import { useEffect, useState } from "react";

export function useAreasData() {
  const [publicData, setPublicData] = useState(null);
  const [privateData, setPrivateData] = useState(null);
  const [conservedData, setConservedData] = useState(null);    // Áreas conservadas
  const [ecoregionsData, setEcoregionsData] = useState(null);  // Ecoregiones

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

  return {
    publicData,
    privateData,
    conservedData,
    ecoregionsData,
  };
}
