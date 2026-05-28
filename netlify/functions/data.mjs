// Netlify Function v2 — Relais JSON pour vMix Data Source
// POST /api/data  ← browser régie envoie { km_restants, done_km, total_km, pct }
// GET  /api/data  ← vMix interroge, reçoit le JSON en retour

import { getStore } from "@netlify/blobs";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT = { km_restants: "--", done_km: "--", total_km: "--", pct: "--" };

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: HEADERS });
  }

  const store = getStore("race-live");

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON("current", body);
      return new Response("ok", { status: 200, headers: HEADERS });
    } catch {
      return new Response("json invalide", { status: 400, headers: HEADERS });
    }
  }

  // GET — vMix lit cette URL
  const data = (await store.get("current", { type: "json" })) ?? DEFAULT;
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...HEADERS, "Content-Type": "application/json; charset=utf-8" },
  });
};

export const config = { path: "/api/data" };
