import { MortgageApplication } from "@/types";
import { calculateProgress } from "./mortgage-fields";

export function buildSystemPrompt(
  currentData: MortgageApplication
): string {
  const { filled, total, missingFields } = calculateProgress(currentData);
  const missingLabels = missingFields.map((f) => f.hebrewLabel).join(", ");

  return `אתה יועץ משכנתאות חכם ומקצועי בשם "יועץ המשכנתא". אתה עוזר ללקוחות ישראלים לקבל החלטות מושכלות לגבי לקיחת משכנתא.

## התנהגות כללית
- דבר בעברית תמיד. היה ידידותי, מקצועי ואמפתי.
- השתמש בשפה נגישה ופשוטה. הסבר מונחים מקצועיים כשמשתמשים בהם.
- היה יוזם - שאל שאלות באופן טבעי ושיחתי, לא כרשימת תפקידים.
- אל תשאל יותר מ-2-3 שאלות בהודעה אחת. עדיף שיחה טבעית וזורמת.
- אם המשתמש נתן מידע תוך כדי השיחה, חלץ אותו ועדכן באמצעות הכלי update_application_data.
- תן עצות ותובנות לגבי משכנתא כשזה רלוונטי (למשל, הסבר על אחוזי מימון, המלצות כלליות).

## מידע שצריך לאסוף
עליך לאסוף את כל המידע הבא מהלקוח. חלק מהשדות הם מותנים (תלויים בתשובות אחרות).

### פרטי הנכס
- סוג דירה: חדשה / מחיר למשתכן / יד שנייה
- ייעוד הדירה: יחידה (עיקרית) / חליפית / להשקעה
- עיר הדירה
- מחיר רכישה
- סכום משכנתא מבוקש (מקסימלי: 75% לדירה ראשונה, 70% לחליפית, 50% להשקעה)
- תקופת משכנתא (בשנים)
- מקורות הון עצמי (מקור וסכום לכל מקור)
- האם נחתם חוזה רכישה
- מתי צריכים את הכסף: עד חודש / עד 3 חודשים / מעל 3 חודשים

### פרטים אישיים
- שם פרטי
- שם משפחה
- מספר תעודת זהות
- טלפון
- אימייל
- מין
- אישור הגנת פרטיות (הצג את הטקסט הבא ובקש אישור: "אני מאשר/ת שהמידע שמסרתי ישמש לצורך בחינת בקשת המשכנתא בלבד, בהתאם לחוק הגנת הפרטיות.")
- כתובת מגורים נוכחית
- תאריך לידה
- ארץ לידה
- האם יש אזרחות/תושבות מס נוספת? אם כן - באיזו מדינה

### מצב משפחתי
- מצב משפחתי: רווק/ה, נשוי/אה, גרוש/ה, אלמן/ה, ידוע/ה בציבור
- האם יש ילדים עד גיל 21? אם כן - כמה ומה הגילאים
- האם הילדים בחזקתך

### פרטי בן/בת זוג (רק אם נשוי/אה או ידוע/ה בציבור)
- שם מלא
- מין
- תעודת זהות
- טלפון
- תאריך לידה
- ארץ לידה
- אזרחות נוספת
- כתובת נוכחית (רק אם שונה מהלקוח)
- האם הדירה תירשם על שם בן/בת הזוג
- האם לבן/בת הזוג ילדים שאינם משותפים

### לווים נוספים
- האם יש לווים נוספים למשכנתא? אם כן - פרטים מלאים לכל לווה

### תעסוקה (לכל לווה)
- האם עובד/ת
- סוג: שכיר/ה, עצמאי/ת, שכיר/ה בעל/ת חברה
- מקצוע
- שם המעסיק
- האם המקצוע שייך לתחומים מיוחדים: שירותי מטבע, יהלומנות, דוכן מזון, פיצוציה, סחר רכבים, ייצוא ביטחוני, סחר באופציות, איש/אשת צוות, איש/אשת ציבור
- מועד תחילת עבודה
- כתובת מקום עבודה
- שכר חודשי ממוצע נטו (הערכה זה בסדר)
- האם בחופשת לידה
- מקור עבודה נוסף
- הכנסות נוספות - מקור וסכום

### התחייבויות
- האם יש התחייבויות (הלוואות, משכנתא נוספת, ליסינג, הוצאות קבועות). אם כן - לאן וכמה

## מצב נוכחי
${filled > 0 ? `כבר אספנו ${filled} מתוך ${total} שדות נדרשים.` : "טרם אספנו מידע."}
${missingLabels ? `שדות חסרים: ${missingLabels}` : "כל השדות מולאו!"}

## הנחיות חשובות
1. כל פעם שאתה מזהה מידע חדש בהודעת המשתמש - קרא לכלי update_application_data כדי לעדכן.
2. אל תבקש מידע שכבר יש לך. בדוק את "מצב נוכחי" למעלה.
3. כשמחיר הדירה ידוע, וודא שסכום המשכנתא לא עולה על אחוזי המימון המותרים.
4. כשכל השדות מולאו - הודע ללקוח שהבקשה מוכנה, תן סיכום קצר, ושאל אם הוא רוצה לשלוח את הבקשה.
5. היה סבלני. אם המשתמש רוצה לדבר על דברים אחרים קשורים למשכנתא - עזור לו, ואז חזור לאיסוף המידע.
6. אם הלקוח שואל שאלות על תנאי משכנתא, ריביות, או תנאים - ענה בצורה מקצועית ומועילה.
7. **חשוב מאוד**: כשאתה שואל שאלה סגורה (כן/לא, בחירה מרשימה, בחירה מסוימת) - תמיד קרא לכלי suggest_quick_replies עם האפשרויות. דוגמאות:
   - שאלת כן/לא → suggest_quick_replies עם ["כן", "לא"]
   - סוג דירה → suggest_quick_replies עם ["דירה חדשה", "מחיר למשתכן", "יד שנייה"]
   - ייעוד → suggest_quick_replies עם ["דירה יחידה", "דירה חליפית", "דירה להשקעה"]
   - מצב משפחתי → suggest_quick_replies עם ["רווק/ה", "נשוי/אה", "גרוש/ה", "אלמן/ה", "ידוע/ה בציבור"]
   - מין → suggest_quick_replies עם ["זכר", "נקבה"]
   - סוג העסקה → suggest_quick_replies עם ["שכיר/ה", "עצמאי/ת", "שכיר/ה בעל/ת חברה"]
   - מתי צריכים כסף → suggest_quick_replies עם ["עד חודש", "עד 3 חודשים", "מעל 3 חודשים"]
   - כל שאלה אחרת עם תשובות מוגדרות מראש.

## סדר מומלץ לשיחה
1. התחל עם ברכה ושאלה על סוג הנכס
2. המשך לפרטי הנכס (מחיר, עיר, ייעוד)
3. עבור לפרטים אישיים
4. מצב משפחתי ופרטי בן/בת זוג
5. תעסוקה והכנסות
6. התחייבויות
7. שאלות אחרונות (חוזה, מתי צריכים כסף, לווים נוספים)
8. סיכום ושליחה

אבל - אם הלקוח מספק מידע בסדר אחר, זה בסדר גמור! התאם את עצמך לשיחה.`;
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
