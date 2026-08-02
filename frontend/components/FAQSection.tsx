"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is ChobiClear completely free to use?",
    a: "Yes! You can remove backgrounds from up to 10 images per day for free without any signup. Free downloads include a watermark. Purchase a plan for clean HD downloads.",
  },
  {
    q: "ছবির ব্যাকগ্রাউন্ড রিমুভ করতে কি সাইন আপ লাগে?",
    a: "না, ফ্রি প্ল্যানে কোনো সাইন আপের প্রয়োজন নেই। শুধু ছবি আপলোড করুন এবং সঙ্গে সঙ্গে ব্যাকগ্রাউন্ড রিমুভ হয়ে যাবে।",
  },
  {
    q: "What image formats are supported?",
    a: "ChobiClear supports JPG, PNG, and WebP images up to 10 MB. The output is always a transparent PNG file.",
  },
  {
    q: "How long are my images stored?",
    a: "For your privacy, all uploaded and processed images are automatically deleted from our servers after 60 minutes. We never use your images for training or share them.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept bKash, Nagad, Rocket, Visa, and Mastercard via SSLCommerz — the most trusted payment gateway in Bangladesh.",
  },
  {
    q: "HD ডাউনলোড আর ফ্রি ডাউনলোডের মধ্যে পার্থক্য কী?",
    a: "ফ্রি ডাউনলোডে ওয়াটারমার্ক থাকে এবং সর্বোচ্চ ১২০০px রেজোলিউশন পাওয়া যায়। HD ডাউনলোডে কোনো ওয়াটারমার্ক নেই এবং ছবির পূর্ণ রেজোলিউশন পাওয়া যায়।",
  },
  {
    q: "Can I use ChobiClear for commercial projects?",
    a: "Absolutely! The HD plan includes a commercial-use license. Free tier results are for personal or testing use only.",
  },
  {
    q: "What technology is used to remove backgrounds?",
    a: "ChobiClear uses U²-Net, a state-of-the-art deep learning model specifically trained for accurate salient object detection and background separation.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="section" id="faq" aria-labelledby="faq-heading" style={{ background: "var(--bg-muted)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>FAQ</span>
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <p>Everything you need to know about ChobiClear.</p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${openIndex === i ? " open" : ""}`}
              id={`faq-item-${i}`}
            >
              <button
                className="faq-question"
                id={`faq-q-${i}`}
                aria-expanded={openIndex === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => toggle(i)}
              >
                {faq.q}
                <span className="faq-icon" aria-hidden="true">+</span>
              </button>
              <div
                id={`faq-a-${i}`}
                className="faq-answer"
                style={{ maxHeight: openIndex === i ? 300 : 0 }}
                role="region"
                aria-labelledby={`faq-q-${i}`}
              >
                <p className="faq-answer-inner">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
