import React from 'react';
import SarathiLogo from '@/components/sarathi-logo';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <h1 className="text-4xl font-extrabold text-[#0A2351] mb-8">About SARATHI</h1>

          {/* Full Form Section */}
          <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '20px', borderLeft: '6px solid #0A2351', marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', letterSpacing: '0.1em', marginBottom: '10px' }}>THE FULL FORM</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0A2351', lineHeight: '1.4' }}>
              <span style={{ color: '#F57D14' }}>S</span>tudent <span style={{ color: '#F57D14' }}>A</span>ssessment <span style={{ color: '#F57D14' }}>R</span>oadmap <span style={{ color: '#F57D14' }}>A</span>pplication for <span style={{ color: '#F57D14' }}>T</span>ransformation & <span style={{ color: '#F57D14' }}>H</span>olistic <span style={{ color: '#F57D14' }}>I</span>mprovement
            </h2>
          </div>

          {/* Project Vision */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-[#0A2351] mb-4">Project Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              SARATHI is an AI-driven ecosystem designed to bridge the gap between academic learning and professional success. 
              By combining psychometric science with the power of <strong>Advanced Gemini AI</strong>, we provide students with a clear "True North" for their careers.
            </p>
          </section>

          {/* Pillars Section */}
          <section style={{ marginTop: '40px' }}>
            <h3 className="text-xl font-bold text-[#0A2351] mb-4">Why SARATHI Platform?</h3>
            <p className="text-slate-600 mb-8">
              The SARATHI Platform addresses these challenges through three core pillars:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fcfcfc' }}>
                <h4 style={{ color: '#0A2351', fontWeight: 'bold', marginBottom: '8px' }}>Personalized Roadmaps</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>More than just advice; a week-by-week strategic action plan for the next 5 years.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fcfcfc' }}>
                <h4 style={{ color: '#0A2351', fontWeight: 'bold', marginBottom: '8px' }}>Skill Gap Analysis</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>Identifying exactly what you need to learn today to qualify for your dream career tomorrow.</p>
              </div>

              <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fcfcfc' }}>
                <h4 style={{ color: '#0A2351', fontWeight: 'bold', marginBottom: '8px' }}>Data-Driven Decisions</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>Removing the guesswork from career planning using psychometric science and AI.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
