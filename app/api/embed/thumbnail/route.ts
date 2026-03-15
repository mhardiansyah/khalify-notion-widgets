import { NextRequest, NextResponse } from "next/server";

async function fetchCanvaThumbnail(url: string): Promise<string | null> {
  const cleanUrl = url
    .replace(/\/edit(\?.*)?$/, "/view")
    .replace(/\/view[\?#].*$/, "/view");

  console.log(`🔍 Mengirim ke Canva OEmbed: ${cleanUrl}`);

  const canvaRes = await fetch(
    `https://www.canva.com/oembed?url=${encodeURIComponent(cleanUrl)}`
  );

  if (!canvaRes.ok) {
    return null;
  }

  const data = await canvaRes.json();
  return data.thumbnail_url ?? null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Parameter URL diperlukan." }, { status: 400 });
  }

  const baseUrl = url
    .replace(/\/edit(\?.*)?$/, "/view")
    .replace(/\/view[\?#].*$/, "/view");

  try {
    const thumbnails: string[] = [];
    let page = 1;
    const MAX_PAGES = 20;

    while (page <= MAX_PAGES) {
      const pageUrl = `${baseUrl}#${page}`;
      const thumb = await fetchCanvaThumbnail(pageUrl);

      if (!thumb) break;
      if (page > 1 && thumb === thumbnails[0]) break;

      thumbnails.push(thumb);
      page++;
    }

    if (thumbnails.length === 0) {
      console.log(`⚠️ Loop halaman gagal, mencoba tanpa fragment...`);
      const fallbackThumb = await fetchCanvaThumbnail(baseUrl);

      if (fallbackThumb) {
        return NextResponse.json({
          thumbnail_url: fallbackThumb,
          thumbnails: [fallbackThumb],
          source: "canva-oembed",
          pages: 1,
        });
      }

      // Fallback terakhir: Microlink
      console.log(`🔄 Mencoba Microlink sebagai fallback...`);
      // 🔥 PERBAIKAN 1: Tambahkan parameter screenshot=true
      const microlinkRes = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true`
      );
      const microlinkData = await microlinkRes.json();

      if (microlinkData.status === "success") {
        // 🔥 PERBAIKAN 2: HAPUS microlinkData.data.logo.url AGAR LOGO "C" TIDAK MUNCUL!
        const thumbUrl =
          microlinkData.data?.screenshot?.url || 
          microlinkData.data?.image?.url ||
          null;
          
        return NextResponse.json({ thumbnail_url: thumbUrl, thumbnails: thumbUrl ? [thumbUrl] : [], source: "microlink", pages: 1 });
      }

      return NextResponse.json({ error: "Thumbnail tidak ditemukan." }, { status: 404 });
    }

    console.log(`🎉 Berhasil mendapat ${thumbnails.length} thumbnail`);
    return NextResponse.json({
      thumbnail_url: thumbnails[0],
      thumbnails,
      source: "canva-oembed",
      pages: thumbnails.length,
    });

  } catch (error) {
    console.error("💥 Error di API route:", error);
    return NextResponse.json({ error: "Server gagal mengambil thumbnail." }, { status: 500 });
  }
}