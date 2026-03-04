import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";



function getNotionValues(prop: any): string[] {
  if (!prop) return [];
  
  if (prop.select) return [prop.select.name];
  if (prop.multi_select) return prop.multi_select.map((s: any) => s.name);
  if (prop.status) return [prop.status.name];
  
  // Jika dia Rollup (kaca pembesar)
  if (prop.rollup && prop.rollup.array) {
    // Ekstrak semua nilai dari dalam array rollup rekursif
    return prop.rollup.array.flatMap((item: any) => getNotionValues(item));
  }
  
  return [];
}

export function EmbedFilter({ 
  theme = "light",
  isPro = false,
  rawData = [] 
}: {
  theme?: "light" | "dark";
  isPro?: boolean;
  rawData?: any[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);

  // 🔥 FILTER MENGGUNAKAN GET NOTION VALUES
  const dynamicFilters = useMemo(() => {
    const platforms = new Set<string>();
    const statuses = new Set<string>();
    const pillars = new Set<string>();

    rawData.forEach(item => {
      const props = item.properties;
      
      getNotionValues(props.Platform).forEach(v => { if(v) platforms.add(v) });
      getNotionValues(props.Status).forEach(v => { if(v) statuses.add(v) });
      getNotionValues(props.Pillar).forEach(v => { if(v) pillars.add(v) });
    });

    const setToDict = (setObj: Set<string>, allLabel: string) => {
      const dict: Record<string, string> = { all: allLabel };
      setObj.forEach(val => {
        dict[val.toLowerCase()] = val; 
      });
      return dict;
    };

    return {
      platform: setToDict(platforms, "All Platform"),
      status: setToDict(statuses, "All Status"),
      pillar: setToDict(pillars, "All Pillars"),
      pinned: {
        all: "All Posts",
        true: "Pinned Only",
        false: "Unpinned Only"
      }
    };
  }, [rawData]);

  const defaultValue = {
    platform: "all",
    status: "all",
    pillar: "all",  
    pinned: "all",
  };

  const orderedKeys = ["platform", "status", "pillar", "pinned"] as const; 

  const current = {
    platform: params.get("platform")?.toLowerCase() ?? defaultValue.platform,
    status: params.get("status")?.toLowerCase() ?? defaultValue.status,
    pillar: params.get("pillar")?.toLowerCase() ?? defaultValue.pillar,
    pinned: params.get("pinned")?.toLowerCase() ?? defaultValue.pinned,
  };

  const updateFilter = (key: string, rawValue: string) => {
    if (!isPro) return;

    const newParams = new URLSearchParams(params.toString());

    if (rawValue === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, rawValue); 
    }

    router.push(`?${newParams.toString()}`);
    setOpen(null);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const clearAll = () => {
    if (!isPro) return;

    const newParams = new URLSearchParams();
    const db = params.get("db");
    if (db) newParams.set("db", db);
    router.push(`?${newParams.toString()}`);
  };

  const isActive = (key: keyof typeof current) =>
    current[key] !== defaultValue[key];

  const activeCount = orderedKeys.filter(isActive).length;

  return (
    <div className="w-full">
      <div
        className={`rounded-xl p-3 sm:p-4 space-y-3 border ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-[#222222] border-[#333333] text-white" 
        }`}
      >
        <div className="grid grid-cols-1 gap-2">
          {orderedKeys.map((key) => {
            const currentRawValue = current[key];
            const filterOptions: any = dynamicFilters[key]; 
            
            let displayValue = currentRawValue;
            if (key === 'pinned') {
                displayValue = filterOptions[currentRawValue] || currentRawValue;
            } else {
                 displayValue = currentRawValue === 'all' 
                     ? filterOptions.all 
                     : (filterOptions[currentRawValue] || currentRawValue.replace(/\b\w/g, (l:string) => l.toUpperCase()));
            }

            return (
              <div key={key} className="relative w-full">
                <button
                  disabled={!isPro}
                  onClick={() => {
                    if (!isPro) return;
                    setOpen(open === key ? null : key);
                  }}
                  className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 border text-sm transition
                    ${
                      isActive(key)
                        ? theme === "light"
                          ? "bg-purple-50 border-purple-300 text-purple-700"
                          : "bg-purple-600/20 border-purple-500 text-purple-300"
                        : theme === "light"
                          ? "bg-gray-200 border-gray-300 text-gray-500"
                          : "bg-[#333333] border-[#333333] text-gray-400" 
                    }
                    ${!isPro ? "cursor-not-allowed opacity-60" : ""}
                  `}
                >
                  <span className="truncate flex-1 text-left">{displayValue}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 ${!isPro ? "opacity-50" : ""}`}
                  />
                </button>

                {open === key && isPro && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpen(null)}
                    />

                    <div
                      className={`absolute z-50 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden max-h-64 overflow-y-auto ${
                        theme === "light"
                          ? "bg-white border-gray-200"
                          : "bg-[#222222] border-[#333333]" 
                      }`}
                    >
                      <div
                        className={`sticky top-0 z-10 px-4 py-2 text-xs font-semibold border-b ${
                          theme === "light"
                            ? "bg-gray-50 text-gray-400 border-gray-200"
                            : "bg-[#2A2A2A] text-gray-400 border-[#333333]" 
                        }`}
                      >
                        {key === "pinned" ? "POSTS" : key.toUpperCase()}
                      </div>

                      {Object.entries(filterOptions).map(([optKey, optLabel]) => {
                          const isSelected = currentRawValue === optKey;
                          const finalOptLabel = optLabel as string;

                          return (
                            <button
                              key={optKey}
                              onClick={() => updateFilter(key, optKey)}
                              className={`w-full px-4 py-3 flex items-center justify-between text-sm text-left
                                ${
                                  isSelected
                                    ? theme === "light"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-purple-600/20 text-purple-300"
                                    : theme === "light"
                                      ? "hover:bg-[#F9FAFB]"
                                      : "hover:bg-[#333333]" 
                                }
                              `}
                            >
                              <span className="truncate pr-2">{finalOptLabel}</span>
                              {isSelected && <span className="text-xs shrink-0">✓</span>}
                            </button>
                          )
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!isPro && (
          <>
            <div
              className={`h-px my-3 ${
                theme === "light" ? "bg-gray-200" : "bg-[#333333]" 
              }`}
            />

            <button
              onClick={() => {
                window.open("https://khlasify.myr.id/pl/content-pro", "_blank");
              }}
              className="w-full py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition rounded-2xl"
            >
              Upgrade to PRO
            </button>
          </>
        )}

        {activeCount > 0 && (
          <div className="flex justify-end">
            <button
              disabled={!isPro}
              onClick={clearAll}
              className={`text-sm ${
                !isPro
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "light"
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-400 hover:text-white"
              }`}
            >
              Clear all
            </button>
          </div>
        )}

        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {orderedKeys.map(
              (key) => {
                if (!isActive(key)) return null;
                const filterOptions: any = dynamicFilters[key];
                const currentVal = current[key];
                
                let badgeLabel = currentVal;
                if (key === 'pinned') {
                     badgeLabel = filterOptions[currentVal] as string;
                } else {
                     badgeLabel = filterOptions[currentVal] as string || currentVal.replace(/\b\w/g, (l:string) => l.toUpperCase());
                }

                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      theme === "light"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-purple-600/20 text-purple-300"
                    }`}
                  >
                    <span className="capitalize">{key === "pinned" ? "post" : key}</span>
                    <span className="truncate max-w-[120px]">
                      {badgeLabel}
                    </span>
                    <button
                      disabled={!isPro}
                      onClick={() =>
                        isPro && updateFilter(key, "all")
                      }
                      className={!isPro ? "cursor-not-allowed opacity-50" : ""}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}