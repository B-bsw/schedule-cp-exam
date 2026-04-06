import { Schedule, ScheduleResult } from "@/types/type";
import * as XLSX from "xlsx";
import { NextRequest, NextResponse } from "next/server";

function getExportUrl(inputUrl: string): string {
  // Extract ID if it's a full Google Sheets URL
  const match = inputUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=xlsx`;
  }

  return inputUrl;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const customUrl = searchParams.get("url");

  if (!query || query.trim() === "" || !customUrl || customUrl.trim() === "") {
    return NextResponse.json([]);
  }

  const normalizedQuery = query.trim();
  const fetchUrl = getExportUrl(customUrl.trim());

  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Failed to fetch from url: ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    const result = workbook.SheetNames.flatMap((name) => {
      const sheet = workbook.Sheets[name];
      const data = XLSX.utils.sheet_to_json<Schedule>(sheet);

      let currentSubject = "";
      let currentBuilding = "";
      const studentRows: ScheduleResult[] = [];

      for (const item of data) {
        if (item["ใบรายชื่อผู้เข้าสอบ"] === "รายวิชา" && item.__EMPTY) {
          currentSubject = String(item.__EMPTY);
        } else if (item["ใบรายชื่อผู้เข้าสอบ"] === "ห้องสอบ" && item.__EMPTY) {
          currentBuilding = String(item.__EMPTY);
        } else if (
          item.__EMPTY != null &&
          String(item.__EMPTY).includes(normalizedQuery) &&
          item.__EMPTY_3 != null &&
          String(item.__EMPTY_3).trim() !== ""
        ) {
          studentRows.push({
            ...item,
            date: name,
            subject: currentSubject,
            building: currentBuilding,
          } as ScheduleResult);
        }
      }

      return studentRows;
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing excel:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
