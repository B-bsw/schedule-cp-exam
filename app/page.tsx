"use client";

import { ScheduleResult, SheetSource } from "@/types/type";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [sources, setSources] = useState<SheetSource[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debouncedUrl, setDebouncedUrl] = useState("");
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setDebouncedUrl(sheetUrl);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, sheetUrl]);

  useEffect(() => {
    const loadSources = async () => {
      const response = await fetch("/api/sources");
      if (!response.ok) return;
      const data = (await response.json()) as SheetSource[];
      setSources(data);
    };

    loadSources();
  }, []);

  useEffect(() => {
    if (!selectedSourceId) return;
    const selected = sources.find((source) => String(source.id) === selectedSourceId);
    if (selected) setSheetUrl(selected.url);
  }, [selectedSourceId, sources]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim() || !debouncedUrl.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const apiUrl = `/api?q=${encodeURIComponent(debouncedQuery)}&url=${encodeURIComponent(debouncedUrl)}`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = (await res.json()) as ScheduleResult[];
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, debouncedUrl]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            CP ค้นหาตารางสอบ
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            เลือกแหล่งข้อมูลหรือใส่ลิงก์ Google Sheets แล้วค้นหาด้วยรหัสนักศึกษา
          </p>
        </header>

        <div className="relative max-w-xl mx-auto space-y-4">
          <select
            className="w-full bg-white px-6 py-3 text-sm rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
            value={selectedSourceId}
            onChange={(event) => setSelectedSourceId(event.target.value)}
          >
            <option value="">เลือก URL ที่บันทึกไว้ (หรือกรอกเอง)</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={sheetUrl}
            onChange={(event) => setSheetUrl(event.target.value)}
            placeholder="ลิงก์ Google Sheets (เช่น https://docs.google.com/spreadsheets/d/...)"
            className="w-full bg-white px-6 py-3 text-sm rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-400"
            spellCheck={false}
          />

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="รหัสนักศึกษา (เช่น 601234567-8)"
              className="w-full bg-white px-6 py-4 text-base sm:text-lg rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-400"
              spellCheck={false}
              disabled={!sheetUrl.trim()}
            />
            {isLoading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 pt-4">
          {!isLoading && hasSearched && results.length === 0 && (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-500">
                ไม่พบข้อมูลที่ตรงกับ{" "}
                <span className="font-medium text-gray-900">
                  &quot;{debouncedQuery}&quot;
                </span>
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  ผลการค้นหา
                </h2>
                <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  พบ {results.length} รายการ
                </span>
              </div>

              <div className="hidden sm:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-100/50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-200">
                      <tr className="[&_th]:border-r [&_th]:last:border-r-0 [&_th]:border-gray-200">
                        <th className="px-6 py-4 font-semibold">รหัสประจำตัว</th>
                        <th className="px-6 py-4 font-semibold">วันที่สอบ</th>
                        <th className="px-6 py-4 font-semibold">วิชา</th>
                        <th className="px-6 py-4 font-semibold">ห้อง</th>
                        <th className="px-6 py-4 font-semibold">เลขที่นั่ง</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 [&_td]:border-r [&_td]:last:border-r-0 [&_td]:border-gray-200 [&_tr]:even:bg-zinc-100/40">
                      {results.map((schedule, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">{schedule.__EMPTY}</td>
                          <td className="px-6 py-4">{schedule.date}</td>
                          <td className="px-6 py-4">{schedule.subject || "-"}</td>
                          <td className="px-6 py-4">{schedule.building || "-"}</td>
                          <td className="px-6 py-4">{schedule.__EMPTY_3 || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
