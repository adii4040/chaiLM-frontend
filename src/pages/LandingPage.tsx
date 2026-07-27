import { useState } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingHero from '../components/landing/LandingHero';
import LandingMockup from '../components/landing/LandingMockup';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingSandbox from '../components/landing/LandingSandbox';
import LandingTechStack from '../components/landing/LandingTechStack';
import LandingCta from '../components/landing/LandingCta';
import LandingFooter from '../components/landing/LandingFooter';
import type { SandboxDemo, InspectorState, SandboxTakeaway } from '../components/landing/types';

const SANDBOX_DEMOS: SandboxDemo[] = [
  {
    id: 'demo_1',
    label: '🎬 AI Systems & Neural Architecture',
    query: 'What are the core bottlenecks in scaling Transformer context windows?',
    summary:
      'The presentation highlights quadratic memory complexity in standard self-attention mechanisms and details memory-efficient KV-cache management.',
    takeaways: [
      {
        text: 'Self-attention matrix computation scales quadratically O(N²) with sequence length, creating severe VRAM bottlenecks during inference.',
        citation: 'Timestamp [00:14:22]',
        type: 'youtube',
        videoId: 'zjkBMFhNj_g',
        timeSec: 862,
      },
      {
        text: 'FlashAttention memory optimizations tile matrix multiplication to reduce SRAM memory access overhead by up to 3x.',
        citation: 'Timestamp [00:32:10]',
        type: 'youtube',
        videoId: 'zjkBMFhNj_g',
        timeSec: 1930,
      },
    ],
  },
  {
    id: 'demo_2',
    label: '📄 Blockchain Property Conveyancing',
    query: 'What are the regulatory and legal challenges of smart contract property transfers?',
    summary:
      'The research identifies user identity verification (e-ID), co-ownership rights in rem, and court-ordered ledger alterations as key legal hurdles in EU property frameworks.',
    takeaways: [
      {
        text: 'Smart contracts automate title transfers, but require verified electronic IDs compliant with national land registry statutes.',
        citation: 'Page [Page 3]',
        type: 'pdf',
        page: 3,
      },
      {
        text: 'Restitution of rights in rem necessitates legal mechanisms for authorized ledger updates under judicial supervision.',
        citation: 'Page [Page 8]',
        type: 'pdf',
        page: 8,
      },
    ],
  },
];

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState<SandboxDemo>(SANDBOX_DEMOS[0]);
  const [activeInspector, setActiveInspector] = useState<InspectorState>({
    type: 'youtube',
    videoId: 'zjkBMFhNj_g',
    timeSec: 862,
    formattedTime: '00:14:22',
    title: 'Transformer Architecture & Scalable Attention Mechanics',
  });

  const handleCitationClick = (takeaway: SandboxTakeaway) => {
    if (takeaway.type === 'youtube') {
      setActiveInspector({
        type: 'youtube',
        videoId: takeaway.videoId || 'zjkBMFhNj_g',
        timeSec: takeaway.timeSec || 0,
        formattedTime: takeaway.citation.replace('Timestamp ', ''),
        title: 'Transformer Architecture & Scalable Attention Mechanics',
      });
    } else {
      setActiveInspector({
        type: 'pdf',
        page: takeaway.page || 1,
        title: 'Legal challenges and opportunities of blockchain.pdf',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-chailm-bg text-chailm-textMain font-sans selection:bg-chailm-accentBlue/20 selection:text-white">
      <LandingHeader />

      <main className="flex-1 space-y-24 pb-20">
        <section className="pt-20 pb-12 px-6 max-w-6xl mx-auto text-center space-y-8">
          <LandingHero />
          <LandingMockup
            activeInspector={activeInspector}
            onSelectInspector={setActiveInspector}
          />
        </section>

        <LandingFeatures />

        <LandingSandbox
          demos={SANDBOX_DEMOS}
          activeDemo={activeDemo}
          onSelectDemo={setActiveDemo}
          onCitationClick={handleCitationClick}
        />

        <LandingTechStack />

        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
