"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, User, CalendarDays, FileText } from "lucide-react";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiteContactList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      setError("");

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("site_contact")
        .select("name, surname, email, tel, request, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message || "Errore durante il caricamento dei contatti");
        setItems([]);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    }

    fetchContacts();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "-";

    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Richieste ricevute</h2>
        <p className="text-sm text-muted-foreground">
          Elenco completo delle richieste ricevute dal sito
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="rounded-2xl">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-52 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Nessuna richiesta presente.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <Card
              key={`${item.email}-${item.created_at}-${index}`}
              className="rounded-2xl border shadow-sm"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {item.name || "-"} {item.surname || ""}
                      </span>
                    </CardTitle>

                    <CardDescription className="mt-1">
                      Contatto dal sito
                    </CardDescription>
                  </div>

                  <Badge variant="secondary" className="shrink-0">
                    {formatDate(item.created_at)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="truncate text-primary hover:underline"
                      >
                        {item.email}
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    {item.tel ? (
                      <a href={`tel:${item.tel}`} className="hover:underline">
                        {item.tel}
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Richiesta</span>
                  </div>

                  <p className="whitespace-pre-wrap wrap-break-words text-sm text-muted-foreground">
                    {item.request || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}