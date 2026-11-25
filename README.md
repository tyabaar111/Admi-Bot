# Admibot-AI

**An admission workspace that turns university sources into clearer conversations and practical next steps.**

Built for **Track 2: Conversational AI & Communication — Admission Helper Chatbot**.

## Why it exists

Admission decisions begin with scattered information: program lists, eligibility rules, fee notices and application instructions. Students need a way to ask follow-up questions, inspect the supporting source and keep their next steps organized—in English or Bangla.

Admibot-AI combines a source-based AI assistant with a university library, document import, a personal cost planner and an application checklist.

## Beyond a single sample university

- **Real university source collections:** dated extracts from official IIUC and East Delta University pages, with original links and check dates.
- **Bring your own university:** upload a UTF-8 TXT or Markdown admission document, or paste notice text. Add a title, university name and optional original source URL.
- **Separate conversations:** each university or personal document workspace has its own chat, checklist and budget. Switching universities does not mix their facts.
- **An explicit demo workspace:** the original fictional Bayview admission file remains available for the hackathon task, clearly labeled as sample data.

Personal documents are labeled user-provided, not independently verified. PDF files must first be copied or exported as text. Imported text stays in the current browser and is sent to the backend and Groq only when the student asks a question. It is not shared with other visitors or permanently stored on the server by this application.

## How it works

1. **Choose a source context.** Select a university collection or create a workspace from an admission document.
2. **Ask naturally.** Type in English or Bangla, or choose one of the suggested questions.
3. **Retrieve relevant material.** The server selects source documents using keyword overlap across recent questions. It sends those extracts and up to nine recent conversation messages to Groq. This is lightweight document retrieval, not embedding-based semantic search.
4. **Generate a grounded reply.** The model is instructed to use the active university’s sources, preserve conditions, explain missing information and distinguish general advice from university policy.
5. **Inspect the evidence.** The server checks the response structure and cited document IDs. Students can read the cited extracts and follow their original links.

The Groq API key remains server-side. Built-in university collections are loaded by the server, so browser requests cannot replace an official collection with arbitrary text. Uploaded material is treated as untrusted source data rather than instructions.

## What students can do

- Explore admission questions in **English or Bangla**, with contextual follow-ups.
- Open **source citations**, inspect check dates and read original university pages.
- Add their own admission notices without changing the application code.
- Use a **semester budget calculator** with their verified credit load, tuition rate, waiver percentage and other fees. It never silently applies fictional fees to a real university.
- Track a **six-step personal application checklist**, saved separately for each workspace.
- **Copy answers, retry an unavailable AI reply, export a conversation**, or start a fresh chat.
- Switch between **light and dark themes** on desktop or mobile.
- Read clearly labeled **source extracts when AI is offline**. The Bayview demo also retains its local rule-based answer engine.

The checklist contains general planning tasks, not a substitute for a university’s official application procedure. The cost planner uses the student’s inputs and applies its waiver only to tuition; the actual university policy must be checked.

## A conversation to try

Select **IIUC**, ask what CSE costs in the imported notice, then ask **“And BBA?”**. The assistant should use the IIUC sources for both questions, rather than the Bayview demo’s rates.

Switch to **East Delta University** and ask for a tuition amount absent from its imported extracts. The assistant should explain the information gap and point to the original program pages rather than reuse IIUC’s figures.

Finally, add a notice for another university and ask the same questions against that document.

## Technology

| Layer | Implementation |
| --- | --- |
| Interface | HTML, CSS and JavaScript modules |
| AI | Groq Chat Completions; default `qwen/qwen3.8-27b` |
| Backend | Node.js server function on Vercel |
| Retrieval | Keyword-based selection of relevant source documents |
| Response format | Structured JSON, checked source IDs and plain-text rendering |
| Local state | Browser storage for personal sources, conversations, checklists and budgets |
| Fallback | Source reader; rule-based answers only for the fictional demo |

The application has no runtime npm dependencies.

## Source transparency and limits

Real-university extracts were checked on **25 November 2026**. They are snapshots, not live browsing or a guarantee that an admission policy remains unchanged. Students should reopen the original notice before acting, and administrators should update collections when the source changes. The assistant cannot retrieve information that was not included in the selected sources.

AI can still misunderstand text, miss a relevant extract or make an unsupported claim. Valid response structure and source IDs do not establish the truth of every sentence. Uploaded documents may be incomplete, outdated or incorrect. The app does not make final admission decisions.

Questions and recent chat are sent to Groq for AI replies. Users should not enter sensitive personal records. The server uses request-size checks, role validation, an origin allowlist and a best-effort per-instance request limit; these are not a distributed abuse-prevention system.

### Original sources

- [IIUC undergraduate admission information](https://iiuc.ac.bd/web/admission/instruction-bn?tab=bachelor)
- [East Delta University admissions](https://admissions.eastdelta.edu.bd/admissions)
- [East Delta University admissions FAQ](https://admissions.eastdelta.edu.bd/admissions-faq)
- Organizer-provided fictional example: `data/track2_admission_info.txt`
