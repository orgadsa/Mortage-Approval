"use client";

import { useState } from "react";
import { MortgageApplication } from "@/types";

interface SummaryScreenProps {
  data: MortgageApplication;
  onBack: () => void;
}

const LABELS: Record<string, string> = {
  propertyType: "סוג דירה",
  propertyPurpose: "ייעוד הדירה",
  propertyCity: "עיר",
  purchasePrice: "מחיר רכישה",
  requestedAmount: "סכום משכנתא מבוקש",
  mortgagePeriodYears: "תקופת משכנתא (שנים)",
  equitySources: "מקורות הון עצמי",
  hasSignedContract: "נחתם חוזה",
  whenNeedMoney: "מתי צריכים את הכסף",
  firstName: "שם פרטי",
  lastName: "שם משפחה",
  idNumber: "תעודת זהות",
  phone: "טלפון",
  email: "אימייל",
  gender: "מין",
  privacyConsent: "אישור פרטיות",
  address: "כתובת מגורים",
  dateOfBirth: "תאריך לידה",
  countryOfBirth: "ארץ לידה",
  hasAdditionalCitizenship: "אזרחות נוספת",
  additionalCitizenshipCountry: "מדינת אזרחות נוספת",
  maritalStatus: "מצב משפחתי",
  hasChildrenUnder21: "ילדים עד גיל 21",
  childrenDetails: "פרטי ילדים",
  childrenInCustody: "ילדים בחזקה",
  partnerFullName: "שם בן/בת זוג",
  partnerGender: "מין בן/בת זוג",
  partnerIdNumber: "ת״ז בן/בת זוג",
  partnerPhone: "טלפון בן/בת זוג",
  partnerDateOfBirth: "תאריך לידה בן/בת זוג",
  partnerCountryOfBirth: "ארץ לידה בן/בת זוג",
  partnerHasAdditionalCitizenship: "אזרחות נוספת בן/בת זוג",
  partnerAdditionalCitizenshipCountry: "מדינת אזרחות נוספת בן/בת זוג",
  partnerAddress: "כתובת בן/בת זוג",
  propertyRegisteredUnderPartner: "רישום על שם בן/בת זוג",
  partnerHasNonSharedChildren: "ילדים לא משותפים",
  hasAdditionalBorrowers: "לווים נוספים",
  additionalBorrowers: "פרטי לווים נוספים",
  isEmployed: "עובד/ת",
  employmentType: "סוג העסקה",
  profession: "מקצוע",
  employerName: "שם המעסיק",
  isSpecialProfession: "מקצוע מיוחד",
  specialProfessionType: "סוג מקצוע מיוחד",
  workStartDate: "תחילת עבודה",
  workAddress: "כתובת עבודה",
  averageMonthlyNetSalary: "שכר חודשי נטו",
  isOnMaternityLeave: "בחופשת לידה",
  hasAdditionalWorkSource: "מקור עבודה נוסף",
  additionalWorkDetails: "פרטי עבודה נוספת",
  hasAdditionalIncome: "הכנסות נוספות",
  additionalIncomeSource: "מקור הכנסה נוספת",
  additionalIncomeAmount: "סכום הכנסה נוספת",
  hasObligations: "התחייבויות",
  obligations: "פירוט התחייבויות",
};

const VALUE_TRANSLATIONS: Record<string, Record<string, string>> = {
  propertyType: {
    new: "דירה חדשה",
    price_for_resident: "מחיר למשתכן",
    second_hand: "יד שנייה",
  },
  propertyPurpose: {
    primary: "דירה יחידה/עיקרית",
    alternative: "דירה חליפית",
    investment: "להשקעה",
  },
  gender: { male: "זכר", female: "נקבה" },
  partnerGender: { male: "זכר", female: "נקבה" },
  maritalStatus: {
    single: "רווק/ה",
    married: "נשוי/אה",
    divorced: "גרוש/ה",
    widowed: "אלמן/ה",
    common_law: "ידוע/ה בציבור",
  },
  employmentType: {
    employee: "שכיר/ה",
    self_employed: "עצמאי/ת",
    employee_company_owner: "שכיר/ה בעל/ת חברה",
  },
  whenNeedMoney: {
    up_to_month: "עד חודש",
    up_to_3_months: "עד 3 חודשים",
    more_than_3_months: "מעל 3 חודשים",
  },
};

function formatValue(key: string, value: unknown): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "כן" : "לא";

  if (typeof value === "string" && VALUE_TRANSLATIONS[key]?.[value]) {
    return VALUE_TRANSLATIONS[key][value];
  }

  if (typeof value === "number") {
    if (
      key.includes("Price") ||
      key.includes("Amount") ||
      key.includes("Salary") ||
      key === "requestedAmount"
    ) {
      return `₪${value.toLocaleString("he-IL")}`;
    }
    return value.toLocaleString("he-IL");
  }

  if (Array.isArray(value)) {
    if (key === "equitySources") {
      return value
        .map(
          (s: { source: string; amount: number }) =>
            `${s.source}: ₪${s.amount.toLocaleString("he-IL")}`
        )
        .join(" | ");
    }
    if (key === "childrenDetails") {
      return value.map((c: { age: number }) => `גיל ${c.age}`).join(", ");
    }
    if (key === "obligations") {
      return value
        .map(
          (o: { description: string; monthlyAmount: number }) =>
            `${o.description}: ₪${o.monthlyAmount.toLocaleString("he-IL")}/חודש`
        )
        .join(" | ");
    }
    return JSON.stringify(value);
  }

  return String(value);
}

