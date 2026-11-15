# Cybersecurity for NGOs – Session 1 · Participant website

Website for participants of "Recognising and Avoiding Common Threats".
Plain HTML, CSS and JavaScript – no build step, no server, no database.

## Open it on your computer
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

## Files
| File | What it is |
|---|---|
| `index.html` | Home: learning outcomes, agenda, course menu with progress ticks |
| `quiz.html` / `final-check.html` | Kahoot button + backup quiz (start and end) |
| `why.html`, `attacks.html` | Content of the lecture |
| `phishing.html` | Exercise: tap red flags, real or fake |
| `passwords.html`, `sharing.html`, `backups.html` | Habits: MFA, safe sharing, 3-2-1, ransomware |
| `self-check.html` | Self-assessment of the 3 weak points + first step |
| `checklist.html` | Take-home checklist (shows the participant's first step) |
| `help.html` | Who to contact in Luxembourg + extra exercises |
| `css/style.css` | All the design (colours at the top in `:root`) |
| `js/config.js` | ✏️ **Your links**: Kahoot, feedback form, extra exercises |
| `js/data.js` | ✏️ **Content**: quiz questions, phishing messages, self-check |
| `js/app.js` | The logic (quiz, exercise, self-check, saving progress) |

## Common edits
- **Kahoot / feedback / extra exercises** → `js/config.js`
- **Quiz questions** → `QUIZ` in `js/data.js` (`a` = index of the correct answer, starting at 0)
- **Phishing messages** → `MESSAGES` in `js/data.js`. A red flag is written `{ t: "text", f: "why it's a red flag" }`.
- **Text of a page** → edit that page's `.html` file directly
- **Colours** → `:root` at the top of `css/style.css` (red is used only for red flags)

## Put it online (Netlify)
1. Go to app.netlify.com/drop and log in.
2. Drag the whole `ngo-cyber-site` folder onto the page.
3. **Site configuration → Change site name** (e.g. `cyber4ngos` → `https://cyber4ngos.netlify.app`).
4. To update: drag the folder again (Deploys → drag and drop).

## Notes
- Answers and progress are saved only in each participant's browser (localStorage). The trainer does not see them – use Kahoot or the coloured cards for group results.
- All organisations, people and domains in the examples are fictional.
- The real NGO case is presented by the trainer (see the comment in `why.html` if you want to add it with its source).
