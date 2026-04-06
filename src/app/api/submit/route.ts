import { NextRequest, NextResponse } from "next/server";
import { MortgageApplication } from "@/types";
import { saveApplicationToCsv } from "@/lib/csv-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationData }: { applicationData: MortgageApplication } = body;

    if (!applicationData) {
      return NextResponse.json(
        { error: "Application data is required" },
        { status: 400 }
      );
    }

    if (!applicationData.firstName || !applicationData.lastName || !applicationData.idNumber) {
      return NextResponse.json(
        { error: "Missing required personal information" },
        { status: 400 }
      );
    }

    const submissionDate = await saveApplicationToCsv(applicationData);

    return NextResponse.json({
      success: true,
      submissionDate,
      message: "הבקשה נשמרה בהצלחה",
    });
  } catch (error) {
    console.error("Submit API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
