const agreementScaleOptions = [
  { value: 'strongly_agree', label: 'Strongly Agree' },
  { value: 'agree', label: 'Agree' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'disagree', label: 'Disagree' },
  { value: 'strongly_disagree', label: 'Strongly Disagree' },
]

const interestScaleOptions = [
  { value: 'very_interested', label: 'Very interested' },
  { value: 'interested', label: 'Interested' },
  { value: 'somewhat_interested', label: 'Somewhat interested' },
  { value: 'slightly_interested', label: 'Slightly interested' },
  { value: 'not_interested', label: 'Not interested' },
]

const importanceScaleOptions = [
  { value: 'very_important', label: 'Very Important' },
  { value: 'important', label: 'Important' },
  { value: 'moderately_important', label: 'Moderately Important' },
  { value: 'slightly_important', label: 'Slightly Important' },
  { value: 'not_important', label: 'Not Important' },
]

const createChoiceQuestions = ({ sectionId, sectionTitle, sectionDescription, prompts, startNumber, options }) => {
  return prompts.map((prompt, index) => ({
    id: `q${startNumber + index}`,
    question_number: startNumber + index,
    question: prompt,
    section_id: sectionId,
    section_title: sectionTitle,
    section_description: sectionDescription,
    input_type: 'choice',
    options,
  }))
}

const createOpenEndedQuestions = ({ sectionId, sectionTitle, sectionDescription, prompts, startNumber }) => {
  return prompts.map((prompt, index) => ({
    id: `q${startNumber + index}`,
    question_number: startNumber + index,
    question: prompt,
    section_id: sectionId,
    section_title: sectionTitle,
    section_description: sectionDescription,
    input_type: 'text',
    options: [],
  }))
}

export const assessmentSections = [
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
        'I enjoy solving problems that require deep thinking and analysis.',
        'I like having a clear plan and structure for my daily tasks.',
        'I feel comfortable talking to new people and making connections.',
        'I often think of creative ideas or new ways of doing things.',
        'I remain calm even during stressful situations.',
        'I naturally take the lead when working in a group.',
        'I think carefully before making important decisions.',
        'I prefer working alone rather than in large teams.',
        'I avoid taking risks unless I’m confident about the outcome.',
        'I adapt quickly when situations change suddenly.',
        'I try to understand how others feel before reacting.',
        'I can stay focused on tasks for long periods without distraction.',
        'I enjoy learning new topics or exploring unfamiliar fields.',
        'I like keeping my workspace and schedule organized.',
        'I can communicate my thoughts clearly while speaking or writing.',
      ],
    }),
  },
  {
    id: 'interests',
    title: 'Career Interests',
    description: 'Rate your interest: Very interested → Not interested',
    questions: createChoiceQuestions({
      sectionId: 'interests',
      sectionTitle: 'Career Interests',
      sectionDescription: 'Rate your interest: Very interested → Not interested',
      startNumber: 16,
      options: interestScaleOptions,
      prompts: [
        'Analyzing data, numbers, or patterns.',
        'Designing visuals such as graphics, videos, or UI screens.',
        'Understanding how machines, software, or technology systems work.',
        'Helping people with academic, emotional, or career problems.',
        'Leading teams, planning events, or managing projects.',
        'Writing articles, blogs, scripts, or social media content.',
        'Conducting research in science, humanities, commerce, or social studies.',
        'Exploring business ideas, startups, or entrepreneurial ventures.',
        'Preparing for competitive exams like UPSC, SSC, Banking, CAT, or GATE.',
        'Working with NGOs, social impact projects, or community development.',
        'Building apps, websites, or digital tools.',
        'Pursuing higher studies abroad for exposure and global career opportunities.',
      ],
    }),
  },
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
        'I can easily identify errors in mathematical or numerical calculations.',
        'I understand diagrams, charts, and visual data quickly.',
        'I can explain difficult concepts in a simple way.',
        'I learn new software or technology faster than most people.',
        'I remember information better when I write or visualize it.',
        'I can think of multiple solutions when faced with a problem.',
        'I can stay focused even when tasks are repetitive or long.',
        'I can evaluate pros and cons logically before making decisions.',
        'I easily understand abstract concepts like theories, algorithms, or frameworks.',
        'I am comfortable analyzing large amounts of information to reach conclusions.',
      ],
    }),
  },
  {
    id: 'motivation',
    title: 'Motivation & Career Drivers',
    description: 'Rate importance: Very Important → Not Important',
    questions: createChoiceQuestions({
      sectionId: 'motivation',
      sectionTitle: 'Motivation & Career Drivers',
      sectionDescription: 'Rate importance: Very Important → Not Important',
      startNumber: 38,
      options: importanceScaleOptions,
      prompts: [
        'Earning a high salary early in my career.',
        'Having long-term job stability and security.',
        'Having opportunities to innovate or build new ideas.',
        'Getting leadership roles and recognition at work.',
        'Having a good work-life balance and manageable workload.',
        'Contributing to society and making a positive impact.',
        'Working in roles that allow international travel or relocation.',
        'Working in a competitive and fast-paced environment.',
        'Being able to work independently without much supervision.',
        'Building a strong personal identity or brand through my achievements.',
      ],
    }),
  },
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
        'I usually complete tasks well before the deadline.',
        'I feel stressed when too many tasks pile up at once.',
        'I enjoy collaborating with others and working in teams.',
        'I take initiative even when instructions are not given.',
        'I actively use feedback to improve myself.',
        'I feel confident presenting or speaking in front of groups.',
        'I follow rules and guidelines carefully.',
        'I stay committed to long-term goals even when progress is slow.',
      ],
    }),
  },
  {
    id: 'open-ended',
    title: 'Open-Ended Reflections',
    description: 'Short written responses that help SARATHI understand your motivation and aspirations.',
    questions: createOpenEndedQuestions({
      sectionId: 'open-ended',
      sectionTitle: 'Open-Ended Reflections',
      sectionDescription: 'Short written responses that help SARATHI understand your motivation and aspirations.',
      startNumber: 56,
      prompts: [
        'What is your dream career, and why does it inspire you?',
        'Describe a challenge you faced and how you overcame it.',
        'What skills do you want to develop in the next 2 years?',
        'What type of work environment helps you perform your best?',
        'Would you prefer building your career in India, abroad, or both? Why?',
      ],
    }),
  },
]

export const assessmentQuestions = assessmentSections.flatMap((section) => section.questions)

export const assessmentQuestionLookup = Object.fromEntries(
  assessmentQuestions.map((question) => [question.id, question])
)
