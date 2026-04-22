// ─────────────────────────────────────────────────────────────
// SARATHI — Psychometric Assessment v2.0
// CRITICAL: Answer values are integers 1–5 (or 1–4 for interest/importance)
// These must match the QUESTION_BANK in app/api/generate-roadmap/route.js exactly.
// ─────────────────────────────────────────────────────────────

// Section 1, 3, 5 — Agreement scale (1=Strongly Agree … 5=Strongly Disagree)
const agreementScaleOptions = [
  { value: 1, label: 'Strongly Agree' },
  { value: 2, label: 'Agree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Disagree' },
  { value: 5, label: 'Strongly Disagree' },
]

// Section 2 — Interest scale (1=Very Interested … 4=Not Interested)
const interestScaleOptions = [
  { value: 1, label: 'Very Interested' },
  { value: 2, label: 'Interested' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Not Interested' },
]

// Section 4 — Importance scale (1=Very Important … 4=Not Important)
const importanceScaleOptions = [
  { value: 1, label: 'Very Important' },
  { value: 2, label: 'Important' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Not Important' },
]

const createChoiceQuestions = ({
  sectionId,
  sectionTitle,
  sectionDescription,
  prompts,
  startNumber,
  options,
}) =>
  prompts.map((prompt, index) => ({
    id: `q${startNumber + index}`,
    question_number: startNumber + index,
    question: prompt,
    section_id: sectionId,
    section_title: sectionTitle,
    section_description: sectionDescription,
    input_type: 'choice',
    options,
  }))

const createOpenEndedQuestions = ({
  sectionId,
  sectionTitle,
  sectionDescription,
  prompts,
  startNumber,
}) =>
  prompts.map((prompt, index) => ({
    id: `q${startNumber + index}`,
    question_number: startNumber + index,
    question: prompt,
    section_id: sectionId,
    section_title: sectionTitle,
    section_description: sectionDescription,
    input_type: 'text',
    options: [],
  }))

export const assessmentSections = [
  // ── SECTION 1: PERSONALITY TRAITS (Q1–Q15) ───────────────────
  {
    id: 'personality',
    title: 'Personality Traits',
    description: 'Scale: Strongly Agree → Strongly Disagree',
    questions: createChoiceQuestions({
      sectionId: 'personality',
      sectionTitle: 'Personality Traits',
      sectionDescription: 'Scale: Strongly Agree → Strongly Disagree',
      startNumber: 1,
      options: agreementScaleOptions,
      prompts: [
        // Q1
        'I enjoy solving problems that require deep thinking and analysis.',
        // Q2
        'I like having a clear plan and structure for my daily tasks.',
        // Q3 — UPDATED: measures conflict style, not sociability
        'When I disagree with someone in a group, I usually voice my opinion even if it creates tension.',
        // Q4
        'I often think of creative ideas or new ways of doing things.',
        // Q5
        'I remain calm even during stressful situations.',
        // Q6
        'I naturally take the lead when working in a group.',
        // Q7
        'I think carefully before making important decisions.',
        // Q8 — UPDATED: measures independence vs collaboration
        'When facing an unfamiliar problem, I prefer to figure it out myself before asking for help.',
        // Q9
        'I avoid taking risks unless I am confident about the outcome.',
        // Q10
        'I adapt quickly when situations change suddenly.',
        // Q11 — KEY SIGNAL: decisiveness under ambiguity
        'I make important decisions quickly and course-correct later, rather than waiting until I am fully certain.',
        // Q12
        'I can stay focused on tasks for long periods without distraction.',
        // Q13 — UPDATED: cognitive flexibility
        'I find it easy to switch between very different tasks or subjects in the same day.',
        // Q14
        'I like keeping my workspace and schedule organized.',
        // Q15 — UPDATED: subtle EQ probe
        'I often notice when someone is uncomfortable in a conversation, even if they do not say anything.',
      ],
    }),
  },

  // ── SECTION 2: CAREER INTERESTS (Q16–Q27) ────────────────────
  {
    id: 'interests',
    title: 'Career Interests',
    description: 'Rate your interest level for each area',
    questions: createChoiceQuestions({
      sectionId: 'interests',
      sectionTitle: 'Career Interests',
      sectionDescription: 'Rate your interest level for each area',
      startNumber: 16,
      options: interestScaleOptions,
      prompts: [
        // Q16
        'Analyzing data, numbers, or patterns.',
        // Q17
        'Designing visuals such as graphics, videos, or UI screens.',
        // Q18
        'Understanding how machines, software, or technology systems work.',
        // Q19
        'Helping people with academic, emotional, or career problems.',
        // Q20
        'Leading teams, planning events, or managing projects.',
        // Q21
        'Writing articles, blogs, scripts, or social media content.',
        // Q22
        'Conducting research in science, humanities, commerce, or social studies.',
        // Q23
        'Exploring business ideas, startups, or entrepreneurial ventures.',
        // Q24 — NEW: healthcare sector
        'Working in healthcare, medicine, nursing, or medical technology.',
        // Q25 — NEW: finance/banking sector
        'Working in finance, banking, investment, or insurance sectors.',
        // Q26 — NEW: law/policy sector
        'Working in law, policy-making, public administration, or governance.',
        // Q27
        'Pursuing higher studies abroad for exposure and global career opportunities.',
      ],
    }),
  },

  // ── SECTION 3: APTITUDE INDICATORS (Q28–Q37) ─────────────────
  {
    id: 'aptitude',
    title: 'Aptitude Indicators',
    description: 'Scale: Strongly Agree → Strongly Disagree',
    questions: createChoiceQuestions({
      sectionId: 'aptitude',
      sectionTitle: 'Aptitude Indicators',
      sectionDescription: 'Scale: Strongly Agree → Strongly Disagree',
      startNumber: 28,
      options: agreementScaleOptions,
      prompts: [
        // Q28 — UPDATED: behavioural proxy for teaching ability
        'My teachers or peers often ask me to explain concepts they find difficult.',
        // Q29
        'I understand diagrams, charts, and visual data quickly.',
        // Q30 — UPDATED: past performance proxy
        'In school or college, I consistently scored higher in Maths or Science than in other subjects.',
        // Q31
        'I learn new software or technology faster than most people.',
        // Q32 — NEW: processing speed probe
        'When I read instructions for a new device or app, I rarely need to read them twice.',
        // Q33
        'I can think of multiple solutions when faced with a problem.',
        // Q34
        'I can stay focused even when tasks are repetitive or long.',
        // Q35 — NEW: pattern recognition
        'I notice patterns or inconsistencies in data or information that others tend to miss.',
        // Q36
        'I easily understand abstract concepts like theories, algorithms, or frameworks.',
        // Q37
        'I am comfortable analyzing large amounts of information to reach conclusions.',
      ],
    }),
  },

  // ── SECTION 4: MOTIVATION & CAREER DRIVERS (Q38–Q47) ─────────
  {
    id: 'motivation',
    title: 'Motivation & Career Drivers',
    description: 'Rate how important each factor is to you',
    questions: createChoiceQuestions({
      sectionId: 'motivation',
      sectionTitle: 'Motivation & Career Drivers',
      sectionDescription: 'Rate how important each factor is to you',
      startNumber: 38,
      options: importanceScaleOptions,
      prompts: [
        // Q38
        'Earning a high salary early in my career.',
        // Q39
        'Having long-term job stability and security.',
        // Q40
        'Having opportunities to innovate or build new ideas.',
        // Q41
        'Getting leadership roles and recognition at work.',
        // Q42
        'Having a good work-life balance and manageable workload.',
        // Q43
        'Contributing to society and making a positive impact.',
        // Q44
        'Working in roles that allow international travel or relocation.',
        // Q45 — KEY SIGNAL: risk tolerance
        'Being able to take calculated risks and try new things, even if some fail.',
        // Q46 — KEY SIGNAL: family approval (India-specific)
        'Having my family\'s approval and support for my career choices.',
        // Q47 — KEY SIGNAL: specialist vs generalist
        'Mastering a specific skill or subject deeply, rather than knowing a little of many things.',
      ],
    }),
  },

  // ── SECTION 5: BEHAVIOURAL TENDENCIES (Q48–Q55) ──────────────
  {
    id: 'behaviour',
    title: 'Behavioural Tendencies',
    description: 'Scale: Strongly Agree → Strongly Disagree',
    questions: createChoiceQuestions({
      sectionId: 'behaviour',
      sectionTitle: 'Behavioural Tendencies',
      sectionDescription: 'Scale: Strongly Agree → Strongly Disagree',
      startNumber: 48,
      options: agreementScaleOptions,
      prompts: [
        // Q48 — REVERSE SCORED: procrastination probe (SA = high procrastination = risk)
        'When I have a long deadline, I tend to start seriously only in the final few days.',
        // Q49
        'I feel stressed when too many tasks pile up at once.',
        // Q50
        'I enjoy collaborating with others and working in teams.',
        // Q51 — NEW: team buy-in behaviour
        'If I disagree with how a team decision was made, I find it hard to commit fully to it.',
        // Q52
        'I actively use feedback to improve myself.',
        // Q53
        'I feel confident presenting or speaking in front of groups.',
        // Q54 — NEW: grit indicator
        'I tend to keep trying a difficult problem even after multiple failures, rather than moving on.',
        // Q55 — NEW: intrinsic curiosity
        'I often research a topic extensively on my own, beyond what was required in class.',
      ],
    }),
  },

  // ── SECTION 6: OPEN-ENDED (Q56–Q60) ──────────────────────────
  {
    id: 'open-ended',
    title: 'Open-Ended Reflections',
    description: 'Short written responses — help SARATHI understand your motivation and aspirations.',
    questions: createOpenEndedQuestions({
      sectionId: 'open-ended',
      sectionTitle: 'Open-Ended Reflections',
      sectionDescription: 'Short written responses — help SARATHI understand your motivation and aspirations.',
      startNumber: 56,
      prompts: [
        // Q56
        'What is your dream career, and why does it inspire you?',
        // Q57
        'Describe a challenge you faced and how you overcame it.',
        // Q58 — KEY SIGNAL: role model (replaces "what skills to develop")
        'Name one person — real or fictional — whose career or life you admire most, and explain what specifically about their path appeals to you.',
        // Q59 — KEY SIGNAL: intrinsic motivation gap (replaces "work environment")
        'If money was not a concern, what would you spend most of your time doing? How close is that to what you are currently pursuing?',
        // Q60
        'Would you prefer building your career in India, abroad, or both? Why?',
      ],
    }),
  },
]

// ── FLAT LIST + LOOKUP ────────────────────────────────────────
export const assessmentQuestions = assessmentSections.flatMap(
  (section) => section.questions
)

export const assessmentQuestionLookup = Object.fromEntries(
  assessmentQuestions.map((question) => [question.id, question])
)

// ── ANSWER VALUE → NUMERIC CONVERTER ────────────────────────
// Use this in assessment-flow-psychometric.jsx before submitting
// to ensure raw_answers is always an array of integers.
export const toNumericAnswers = (answersMap) =>
  assessmentQuestions.map((q) => {
    const val = answersMap[q.id]
    return val !== undefined ? Number(val) : null
  })
