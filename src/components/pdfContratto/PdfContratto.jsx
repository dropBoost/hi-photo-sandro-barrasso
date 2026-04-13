import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#374151",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  topSection: {
    gap: 18,
  },

  header: {
    gap: 16,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  brandBox: {
    width: "68%",
    gap: 4,
  },

  logo: {
    height: 45,
    objectFit: "contain",
    alignSelf: "flex-start",
  },

  companyInfoBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },

  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  companyPayoff: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#d1d5db",
  },

  companySite: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "lowercase",
  },

  docBox: {
    width: "32%",
    alignItems: "flex-end",
    gap: 4,
  },

  docTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#111827",
    textAlign: "right",
  },

  docCode: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "right",
  },

  sectionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  card: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f4f4f4",
    gap: 5,
  },

  clientCard: {
    width: "52%",
  },

  infoCard: {
    width: "48%",
  },

  cardTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },

  line: {
    fontSize: 9,
    color: "#222222",
    lineHeight: 1.45,
  },

  muted: {
    color: "#9ca3af",
    fontSize: 9,
  },

  contractBox: {
    gap: 10,
  },

  contractTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#111827",
  },

  introText: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.6,
    textAlign: "justify",
  },

  clausesBox: {
    gap: 8,
  },

  clause: {
    gap: 3,
  },

  clauseTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
  },

  clauseText: {
    fontSize: 8.7,
    color: "#4b5563",
    lineHeight: 1.55,
    textAlign: "justify",
  },

  evidenceBox: {
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    padding: 10,
    gap: 4,
    border: "1 solid #e5e7eb",
  },

  evidenceTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#111827",
  },

  evidenceText: {
    fontSize: 8.2,
    color: "#6b7280",
    lineHeight: 1.5,
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

  footer: {
    borderTop: "1 solid #e5e7eb",
    paddingTop: 8,
    marginTop: 14,
    fontSize: 8,
    color: "#9ca3af",
    gap: 2,
  },

  coverPage: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },

  coverLogo: {
    height: 100,
    objectFit: "contain",
    alignSelf: "center",
  },
});

