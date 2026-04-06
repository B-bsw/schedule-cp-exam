"use client";

import { ScheduleResult } from "@/types/type";
import { useState, useEffect } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [debouncedUrl, setDebouncedUrl] = useState<string>("");
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setDebouncedUrl(sheetUrl);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, sheetUrl]);

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
          const data = await res.json();
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
            กรุณาใส่ลิงก์ Google Sheets และรหัสนักศึกษาเพื่อตรวจสอบวันและเวลาสอบ
          </p>
        </header>

        <div className="relative max-w-xl mx-auto space-y-4">
          <div className="relative">
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="ลิงก์ Google Sheets (เช่น https://docs.google.com/spreadsheets/d/...)"
              className="w-full bg-white px-6 py-3 text-sm rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-400"
              spellCheck={false}
            />
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  `&quot;{debouncedQuery}`&quot;
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

              {/* Mobile View: Cards */}
              <div className="flex flex-col sm:hidden gap-4">
                {results.map((schedule, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start text-nowrap gap-1">
                      <span className="font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">
                        {schedule.__EMPTY}
                      </span>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-lg ${schedule.date?.includes("บ่าย") ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}`}
                      >
                        {schedule.date}
                      </span>
                    </div>

                    <div>
                      <h3
                        className="text-gray-900  text-base truncate overflow-clip"
                        title={schedule.subject}
                      >
                        รายวิชา:{" "}
                        <span className="font-semibold">
                          {schedule.subject || "-"}
                        </span>
                      </h3>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          ห้องสอบ
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.building || "-"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          เลขที่นั่ง
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.__EMPTY_3 || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden sm:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-100/50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-200">
                      <tr className="[&_th]:border-r [&_th]:last:border-r-0 [&_th]:border-gray-200">
                        <th className="px-6 py-4 font-semibold">
                          รหัสประจำตัว
                        </th>
                        <th className="px-6 py-4 font-semibold">วันที่สอบ</th>
                        <th className="px-6 py-4 font-semibold">วิชา</th>
                        <th className="px-6 py-4 font-semibold">ห้อง</th>
                        <th className="px-6 py-4 font-semibold">เลขที่นั่ง</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 [&_td]:border-r [&_td]:last:border-r-0 [&_td]:border-gray-200 [&_tr]:even:bg-zinc-100/40">
                      {results.map((schedule, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs">
                              {schedule.__EMPTY}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs ${schedule.date?.includes("บ่าย") ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}`}
                            >
                              {schedule.date}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-gray-900 text-sm font-medium max-w-xs text-wrap"
                            title={schedule.subject}
                          >
                            {schedule.subject || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {schedule.building || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {schedule.__EMPTY_3 || "-"}
                          </td>
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