const SECTIONS: { title: string; fields: string[] }[] = [
  {
    title: "פרטי הנכס",
    fields: [
      "propertyType", "propertyPurpose", "propertyCity", "purchasePrice",
      "requestedAmount", "mortgagePeriodYears", "equitySources",
      "hasSignedContract", "whenNeedMoney",
    ],
  },
  {
    title: "פרטים אישיים",
    fields: [
      "firstName", "lastName", "idNumber", "phone", "email", "gender",
      "address", "dateOfBirth", "countryOfBirth", "hasAdditionalCitizenship",
      "additionalCitizenshipCountry",
    ],
  },
  {
    title: "מצב משפחתי",
    fields: ["maritalStatus", "hasChildrenUnder21", "childrenDetails", "childrenInCustody"],
  },
  {
    title: "פרטי בן/בת זוג",
    fields: [
      "partnerFullName", "partnerGender", "partnerIdNumber", "partnerPhone",
      "partnerDateOfBirth", "partnerCountryOfBirth",
      "partnerHasAdditionalCitizenship", "partnerAdditionalCitizenshipCountry",
      "partnerAddress", "propertyRegisteredUnderPartner", "partnerHasNonSharedChildren",
    ],
  },
  {
    title: "תעסוקה",
    fields: [
      "isEmployed", "employmentType", "profession", "employerName",
      "isSpecialProfession", "specialProfessionType", "workStartDate",
      "workAddress", "averageMonthlyNetSalary", "isOnMaternityLeave",
      "hasAdditionalWorkSource", "additionalWorkDetails",
    ],
  },
  {
    title: "מצב כלכלי",
    fields: [
      "hasAdditionalIncome", "additionalIncomeSource", "additionalIncomeAmount",
      "hasObligations", "obligations", "hasAdditionalBorrowers", "additionalBorrowers",
    ],
  },
];

export default function SummaryScreen({ data, onBack }: SummaryScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationData: data }),
      });
      if (!response.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("אירעה שגיאה בשליחת הבקשה. נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    const element = document.getElementById("summary-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(
      `בקשת_משכנתא_${data.firstName || ""}_${data.lastName || ""}.pdf`
    );
  };

  return (
    <div className="min-h-full bg-poalim-grayBg overflow-y-auto">
      <div className="max-w-3xl mx-auto px-5 py-6">
        {submitted ? (
          <div className="text-center py-14">
            <div className="w-16 h-16 mx-auto mb-5 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-poalim-black mb-2">
              הבקשה אצלנו!
            </h2>
            <p className="text-poalim-gray mb-6 text-[15px]">
              אנחנו מתחילים לטפל בבקשת המשכנתא שלך.
              <br />
              ניצור איתך קשר בהקדם.
            </p>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-poalim-red text-white rounded-lg hover:bg-poalim-redHover transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              הורדת PDF עם פרטי הבקשה
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-poalim-black">סיכום בקשת המשכנתא</h2>
            <button
              onClick={onBack}
              className="text-poalim-red hover:text-poalim-redHover font-medium text-sm"
            >
              ← חזרה לצ׳אט
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div id="summary-content" className="space-y-4">
          {submitted && (
            <div className="text-center mb-5 pt-3">
              <div className="inline-flex items-center gap-1.5 bg-poalim-red text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                <svg width="10" height="10" viewBox="0 0 28 28" fill="white">
                  <path d="M14 4L24 14L14 24L4 14L14 4Z" />
                </svg>
                פועלים משכנתאות
              </div>
              <h1 className="text-lg font-bold text-poalim-black">פרטי בקשת משכנתא</h1>
              <p className="text-poalim-grayLight text-xs mt-0.5">
                {data.firstName} {data.lastName} • {new Date().toLocaleDateString("he-IL")}
              </p>
            </div>
          )}

          {SECTIONS.map((section, si) => {
            const filledFields = section.fields.filter((f) => {
              const val = data[f as keyof MortgageApplication];
              return val !== undefined && val !== null && val !== "";
            });
            if (filledFields.length === 0) return null;

            return (
              <div key={si} className="bg-white rounded-xl border border-poalim-border overflow-hidden">
                <div className="px-4 py-2.5 border-b border-poalim-borderLight bg-poalim-grayBg">
                  <h3 className="text-sm font-bold text-poalim-red">{section.title}</h3>
                </div>
                <div className="divide-y divide-poalim-borderLight">
                  {filledFields.map((fieldKey) => {
                    const value = data[fieldKey as keyof MortgageApplication];
                    return (
                      <div key={fieldKey} className="flex justify-between px-4 py-2.5">
                        <span className="text-poalim-grayLight text-[13px]">
                          {LABELS[fieldKey] || fieldKey}
                        </span>
                        <span className="font-medium text-poalim-black text-[13px] text-left max-w-[60%]">
                          {formatValue(fieldKey, value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!submitted && (
          <div className="mt-6 flex gap-2.5">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-poalim-red hover:bg-poalim-redHover disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-all text-sm"
            >
              {isSubmitting ? "שולח..." : "שליחת הבקשה"}
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-3 border-2 border-poalim-red/20 text-poalim-red font-semibold rounded-xl hover:bg-poalim-redLight transition-colors text-sm"
            >
              PDF ↓
            </button>
          </div>
        )}

        {!submitted && (
          <p className="text-[11px] text-poalim-grayLight text-center mt-4 leading-relaxed">
            אי עמידה בפירעון ההלוואה עלולה לגרור חיוב בריבית פיגורים והליכי הוצאה לפועל.
            <br />
            קבלת הלוואה לדיור כפופה לאישור הבנק, תנאיו וכל דין.
          </p>
        )}
      </div>
    </div>
  );
}
