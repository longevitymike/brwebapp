{{ /* Replace entire file content below with onboarding wizard */ }}
"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { OnboardingStepCard, OnboardingComplete } from '@/components/AuthAndOnboardingUpgrades';

const STEPS = [
  { key: 'name', type: 'text', question: "Let’s get started! What’s your child’s first name?", placeholder: "Child’s Name" },
  { key: 'gender', type: 'choice', question: "Is your child a boy or a girl?", options: ["Boy", "Girl"] },
  { key: 'ageGroup', type: 'choice', question: "Which age group does your child belong to?", options: ["5–7", "8–11", "12–14", "15–16"] },
  { key: 'sport', type: 'choice', question: "What is your child’s primary sport or activity?", options: ["Running","Basketball","Soccer","Tennis","Gymnastics","Dance","Martial Arts","Other"] },
  { key: 'goal', type: 'choice', question: "What is the main goal for your athlete with this program?", options: ["Improve Performance","Prevent Injuries","Increase Speed & Agility","Enhance Balance","General Foot Health"] },
  { key: 'injury', type: 'choice', question: "Has your child experienced any foot or ankle issues before?", options: ["No issues","Plantar Fasciitis","Achilles Tendonitis","Ankle Sprains","Bunions","Other"] },
  { key: 'inSeason', type: 'choice', question: "Is your child currently in their competitive season?", options: ["Yes, in season","No, off season"] },
  { key: 'final', type: 'final', title: "You’re all set! 🎉", subtitle: "Thanks for sharing! Let’s begin your child’s first session.", buttonLabel: "Start Now 🚀" }
];

type StepType = typeof STEPS[number];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const next = async () => {
    if (!isLast) setStep(s => s + 1);
    else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            email: user.email,
            ...answers,
            onboarding_complete: true,
            updated_at: new Date().toISOString(),
          })
          .throwOnError();
      }
      navigate('/dashboard', { replace: true });
    }
  };

  const record = (val: string) => setAnswers(a => ({ ...a, [current.key]: val }));

  if (current.type === 'final') {
    return <OnboardingComplete />;
  }

  return (
    <OnboardingStepCard
      title={current.type === 'final' ? current.title : current.question}
      description={current.type === 'final' ? current.subtitle : current.question}
      progress={progress}
      onNext={next}
    >
      {current.type === 'text' ? (
        <input
          type="text"
          placeholder={(current as any).placeholder}
          value={answers[current.key] || ''}
          onChange={e => record(e.target.value)}
          className="w-full bg-white/90 rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ) : (
        (current as any).options?.map((opt: string) => {
          const sel = answers[current.key] === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => record(opt)}
              className={
                `w-full text-center px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 ` +
                (sel ? 'bg-primary text-white border-primary' : 'bg-white border-border')
              }
            >
              {opt}
            </button>
          );
        })
      )}
    </OnboardingStepCard>
  );
}