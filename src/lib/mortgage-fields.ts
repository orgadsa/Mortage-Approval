import { FieldDefinition, MortgageApplication } from "@/types";

export const fieldDefinitions: FieldDefinition[] = [
  // Property
  { key: "propertyType", label: "Property Type", hebrewLabel: "סוג דירה", category: "property", required: true },
  { key: "propertyPurpose", label: "Property Purpose", hebrewLabel: "ייעוד הדירה", category: "property", required: true },
  { key: "propertyCity", label: "Property City", hebrewLabel: "עיר הדירה", category: "property", required: true },
  { key: "purchasePrice", label: "Purchase Price", hebrewLabel: "מחיר רכישה", category: "property", required: true },
  { key: "requestedAmount", label: "Requested Mortgage Amount", hebrewLabel: "סכום משכנתא מבוקש", category: "property", required: true },
  { key: "mortgagePeriodYears", label: "Mortgage Period (Years)", hebrewLabel: "תקופת משכנתא (שנים)", category: "property", required: true },
  { key: "equitySources", label: "Equity Sources", hebrewLabel: "מקורות הון עצמי", category: "property", required: true },
  { key: "hasSignedContract", label: "Contract Signed", hebrewLabel: "האם נחתם חוזה", category: "property", required: true },
  { key: "whenNeedMoney", label: "When Need Money", hebrewLabel: "מתי צריכים את הכסף", category: "property", required: true },

  // Personal
  { key: "firstName", label: "First Name", hebrewLabel: "שם פרטי", category: "personal", required: true },
  { key: "lastName", label: "Last Name", hebrewLabel: "שם משפחה", category: "personal", required: true },
  { key: "idNumber", label: "ID Number", hebrewLabel: "תעודת זהות", category: "personal", required: true },
  { key: "phone", label: "Phone", hebrewLabel: "טלפון", category: "personal", required: true },
  { key: "email", label: "Email", hebrewLabel: "אימייל", category: "personal", required: true },
  { key: "gender", label: "Gender", hebrewLabel: "מין", category: "personal", required: true },
  { key: "privacyConsent", label: "Privacy Consent", hebrewLabel: "אישור הגנת פרטיות", category: "personal", required: true },
  { key: "address", label: "Address", hebrewLabel: "כתובת מגורים", category: "personal", required: true },
  { key: "dateOfBirth", label: "Date of Birth", hebrewLabel: "תאריך לידה", category: "personal", required: true },
  { key: "countryOfBirth", label: "Country of Birth", hebrewLabel: "ארץ לידה", category: "personal", required: true },
  { key: "hasAdditionalCitizenship", label: "Additional Citizenship", hebrewLabel: "אזרחות/תושבות מס נוספת", category: "personal", required: true },
  { key: "additionalCitizenshipCountry", label: "Additional Citizenship Country", hebrewLabel: "מדינת אזרחות נוספת", category: "personal", required: false, conditionalOn: { field: "hasAdditionalCitizenship", value: true } },

  // Family
  { key: "maritalStatus", label: "Marital Status", hebrewLabel: "מצב משפחתי", category: "family", required: true },
  { key: "hasChildrenUnder21", label: "Children Under 21", hebrewLabel: "ילדים עד גיל 21", category: "family", required: true },
  { key: "childrenDetails", label: "Children Details", hebrewLabel: "פרטי ילדים (כמה וגילאים)", category: "family", required: false, conditionalOn: { field: "hasChildrenUnder21", value: true } },
  { key: "childrenInCustody", label: "Children in Custody", hebrewLabel: "האם הילדים בחזקתך", category: "family", required: false, conditionalOn: { field: "hasChildrenUnder21", value: true } },

  // Partner
  { key: "partnerFullName", label: "Partner Full Name", hebrewLabel: "שם מלא בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerGender", label: "Partner Gender", hebrewLabel: "מין בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerIdNumber", label: "Partner ID", hebrewLabel: "ת״ז בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerPhone", label: "Partner Phone", hebrewLabel: "טלפון בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerDateOfBirth", label: "Partner DOB", hebrewLabel: "תאריך לידה בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerCountryOfBirth", label: "Partner Country of Birth", hebrewLabel: "ארץ לידה בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerHasAdditionalCitizenship", label: "Partner Additional Citizenship", hebrewLabel: "אזרחות נוספת בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "propertyRegisteredUnderPartner", label: "Property Under Partner", hebrewLabel: "רישום הדירה על שם בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },
  { key: "partnerHasNonSharedChildren", label: "Partner Non-shared Children", hebrewLabel: "ילדים לא משותפים של בן/בת זוג", category: "partner", required: false, conditionalOn: { field: "maritalStatus", value: "married" } },

  // Additional Borrowers
  { key: "hasAdditionalBorrowers", label: "Additional Borrowers", hebrewLabel: "לווים נוספים", category: "borrowers", required: true },

  // Employment
  { key: "isEmployed", label: "Employed", hebrewLabel: "עובד/ת", category: "employment", required: true },
  { key: "employmentType", label: "Employment Type", hebrewLabel: "סוג העסקה", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "profession", label: "Profession", hebrewLabel: "מקצוע", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "employerName", label: "Employer Name", hebrewLabel: "שם המעסיק", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "isSpecialProfession", label: "Special Profession", hebrewLabel: "מקצוע מיוחד (שירותי מטבע, יהלומנות וכו׳)", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "workStartDate", label: "Work Start Date", hebrewLabel: "מועד תחילת עבודה", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "workAddress", label: "Work Address", hebrewLabel: "כתובת מקום עבודה", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "averageMonthlyNetSalary", label: "Monthly Net Salary", hebrewLabel: "שכר חודשי ממוצע נטו", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "isOnMaternityLeave", label: "On Maternity Leave", hebrewLabel: "בחופשת לידה", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "hasAdditionalWorkSource", label: "Additional Work Source", hebrewLabel: "מקור עבודה נוסף", category: "employment", required: false, conditionalOn: { field: "isEmployed", value: true } },
  { key: "hasAdditionalIncome", label: "Additional Income", hebrewLabel: "הכנסות נוספות", category: "financial", required: true },
  { key: "additionalIncomeSource", label: "Additional Income Source", hebrewLabel: "מקור הכנסה נוספת", category: "financial", required: false, conditionalOn: { field: "hasAdditionalIncome", value: true } },
  { key: "additionalIncomeAmount", label: "Additional Income Amount", hebrewLabel: "סכום הכנסה נוספת", category: "financial", required: false, conditionalOn: { field: "hasAdditionalIncome", value: true } },

  // Obligations
  { key: "hasObligations", label: "Has Obligations", hebrewLabel: "התחייבויות קיימות", category: "financial", required: true },
  { key: "obligations", label: "Obligations Details", hebrewLabel: "פירוט התחייבויות", category: "financial", required: false, conditionalOn: { field: "hasObligations", value: true } },
];

/**
 * Calculates which fields are currently required based on the application state.
 * Conditional fields become required when their condition is met.
 */
export function getRequiredFields(application: MortgageApplication): FieldDefinition[] {
  return fieldDefinitions.filter((field) => {
    if (field.required) return true;
    if (field.conditionalOn) {
      const parentValue = application[field.conditionalOn.field];
      if (field.conditionalOn.value === "married") {
        return parentValue === "married" || parentValue === "common_law";
      }
      return parentValue === field.conditionalOn.value;
    }
    return false;
  });
}

export function calculateProgress(application: MortgageApplication): {
  filled: number;
  total: number;
  percentage: number;
  missingFields: FieldDefinition[];
} {
  const required = getRequiredFields(application);
  const filled = required.filter((field) => {
    const value = application[field.key];
    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    return true;
  });

  const missingFields = required.filter(
    (field) => !filled.find((f) => f.key === field.key)
  );

  return {
    filled: filled.length,
    total: required.length,
    percentage: required.length > 0 ? Math.round((filled.length / required.length) * 100) : 0,
    missingFields,
  };
}
