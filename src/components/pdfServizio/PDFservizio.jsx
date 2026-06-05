import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 30,
    paddingHorizontal: 34,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#111827",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  top: {
    gap: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brandBox: {
    width: "58%",
    gap: 4,
  },

  logo: {
    height: 42,
    objectFit: "contain",
    alignSelf: "flex-start",
    marginBottom: 4,
  },

  companyRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    textTransform: "uppercase",
  },

  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },

  payoff: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#d1d5db",
  },

  website: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "lowercase",
  },

  docBox: {
    width: "38%",
    alignItems: "flex-end",
    gap: 4,
  },

  docLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
  },

  docTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
    textAlign: "right",
  },

  docCode: {
    fontSize: 6.5,
    color: "#9ca3af",
    textAlign: "right",
  },

  hero: {
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    padding: 18,
    gap: 12,
  },

  badge: {
    alignSelf: "flex-start",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 9,
    color: "#ffffff",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },

  serviceLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.4,
  },

  serviceTitle: {
    fontSize: 12,
    lineHeight: 1.15,
    fontFamily: "Helvetica-Bold",
    color: "#222222",
  },

  metaGrid: {
    flexDirection: "row",
    gap: 8,
  },

  metaCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },

  metaLabel: {
    fontSize: 7,
    color: "#9ca3af",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },

  metaValue: {
    fontSize: 8.5,
    color: "#111827",
    lineHeight: 1.25,
  },

  content: {
    gap: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },

  sectionLine: {
    width: 26,
    height: 2,
    borderRadius: 2,
  },

  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
  },

  descriptionBox: {
    borderRadius: 10,
    border: "1 solid #e5e7eb",
    padding: 16,
    backgroundColor: "#ffffff",
  },

  descriptionText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.40,
    textAlign: "justify",
  },

  bottom: {
    gap: 12,
  },

  noteBox: {
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    padding: 12,
  },

  notesTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    color: "#6b7280",
    textTransform: "uppercase",
  },

  notesText: {
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.5,
  },

  footer: {
    borderTop: "1 solid #e5e7eb",
    paddingTop: 8,
    fontSize: 8,
    color: "#9ca3af",
    flexDirection: "column",
    gap: 2,
  },
});

export default function ServizioPdfDocument({ servizio, settings }) {
  const s = settings || {};
  const colorBrand = s?.colorBrand || "#111827";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <View style={styles.header}>
            <View style={styles.brandBox}>
              {s?.logoDark ? (
                <Image src={{ uri: s.logoDark }} style={styles.logo} />
              ) : null}

              <View style={styles.companyRow}>
                <Text style={[styles.companyName, { color: colorBrand }]}>
                  {s?.companyName || "NOME AZIENDA"}
                </Text>

                <Text style={styles.payoff}>
                  / {s?.payoff || "PAYOFF"}
                </Text>
              </View>

              <Text style={styles.website}>{s?.sito || "-"}</Text>
            </View>

          </View>

          <View style={styles.hero}>
            {servizio?.categoria ? (
              <Text style={[styles.badge, { backgroundColor: colorBrand }]}>
                {servizio.categoria}
              </Text>
            ) : null}

            <View>
              <Text style={styles.serviceLabel}>Nome servizio</Text>
              <Text style={styles.serviceTitle}>
                {servizio?.nome_servizio || "-"}
              </Text>
            </View>

          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionLine,
                { backgroundColor: colorBrand },
              ]}
            />
            <Text style={styles.sectionTitle}>Descrizione servizio</Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {servizio?.descrizione ||
                "Nessuna descrizione disponibile."}
            </Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.footer}>
            <Text>{s?.indirizzo || "-"}</Text>
            <Text>P.IVA: {s?.piva ? `IT${s.piva}` : "-"}</Text>
            <Text>
              email: {s?.email || "-"} tel: {s?.telefono || "-"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}