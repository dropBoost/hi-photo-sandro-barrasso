'use client'

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, MapPin, User, Phone, Mail, Briefcase } from "lucide-react"

import { createSupabaseBrowserClient } from "@/utils/supabase/client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

function getLocalToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatDateLabel(dateString) {
  if (!dateString) return "Senza data"

  const date = new Date(`${dateString}T00:00:00`)

  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatShortDate(dateString) {
  if (!dateString) return "-"
  const date = new Date(`${dateString}T00:00:00`)

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function getEventVariant(evento) {
  const value = (evento || "").toLowerCase()

  if (value.includes("matrimonio")) return "default"
  if (value.includes("shooting")) return "secondary"
  return "outline"
}

export default function COMPcalendario() {

  const [working, setWorking] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    async function getWorking() {
      setLoading(true)

      const supabase = createSupabaseBrowserClient()
      const oggi = getLocalToday()

      const { data, error } = await supabase
        .from("preventivi")
        .select(`*,
          cliente:clienti_anagrafica(*)`)
        .eq("accettato", true)
        .eq("archiviato", false)
        .gte("data_evento", oggi)
        .order("data_evento", { ascending: true })

      if (error) {
        console.error("Errore:", error)
        setLoading(false)
        return
      }

      const rows = data || []
      setWorking(rows)

      if (rows.length > 0) {
        setSelectedDate(rows[0].data_evento)
      }

      setLoading(false)
    }

    getWorking()
  }, [])

  const groupedByDate = useMemo(() => {
    return working.reduce((acc, item) => {
      const key = item.data_evento || "senza-data"

      if (!acc[key]) acc[key] = []
      acc[key].push(item)

      return acc
    }, {})
  }, [working])

  const dateKeys = useMemo(() => {
    return Object.keys(groupedByDate)
  }, [groupedByDate])

  const selectedItems = useMemo(() => {
    if (!selectedDate) return []
    return groupedByDate[selectedDate] || []
  }, [groupedByDate, selectedDate])

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center rounded-2xl h-full w-full bg-muted">
        <span>...caricamento</span>
      </div>
    )
  }

  if (!working.length) {
    return (
      <div className="flex flex-row items-center justify-center rounded-2xl h-full w-full bg-muted">
        <span>nessun lavoro in corso</span>
      </div>
    )
  }

  return (
    <div className="flex xl:flex-row flex-col gap-5 h-full">
      {/* SIDEBAR DATE */}
      <div className="flex flex-col rounded-2xl basis-2/6 xl:max-h-full max-h-125 border p-4 gap-3">
        <div className="flex flex-row items-center justify-center gap-1 text-sm">
            <CalendarDays className="h-3 w-3" />
            Calendario lavori
        </div>
        <Separator/>
        <div className="flex flex-col gap-3 px-5 overflow-auto">
          {dateKeys.map((dateKey) => {
            const count = groupedByDate[dateKey]?.length || 0
            const active = selectedDate === dateKey

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={[
                  "w-full rounded-xl border p-4 text-left transition",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium capitalize">
                      {formatDateLabel(dateKey)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatShortDate(dateKey)}
                    </p>
                  </div>

                  <Badge variant={active ? "default" : "secondary"}>
                    {count}
                  </Badge>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* DETTAGLI GIORNATA */}
      <div className="flex flex-col rounded-2xl basis-4/6 xl:max-h-full max-h-125 border p-4 gap-3">
        <div className="flex flex-row items-center justify-center gap-1 text-sm">
          <div className="flex flex-row items-center gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm capitalize">
              {formatDateLabel(selectedDate)}
            </div>
            <Badge variant="outline">
              {selectedItems.length} {selectedItems.length === 1 ? "evento" : "eventi"}
            </Badge>
          </div>
        </div>
        <Separator/>
        <div className="flex flex-col gap-3 px-5 overflow-auto">
          <div className="flex flex-col gap-4">
            {selectedItems.map((item, index) => (
              <div key={item.id} className="rounded-2xl border bg-muted shadow-none">
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-start">
                      <Badge variant={getEventVariant(item.evento)} className={`text-[0.6rem]`}>
                        {item.evento || "Evento"}
                      </Badge>

                      <h3 className="text-sm font-semibold truncate">
                        {item.oggetto || "Senza oggetto"}
                      </h3>

                      <p className="text-sm text-muted-foreground truncate">
                        {item.descrizione || null}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid gap-1 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Cliente</p>
                          <p className="text-sm text-muted-foreground">
                            {item.cliente.nome} {item.cliente.cognome}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Data evento</p>
                          <p className="text-sm text-muted-foreground">
                            {formatShortDate(item.data_evento)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {item.location || "-"}
                            {item.location_citta ? `, ${item.location_citta}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Tipo evento</p>
                          <p className="text-sm text-muted-foreground">
                            {item.evento || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground break-all">
                            {item.cliente.email || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Telefono</p>
                          <p className="text-sm text-muted-foreground">
                            {item.cliente.telefono || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}