import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "אישור עקרוני | פועלים משכנתאות",
  description:
    "צ׳אט חכם ליעוץ משכנתא — קבלו המלצות מותאמות אישית והגישו בקשה בקלות",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-poalim-grayBg min-h-screen">{children}</body>
    </html>
  );
}
