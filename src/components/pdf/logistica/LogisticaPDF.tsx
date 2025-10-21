/* src/components/pdf/logistica/LogisticaPDF.tsx */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ICFBrand } from "../_brand/pdfBrand";

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

type Props = {
  lang: Lang;
  system: System;
  input: { area: number; waste: number };
  out: Out;
  note: string;
  badge: string;
  createdAtISO?: string;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 28,
    fontSize: 11,
    fontFamily: ICFBrand.font.base,
    color: "#111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: ICFBrand.colors.accent,
    paddingBottom: 10,
    marginBottom: 12,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: { width: 50, height: 30 },
  brandText: {
    fontSize: 16,
    fontWeight: 700,
    color: ICFBrand.colors.primary,
  },
  slogan: {
    fontSize: 9,
    color: ICFBrand.colors.gray,
  },
  badge: {
    fontSize: 10,
    borderWidth: 1,
    borderColor: ICFBrand.colors.primary,
    color: ICFBrand.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  h1: { fontSize: 14, marginBottom: 6, fontWeight: 700 },
  card: {
    borderWidth: 1,
    borderColor: ICFBrand.colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: ICFBrand.colors.light,
    paddingVertical: 4,
  },
  cellL: { flex: 1 },
  cellR: { width: 120, textAlign: "right", fontWeight: 700 },
  small: { fontSize: 9, color: ICFBrand.colors.gray },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 24,
    fontSize: 9,
    color: ICFBrand.colors.gray,
    textAlign: "center",
  },
});

function fmt(n: number, d = 2) {
  return Number.isFinite(n) ? n.toFixed(d) : "-";
}

const TEXTS: Record<
  Lang,
  {
    title: string;
    inputs: string;
    results: string;
    suggested: string;
    area: string;
    waste: string;
    blocks: string;
    corners: string;
    pallets: string;
    palletsCorner: string;
    palletsTotal: string;
    trucks: string;
    generated: string;
  }
> = {
  es: {
    title: "Calculadora de Logística — ICF MEXICO",
    inputs: "Entradas",
    results: "Resultados",
    suggested: "Sugerencia (redondeo)",
    area: "Superficie de muro (m²)",
    waste: "Merma (%)",
    blocks: "Bloques lineales",
    corners: "Bloques de esquina",
    pallets: "Tarimas lineales",
    palletsCorner: "Tarimas de esquina",
    palletsTotal: "Tarimas totales",
    trucks: "Camiones 53’",
    generated: "Documento generado",
  },
  en: {
    title: "Logistics Calculator — ICF MEXICO",
    inputs: "Inputs",
    results: "Results",
    suggested: "Suggestion (round up)",
    area: "Wall surface (m²)",
    waste: "Waste (%)",
    blocks: "Linear blocks",
    corners: "Corner blocks",
    pallets: "Linear pallets",
    palletsCorner: "Corner pallets",
    palletsTotal: "Total pallets",
    trucks: "53-ft trucks",
    generated: "Document generated",
  },
};

export default function LogisticaPDFDoc({
  lang,
  system,
  input,
  out,
  note,
  badge,
  createdAtISO,
}: Props) {
  const t = TEXTS[lang];
  const created =
    createdAtISO ??
    new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con logo y marca */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <Image src="/logo-icf-mexico.png" style={styles.logo} />
            <View>
              <Text style={styles.brandText}>{ICFBrand.info.name}</Text>
              <Text style={styles.slogan}>
                {ICFBrand.info.slogan} — {ICFBrand.info.website}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.badge}>{badge}</Text>
          </View>
        </View>

        <Text style={styles.h1}>{t.title}</Text>

        {/* Entradas */}
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            {t.inputs}
          </Text>
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.area}</Text>
            <Text style={styles.cellR}>{fmt(input.area, 2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.waste}</Text>
            <Text style={styles.cellR}>{fmt(input.waste, 2)}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.cellL}>Sistema</Text>
            <Text style={styles.cellR}>{system}</Text>
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            {t.results}
          </Text>
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.blocks}</Text>
            <Text style={styles.cellR}>{fmt(out.blocksLine)}</Text>
          </View>
          {out.blocksCorner > 0 && (
            <View style={styles.row}>
              <Text style={styles.cellL}>{t.corners}</Text>
              <Text style={styles.cellR}>{fmt(out.blocksCorner)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.pallets}</Text>
            <Text style={styles.cellR}>{fmt(out.palletsLine)}</Text>
          </View>
          {out.palletsCorner > 0 && (
            <View style={styles.row}>
              <Text style={styles.cellL}>{t.palletsCorner}</Text>
              <Text style={styles.cellR}>{fmt(out.palletsCorner)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.palletsTotal}</Text>
            <Text style={styles.cellR}>{fmt(out.palletsTotal)}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.cellL}>{t.trucks}</Text>
            <Text style={styles.cellR}>{fmt(out.trucks)}</Text>
          </View>
        </View>

        {/* Sugerencias */}
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            {t.suggested}
          </Text>
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.pallets}</Text>
            <Text style={styles.cellR}>{String(out.sug.palletsLine)}</Text>
          </View>
          {out.palletsCorner > 0 && (
            <View style={styles.row}>
              <Text style={styles.cellL}>{t.palletsCorner}</Text>
              <Text style={styles.cellR}>
                {String(out.sug.palletsCorner)}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.cellL}>{t.palletsTotal}</Text>
            <Text style={styles.cellR}>
              {String(out.sug.palletsTotal)}
            </Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.cellL}>{t.trucks}</Text>
            <Text style={styles.cellR}>{String(out.sug.trucks)}</Text>
          </View>
        </View>

        {/* Nota */}
        <View style={{ marginTop: 8 }}>
          <Text style={styles.small}>{note}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2025 ICF MEXICO — {t.generated}: {created}
        </Text>
      </Page>
    </Document>
  );
}
