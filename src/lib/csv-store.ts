import { MortgageApplication } from "@/types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CSV_PATH = path.join(DATA_DIR, "applications.csv");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function flattenApplication(app: MortgageApplication): Record<string, string> {
  const flat: Record<string, string> = {};

  for (const [key, value] of Object.entries(app)) {
    if (value === undefined || value === null) {
      flat[key] = "";
    } else if (Array.isArray(value)) {
      flat[key] = JSON.stringify(value);
    } else if (typeof value === "object") {
      flat[key] = JSON.stringify(value);
    } else {
      flat[key] = String(value);
    }
  }

  return flat;
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

const CSV_COLUMNS = [
  "submissionDate",
  "propertyType",
  "propertyPurpose",
  "propertyCity",
  "purchasePrice",
  "requestedAmount",
  "mortgagePeriodYears",
  "equitySources",
  "hasSignedContract",
  "whenNeedMoney",
  "firstName",
  "lastName",
  "idNumber",
  "phone",
  "email",
  "gender",
  "privacyConsent",
  "address",
  "dateOfBirth",
  "countryOfBirth",
  "hasAdditionalCitizenship",
  "additionalCitizenshipCountry",
  "maritalStatus",
  "hasChildrenUnder21",
  "childrenDetails",
  "childrenInCustody",
  "partnerFullName",
  "partnerGender",
  "partnerIdNumber",
  "partnerPhone",
  "partnerDateOfBirth",
  "partnerCountryOfBirth",
  "partnerHasAdditionalCitizenship",
  "partnerAdditionalCitizenshipCountry",
  "partnerAddress",
  "propertyRegisteredUnderPartner",
  "partnerHasNonSharedChildren",
  "hasAdditionalBorrowers",
  "additionalBorrowers",
  "isEmployed",
  "employmentType",
  "profession",
  "employerName",
  "isSpecialProfession",
  "specialProfessionType",
  "workStartDate",
  "workAddress",
  "averageMonthlyNetSalary",
  "isOnMaternityLeave",
  "hasAdditionalWorkSource",
  "additionalWorkDetails",
  "hasAdditionalIncome",
  "additionalIncomeSource",
  "additionalIncomeAmount",
  "hasObligations",
  "obligations",
];

export async function saveApplicationToCsv(
  application: MortgageApplication
): Promise<string> {
  ensureDataDir();

  const flat = flattenApplication(application);
  flat.submissionDate = new Date().toISOString();

  const fileExists = fs.existsSync(CSV_PATH);

  if (!fileExists) {
    const header = CSV_COLUMNS.map(escapeCsvField).join(",") + "\n";
    fs.writeFileSync(CSV_PATH, "\uFEFF" + header, "utf-8"); // BOM for Hebrew support in Excel
  }

  const row =
    CSV_COLUMNS.map((col) => escapeCsvField(flat[col] || "")).join(",") + "\n";
  fs.appendFileSync(CSV_PATH, row, "utf-8");

  return flat.submissionDate;
}
