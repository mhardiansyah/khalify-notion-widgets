import { NextRequest, NextResponse } from "next/server";

async function fetchCanvaThumbnail(url: string): Promise<string | null> {
  const cleanUrl = url
    .replace(/\/edit(\?.*)?$/, "/view")
    .replace(/\/view[\?#].*$/, "/view");

  console.log(`🔍 Mengirim ke Canva OEmbed: ${cleanUrl}`);

  try {
    // 🔥 PERBAIKAN FATAL: Menggunakan endpoint API Canva yang terbaru!
    const canvaRes = await fetch(
      `https://api.canva.com/_spi/presentation/_oembed?url=${encodeURIComponent(cleanUrl)}`
    );

    if (!canvaRes.ok) {
      console.log(`❌ API Canva Menolak: Status ${canvaRes.status} ${canvaRes.statusText}`);
      return null;
    }

    const data = await canvaRes.json();
    return data.thumbnail_url ?? null;
  } catch (err) {
    console.error("Fetch Canva error:", err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Parameter URL diperlukan." }, { status: 400 });
  }

  const isCanva = url.toLowerCase().includes("canva.com");

  try {
    // ==========================================
    // LOGIKA KHUSUS CANVA (Hanya pakai OEmbed)
    // ==========================================
    if (isCanva) {
      const baseUrl = url
        .replace(/\/edit(\?.*)?$/, "/view")
        .replace(/\/view[\?#].*$/, "/view");

      const thumbnails: string[] = [];
      let page = 1;
      const MAX_PAGES = 20;

      // 1. Coba ambil multiple pages (Carousel)
      while (page <= MAX_PAGES) {
        const pageUrl = `${baseUrl}#${page}`;
        const thumb = await fetchCanvaThumbnail(pageUrl);

        if (!thumb) break;
        if (page > 1 && thumb === thumbnails[0]) break;

        thumbnails.push(thumb);
        page++;
      }

      if (thumbnails.length > 0) {
        console.log(`🎉 Berhasil mendapat ${thumbnails.length} thumbnail Canva!`);
        return NextResponse.json({
          thumbnail_url: thumbnails[0],
          thumbnails,
          source: "canva-oembed",
          pages: thumbnails.length,
        });
      }

      // 2. Fallback tanpa hashtag page (Single Image)
      console.log(`⚠️ Loop gagal, mencoba fetch single page Canva...`);
      const fallbackThumb = await fetchCanvaThumbnail(baseUrl);

      if (fallbackThumb) {
        return NextResponse.json({
          thumbnail_url: fallbackThumb,
          thumbnails: [fallbackThumb],
          source: "canva-oembed",
          pages: 1,
        });
      }

      console.log(`❌ Link Canva ditolak API. Kemungkinan besar belum diset "Anyone with the link".`);
      return NextResponse.json({ error: "Link Canva belum public" }, { status: 403 });

    } 
    // ==========================================
    // LOGIKA UNTUK WEBSITE LAIN (Pakai Microlink)
    // ==========================================
    else {
      console.log(`🔄 Mencoba Microlink untuk link non-Canva...`);
      const microlinkRes = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true`
      );
      const microlinkData = await microlinkRes.json();

      if (microlinkData.status === "success") {
        const thumbUrl =
          microlinkData.data?.screenshot?.url || 
          microlinkData.data?.image?.url ||
          null;
          
        if (thumbUrl) {
          return NextResponse.json({ thumbnail_url: thumbUrl, thumbnails: [thumbUrl], source: "microlink", pages: 1 });
        }
      }

      return NextResponse.json({ error: "Thumbnail tidak ditemukan." }, { status: 404 });
    }

  } catch (error) {
    console.error("💥 Error di API route:", error);
    return NextResponse.json({ error: "Server gagal mengambil thumbnail." }, { status: 500 });
  }
}