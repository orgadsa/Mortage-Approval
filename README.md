# יועץ המשכנתא — Smart Mortgage Advisor Chat

A smart Hebrew chatbot for mortgage advisory, powered by Claude (Anthropic). The chatbot guides users through a complete mortgage application process via natural conversation, collecting all required fields while providing professional advice.

## Features

- **Smart Chat**: AI-powered conversational interface that naturally collects required application data
- **Hebrew RTL**: Full Hebrew interface with right-to-left layout
- **Progress Tracking**: Real-time progress bar showing how many required fields have been filled
- **Field Extraction**: Claude automatically extracts structured data from free-form conversation
- **Conditional Fields**: Smart field requirements (e.g., partner details only asked if married)
- **Summary Screen**: Complete summary of all collected data
- **PDF Export**: Download application details as PDF
- **CSV Storage**: Applications saved to CSV for data management

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude** (Sonnet) for AI chat
- **jsPDF + html2canvas** for PDF generation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Data Collection

The chatbot collects the following categories of information through natural conversation:

| Category | Fields |
|----------|--------|
| Property | Type, purpose, city, price, mortgage amount, period, equity sources, contract status, timeline |
| Personal | Name, ID, phone, email, gender, privacy consent, address, DOB, country, citizenship |
| Family | Marital status, children details, custody |
| Partner | Full details if married/common-law |
| Employment | Status, type, profession, employer, salary, special professions, maternity leave |
| Financial | Additional income, obligations, additional borrowers |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Chat API (Claude integration)
│   │   └── submit/route.ts    # Submit application (CSV save)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatInterface.tsx       # Main chat component
│   ├── ChatMessage.tsx         # Message bubble
│   ├── ProgressBar.tsx         # Progress indicator
│   ├── SummaryScreen.tsx       # Summary + PDF export
│   └── TypingIndicator.tsx     # Typing animation
├── lib/
│   ├── csv-store.ts            # CSV storage utility
│   ├── mortgage-fields.ts      # Field definitions & validation
│   └── system-prompt.ts        # Claude system prompt & tools
└── types/
    └── index.ts                # TypeScript type definitions
```
