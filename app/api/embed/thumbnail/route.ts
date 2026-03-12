import { NextRequest, NextResponse } from "next/server";

async function fetchCanvaThumbnail(url: string): Promise<string | null> {
  const cleanUrl = url
    .replace(/\/edit(\?.*)?$/, "/view")
    .replace(/\/view[\?#].*$/, "/view");

  console.log(`🔍 Mengirim ke Canva OEmbed: ${cleanUrl}`);

  const canvaRes = await fetch(
    `https://www.canva.com/oembed?url=${encodeURIComponent(cleanUrl)}`
  );

  // ✅ Log status respons Canva agar kita tahu persis apa yang terjadi
  console.log(`📡 Status Canva OEmbed: ${canvaRes.status} ${canvaRes.statusText}`);

  if (!canvaRes.ok) {
    // Baca isi error response dari Canva untuk debugging
    const errorText = await canvaRes.text();
    console.log(`❌ Canva OEmbed menolak: ${errorText.substring(0, 200)}`);
    return null;
  }

  const data = await canvaRes.json();
  console.log(`✅ Canva OEmbed berhasil:`, JSON.stringify(data).substring(0, 300));
  return data.thumbnail_url ?? null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Parameter URL diperlukan." }, { status: 400 });
  }

  console.log(`\n🚀 API thumbnail dipanggil dengan URL: ${url}`);

  const baseUrl = url
    .replace(/\/edit(\?.*)?$/, "/view")
    .replace(/\/view[\?#].*$/, "/view");

  console.log(`🧹 URL setelah dibersihkan: ${baseUrl}`);

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
      const microlinkRes = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}`
      );
      const microlinkData = await microlinkRes.json();
      console.log(`📦 Microlink response:`, JSON.stringify(microlinkData).substring(0, 300));

      if (microlinkData.status === "success") {
        const thumbUrl =
          microlinkData.data?.image?.url ||
          microlinkData.data?.logo?.url ||
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