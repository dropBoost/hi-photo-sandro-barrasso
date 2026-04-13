import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#999999",
    backgroundColor: "#ffffff",
    gap: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  header: {
    gap: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brandBox: {
    width: "55%",
    gap: 3,
  },

  companyInfoBox: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
    textTransform: "uppercase",
    gap: 3,
  },

  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  companyPayoff: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#dedede",
  },

  logo: {
    height: 45,
    objectFit: "contain",
    alignSelf: "flex-start",
  },

  docBoxLft: {
    width: "100%",
    alignItems: "flex-start",
    textTransform: "uppercase",
    color: "#999999",
  },

  docPreventivo: {
    alignSelf: "flex-start",
    fontSize: 6,
    color: "#a0a0a0",
    textAlign: "left",
  },

  sectionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },

  card: {
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#f4f4f4",
    gap: 5,
  },

  clientCard: {
    width: "58%",
  },

  infoCard: {
    width: "38%",
  },

  cardTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
  },

  line: {
    marginBottom: 0,
    color: "#222222",
    lineHeight: 1,
    fontSize: 9,
  },

  muted: {
    color: "#999999",
    fontSize: 9,
  },

  tableWrapper: {
    borderBottom: "1",
    borderLeft: "1",
    borderRight: "1",
    borderColor: "#e5e7eb",
    borderStyle: "solid",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 18,
    color: "#222222",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111827",
    color: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: "1 solid #e5e7eb",
    fontSize: 9.5,
    alignItems: "center",
  },

  rowAlt: {
    backgroundColor: "#f9fafb",
  },

  colId: {
    width: "10%",
    paddingRight: 6,
  },

  colDate: {
    width: "20%",
    paddingRight: 6,
  },

  colNote: {
    width: "45%",
    paddingRight: 6,
  },

  colAmount: {
    width: "25%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },

  totalBox: {
    marginLeft: "auto",
    width: 220,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#f9fafb",
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1 solid #d1d5db",
  },

  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  notesTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#999999",
  },

  notesText: {
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.6,
  },

  footer: {
    borderTop: "1 solid #e5e7eb",
    paddingTop: 8,
    textAlign: "left",
    fontSize: 8,
    color: "#9ca3af",
    flexDirection: "column",
    gap: 1,
  },

  emptyRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 9,
    color: "#6b7280",
  },

  signaturesWrap: {
    marginTop: 18,
    gap: 14,
  },

  placeDate: {
    fontSize: 8.5,
    color: "#6b7280",
  },

  signaturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 6,
  },

  signBox: {
    width: "48%",
    gap: 26,
  },

  signLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  signLine: {
    borderBottom: "1 solid #9ca3af",
    height: 1,
    width: "100%",
  },

  signNote: {
    fontSize: 7.5,
    color: "#9ca3af",
  },

});

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("it-IT").format(new Date(value));
  } catch {
    return value;
  }
}

export default function PDFschedaAcconti({ data }) {
  const acconti = data?.acconti || [];
  const s = data?.settings || {};
  const cliente = data?.cliente || {};

  const totaleAcconti = acconti.reduce((acc, item) => {
    return acc + Number(item?.acconto || 0);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandBox}>
              {s?.logoDark ? <Image src={{ uri: s.logoDark }} style={styles.logo} /> : null}

              <View style={styles.companyInfoBox}>
                <Text style={[styles.companyName, { color: s?.colorBrand || "#111827" }]}>
                  {s?.companyName || "NOME AZIENDA"}
                </Text>
                <Text style={styles.companyPayoff}>/ {s?.payoff || "PAYOFF"}</Text>
              </View>

              <View style={styles.docBoxLft}>
                <Text style={[styles.docPreventivo, { textTransform: "lowercase", fontSize: 8 }]}>
                  {s?.sito || "-"}
                </Text>
              </View>

              <View style={styles.docBoxLft}>
                <Text style={styles.docPreventivo}>
                  SCHEDA ACCONTI preventivo cod. {data?.idPreventivo || "-"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionGrid}>
            <View style={[styles.card, styles.clientCard]}>
              <Text style={[styles.cardTitle, { color: s?.colorBrand || "#111827" }]}>
                Dati cliente
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Nome:</Text> {cliente?.nome || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Cognome:</Text> {cliente?.cognome || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Email:</Text> {cliente?.email || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Telefono:</Text> {cliente?.telefono || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Descrizione:</Text> {data?.descrizione || "-"}
              </Text>
            </View>

            <View style={[styles.card, styles.infoCard]}>
              <Text style={[styles.cardTitle, { color: s?.colorBrand || "#111827" }]}>
                Dettagli preventivo
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Oggetto:</Text> {data?.oggetto || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Evento:</Text> {data?.evento || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Location:</Text> {data?.location || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Città:</Text> {data?.location_citta || "-"}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Data evento:</Text> {formatDate(data?.data_evento)}
              </Text>

              <Text style={styles.line}>
                <Text style={styles.muted}>Scadenza:</Text> {formatDate(data?.scadenza_preventivo)}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.tableWrapper}>
            <View style={[styles.tableHeader, { backgroundColor: s?.colorBrand || "#111827" }]}>
              <Text style={styles.colId}>ID</Text>
              <Text style={styles.colDate}>Data</Text>
              <Text style={styles.colNote}>Nota</Text>
              <Text style={styles.colAmount}>Acconto</Text>
            </View>

            {acconti.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text>Nessun acconto registrato.</Text>
              </View>
            ) : (
              acconti.map((item, index) => (
                <View
                  key={item.id ?? index}
                  style={[
                    styles.row,
                    index % 2 !== 0 ? styles.rowAlt : null,
                    index === acconti.length - 1 ? { borderBottom: "0" } : null,
                  ]}
                >
                  <Text style={styles.colId}>{index+1 || "-"}</Text>
                  <Text style={styles.colDate}>{formatDate(item?.created_at)}</Text>
                  <Text style={styles.colNote}>{item?.nota || "-"}</Text>
                  <Text style={styles.colAmount}>{formatCurrency(item?.acconto || 0)}</Text>
                </View>
              ))
            )}
          </View>

          <View style={[styles.totalBox, { backgroundColor: s?.colorBrand || "#111827" }]}>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Totale acconti</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(totaleAcconti)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.signaturesWrap}>
          <Text style={styles.placeDate}>
            Luogo e data: _________________________________________________
          </Text>

          <View style={styles.signaturesRow}>
            <View style={styles.signBox}>
              <Text style={styles.signLabel}>Firma del Committente</Text>
              <View style={styles.signLine} />
              <Text style={styles.signNote}>
                Per accettazione espressa del contratto e del preventivo richiamato.
              </Text>
            </View>

            <View style={styles.signBox}>
              <Text style={styles.signLabel}>Firma del Fornitore</Text>
              <View style={styles.signLine} />
              <Text style={styles.signNote}>
                Timbro e firma del professionista / studio fotografico.
              </Text>
            </View>
          </View>
        </View>
        <View>
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