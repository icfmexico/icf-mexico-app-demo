"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import LogisticaPDFDoc from "./LogisticaPDF";

type Lang = "es" | "en";
type System = "ICF15" | "ICF20" | "PS23" | "PS27" | "PS32";

type Out = {
  blocksLine: number;
  blocksCorner: number;
  palletsLine: number;
  palletsCorner: number;
  palletsTotal: number;
  trucks: number;
  sug: {
    palletsLine: number;
    palletsCorner: number;
    palletsTotal: number;
    trucks: number;
  };
};

export default function LogisticaPDFButton(props: {
  lang: Lang;
  system: System;
  input: { area: number; waste: number };
  out: Out;
  note: string;
  badge: string;
}) {
  const filename = `ICF-MEXICO_Logistica_${props.system}_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <LogisticaPDFDoc
          lang={props.lang}
          system={props.system}
          input={props.input}
          out={props.out}
          note={props.note}
          badge={props.badge}
        />
      }
      fileName={filename}
    >
      {({ blob, url, loading }) => (
        <button
          type="button"
          className="px-3 py-2 rounded-lg border shadow-sm text-sm hover:bg-black hover:text-white transition"
          disabled={loading}
        >
          {loading
            ? props.lang === "es"
              ? "Generando PDF…"
              : "Generating PDF…"
            : props.lang === "es"
            ? "Descargar PDF"
            : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
