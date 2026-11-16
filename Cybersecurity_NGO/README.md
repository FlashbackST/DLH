# Cybersecurity for NGOs – Session 1 · Participant website

Website for participants of "Recognising and Avoiding Common Threats".
Plain HTML, CSS and JavaScript – no build step, no server, no database.

## Open it on your computer
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

## Files (same order as the training plan)
| File | What it is |
|---|---|
| `index.html` | Home: learning outcomes, agenda, course menu with progress ticks |
| `quiz.html` | Part 1 – starting quiz (Genially button + backup quiz) |
| `attacks.html` | Part 2 – why NGOs are targeted & how attacks work |
| `phishing.html` | Part 3 – exercise: 3 pairs (email, SMS, website), which one is fake? |
| `passwords.html` | Part 4 – passwords & MFA |
| `sharing.html` | Part 5 – share safely & back up (3-2-1, ransomware) |
| `bingo.html` | Part 6 – Cyber Bingo (trainer screen: `bingo.html#trainer`) |
| `checklist.html` | Part 7 – questions & take-home checklist (+ own first step) |
| `help.html` | Who to contact in Luxembourg + extra exercises |
| `css/style.css` | All the design |
| `js/config.js` | ✏️ **Your links**: quiz (Genially), feedback, extra exercises |
| `js/menu.js` | ✏️ The menu on the home page |
| `js/phishing-data.js` | ✏️ The 3 pairs of the phishing exercise |
| `js/data.js` | ✏️ Backup quiz questions |
| `js/app.js` | The logic |

## Common edits
- **Quiz link (Genially) / feedback / extra exercises** → `js/config.js`
- **Quiz questions** → `QUIZ` in `js/data.js` (`a` = index of the correct answer, starting at 0)
- **Phishing pairs** → `js/phishing-data.js`. A red flag is written `{ t: "text", f: "why it's a red flag" }`.
- **Text of a page** → edit that page's `.html` file directly
- **Colours** → `:root` at the top of `css/style.css` (red is used only for red flags)

## Put it online (Netlify)
1. Go to app.netlify.com/drop and log in.
2. Drag the whole `ngo-cyber-site` folder onto the page.
3. **Site configuration → Change site name** (e.g. `cyber4ngos` → `https://cyber4ngos.netlify.app`).
4. To update: drag the folder again (Deploys → drag and drop).

## Notes
- Answers and progress are saved only in each participant's browser (localStorage). The trainer does not see them – use the quiz tool or the coloured cards for group results.
- All organisations, people and domains in the examples are fictional.
- The real NGO case is presented by the trainer (see the comment in `why.html` if you want to add it with its source).
