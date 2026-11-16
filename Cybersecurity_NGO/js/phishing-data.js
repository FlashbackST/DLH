/* =====================================================================
   PHISHING EXERCISE – 3 pairs (email, SMS, website).
   In each pair one message is real and one is fake ("fake": "a" or "b").
   A red flag is written { t: "text", f: "why it is a red flag" }.
   All names, organisations and domains are FICTIONAL.
   ===================================================================== */
const PAIRS = [
  { title: "Email", fake: "b",
    a: { kind: "mail",
         from: ["Karim (IT volunteer) <karim@zesummewuessen.lu>"],
         subject: ["Next month: two-step login for all team accounts"],
         body: [["As discussed at Tuesday's team meeting, we'll turn on the phone check (MFA) for our mailboxes in November."],
                ["I'll be at the office on Thursday 14:00–16:00 to help. I will never ask for your password or your code."]] },
    b: { kind: "mail",
         from: ["Jean (Treasurer) ", { t: "<tresorier.zesummewuessen@gmaii.com>", f: "Look-alike address: “gmaii.com”, not your NGO's address." }],
         subject: [{ t: "URGENT – pay before 17:00", f: "Rush: you are pushed to act before you think." }],
         body: [["Hi, I'm in a board meeting. Please pay the attached invoice today. ",
                 { t: "The supplier's bank account has changed, use the new one.", f: "Changed bank details by email is a classic fraud." }],
                [{ t: "Don't call me, just reply when it's done.", f: "Blocking a phone check is a huge red flag." }]] },
    tip: "Real: your NGO's own address, things you can check, no pressure. Fake: rush, money and “don't call”. Always call back on a number you already know." },

  { title: "SMS", fake: "a",
    a: { kind: "sms", who: "ParcelNow",
         bubbles: [["Your parcel is on hold. ", { t: "Pay €1.99 customs fees", f: "A tiny fee to get your card details." }, " ",
                    { t: "within 24h", f: "A deadline = pressure." }, "."],
                   ["Pay here: ", { t: "parcelnow-lu.delivery-fee.top", f: "Strange address (.top) – not the delivery company's website." }]] },
    b: { kind: "sms", who: "Léa (Team) – saved contact",
         bubbles: [["Hi! Running 10 min late for the volunteer briefing, the train is stuck 🙈 Start without me!"]] },
    tip: "Real: a known contact, no link, nothing asked. Fake: a small fee, a deadline and a strange link. Never tap – open the carrier's app yourself." },

  { title: "Website", fake: "b",
    a: { kind: "web", brand: "Zesumme Wuessen – shared drive",
         url: ["https://", "drive.zesummewuessen.lu", "/members"],
         text: ["Sign in to the NGO's shared drive with your personal account."] },
    b: { kind: "web", brand: "CloudBox",
         url: ["https://", { t: "cloudbox.secure-login-zesummewuessen.com", f: "The real owner is the end of the address: “zesummewuessen.com” – not your NGO's .lu. The rest is decoration." }, "/share"],
         text: [{ t: "Your session has expired.", f: "A fake reason to make you type your password." }, " Sign in to view ",
                { t: "“Donors_2026_FULL.xlsx”", f: "A tempting file name to make you curious." }] },
    tip: "Read the address just before the first “/”: that's the real owner. Arrived from a link? Don't type your password – open the service from your own bookmark." }
];
