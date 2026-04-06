import { MortgageApplication } from "@/types";
import { calculateProgress } from "./mortgage-fields";

export function buildSystemPrompt(
  currentData: MortgageApplication
): string {
  const { filled, total, missingFields } = calculateProgress(currentData);
  const missingLabels = missingFields.map((f) => f.hebrewLabel).join(", ");

  const currentDataJson = Object.keys(currentData).length > 0
    ? `\nנתונים שכבר נאספו: ${JSON.stringify(currentData, null, 0)}`
    : "";

  return `יועץ משכנתאות של בנק הפועלים. דבר בעברית, ידידותי ומקצועי. שאל 1-2 שאלות בהודעה. חלץ מידע מהשיחה וקרא ל-update_application_data.

שדות לאסוף:
נכס: סוג(חדשה/מחיר למשתכן/יד שנייה), ייעוד(יחידה/חליפית/השקעה), עיר, מחיר, סכום מבוקש(מקס 75%ראשונה/70%חליפית/50%השקעה), תקופה, הון עצמי(מקור+סכום), חוזה נחתם?, מתי כסף(חודש/3חודשים/3+)
אישי: שם פרטי, משפחה, ת"ז, טלפון, מייל, מין, פרטיות("אני מאשר/ת שהמידע ישמש לבחינת בקשת המשכנתא בלבד"), כתובת, ת.לידה, ארץ לידה, אזרחות נוספת?
משפחתי: מצב(רווק/נשוי/גרוש/אלמן/ידוע בציבור), ילדים<21?(כמה+גילאים), בחזקתך?
בן/בת זוג(אם נשוי/ידוע): שם, מין, ת"ז, טלפון, ת.לידה, ארץ, אזרחות נוספת, כתובת(אם שונה), רישום דירה על שמו?, ילדים לא משותפים?
לווים נוספים?: פרטים מלאים
תעסוקה: עובד?, סוג(שכיר/עצמאי/שכיר בעל חברה), מקצוע, מעסיק, מקצוע מיוחד?(מט"ח,יהלומנות,מזון,פיצוציה,רכבים,ביטחוני,אופציות,ציבור), תחילת עבודה, כתובת עבודה, שכר נטו, חל"ד?, עבודה נוספת?, הכנסות נוספות?(מקור+סכום)
התחייבויות: יש?(לאן+כמה)

מצב: ${filled}/${total} שדות מולאו.
${missingLabels ? `חסר: ${missingLabels}` : "הכל מולא!"}${currentDataJson}

כללים:
- קרא ל-update_application_data כשמזהה מידע חדש
- אל תשאל מידע שכבר יש
- כשהכל מולא: סיכום + שליחה
- היה קצר וענייני בתשובות
- **קריטי**: בכל הודעה שאל שאלה אחת בלבד. אם השאלה סגורה - קרא ל-suggest_quick_replies. אם פתוחה - לא.
- לעולם אל תשאל שאלה פתוחה ושאלה סגורה באותה הודעה.
- שאלות סגורות (עם כפתורים): סוג דירה, ייעוד, מין, מצב משפחתי, סוג העסקה, כן/לא, מתי צריכים כסף, אישורים, מקצוע מיוחד, חוזה נחתם, לווים נוספים, ילדים בחזקה, רישום על שם זוג
- שאלות פתוחות (בלי כפתורים): עיר, מחיר, סכום, שמות, ת"ז, טלפון, מייל, כתובות, מקצוע, מעסיק, הון עצמי, שכר, גילאי ילדים, תאריכים, ארץ לידה`;
}

export const QUICK_REPLIES_TOOL = {
  name: "suggest_quick_replies",
  description:
    "הצג כפתורי בחירה מהירה ללקוח. קרא לכלי זה כל פעם ששואלים שאלה סגורה (כן/לא, בחירה מרשימה, וכו׳). הכפתורים יופיעו מתחת להודעה.",
  input_schema: {
    type: "object" as const,
    properties: {
      replies: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: {
              type: "string",
              description: "הטקסט שיופיע על הכפתור",
            },
            value: {
              type: "string",
              description: "הערך שיישלח כהודעה כשלוחצים",
            },
          },
          required: ["label", "value"],
        },
        description: "רשימת כפתורי הבחירה",
      },
    },
    required: ["replies"],
  },
};

