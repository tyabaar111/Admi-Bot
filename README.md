# Admibot-AI

**A bilingual AI admission assistant that helps new students turn questions into clear next steps.**

Built for **Track 2: Conversational AI & Communication — Admission Helper Chatbot**.

## The problem

New students need to understand programs, eligibility, fees, documents and deadlines before applying. Finding and connecting these details can be confusing, especially when a student has follow-up questions or prefers Bangla.

Admibot-AI brings the supplied admission information into one conversational interface, helping students explore their options in simple, friendly language.

## How it works

1. **Ask a question.** Students can type in English or Bangla, or choose a suggested question.
2. **Keep the conversation in context.** The current question and recent chat history help the assistant understand follow-ups such as “And for BBA?” after discussing CSE fees.
3. **Consult the admission information.** A server-side function sends the organizer-provided admission file and conversation to Groq, with instructions to use only the supplied university facts.
4. **Return a useful answer.** The model produces an answer, source-section references and suggested follow-up questions. The server checks the response structure and section IDs before displaying it.
5. **Show the source.** Students can open a citation to inspect the corresponding section of the original admission file.

The Groq API key stays on the server. It is never included in the browser code.

## Main features

- **English and Bangla support:** localized interface and conversational answers.
- **Contextual follow-ups:** remembers recent messages and the program being discussed.
- **Admission guidance:** covers departments, eligibility, application steps, required documents, estimated fees, waivers, dates and campus facilities.
- **Source references:** connects answers to numbered sections of the supplied file.
- **Clarifying questions:** asks for details when the student's question is unclear.
- **Honest handling of missing information:** explains when a detail is unavailable and suggests contacting the sample Admission Office.
- **Suggested questions:** gives students an easy place to start and helps them continue the conversation.
- **Admission checklist:** tracks the six application steps, with progress saved on the current device.
- **Chat controls:** clear the conversation or reset its context.
- **Offline guide:** provides clearly labeled, rule-based replies when the AI backend is unavailable.
- **Responsive interface:** adapts to desktop and mobile screens.

## Example conversation

**Student:** What is the CSE tuition fee per credit?

**Admibot-AI:** The CSE tuition fee is BDT 4,500 per credit.

**Student:** And for BBA?

**Admibot-AI:** The BBA tuition fee is BDT 3,500 per credit.

If a student asks for an unlisted detail, such as the hostel fee, the assistant should explain that the source does not provide it rather than inventing an amount.

## Technology

| Component | Implementation |
| --- | --- |
| Interface | HTML, CSS and JavaScript |
| AI provider | Groq Chat Completions |
| Configured default model | `qwen/qwen3.8-27b` |
| Backend | Node.js server function |
| Deployment configuration | Vercel |
| Knowledge source | Organizer-provided admission text file |
| Local state | Browser storage for chat history and checklist progress |
| Fallback | Local intent detection and rule-based answers |

## Grounding and limitations

The knowledge source is `data/track2_admission_info.txt`. It describes **Bayview International University, a fictional university created for the hackathon**. University names, contact details, fees and Fall 2027 dates are sample information.

The AI is instructed to preserve eligibility conditions, label fee calculations as estimates, and decline questions that the source cannot answer. AI can still make mistakes: checking the response format and source IDs does not guarantee that every claim is correct. The assistant supports exploration and does not make final admission decisions.

When AI is enabled, the current question and recent conversation are sent through the backend to Groq. Students should avoid entering sensitive personal information. The offline guide has narrower language understanding than the AI mode.
