import asyncio
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).resolve().parents[1] / '.env')

SYSTEM_PROMPT = (
    "You are an expert Career Counselor for the SARATHI App, specializing in the Indian job market. \n"
    "Analyze the provided user answers to a 6-part psychometric assessment.\n"
    "Output a highly personalized, structured JSON response with exactly this format:\n"
    "{\n"
    '  "user_archetype": "A catchy 2-3 word title",\n'
    '  "executive_summary": "3-paragraph summary of core strengths, work style, and primary motivations",\n'
    '  "psychometric_profile": {\n'
    '    "dominant_personality_traits": ["Trait 1", "Trait 2"],\n'
    '    "core_motivators": ["Motivator 1", "Motivator 2"],\n'
    '    "learning_style": "How they best absorb information"\n'
    '  },\n'
    '  "top_career_matches": [\n'
    '    {\n'
    '      "career_title": "Specific Role",\n'
    '      "why_it_fits": "2 sentences explaining the match",\n'
    '      "starting_salary_inr": "Realistic range in INR (e.g., ₹6L - ₹12L PA)",\n'
    '      "growth_potential": "High/Medium/Low"\n'
    '    }\n'
    '  ],\n'
    '  "one_year_roadmap": {\n'
    '    "q1_focus": "Skills to learn",\n'
    '    "q2_focus": "Projects to build",\n'
    '    "q3_focus": "Networking/internships",\n'
    '    "q4_focus": "Application prep"\n'
    '  },\n'
    '  "potential_blind_spots": ["Constructive feedback on areas they might struggle"]\n'
    "}"
)


def extract_json(raw_text: str):
    text = (raw_text or '').strip()

    if text.startswith('```'):
        text = text.split('\n', 1)[1] if '\n' in text else text
        if text.endswith('```'):
            text = text[:-3].strip()
        if text.lower().startswith('json'):
            text = text[4:].strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


async def main():
    payload_text = sys.stdin.read().strip()
    if not payload_text:
        raise ValueError('Missing input payload')

    payload = json.loads(payload_text)
    api_key = os.environ.get('EMERGENT_LLM_KEY')

    if not api_key:
        raise RuntimeError('Missing EMERGENT_LLM_KEY')

    user_message = UserMessage(
        text=(
            "Assessment context for SARATHI:\n"
            + json.dumps(
                {
                    "student_profile": payload.get('student_profile', {}),
                    "assessment_context": payload.get('assessment_context', []),
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n\nReturn only valid JSON matching the required structure."
        )
    )

    chat = LlmChat(
        api_key=api_key,
        session_id=payload.get('session_id') or f"sarathi-{payload.get('assessment_id', 'roadmap')}",
        system_message=SYSTEM_PROMPT,
    ).with_model('gemini', 'gemini-2.5-pro')

    response = await chat.send_message(user_message)
    structured = extract_json(response)

    print(json.dumps(structured, ensure_ascii=False))


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