function formatDate(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export default function ContrattoPdfDocument({ data }) {
  const s = data?.settings || {};
  const cliente = data?.cliente || {};
  const colorBrand = s?.colorBrand || "#111827";

  const clienteNomeCompleto =
    [cliente?.nome, cliente?.cognome].filter(Boolean).join(" ") || "-";

  const codicePreventivo = data?.idPreventivo || data?.uuid || "-";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          {s?.logoDark ? <Image src={{ uri: s.logoDark }} style={styles.coverLogo} /> : null}

          <View style={styles.companyInfoBox}>
            <Text style={[styles.companyName, { color: colorBrand }]}>
              {s?.companyName || "NOME AZIENDA"}
            </Text>
            <Text style={styles.companyPayoff}>
              / {s?.payoff || "PAYOFF"}
            </Text>
          </View>

          <Text style={styles.companySite}>{s?.sito || "-"}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.topSection}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.brandBox}>
                {s?.logoDark ? <Image src={{ uri: s.logoDark }} style={styles.logo} /> : null}

                <View style={styles.companyInfoBox}>
                  <Text style={[styles.companyName, { color: colorBrand }]}>
                    {s?.companyName || "NOME AZIENDA"}
                  </Text>
                  <Text style={styles.companyPayoff}>
                    / {s?.payoff || "PAYOFF"}
                  </Text>
                </View>

                <Text style={styles.companySite}>{s?.sito || "-"}</Text>
              </View>

              <View style={styles.docBox}>
                <Text style={[styles.docTitle, { color: colorBrand }]}>Contratto</Text>
                <Text style={styles.docCode}>
                  Riferimento preventivo: {codicePreventivo}
                </Text>
              </View>
            </View>

            <View style={styles.sectionGrid}>
              <View style={[styles.card, styles.clientCard]}>
                <Text style={[styles.cardTitle, { color: colorBrand }]}>Committente</Text>

                <Text style={styles.line}>
                  <Text style={styles.muted}>Nome e cognome:</Text> {clienteNomeCompleto}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Email:</Text> {cliente?.email || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Telefono:</Text> {cliente?.telefono || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Location evento:</Text> {data?.location || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Città evento:</Text> {data?.location_citta || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Data evento:</Text> {formatDate(data?.data_evento)}
                </Text>
              </View>

              <View style={[styles.card, styles.infoCard]}>
                <Text style={[styles.cardTitle, { color: colorBrand }]}>Fornitore</Text>

                <Text style={styles.line}>
                  <Text style={styles.muted}>Ragione / Nome attività:</Text> {s?.companyName || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Indirizzo:</Text> {s?.indirizzo || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>P.IVA:</Text> {s?.piva ? `IT${s.piva}` : "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Email:</Text> {s?.email || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Telefono:</Text> {s?.telefono || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Oggetto:</Text> {data?.oggetto || "-"}
                </Text>
                <Text style={styles.line}>
                  <Text style={styles.muted}>Evento:</Text> {data?.evento || "-"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contractBox}>
            <Text style={[styles.contractTitle, { color: colorBrand }]}>
              Contratto di conferma incarico fotografico
            </Text>

            <Text style={styles.introText}>
              Il presente contratto disciplina il rapporto tra il Fornitore sopra indicato e il
              Committente, avente ad oggetto la prestazione di servizi fotografici e/o video
              professionali concordati tra le parti. Le parti convengono che il contenuto economico,
              operativo e commerciale dell’incarico è quello già definito nel preventivo identificato
              dal seguente codice univoco: {codicePreventivo}. Tale preventivo costituisce parte
              integrante e sostanziale del presente contratto, anche se materialmente separato e
              stampato in allegato.
            </Text>

            <View style={styles.clausesBox}>
              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>1. Oggetto dell’incarico</Text>
                <Text style={styles.clauseText}>
                  Il Fornitore si impegna a svolgere la prestazione professionale concordata con il
                  Committente secondo quanto indicato nel preventivo richiamato nel presente
                  documento, comprensivo delle attività, delle eventuali tempistiche di consegna,
                  delle modalità di esecuzione e di ogni ulteriore dettaglio tecnico o organizzativo
                  ivi descritto.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>2. Riferimento al preventivo</Text>
                <Text style={styles.clauseText}>
                  Le parti riconoscono espressamente che il preventivo identificato dal codice
                  {` "${codicePreventivo}" `}è stato precedentemente visionato, approvato e accettato dal
                  Committente. Il relativo contenuto economico e prestazionale si intende qui
                  integralmente richiamato, senza necessità di trascriverne il dettaglio nel presente
                  contratto.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>3. Corrispettivo e modalità di pagamento</Text>
                <Text style={styles.clauseText}>
                  Il corrispettivo dovuto dal Committente è quello indicato nel preventivo richiamato.
                  Salvo diverso accordo scritto, eventuali acconti, saldi, scadenze e modalità di
                  pagamento si intendono quelli già riportati nel preventivo o successivamente
                  concordati per iscritto. Il mancato pagamento nei termini pattuiti potrà comportare
                  la sospensione delle attività, della consegna dei materiali e/o della concessione
                  d’uso dei contenuti prodotti, fatto salvo il risarcimento degli eventuali danni.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>4. Recesso, rinvio e annullamento</Text>
                <Text style={styles.clauseText}>
                  In caso di rinvio o annullamento dell’evento o della prestazione da parte del
                  Committente, resteranno valide le condizioni eventualmente già previste nel
                  preventivo o in comunicazioni scritte intercorse tra le parti. In mancanza di una
                  specifica disciplina, il Fornitore avrà diritto al rimborso delle spese già sostenute,
                  delle attività già eseguite e dell’eventuale mancato guadagno proporzionato
                  all’impegno professionale già riservato.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>5. Tempi di consegna e limiti operativi</Text>
                <Text style={styles.clauseText}>
                  I tempi di consegna di fotografie, video, selezioni, album, file digitali o altri
                  elaborati decorrono dal completamento della prestazione e dall’eventuale ricezione
                  del saldo, salvo diversa indicazione scritta. Il Fornitore non potrà essere ritenuto
                  responsabile per ritardi imputabili a cause di forza maggiore, impedimenti tecnici,
                  eventi esterni non controllabili o ritardi del Committente nella trasmissione di
                  informazioni, approvazioni o materiali necessari.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>6. Diritti d’autore e utilizzo dei materiali</Text>
                <Text style={styles.clauseText}>
                  I diritti d’autore sulle immagini e sugli altri contenuti realizzati restano in capo al
                  Fornitore, salvo diversi accordi scritti. Al Committente viene riconosciuto un diritto
                  di utilizzo dei materiali nei limiti pattuiti e per le finalità concordate. È vietata la
                  cessione a terzi, la modifica sostanziale, la rivendita o l’utilizzo commerciale non
                  autorizzato dei contenuti, salvo preventiva autorizzazione scritta del Fornitore.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>7. Liberatorie e autorizzazioni</Text>
                <Text style={styles.clauseText}>
                  Il Committente dichiara di essere responsabile dell’ottenimento di eventuali
                  autorizzazioni, consensi, liberatorie o permessi necessari relativamente ai luoghi,
                  alle persone ritratte, agli spazi privati e a ogni altro elemento utile alla corretta
                  esecuzione della prestazione, salvo che tale attività sia stata espressamente affidata
                  al Fornitore con accordo separato.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>8. Limitazione di responsabilità</Text>
                <Text style={styles.clauseText}>
                  Il Fornitore si impegna a eseguire la prestazione con la massima diligenza
                  professionale. Resta inteso che non potrà essere ritenuto responsabile per fatti non
                  imputabili alla propria volontà, per impedimenti logistici, condizioni atmosferiche,
                  restrizioni imposte dalle location, indisponibilità dei soggetti coinvolti, guasti non
                  prevedibili, blackout, eventi eccezionali o altre cause di forza maggiore.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>9. Trattamento dei dati personali</Text>
                <Text style={styles.clauseText}>
                  Le parti dichiarano di agire nel rispetto della normativa vigente in materia di
                  protezione dei dati personali. I dati raccolti saranno trattati esclusivamente per
                  finalità connesse alla gestione del rapporto contrattuale, amministrativo, fiscale e
                  operativo, secondo quanto previsto dalla normativa applicabile e dall’eventuale
                  informativa privacy resa disponibile dal Fornitore.
                </Text>
              </View>

              <View style={styles.clause}>
                <Text style={styles.clauseTitle}>10. Foro competente e legge applicabile</Text>
                <Text style={styles.clauseText}>
                  Il presente contratto è regolato dalla legge italiana. Per ogni controversia relativa
                  all’interpretazione, validità, esecuzione o risoluzione del presente accordo, salvo
                  diversa previsione inderogabile di legge, sarà competente il foro del luogo in cui il
                  Fornitore ha la propria sede legale o operativa.
                </Text>
              </View>
            </View>

            <View style={styles.evidenceBox}>
              <Text style={styles.evidenceTitle}>Riferimento documentale</Text>
              <Text style={styles.evidenceText}>
                Il presente contratto deve essere letto unitamente al preventivo identificato dal codice
                {` "${codicePreventivo}" `}che ne costituisce allegato richiamato e parte integrante.
              </Text>
            </View>
          </View>
        </View>

        <View>
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

          <View style={styles.footer}>
            <Text>{s?.indirizzo || "-"}</Text>
            <Text>{s?.piva ? `P.IVA: IT${s.piva}` : "P.IVA: -"}</Text>
            <Text>
              {s?.email || "-"} {s?.telefono ? `| Tel: ${s.telefono}` : ""}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}