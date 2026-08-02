import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZJDVM7SR0H"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-ZJDVM7SR0H');
</script>
// ── Replace these with your real IDs ──────────────────────────────────────
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const BASE_URL = "https://chobiclear.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ChobiClear – Free Background Remover Online | Bangladesh",
    template: "%s | ChobiClear",
  },
  description:
    "Remove image backgrounds instantly for free — no signup needed. The fastest online background remover for photos. ছবির ব্যাকগ্রাউন্ড ফ্রিতে রিমুভ করুন।",
  keywords: [
    "remove background from image free",
    "bg remover online",
    "photo background remover Bangladesh",
    "background remover free",
    "remove bg online",
    "image background eraser",
    "transparent background maker",
    "ছবির ব্যাকগ্রাউন্ড রিমুভ",
    "বিজি রিমুভ",
    "ছবি থেকে ব্যাকগ্রাউন্ড সরানো",
    "ব্যাকগ্রাউন্ড রিমুভ ফ্রি",
    "ChobiClear",
  ],
  authors: [{ name: "ChobiClear", url: BASE_URL }],
  creator: "ChobiClear",
  publisher: "ChobiClear",
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-BD": BASE_URL,
      "bn-BD": `${BASE_URL}/bn`,
    },
  },
  openGraph: {
    title: "ChobiClear – Free Background Remover Online | Bangladesh",
    description:
      "Remove image backgrounds instantly for free. No signup. ছবির ব্যাকগ্রাউন্ড ফ্রিতে রিমুভ করুন।",
    url: BASE_URL,
    siteName: "ChobiClear",
    locale: "en_BD",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ChobiClear – Free Background Remover for Photos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChobiClear – Free Background Remover Online",
    description: "Remove image backgrounds instantly for free. No signup required.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification token here
    // google: "your-google-verification-token",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": BASE_URL,
      name: "ChobiClear",
      url: BASE_URL,
      description:
        "Free online background remover for photos. Remove image backgrounds instantly using AI — no signup required.",
      applicationCategory: "PhotographyApplication",
      operatingSystem: "Web Browser",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "BDT",
          description: "Up to 10 images/day, watermarked downloads",
        },
        {
          "@type": "Offer",
          name: "100 Image Pack",
          price: "199",
          priceCurrency: "BDT",
          description: "100 HD clean downloads, credits never expire",
        },
        {
          "@type": "Offer",
          name: "Monthly Unlimited",
          price: "299",
          priceCurrency: "BDT",
          description: "Unlimited images per month, no watermark",
        },
      ],
      featureList: [
        "AI-powered background removal",
        "Transparent PNG output",
        "No signup required",
        "Files auto-deleted after 60 minutes",
        "Mobile responsive",
        "Bilingual English and Bengali interface",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is ChobiClear completely free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! You can remove backgrounds from up to 10 images per day for free without any signup. Free downloads include a watermark. Purchase a plan for clean HD downloads.",
          },
        },
        {
          "@type": "Question",
          name: "ছবির ব্যাকগ্রাউন্ড রিমুভ করতে কি সাইন আপ লাগে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "না, ফ্রি প্ল্যানে কোনো সাইন আপের প্রয়োজন নেই। শুধু ছবি আপলোড করুন এবং সঙ্গে সঙ্গে ব্যাকগ্রাউন্ড রিমুভ হয়ে যাবে।",
          },
        },
        {
          "@type": "Question",
          name: "How long are my images stored?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All uploaded and processed images are automatically deleted from our servers after 60 minutes. We never use your images for training or share them with third parties.",
          },
        },
        {
          "@type": "Question",
          name: "What payment methods are accepted?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We accept bKash, Nagad, Rocket, Visa, and Mastercard via SSLCommerz — the most trusted payment gateway in Bangladesh.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#00C9A7" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google AdSense — replace ca-pub-XXXXXXXXXXXXXXXX with your ID */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
        {/* Google Analytics 4 — replace G-XXXXXXXXXX with your measurement ID */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
      </body>
    </html>
  );
}
