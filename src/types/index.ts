export interface EquitySource {
  source: string;
  amount: number;
}

export interface ChildInfo {
  age: number;
}

export interface Obligation {
  description: string;
  monthlyAmount: number;
}

export interface AdditionalBorrower {
  fullName: string;
  gender: string;
  idNumber: string;
  phone: string;
  dateOfBirth: string;
  countryOfBirth: string;
  hasAdditionalCitizenship: boolean;
  additionalCitizenshipCountry?: string;
  address: string;
  propertyRegisteredUnderThem: boolean;
}

export interface MortgageApplication {
  // Property
  propertyType?: string;
  propertyPurpose?: string;
  propertyCity?: string;
  purchasePrice?: number;
  requestedAmount?: number;
  mortgagePeriodYears?: number;
  equitySources?: EquitySource[];
  hasSignedContract?: boolean;
  whenNeedMoney?: string;

  // Personal
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  gender?: string;
  privacyConsent?: boolean;
  address?: string;
  otpVerified?: boolean;
  dateOfBirth?: string;
  countryOfBirth?: string;
  hasAdditionalCitizenship?: boolean;
  additionalCitizenshipCountry?: string;

  // Family
  maritalStatus?: string;
  hasChildrenUnder21?: boolean;
  childrenDetails?: ChildInfo[];
  childrenInCustody?: boolean;

  // Partner
  partnerFullName?: string;
  partnerGender?: string;
  partnerIdNumber?: string;
  partnerPhone?: string;
  partnerDateOfBirth?: string;
  partnerCountryOfBirth?: string;
  partnerHasAdditionalCitizenship?: boolean;
  partnerAdditionalCitizenshipCountry?: string;
  partnerAddress?: string;
  propertyRegisteredUnderPartner?: boolean;
  partnerHasNonSharedChildren?: boolean;

  // Additional Borrowers
  hasAdditionalBorrowers?: boolean;
  additionalBorrowers?: AdditionalBorrower[];

  // Employment
  isEmployed?: boolean;
  employmentType?: string;
  profession?: string;
  employerName?: string;
  isSpecialProfession?: boolean;
  specialProfessionType?: string;
  workStartDate?: string;
  workAddress?: string;
  averageMonthlyNetSalary?: number;
  isOnMaternityLeave?: boolean;
  hasAdditionalWorkSource?: boolean;
  additionalWorkDetails?: string;
  hasAdditionalIncome?: boolean;
  additionalIncomeSource?: string;
  additionalIncomeAmount?: number;

  // Obligations
  hasObligations?: boolean;
  obligations?: Obligation[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface QuickReply {
  label: string;
  value: string;
}

export interface ChatApiResponse {
  message: string;
  updatedFields: Partial<MortgageApplication>;
  progress: number;
  totalRequired: number;
  isComplete: boolean;
  quickReplies?: QuickReply[];
}

export type FieldCategory =
  | "property"
  | "personal"
  | "family"
  | "partner"
  | "borrowers"
  | "employment"
  | "financial";

export interface FieldDefinition {
  key: keyof MortgageApplication;
  label: string;
  hebrewLabel: string;
  category: FieldCategory;
  required: boolean;
  conditionalOn?: {
    field: keyof MortgageApplication;
    value: unknown;
  };
}
