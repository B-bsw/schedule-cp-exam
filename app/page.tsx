"use client";

import { ScheduleResult } from "@/types/type";
import { useState } from "react";
import type { FormEvent } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [urlTouched, setUrlTouched] = useState<boolean>(false);
  const [idTouched, setIdTouched] = useState<boolean>(false);
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [submittedUrl, setSubmittedUrl] = useState<string>("");

  const studentIdPattern = /^\d{9}-\d$/;
  const isValidId = studentIdPattern.test(searchQuery.trim());
  const isValidUrl =
    sheetUrl.trim().startsWith("http") &&
    sheetUrl.includes("docs.google.com/spreadsheets");
  const showUrlError = urlTouched && !isValidUrl;
  const showIdError = idTouched && !isValidId;
  const canSubmit = isValidUrl && isValidId && !isLoading;
  const isDirty =
    hasSearched &&
    (submittedQuery !== searchQuery || submittedUrl !== sheetUrl);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrlTouched(true);
    setIdTouched(true);
    setErrorMessage("");

    if (!isValidUrl || !isValidId) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const apiUrl = `/api?q=${encodeURIComponent(searchQuery.trim())}&url=${encodeURIComponent(sheetUrl.trim())}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setSubmittedQuery(searchQuery);
        setSubmittedUrl(sheetUrl);
        setLastUpdated(
          new Date().toLocaleString("th-TH", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        );
      } else {
        setResults([]);
        setErrorMessage("ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบลิงก์และลองใหม่");
      }
    } catch {
      setResults([]);
      setErrorMessage("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

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

        <form
          className="relative max-w-xl mx-auto space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              htmlFor="sheet-url"
              className="text-sm font-medium text-gray-800"
            >
              ลิงก์ Google Sheets
            </label>
            <input
              id="sheet-url"
              type="url"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full bg-white px-6 py-3 text-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-500"
              spellCheck={false}
              aria-describedby="sheet-url-help"
            />
            <p
              id="sheet-url-help"
              className="text-xs text-gray-500 leading-relaxed"
            >
              ใช้ลิงก์ที่ตั้งค่าเป็นสาธารณะ หรืออนุญาตให้ดูได้
            </p>
            {showUrlError && (
              <p className="text-xs text-orange-700">
                กรุณาใส่ลิงก์ Google Sheets ที่ถูกต้อง
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="student-id"
              className="text-sm font-medium text-gray-800"
            >
              รหัสนักศึกษา
            </label>
            <div className="relative">
              <input
                id="student-id"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setIdTouched(true)}
                placeholder="601234567-8"
                className="w-full bg-white px-6 py-4 text-base sm:text-lg rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all placeholder:text-gray-500"
                spellCheck={false}
                disabled={!sheetUrl.trim()}
                aria-describedby="student-id-help"
              />
              {isLoading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p
              id="student-id-help"
              className="text-xs text-gray-500 leading-relaxed"
            >
              รูปแบบ 11 หลักรวมขีดกลาง
            </p>
            {showIdError && (
              <p className="text-xs text-orange-700">
                กรุณาใส่รหัสนักศึกษาที่ถูกต้อง
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold shadow-sm transition-all hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isLoading ? "กำลังค้นหา" : "ค้นหา"}
            </button>
            {isDirty && (
              <p className="text-xs text-gray-500">
                มีการแก้ไขข้อมูล กดค้นหาเพื่ออัปเดตผลลัพธ์
              </p>
            )}
          </div>
          {errorMessage && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-orange-800">
              {errorMessage}
            </div>
          )}
        </form>

        <div className="space-y-6 pt-4">
          {!isLoading &&
            hasSearched &&
            results.length === 0 &&
            !errorMessage && (
              <div className="text-center py-14 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <p className="text-gray-900 font-medium">
                  ไม่พบข้อมูลที่ตรงกับรหัสนี้
                </p>
                <p className="text-sm text-gray-500">
                  ตรวจสอบรหัสนักศึกษา และลิงก์ที่แชร์ถูกต้องหรือไม่ แล้วลอง
                  อีกครั้ง
                </p>
              </div>
            )}

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 px-2">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-gray-700">
                    ผลการค้นหา
                  </h2>
                  {lastUpdated && (
                    <p className="text-xs text-gray-500">
                      อัปเดตล่าสุด {lastUpdated}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  พบ {results.length} รายการ
                </span>
              </div>

              {/* Mobile View: Cards */}
              <div className="flex flex-col sm:hidden gap-4">
                {results.map((schedule, i) => {
                  const isAfternoon = schedule.date?.includes("บ่าย");
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start text-nowrap gap-1">
                        <span className="font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">
                          {schedule.__EMPTY}
                        </span>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-lg ${isAfternoon ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}`}
                        >
                          {isAfternoon ? "ช่วงบ่าย" : "ช่วงเช้า"}
                        </span>
                      </div>

                      <div>
                        <h3
                          className="text-gray-900 text-base truncate overflow-clip"
                          title={schedule.subject}
                        >
                          รายวิชา:{" "}
                          <span className="font-semibold">
                            {schedule.subject || "-"}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {schedule.date || "-"}
                        </p>
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
                  );
                })}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
                              {schedule.date?.includes("บ่าย")
                                ? "ช่วงบ่าย"
                                : "ช่วงเช้า"}
                            </span>
                            <div className="text-xs text-gray-500 mt-2">
                              {schedule.date || "-"}
                            </div>
                          </td>
                          <td
                            className="px-6 py-4 text-gray-900 text-sm font-medium max-w-xs text-wrap"
                            title={schedule.subject}
                          >
                            {schedule.subject || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm font-medium max-w-xs text-wrap">
                            <span>{schedule.building || "-"}</span>
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
