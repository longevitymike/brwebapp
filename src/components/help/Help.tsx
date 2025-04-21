import React from 'react';
import { Disclosure } from '@headlessui/react';
// Note: Heroicons v2 uses outline/solid imports differently
// Using outline for ChevronUpIcon as solid might not be directly available this way
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const helpSections = [
  {
    title: "🏁 Getting Started",
    faqs: [
      { q: "How do I start my workout?", a: 'Simply tap "Start Workout" on the home screen - your daily session is ready to go!' },
      { q: "What equipment is needed?", a: "Just your body, bare feet, and enough space to move around. No special gear required!" },
      { q: "Is this safe for my child to use independently?", a: "Yes! All workouts are video-guided and designed to be safe. Younger children (under 10) might need help initially to understand proper form." },
      { q: "How much time should we set aside?", a: "Each workout takes only 15 minutes - perfect for busy schedules!" },
    ],
  },
  {
    title: "💳 Account & Payments",
    faqs: [
      { q: "Is this a subscription or one-time purchase?", a: "One-time payment gives you full access to the 30-day program. No hidden fees or subscriptions!" },
      { q: "Can multiple children use one account?", a: "Each purchase covers one child. For siblings, contact us about our family bundle discount." },
      { q: "How do I reset my login access?", a: 'Click "Forgot Email" on the login screen or email support@barefootreset.com for a new magic link.' },
      { q: "Do you offer refunds?", a: "Yes! If you're not satisfied within 14 days, we offer a full refund - no questions asked." },
    ],
  },
  {
    title: "🛠 Troubleshooting",
    faqs: [
      { q: "Videos aren't loading properly", a: "Try refreshing or switching browsers/devices." },
      { q: "My progress isn't saving", a: 'Make sure to tap "Mark Complete". If it continues, email us!' },
      { q: "I can't access my account", a: "Email support@barefootreset.com with your login email." },
      { q: "Can I download videos for offline use?", a: "Not yet, but we’re working on it!" },
    ],
  },
  {
    title: "📦 Program Questions",
    faqs: [
      { q: "Can this help with flat feet or foot/ankle pain?", a: "Yes! This program strengthens the foot-ankle complex." },
      { q: "Is this only for serious athletes?", a: "Nope! It’s great for all kids building coordination and balance." },
      { q: "Can we pause and resume the program?", a: "Yes, progress is saved!" },
      { q: "Will we see actual results?", a: "Most parents see improvements in 2–3 weeks of consistent practice." },
    ],
  },
  {
    title: "🧠 AI Coach (Coming Soon)",
    faqs: [
      { q: "What is the AI Coach?", a: "A smart buddy who guides your athlete through training. Launching soon!" }
    ],
  },
];

// Renamed component to match filename convention
export default function Help() {
  return (
    // Removed outer bg-white and max-width, assuming parent container handles this
    <div className="w-full space-y-4">
      {helpSections.map((section) => (
        <div key={section.title}>
          {/* Section Title (Optional, can be removed if SettingsPage title is sufficient) */}
          {/* <h3 className="text-lg font-bold text-gray-800 mb-2">{section.title}</h3> */}
          {section.faqs.map((faq, idx) => (
            <Disclosure key={idx} as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                    <span>{faq.q}</span>
                    <ChevronUpIcon className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-blue-500 transition-transform duration-200`} />
                  </Disclosure.Button>
                  {/* Added transition to panel */}
                  <Disclosure.Panel className="px-4 pt-3 pb-2 text-sm text-gray-600 transition-all duration-300 ease-in-out origin-top data-[closed]:scale-y-0 data-[closed]:opacity-0">
                    {faq.a}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      ))}
    </div>
  );
}
