/* =====================================================================
   ✏️  CONFIG – edit your links here. Leave url "" to hide a button.
   ===================================================================== */
const CONFIG = {
  // Kahoot for the starting quiz and the final check.
  // Live game: keep "https://kahoot.it" (participants type the PIN on screen).
  // Self-paced challenge: paste the challenge link Kahoot gives you.
  kahootStart: { url: "https://kahoot.it", note: "Enter the game PIN shown on the trainer's screen." },
  kahootEnd:   { url: "https://kahoot.it", note: "Enter the game PIN shown on the trainer's screen." },

  // Feedback form at the end (e.g. a Microsoft Forms or Google Forms link).
  feedback: { url: "", label: "Give your feedback (1 minute)" },

  // Extra buttons shown at the top of a page.
  // Page ids: why, attacks, phishing, passwords, sharing, backups, self-check, checklist
  pageLinks: {
    // phishing: [{ label: "Open the extra phishing exercise", url: "https://..." }],
  },

  // Extra exercises listed on the Help page under "Practise more".
  extra: [
    // { label: "Name of the exercise", note: "Short description", url: "https://..." },
  ]
};
