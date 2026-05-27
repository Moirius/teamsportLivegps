import { getStore } from "@netlify/blobs";

export default async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const store = getStore("race-tracker");

  // La régie envoie le km ici
  if (req.method === "POST") {
    const { km } = await req.json();
    await store.set("km", String(km ?? "---"));
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // vMix poll ce endpoint en GET
  const km = (await store.get("km")) ?? "---";
  return new Response(JSON.stringify({ km_restants: km }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
};

export const config = { path: "/api/km" };
