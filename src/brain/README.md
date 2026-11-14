---
title: Brain guide
description: How the brand brain works and how to edit it. Not sent to the chatbot.
use: [docs]
---

# The brand brain

Plain markdown files with everything the business knows, written once and reused by the website chatbot, the FAQ page, and later WhatsApp, Instagram, Claude Projects or marketing work.

## Two kinds of knowledge

1. **Words** live here, in these markdown files: voice, rules, policies, FAQ, health wording, the story. Edit them freely.
2. **Hard facts** (prices, order days, cutoff, delivery fees, pickup times, minimums and the menu) stay in the website's data files, `src/lib/site-facts.ts` and `src/lib/menu-data.ts`, so the bot and the site can never disagree. The bot adds them automatically, including which meals are on this week.

Avoid typing prices or times into these files. If a fact changes, change it in the data file once.

## File format

Every file starts with a short header between `---` lines:

| Field | What it does |
| --- | --- |
| `title` | Name of the topic. |
| `description` | One line on what's inside. |
| `use` | Where it's used: `chatbot`, `website`, `marketing`, `docs`. The bot only reads `chatbot` files. |
| `always` | `true` = sent with every chat message. Only `core.md` should have this; keep it short. |
| `keywords` | Words that pull this file into a chat. If a customer's message contains any of them, the file is added. Word starts work too: `allerg` matches allergy, allergies and allergic. |

If no topic matches a message, the bot gets the FAQ as a safety net.

## Files

- `core.md`: identity, voice, rules, when to hand over. Always sent.
- `faq.md`: ordering questions. Also builds the website's FAQ page (each `## ` heading is a question).
- `policies.md`: payment, changes, refunds, allergens, storage.
- `health.md`: diabetic, vegetarian and weight-loss wording.
- `story.md`: who we are, catering, contact.

## Adding a topic

Create `something.md` with the header above, `use: [chatbot]` and its keywords. The bot picks it up on the next deploy, no code changes needed.
