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
          By combining psychometric science with the power of <strong>Gemini 2.5 AI</strong>, we provide students with 
          a clear "True North" for their careers.
        </p>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#333' }}>Why SARATHI?</h2>
        <p>
          In the Indian education landscape, students often face "decision paralysis" due to a lack of personalized guidance. 
          SARATHI solves this by:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong>Personalized Roadmaps:</strong> Not just advice, but a week-by-week plan for 5 years.</li>
          <li style={{ marginBottom: '10px' }}><strong>Skill Gap Analysis:</strong> Identifying exactly what you need to learn for your dream job.</li>
          <li style={{ marginBottom: '10px' }}><strong>Data-Driven Decisions:</strong> Removing guesswork from career planning.</li>
        </ul>
      </section>

    </div>
  );
}