export const TOOL_DEFINITION = {
  name: "update_application_data",
  description:
    "עדכון נתוני בקשת המשכנתא. קרא לכלי זה כל פעם שזיהית מידע חדש מהודעת הלקוח. עדכן רק שדות שיש לגביהם מידע חדש.",
  input_schema: {
    type: "object" as const,
    properties: {
      propertyType: {
        type: "string",
        enum: ["new", "price_for_resident", "second_hand"],
        description: "סוג הנכס: חדש, מחיר למשתכן, יד שנייה",
      },
      propertyPurpose: {
        type: "string",
        enum: ["primary", "alternative", "investment"],
        description: "ייעוד: דירה יחידה/עיקרית, חליפית, להשקעה",
      },
      propertyCity: {
        type: "string",
        description: "עיר הנכס",
      },
      purchasePrice: {
        type: "number",
        description: "מחיר רכישה בש״ח",
      },
      requestedAmount: {
        type: "number",
        description: "סכום משכנתא מבוקש בש״ח",
      },
      mortgagePeriodYears: {
        type: "number",
        description: "תקופת המשכנתא בשנים",
      },
      equitySources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: { type: "string", description: "מקור ההון" },
            amount: { type: "number", description: "סכום בש״ח" },
          },
          required: ["source", "amount"],
        },
        description: "מקורות הון עצמי",
      },
      hasSignedContract: {
        type: "boolean",
        description: "האם נחתם חוזה רכישה",
      },
      whenNeedMoney: {
        type: "string",
        enum: ["up_to_month", "up_to_3_months", "more_than_3_months"],
        description: "מתי צריכים את הכסף",
      },
      firstName: { type: "string", description: "שם פרטי" },
      lastName: { type: "string", description: "שם משפחה" },
      idNumber: { type: "string", description: "מספר ת״ז" },
      phone: { type: "string", description: "מספר טלפון" },
      email: { type: "string", description: "כתובת אימייל" },
      gender: {
        type: "string",
        enum: ["male", "female"],
        description: "מין",
      },
      privacyConsent: {
        type: "boolean",
        description: "אישור הגנת פרטיות",
      },
      address: { type: "string", description: "כתובת מגורים" },
      dateOfBirth: {
        type: "string",
        description: "תאריך לידה (DD/MM/YYYY)",
      },
      countryOfBirth: { type: "string", description: "ארץ לידה" },
      hasAdditionalCitizenship: {
        type: "boolean",
        description: "האם יש אזרחות/תושבות מס נוספת",
      },
      additionalCitizenshipCountry: {
        type: "string",
        description: "מדינת אזרחות נוספת",
      },
      maritalStatus: {
        type: "string",
        enum: ["single", "married", "divorced", "widowed", "common_law"],
        description: "מצב משפחתי",
      },
      hasChildrenUnder21: {
        type: "boolean",
        description: "האם יש ילדים מתחת לגיל 21",
      },
      childrenDetails: {
        type: "array",
        items: {
          type: "object",
          properties: {
            age: { type: "number", description: "גיל הילד" },
          },
          required: ["age"],
        },
        description: "גילאי הילדים",
      },
      childrenInCustody: {
        type: "boolean",
        description: "האם הילדים בחזקתך",
      },
      partnerFullName: { type: "string", description: "שם מלא בן/בת זוג" },
      partnerGender: {
        type: "string",
        enum: ["male", "female"],
        description: "מין בן/בת זוג",
      },
      partnerIdNumber: { type: "string", description: "ת״ז בן/בת זוג" },
      partnerPhone: { type: "string", description: "טלפון בן/בת זוג" },
      partnerDateOfBirth: {
        type: "string",
        description: "תאריך לידה בן/בת זוג",
      },
      partnerCountryOfBirth: {
        type: "string",
        description: "ארץ לידה בן/בת זוג",
      },
      partnerHasAdditionalCitizenship: {
        type: "boolean",
        description: "אזרחות נוספת בן/בת זוג",
      },
      partnerAdditionalCitizenshipCountry: {
        type: "string",
        description: "מדינת אזרחות נוספת בן/בת זוג",
      },
      partnerAddress: {
        type: "string",
        description: "כתובת בן/בת זוג (רק אם שונה)",
      },
      propertyRegisteredUnderPartner: {
        type: "boolean",
        description: "רישום הנכס על שם בן/בת זוג",
      },
      partnerHasNonSharedChildren: {
        type: "boolean",
        description: "לבן/בת הזוג ילדים לא משותפים",
      },
      hasAdditionalBorrowers: {
        type: "boolean",
        description: "האם יש לווים נוספים",
      },
      additionalBorrowers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            fullName: { type: "string" },
            gender: { type: "string" },
            idNumber: { type: "string" },
            phone: { type: "string" },
            dateOfBirth: { type: "string" },
            countryOfBirth: { type: "string" },
            hasAdditionalCitizenship: { type: "boolean" },
            additionalCitizenshipCountry: { type: "string" },
            address: { type: "string" },
            propertyRegisteredUnderThem: { type: "boolean" },
          },
          required: ["fullName", "idNumber"],
        },
        description: "פרטי לווים נוספים",
      },
      isEmployed: { type: "boolean", description: "האם עובד/ת" },
      employmentType: {
        type: "string",
        enum: ["employee", "self_employed", "employee_company_owner"],
        description: "סוג העסקה",
      },
      profession: { type: "string", description: "מקצוע" },
      employerName: { type: "string", description: "שם המעסיק" },
      isSpecialProfession: {
        type: "boolean",
        description: "מקצוע מיוחד (שירותי מטבע, יהלומנות וכו׳)",
      },
      specialProfessionType: {
        type: "string",
        description: "סוג המקצוע המיוחד",
      },
      workStartDate: { type: "string", description: "מועד תחילת עבודה" },
      workAddress: { type: "string", description: "כתובת מקום העבודה" },
      averageMonthlyNetSalary: {
        type: "number",
        description: "שכר חודשי ממוצע נטו בש״ח",
      },
      isOnMaternityLeave: {
        type: "boolean",
        description: "בחופשת לידה",
      },
      hasAdditionalWorkSource: {
        type: "boolean",
        description: "מקור עבודה נוסף",
      },
      additionalWorkDetails: {
        type: "string",
        description: "פרטי מקור עבודה נוסף",
      },
      hasAdditionalIncome: {
        type: "boolean",
        description: "הכנסות נוספות",
      },
      additionalIncomeSource: {
        type: "string",
        description: "מקור הכנסה נוספת",
      },
      additionalIncomeAmount: {
        type: "number",
        description: "סכום הכנסה נוספת חודשית בש״ח",
      },
      hasObligations: {
        type: "boolean",
        description: "האם יש התחייבויות",
      },
      obligations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string", description: "תיאור ההתחייבות" },
            monthlyAmount: {
              type: "number",
              description: "סכום חודשי בש״ח",
            },
          },
          required: ["description", "monthlyAmount"],
        },
        description: "פרטי התחייבויות",
      },
    },
    required: [],
  },
};
