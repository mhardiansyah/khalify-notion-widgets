"use client";
import React from "react";

const widgets = [
  {
    id: "O2E0kV",
    name: "Widget #O2E0kV",
    token: "***************",
    db: "2aaa40426b838108a7da7122773caca1",
    url: "https://khalify-notion-widgets.vercel.app/embed/f1d95f?db=2a5ad4026b8381f2a5f2d8e71a60864e",
    icon: "⭐",
  },
  {
    id: "OAx23h",
    name: "iglayout",
    token: "***************",
    db: "2a44366799a896942dcf6b81e08591",
    url: "https://khalify-notion-widgets.vercel.app/embed/OAx23h?db=2a44366799a896942dcf6b81e08591",
    icon: "🦆",
  },
  {
    id: "er8u0T",
    name: "Widget #er8u0T",
    token: "***************",
    db: "2a5a40426b8381f2a5fd28e71a68684e",
    url: "https://khalify-notion-widgets.vercel.app/embed/er8u0T?db=2a5a40426b8381f2a5fd28e71a68684e",
    icon: "🌸",
  },
];

const WidgetCard = ({ widget }: { widget: typeof widgets[0] }) => (
  <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{widget.icon}</span>
      <div>
        <div className="font-semibold">{widget.name}</div>
        <div className="text-xs text-gray-500">ID: {widget.id}</div>
      </div>
    </div>
    <div className="text-xs text-gray-500">Integration Token:</div>
    <div className="font-mono text-sm tracking-widest">***************</div>
    <div className="text-xs text-gray-500">Database:</div>
    <div className="font-mono text-sm">{widget.db}</div>
    <div className="flex gap-2 mt-2">
      <a
        href={widget.url}
        target="_blank"
        className="text-orange-600 underline text-sm"
      >
        View Widget
      </a>
      <a
        href="#"
        className="text-orange-600 underline text-sm"
      >
        View DB
      </a>
    </div>
  </div>
);

export default function WidgetsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-black">Your Widgets ({widgets.length})</h1>
        {widgets.map((w) => (
          <WidgetCard widget={w} key={w.id} />
        ))}
      </div>
    </div>
  );
}