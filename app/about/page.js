export default function AboutPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
      
      {/* Title Section */}
      <h1 style={{ fontSize: '2.8rem', color: '#002D62', marginBottom: '10px' }}>About SARATHI</h1>
      
      {/* Abbreviation Highlight Box */}
      <div style={{ 
        backgroundColor: '#f0f7ff', 
        padding: '20px', 
        borderRadius: '10px', 
        borderLeft: '5px solid #002D62',
        marginBottom: '30px' 
      }}>
        <h2 style={{ fontSize: '1.1rem', color: '#555', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
          The Full Form
        </h2>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#002D62', margin: 0 }}>
          <span style={{color: '#e67e22'}}>S</span>tudent 
          <span style={{color: '#e67e22'}}> A</span>ssessment 
          <span style={{color: '#e67e22'}}> R</span>oadmap 
          <span style={{color: '#e67e22'}}> A</span>pplication for 
          <span style={{color: '#e67e22'}}> T</span>ransformation & 
          <span style={{color: '#e67e22'}}> H</span>olistic 
          <span style={{color: '#e67e22'}}> I</span>mprovement
        </p>
      </div>

      {/* Project Description */}
      <section>
        <h2 style={{ color: '#333' }}>Project Vision</h2>
        <p style={{ fontSize: '1.1rem', color: '#444' }}>
          SARATHI is an AI-driven ecosystem designed to bridge the gap between academic learning and professional success. 
          By combining psychometric science with the power of <strong> Advanced Gemini AI</strong>, we provide students with 
          a clear "True North" for their careers.
        </p>
      </section>

      <section style={{ marginTop: '40px' }}>
  <h2 style={{ color: '#0A2351', marginBottom: '10px' }}>Why SARATHI Platform?</h2>
  <p style={{ color: '#64748b', lineHeight: '1.6' }}>
    In the Indian education landscape, students often face "decision paralysis" due to a lack of personalized guidance.
    The SARATHI Platform addresses these challenges through three core pillars:
  </p>

  {/* 🚀 This adds the extra gap you requested before the pillars start */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
    
    {/* Pillar 1 */}
    <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h4 style={{ color: '#0A2351', fontWeight: 'bold', marginBottom: '8px' }}>Personalized Roadmaps</h4>
      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
        More than just advice; a week-by-week strategic action plan for the next 5 years.
      </p>
    </div>

    {/* Pillar 2 */}
    <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h4 style={{ color: '#0A2351', fontWeight: 'bold', marginBottom: '8px' }}>Skill Gap Analysis</h4>
      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
        Identifying exactly what you need to learn today to qualify for your dream career tomorrow.
      </p>
    </div>

    {/* Pillar 3 */}
    <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h4 style={{ color: '#0A2351', fontWeight: 'bold', marginBottom: '8px' }}>Data-Driven Decisions</h4>
      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
        Removing the guesswork from career planning using psychometric science and AI.
      </p>
    </div>

  </div>
</section>
