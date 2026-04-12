import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "אישור עקרוני | פועלים משכנתאות",
  description:
    "צ׳אט חכם ליעוץ משכנתא — קבלו המלצות מותאמות אישית והגישו בקשה בקלות",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-poalim-grayBg overflow-hidden h-screen h-[100dvh]">{children}</body>
    </html>
  );
}
