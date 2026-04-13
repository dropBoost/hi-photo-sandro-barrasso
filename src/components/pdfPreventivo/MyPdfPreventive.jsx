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

  companyInfo: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.5,
  },

  logo: {
    height: 45,
    objectFit: "contain",
    alignSelf: "flex-start",
  },

  docBox: {
    width: "40%",
    alignItems: "flex-end",
  },

  docBoxLft: {
    width: "100%",
    alignItems: "flex-start",
    textTransform: "uppercase",
    color: "#999999",
  },

  docLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 3,
  },

  docTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#a0a0a0",
  },

  docNumber: {
    alignSelf: "flex-end",
    fontSize: 8,
    color: "#a0a0a0",
    textAlign: "right",
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
    marginBottom: 0,
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

  colService: {
    width: "34%",
    paddingRight: 6,
  },

  colCategory: {
    width: "20%",
    paddingRight: 6,
  },

  colPrice: {
    width: "15%",
    textAlign: "right",
    paddingRight: 6,
  },

  colDiscount: {
    width: "13%",
    textAlign: "right",
    paddingRight: 6,
  },

  colFinal: {
    width: "18%",
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

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 10,
    color: "#ffffff",
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

export default function PreventivoPdfDocument({ data }) {
  const items = data?.items || [];
  const s = data?.settings || {};
  const cliente = data?.cliente || {};

  const totaleLordo = items.reduce((acc, item) => {
    return acc + Number(item?.prezzo || 0);
  }, 0);

  const totaleSconto = items.reduce((acc, item) => {
    const prezzo = Number(item?.prezzo || 0);
    const sconto = Number(item?.sconto || 0);
    return acc + (prezzo * sconto) / 100;
  }, 0);

  const totaleNetto = items.reduce((acc, item) => {
    const prezzo = Number(item?.prezzo || 0);
    const sconto = Number(item?.sconto || 0);
    return acc + (prezzo - (prezzo * sconto) / 100);
  }, 0);

  const mostraColonnaSconto = items.some((item) => Number(item?.sconto || 0) > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PARTE TOP */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandBox}>
              {s?.logoDark ? <Image src={{ uri: s.logoDark }} style={styles.logo} /> : null}

              <View style={styles.companyInfoBox}>
                <Text style={[styles.companyName, { color: s?.colorBrand || "#111827" }]}>
                  {s?.companyName || "NOME AZIENDA"}
                </Text>
                <Text style={styles.companyPayoff}>
                  / {s?.payoff || "PAYOFF"}
                </Text>
              </View>

              <View style={styles.docBoxLft}>
                <Text style={[styles.docPreventivo, { textTransform: "lowercase", fontSize: 8 }]}>
                  {s?.sito || "-"}
                </Text>
              </View>

              <View style={styles.docBoxLft}>
                <Text style={styles.docPreventivo}>
                  PREVENTIVO cod. {data?.idPreventivo || "-"}
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

        {/* PARTE CENTRO */}
        <View>
          <View style={styles.tableWrapper}>
            <View style={[styles.tableHeader, { backgroundColor: s?.colorBrand || "#111827" }]}>
              <Text style={mostraColonnaSconto ? styles.colService : { width: "39%", paddingRight: 6 }}>
                Servizio
              </Text>

              <Text style={mostraColonnaSconto ? styles.colCategory : { width: "23%", paddingRight: 6 }}>
                Categoria
              </Text>

              <Text
                style={
                  mostraColonnaSconto
                    ? styles.colPrice
                    : { width: "17%", textAlign: "right", paddingRight: 6 }
                }
              >
                Prezzo
              </Text>

              {mostraColonnaSconto ? <Text style={styles.colDiscount}>Sconto</Text> : null}

              <Text
                style={
                  mostraColonnaSconto
                    ? styles.colFinal
                    : { width: "21%", textAlign: "right", fontFamily: "Helvetica-Bold" }
                }
              >
                Totale
              </Text>
            </View>

            {items.map((item, index) => {
              const prezzo = Number(item?.prezzo || 0);
              const sconto = Number(item?.sconto || 0);
              const finale = prezzo - (prezzo * sconto) / 100;

              return (
                <View
                  key={item.id ?? index}
                  style={[
                    styles.row,
                    index % 2 !== 0 ? styles.rowAlt : null,
                    index === items.length - 1 ? { borderBottom: "0" } : null,
                  ]}
                >
                  <Text style={mostraColonnaSconto ? styles.colService : { width: "39%", paddingRight: 6 }}>
                    {item?.preventivi_servizi?.nome_servizio || "-"}
                  </Text>

                  <Text style={mostraColonnaSconto ? styles.colCategory : { width: "23%", paddingRight: 6 }}>
                    {item?.preventivi_servizi?.categoria || "-"}
                  </Text>

                  <Text
                    style={
                      mostraColonnaSconto
                        ? styles.colPrice
                        : { width: "17%", textAlign: "right", paddingRight: 6 }
                    }
                  >
                    {formatCurrency(prezzo)}
                  </Text>

                  {mostraColonnaSconto ? (
                    <Text style={styles.colDiscount}>{sconto}%</Text>
                  ) : null}

                  <Text
                    style={
                      mostraColonnaSconto
                        ? styles.colFinal
                        : { width: "21%", textAlign: "right", fontFamily: "Helvetica-Bold" }
                    }
                  >
                    {formatCurrency(finale)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={[styles.totalBox, { backgroundColor: s?.colorBrand || "#111827" }]}>
            <View style={styles.totalRow}>
              <Text>Totale</Text>
              <Text>{formatCurrency(totaleLordo)}</Text>
            </View>

            {totaleSconto > 0 ? (
              <View style={styles.totalRow}>
                <Text>Sconto totale</Text>
                <Text>- {formatCurrency(totaleSconto)}</Text>
              </View>
            ) : null}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Totale preventivo</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(totaleNetto)}</Text>
            </View>
          </View>
        </View>

        {/* PARTE BOTTOM */}
        <View>
          <View>
            <Text style={styles.notesTitle}>Note</Text>
            <Text style={styles.notesText}>{s?.footerPreventivo || "-"}</Text>
          </View>

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