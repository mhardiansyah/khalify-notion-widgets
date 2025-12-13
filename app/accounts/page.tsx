/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "../components/Navbar";
import { Plus, Trash2 } from "lucide-react";

export default function AccountsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [highlights, setHighlights] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace("/login");

      setUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name || "");
        setUsername(profile.username || "");
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || "");
        setHighlights(profile.highlights || []);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    await supabase.from("profiles").upsert({
      id: user.id,
      name,
      username,
      bio,
      avatar_url: avatarUrl,
      highlights,
    });

    setLoading(false);
  };

  const addHighlight = () =>
    setHighlights([...highlights, { title: "", image: "" }]);

  const updateHighlight = (i: number, f: string, v: string) => {
    const copy = [...highlights];
    copy[i][f] = v;
    setHighlights(copy);
  };

  const removeHighlight = (i: number) =>
    setHighlights(highlights.filter((_, idx) => idx !== i));

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Account Details</h1>
          <p className="text-gray-500">Manage your profile</p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">
            {/* PERSONAL INFO */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4">Personal Information</h2>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={avatarUrl || "/avatar-placeholder.png"}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Avatar URL"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@username"
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Highlights</h2>
                <button
                  onClick={addHighlight}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-purple-600 text-white rounded-lg"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="space-y-4">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="relative border rounded-xl p-4 bg-gray-50"
                  >
                    <button
                      onClick={() => removeHighlight(i)}
                      className="absolute right-3 top-3 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={h.title}
                        onChange={(e) =>
                          updateHighlight(i, "title", e.target.value)
                        }
                        placeholder="Title"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={h.image}
                        onChange={(e) =>
                          updateHighlight(i, "image", e.target.value)
                        }
                        placeholder="Image URL"
                        className="px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold mb-2">Account Stats</h2>
              <p className="text-sm text-gray-500">
                Placeholder (nanti bisa isi widgets, license, dll)
              </p>
            </div>
          </div>
        </div>

        {/* BIO – FULL WIDTH */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-2">Bio</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell something about you…"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          Save Profile
        </button>
      </div>
    </>
  );
}
