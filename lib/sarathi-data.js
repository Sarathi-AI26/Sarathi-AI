export const assessmentQuestions = [
  {
    id: 'q1',
    question: 'When you start a new project, what excites you the most?',
    description: 'Choose the option that feels most natural to you.',
    options: [
      { value: 'a', label: 'Breaking the problem into logic, systems, and code' },
      { value: 'b', label: 'Leading a team, persuading people, and shaping decisions' },
      { value: 'c', label: 'Designing the experience, visuals, and storytelling' },
      { value: 'd', label: 'Solving issues that impact society, policy, or communities' },
    ],
  },
  {
    id: 'q2',
    question: 'In a college fest or group assignment, you usually become the person who…',
    description: 'There is no perfect answer here — just pick your default mode.',
    options: [
      { value: 'a', label: 'Builds the technical solution or data model' },
      { value: 'b', label: 'Coordinates people, timelines, and presentations' },
      { value: 'c', label: 'Creates the brand, visuals, or content' },
      { value: 'd', label: 'Connects the work to impact, operations, or institutions' },
    ],
  },
  {
    id: 'q3',
    question: 'What type of challenge gives you the biggest sense of achievement?',
    description: 'Pick the environment where you feel most energized.',
    options: [
      { value: 'a', label: 'Optimizing complex systems and finding the best answer' },
      { value: 'b', label: 'Understanding markets, users, and what people need next' },
      { value: 'c', label: 'Creating something memorable, expressive, or human-centered' },
      { value: 'd', label: 'Improving large-scale systems, governance, or field operations' },
    ],
  },
  {
    id: 'q4',
    question: 'Which work style sounds the most satisfying for the next 5 years?',
    description: 'Think of the kind of journey you would gladly repeat every week.',
    options: [
      { value: 'a', label: 'Deep technical problem-solving with visible output' },
      { value: 'b', label: 'Fast-moving business, product, or consulting decisions' },
      { value: 'c', label: 'Creative iteration, user feedback, and portfolio building' },
      { value: 'd', label: 'Structured preparation for public systems or mission-led roles' },
    ],
  },
  {
    id: 'q5',
    question: 'What do friends usually appreciate you for?',
    description: 'This helps estimate your natural strengths in teams and careers.',
    options: [
      { value: 'a', label: 'Analytical thinking and making difficult things simpler' },
      { value: 'b', label: 'Confidence, communication, and decision-making' },
      { value: 'c', label: 'Taste, originality, and understanding people emotionally' },
      { value: 'd', label: 'Discipline, reliability, and sense of responsibility' },
    ],
  },
]

const careerTracks = {
  technical: {
    title: 'AI, Data & Software',
    fitLabel: 'Strong analytical + systems fit',
    strengths: ['Logical reasoning', 'Technical depth', 'Structured execution'],
    roadmap: [
      'Build one GitHub or portfolio project around data, automation, or full-stack development.',
      'Pick one high-signal path: DSA + placements, applied AI, or analytics internships.',
      'Publish your work on LinkedIn, GitHub, or Kaggle to create visible proof of skill.',
    ],
    roles: ['Software Engineer', 'Data Analyst', 'AI/ML Associate'],
  },
  business: {
    title: 'Product, Consulting & Business',
    fitLabel: 'Strong leadership + decision fit',
    strengths: ['Communication', 'Ownership', 'User and market thinking'],
    roadmap: [
      'Lead one campus or internship project where outcomes can be measured clearly.',
      'Practice case interviews, product teardowns, and structured problem solving.',
      'Build a profile with internships, presentation decks, and market/user insights.',
    ],
    roles: ['Product Analyst', 'Consulting Associate', 'Growth Executive'],
  },
  creative: {
    title: 'UX, Design & Digital Brand',
    fitLabel: 'Strong creative + human-centered fit',
    strengths: ['Storytelling', 'Visual sense', 'Empathy and user understanding'],
    roadmap: [
      'Create 2 to 3 portfolio-ready case studies in Figma, content, or visual communication.',
      'Collect feedback from peers and mentors to improve craft and clarity quickly.',
      'Apply for internships in design, content, brand, or creator-led startups.',
    ],
    roles: ['UX Designer', 'Content Strategist', 'Brand Associate'],
  },
  public: {
    title: 'Public Policy, Operations & Mission Roles',
    fitLabel: 'Strong discipline + impact fit',
    strengths: ['Consistency', 'Responsibility', 'System-level thinking'],
    roadmap: [
      'Explore fellowships, UPSC/public policy awareness, NGOs, or operations-heavy internships.',
      'Build strong current-affairs, writing, and problem-framing habits every week.',
      'Document impact-led projects, volunteering, or fieldwork in a simple profile deck.',
    ],
    roles: ['Operations Associate', 'Policy Research Intern', 'Social Impact Fellow'],
  },
}

const weights = {
  q1: {
    a: { technical: 3, business: 1 },
    b: { business: 3, public: 1 },
    c: { creative: 3, business: 1 },
    d: { public: 3, business: 1 },
  },
  q2: {
    a: { technical: 3 },
    b: { business: 3, public: 1 },
    c: { creative: 3 },
    d: { public: 3, business: 1 },
  },
  q3: {
    a: { technical: 3 },
    b: { business: 3, technical: 1 },
    c: { creative: 3 },
    d: { public: 3 },
  },
  q4: {
    a: { technical: 3 },
    b: { business: 3 },
    c: { creative: 3 },
    d: { public: 3 },
  },
  q5: {
    a: { technical: 3 },
    b: { business: 3 },
    c: { creative: 3 },
    d: { public: 3 },
  },
}

const baseScores = {
  technical: 2,
  business: 2,
  creative: 2,
  public: 2,
}

const toFitScore = (value) => Math.min(96, 62 + value * 7)

export const buildCareerAnalysis = (answers = {}, studentName = 'Student') => {
  const scores = { ...baseScores }

  for (const [questionId, selectedOption] of Object.entries(answers || {})) {
    const questionWeights = weights[questionId]?.[selectedOption] || {}

    Object.entries(questionWeights).forEach(([track, score]) => {
      scores[track] += score
    })
  }

  const rankedTracks = Object.entries(scores)
    .map(([key, score]) => ({ key, score, ...careerTracks[key] }))
    .sort((first, second) => second.score - first.score)

  const topThree = rankedTracks.slice(0, 3).map((track, index) => ({
    rank: index + 1,
    title: track.title,
    fit_score: toFitScore(track.score),
    fit_label: track.fitLabel,
    strengths: track.strengths,
    roadmap: track.roadmap,
    roles: track.roles,
  }))

  const leadTrack = topThree[0]
  const secondTrack = topThree[1]

  return {
    generated_at: new Date().toISOString(),
    summary: `${studentName}, your current pattern suggests the strongest match with ${leadTrack?.title}. You also show promising overlap with ${secondTrack?.title}, which means you likely do best in careers that combine aptitude with visible outcomes and momentum.`,
    readiness_score: leadTrack?.fit_score || 75,
    top_strengths: leadTrack?.strengths || [],
    recommendations: topThree,
    roadmap: {
      next_30_days: [
        'Talk to 2 seniors or mentors already working in the top matching path.',
        'Start one visible project or portfolio artifact that proves your interest.',
        'Create a weekly schedule for skill-building, internships, and self-review.',
      ],
      next_90_days: leadTrack?.roadmap || [],
      career_assets_to_build: [
        'A 1-page resume tailored to your chosen career direction.',
        'A LinkedIn profile with projects, positions of responsibility, and proof of work.',
        'A simple public portfolio folder with 2 to 3 strong artifacts.',
      ],
    },
  }
}
