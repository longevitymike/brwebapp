
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import MascotPopup from '../components/mascot/MascotPopup';
import Help from '../components/help/Help';

const HelpPage = () => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showMascot, setShowMascot] = useState(false);
  
  // Toggle mascot after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowMascot(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const faqSections = [
    {
      id: 'getting-started',
      title: '🏁 Getting Started',
      questions: [
        { q: 'How do I start my first workout?', a: 'Go to the Dashboard and click on the workout card for today.' },
        { q: 'How often should I train?', a: 'For best results, follow the schedule of 3-4 workouts per week.' }
      ]
    },
    {
      id: 'account',
      title: '💳 Account & Payments',
      questions: [
        { q: 'How do I update my email?', a: 'Head to Account settings to update your personal information.' },
        { q: 'Is there a family plan?', a: 'Yes! You can add multiple children under a single parent account.' }
      ]
    },
    {
      id: 'troubleshooting',
      title: '🔧 Troubleshooting',
      questions: [
        { q: 'My workout isn\'t loading', a: 'Try refreshing the page or checking your internet connection.' },
        { q: 'I can\'t see my progress', a: 'Make sure you\'ve completed at least one workout to see progress.' }
      ]
    },
    {
      id: 'program',
      title: '📦 Program Questions',
      questions: [
        { q: 'How long is the program?', a: 'The standard program runs for 8 weeks with progressive difficulty.' },
        { q: 'Can I skip ahead?', a: 'We recommend following the structured program for best results.' }
      ]
    }
  ];

  const toggleSection = (id: string) => {
    if (activeFaq === id) {
      setActiveFaq(null);
    } else {
      setActiveFaq(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Help & Support</h1>
      
      <div className="card p-4">
        <p className="mb-6">Find answers to frequently asked questions below. Can't find what you're looking for? Contact our support team.</p>
        
        <div className="space-y-4">
          {faqSections.map(section => (
            <div key={section.id} className="border border-border rounded-lg overflow-hidden">
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center p-4 text-left font-medium bg-background/50 hover:bg-background/80"
              >
                <span>{section.title}</span>
                <ChevronRight className={`transform transition-transform ${activeFaq === section.id ? 'rotate-90' : ''} w-5 h-5`} />
              </button>
              
              {activeFaq === section.id && (
                <div className="p-4 bg-background/20">
                  <ul className="space-y-4">
                    {section.questions.map((item, idx) => (
                      <li key={idx}>
                        <p className="font-medium mb-1">{item.q}</p>
                        <p className="text-muted-foreground">{item.a}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
          <p className="text-lg font-medium mb-2">AI Coach Coming Soon! 🧠</p>
          <p className="text-muted-foreground">Get personalized training advice and answers to all your questions.</p>
        </div>
      </div>
      
      <MascotPopup show={showMascot} />
    </div>
  );
};

export default HelpPage;
