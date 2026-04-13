"use client";

import { useState, useTransition } from "react";
import { postSiteContactAction } from "./action/postSiteContactAction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FormSiteContact() {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    tel: "",
    request: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    startTransition(async () => {
      const result = await postSiteContactAction(form);

      if (!result?.ok) {
        setError(result?.message || "Errore durante l'invio della richiesta.");
        return;
      }

      setMessage("Richiesta inviata con successo.");
      setForm({
        name: "",
        surname: "",
        email: "",
        tel: "",
        request: "",
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Inserisci il nome"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="surname">Cognome</Label>
              <Input
                id="surname"
                name="surname"
                placeholder="Inserisci il cognome"
                value={form.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Inserisci l'email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tel">Telefono</Label>
              <Input
                id="tel"
                name="tel"
                type="tel"
                placeholder="Inserisci il telefono"
                value={form.tel}
                onChange={handleChange}
              />
            </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="request">Richiesta</Label>
          <Textarea
            id="request"
            name="request"
            placeholder="Scrivi qui la tua richiesta"
            value={form.request}
            onChange={handleChange}
            className="min-h-40"
            required
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
          {message}
        </div>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? "Invio in corso..." : "Invia richiesta"}
      </Button>
    </form>
  );
}