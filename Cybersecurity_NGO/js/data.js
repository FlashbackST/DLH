/* =====================================================================
   DATA – all the content used by the interactive parts.
   Change questions and messages here; app.js does the rest.
   All organisations, people and domains are FICTIONAL.
   ===================================================================== */

/* The pages of the course, in order (used for the menu and progress). */
const PAGES = [
  { id: "quiz",       file: "quiz.html",        title: "Starting quiz",        sub: "5 questions · Kahoot" },
  { id: "why",        file: "why.html",         title: "Why NGOs are targeted", sub: "What attackers want" },
  { id: "attacks",    file: "attacks.html",     title: "Know the attacks",      sub: "Phishing, smishing, deepfakes…" },
  { id: "phishing",   file: "phishing.html",    title: "Spot the phishing",     sub: "Exercise · 5 messages" },
  { id: "passwords",  file: "passwords.html",   title: "Passwords & MFA",       sub: "Set it up on your phone" },
  { id: "sharing",    file: "sharing.html",     title: "Share safely",          sub: "Email, cloud, drives, apps" },
  { id: "backups",    file: "backups.html",     title: "Backups & ransomware",  sub: "The 3-2-1 rule" },
  { id: "self-check", file: "self-check.html",  title: "Check your NGO",        sub: "Your 3 weak points" },
  { id: "final",      file: "final-check.html", title: "Final check",           sub: "See your progress" },
  { id: "checklist",  file: "checklist.html",   title: "Take-home checklist",   sub: "Keep this page" },
  { id: "help",       file: "help.html",        title: "Get help & links",      sub: "Who to contact in Luxembourg" }
];

/* Quiz: the same 5 questions at the start and at the end.
   a = index of the correct option (0 = first). */
const QUIZ = [
  { topic: "Recognise attacks",
    q: "You get an email from your NGO's president: “I'm in a meeting, please buy 5 gift cards of €100 right now and send me the codes. Don't call me.” What do you do?",
    o: ["Buy them quickly – it's the president",
        "Reply to the email to ask if it's really them",
        "Call the president on the number you already know",
        "Forward it to a colleague so they can buy them"],
    a: 2,
    why: "Urgency + authority + “don't call” = classic fraud. Always check through a channel you already know, never by replying to the message." },
  { topic: "Recognise attacks",
    q: "A text message says: “Your parcel is on hold. Pay €1.99 customs fees here: parcel-fee-lu.top”. What is it most likely?",
    o: ["A normal delivery message", "A fraudulent text message (smishing)", "A message from customs", "A mistake from the delivery company"],
    a: 1,
    why: "Small fee + deadline + strange link = smishing. Don't tap: open the carrier's app or website yourself." },
  { topic: "Check links",
    q: "Your NGO's website is amisduparc.lu. Which link really belongs to your NGO?",
    o: ["amisduparc.lu.secure-login.com/docs", "amisduparc-lu.net/docs", "intranet.amisduparc.lu/docs", "secure-docs.com/amisduparc.lu"],
    a: 2,
    why: "Read the address just before the first “/”: the real owner is the last part (amisduparc.lu). In the others, your NGO's name is only decoration." },
  { topic: "Passwords & MFA",
    q: "What protects your NGO mailbox best?",
    o: ["A password you change every month", "The same strong password you use everywhere",
        "A long, unique password saved in a password manager, plus MFA", "A password written on a sticky note under the keyboard"],
    a: 2,
    why: "A unique password stops one leak from opening everything, and MFA blocks a thief who has your password." },
  { topic: "Safe sharing",
    q: "You need to send the list of beneficiaries to a partner organisation. What is the safest way?",
    o: ["Post it in the volunteers' WhatsApp group", "Share a link set to “anyone with the link”",
        "Share it from the NGO drive with that one person only, and remove access later", "Email it to the partner's private Gmail address"],
    a: 2,
    why: "Share only with the named person who needs it, and take access back when the work is done." }
];

/* Phishing exercise. A "segment" is either plain text (a string)
   or a red flag: { t: "text shown", f: "why it is a red flag" }. */
const MESSAGES = [
  { kind: "mail", phish: true,
    from: ["Jean (Treasurer) ", { t: "<tresorier.amisduparc@gmaii.com>", f: "Look-alike address: “gmaii.com”, not your NGO's domain." }],
    subject: [{ t: "URGENT – pay before 17:00", f: "Urgency pushes you to act before thinking." }],
    body: [["Hi, I'm in a board meeting. Please pay the attached invoice today. ",
            { t: "Their bank account has changed, use the new one.", f: "A changed bank account sent by email is a classic fraud." }],
           [{ t: "Don't call me, just reply when done.", f: "Blocking a phone check is a huge red flag." }]],
    tip: "Any change of bank details → call the person on a number you already know." },
  { kind: "mail", phish: false,
    from: ["Karim (IT volunteer) <karim@amisduparc.lu>"],
    subject: ["Next month: two-step login for all team accounts"],
    body: [["As discussed at Tuesday's team meeting, we'll turn on MFA for our mailboxes in November."],
           ["I'll be at the office on Thursday 14:00–16:00 to help. I will never ask for your password or code."]],
    tip: "Real: your NGO's own address, things you can check (a meeting, a person), no pressure, no secrets asked." },
  { kind: "sms", phish: true, who: "ParcelNow",
    bubbles: [["Your parcel is on hold. ", { t: "Pay €1.99 customs fees", f: "A tiny fee to get your card details." }, " ",
               { t: "within 24h", f: "Deadline = pressure." }, "."],
              ["Pay here: ", { t: "parcelnow-lu.delivery-fee.top", f: "Strange website address (.top) – not the carrier's official site." }]],
    tip: "Never tap links in delivery SMS. Open the carrier's app or website yourself." },
  { kind: "sms", phish: false, who: "Léa (Team) – saved contact",
    bubbles: [["Hi! Running 10 min late for the volunteer briefing, train is stuck 🙈 Start without me!"]],
    tip: "Real: a known contact, no link, no request for money or data." },
  { kind: "web", phish: true,
    url: ["https://", { t: "cloudbox.secure-login-amisduparc.com", f: "The real owner is “amisduparc.com” – not your NGO (you use .lu). The rest is decoration." }, "/share"],
    text: [{ t: "Your session has expired.", f: "A fake reason to ask for your password." }, " Sign in to view ",
           { t: "“Donors_2026_FULL.xlsx”", f: "A tempting file name to make you curious." }],
    tip: "Arrived from a link? Don't type your password. Open the service from your own bookmark." }
];

/* Self-assessment: 2 yes/no questions per weak point + suggested first steps. */
const WEAK_POINTS = [
  { name: "Phishing & social engineering",
    q: ["Do you check the sender and the link before you click?",
        "Do you verify money or password requests by calling a number you already know?"],
    steps: ["Agree on a call-back rule for every payment request", "Put the phishing checklist next to your screen", "Report suspicious messages to one named person"] },
  { name: "Weak passwords without MFA",
    q: ["Do you use a different password for each important account?", "Is MFA turned on for your email?"],
    steps: ["Turn on MFA on your email this week", "Install a password manager", "Help one colleague turn on MFA"] },
  { name: "Unsafe sharing without backups",
    q: ["Do you share files only with named people (never “anyone with the link”)?", "Does your NGO keep a backup copy offline?"],
    steps: ["Remove “anyone with the link” from shared files", "Make one offline backup this month", "Agree who may access beneficiary data"] }
];
