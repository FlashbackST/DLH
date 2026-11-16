/* =====================================================================
   APP – the logic of the site. Each page says who it is with
   <body data-page="...">, and this file switches on what that page needs.
   Progress is saved only in the participant's own browser (localStorage).
   ===================================================================== */

/* ---------- small helpers ---------- */
const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// localStorage can be blocked (private mode) → always use try/catch
const store = {
  get(key, fallback) { try { const v = localStorage.getItem("ngo1_" + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
  set(key, value)    { try { localStorage.setItem("ngo1_" + key, JSON.stringify(value)); } catch (e) {} }
};
function markDone(id) { const done = store.get("done", {}); done[id] = true; store.set("done", done); }
function linkButton(l) { return `<a class="btn ghost" style="margin:8px 0" href="${esc(l.url)}" target="_blank" rel="noopener">↗ ${esc(l.label)}</a>`; }

/* ---------- runs on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  // Pages without exercises count as "done" as soon as they are opened
  if (["why", "attacks", "passwords", "sharing", "backups", "help"].includes(page)) markDone(page);

  // Extra links from config.js, shown at the top of the page
  const links = ((CONFIG.pageLinks || {})[page] || []).filter(l => l.url);
  if (links.length) $("main").insertAdjacentHTML("afterbegin",
    `<div class="card" style="background:var(--accent-soft)"><b>Exercise links</b>${links.map(linkButton).join("")}</div>`);

  // Switch on the part this page needs
  if (page === "home")       renderMenu();
  if (page === "quiz")       renderQuiz("start");
  if (page === "final")      renderQuiz("end");
  if (page === "phishing")   renderPhishing();
  if (page === "self-check") renderSelfCheck();
  if (page === "checklist")  renderChecklist();
  if (page === "help")       renderHelpExtras();
});

/* ---------- HOME: menu with progress ticks ---------- */
function renderMenu() {
  const done = store.get("done", {});
  const list = (typeof MENU !== "undefined") ? MENU : PAGES;
  $("#menu").innerHTML = list.map((p, i) => `
    <a class="step ${done[p.id] ? "done" : ""}" href="${p.file}">
      <div class="n">${done[p.id] ? "✓" : i + 1}</div>
      <div><b>${esc(p.title)}</b><span>${esc(p.sub)}</span></div>
    </a>`).join("");
}

/* ---------- QUIZ (start) and FINAL CHECK (end) ---------- */
function renderQuiz(mode, skipExternal) {
  const app = $("#quiz-app");
  const ext = mode === "start" ? CONFIG.quizStart : CONFIG.quizEnd;
  const tool = CONFIG.quizTool || "the quiz tool";
  const doneId = mode === "start" ? "quiz" : "final";

  // 1) The quiz runs on Genially only
  if (ext && ext.url && !skipExternal) {
    markDone(doneId);
    app.innerHTML = `
      <div class="card"><p style="color:var(--ink)">We do this quiz together on <b>${esc(tool)}</b>.</p>
        <a class="btn primary" href="${esc(ext.url)}" target="_blank" rel="noopener">▶ Open the quiz on ${esc(tool)}</a>
        <p class="small" style="margin-top:10px">${esc(ext.note || "")}</p></div>`;
    return;
  }

  // 2) Local quiz: one question per screen
  let i = 0;
  const answers = [];
  const showQuestion = () => {
    const q = QUIZ[i];
    app.innerHTML = `
      <div class="tag">Question ${i + 1} of ${QUIZ.length}</div>
      <div class="progress"><i style="width:${i / QUIZ.length * 100}%"></i></div>
      <div class="card"><p class="small">${esc(q.topic)}</p><h2 style="font-size:19px">${esc(q.q)}</h2>
        ${q.o.map((o, k) => `<button class="choice" data-k="${k}">${esc(o)}</button>`).join("")}
        <div id="fb"></div></div>`;
    app.querySelectorAll(".choice").forEach(btn => btn.onclick = () => {
      const k = +btn.dataset.k, ok = k === q.a;
      answers[i] = k;
      app.querySelectorAll(".choice").forEach(x => {
        x.disabled = true;
        if (+x.dataset.k === q.a) x.classList.add("right"); else if (x === btn) x.classList.add("wrong");
      });
      // At the start: no explanation yet (the session explains it). At the end: explain.
      $("#fb").innerHTML = (mode === "start"
        ? `<div class="fb info">${ok ? "✅ Correct." : "Noted – we'll come back to this during the session."}</div>`
        : `<div class="fb ${ok ? "ok" : "ko"}"><b>${ok ? "✅ Correct." : "❌ Not quite."}</b> ${esc(q.why)}</div>`)
        + `<button class="btn primary next" id="nx">${i < QUIZ.length - 1 ? "Next question" : "See my result"}</button>`;
      $("#nx").onclick = () => { i++; i < QUIZ.length ? showQuestion() : showResult(); };
    });
  };
  const showResult = () => {
    const score = answers.filter((a, k) => a === QUIZ[k].a).length;
    store.set(mode === "start" ? "quizStart" : "quizEnd", { score });
    markDone(doneId);
    const before = store.get("quizStart", null);
    app.innerHTML = mode === "start" ? `
      <div class="card" style="text-align:center"><div class="tag">Your starting score</div>
        <div class="big-score">${score} / ${QUIZ.length}</div>
        <p>This is just your starting point – we'll check again at the end.</p></div>
      <a class="btn primary" href="why.html">Next: Why NGOs are targeted</a>` : `
      <div class="card" style="text-align:center"><div class="tag">Your progress</div>
        <div class="cmp"><div><span class="small">At the start</span><b>${before ? before.score : "–"} / ${QUIZ.length}</b></div>
          <div><span class="small">Now</span><b>${score} / ${QUIZ.length}</b></div></div>
        <p>${before && score > before.score ? "🎉 Well done – you improved!" : "Keep the checklist to remember the key habits."}</p></div>
      <a class="btn primary" href="checklist.html">Open the take-home checklist</a>`;
  };
  showQuestion();
}

/* ---------- PHISHING EXERCISE ---------- */
let segMap = {}, segCount = 0;
// Turn an array of segments into tappable <span>s and remember which are red flags
function segs(arr) {
  return arr.map(p => {
    const s = typeof p === "string" ? { t: p } : p;
    if (!s.t.trim()) return esc(s.t);
    const id = "s" + (segCount++);
    segMap[id] = s;
    return `<span class="seg" data-id="${id}">${esc(s.t)}</span>`;
  }).join("");
}
// Draw a message as an email, an SMS or a website
function drawMessage(m) {
  if (m.kind === "mail") return `<div class="mail"><div class="h"><div><b>From:</b> ${segs(m.from)}</div><div><b>Subject:</b> ${segs(m.subject)}</div></div>
      <div class="b">${m.body.map(line => `<p>${segs(line)}</p>`).join("")}</div></div>`;
  if (m.kind === "sms") return `<div class="phone"><div class="who">${esc(m.who)}</div>${m.bubbles.map(b => `<div class="bub">${segs(b)}</div>`).join("")}</div>`;
  return `<div class="browser"><div class="url">🔒 ${segs(m.url)}</div><div class="pg"><b style="color:#2f6fec;font-size:18px">☁ ${esc(m.brand || "CloudBox")}</b>
      <p style="color:#222;margin:8px 0">${segs(m.text)}</p><div class="fakein">Email address</div><div class="fakein">Password</div><div class="fakebtn">Sign in</div></div></div>`;
}
function renderPhishing() {
  const app = $("#phishing-app");
  if (typeof PAIRS === "undefined") { app.innerHTML = "<p>Exercise data missing (js/phishing-data.js).</p>"; return; }
  let i = 0, right = 0;
  const show = () => {
    segMap = {}; segCount = 0;
    const p = PAIRS[i];
    app.innerHTML = `
      <div class="tag">Pair ${i + 1} of ${PAIRS.length} · ${esc(p.title)}</div>
      <div class="progress"><i style="width:${i / PAIRS.length * 100}%"></i></div>
      <p style="color:var(--ink)"><b>One is real, one is fake.</b> Which one is fake?</p>
      <h3>A</h3><div id="ma">${drawMessage(p.a)}</div>
      <h3>B</h3><div id="mb">${drawMessage(p.b)}</div>
      <div class="row next" id="act"><button class="btn fake" data-v="a">🎣 A is fake</button><button class="btn fake" data-v="b">🎣 B is fake</button></div>
      <div id="fb"></div>`;
    app.querySelectorAll("#act .btn").forEach(b => b.onclick = () => judge(b.dataset.v));
  };
  const judge = choice => {
    const p = PAIRS[i], ok = choice === p.fake;
    if (ok) right++;
    $("#act").remove();
    const fakeBox = p.fake === "a" ? "#ma" : "#mb", flags = [];
    app.querySelectorAll(fakeBox + " .seg").forEach(el => {
      const s = segMap[el.dataset.id];
      if (s && s.f) { el.classList.add("miss"); flags.push(`<li><b>${esc(s.t)}</b> – ${esc(s.f)}</li>`); }
    });
    $("#fb").innerHTML = `<div class="fb ${ok ? "ok" : "ko"}"><b>${ok ? "✅ Correct" : "❌ Not quite"} – ${p.fake.toUpperCase()} is the fake one.</b></div>
      ${flags.length ? `<p style="color:var(--ink);margin:10px 0 4px"><b>The red flags in ${p.fake.toUpperCase()}:</b></p><ul class="redflags">${flags.join("")}</ul>` : ""}
      <div class="fb info">💡 ${esc(p.tip)}</div>
      <button class="btn primary next" id="nx">${i < PAIRS.length - 1 ? "Next pair" : "Finish"}</button>`;
    $("#nx").onclick = () => { i++; i < PAIRS.length ? show() : finish(); };
    $("#fb").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const finish = () => {
    markDone("phishing");
    app.innerHTML = `<div class="card" style="text-align:center"><div class="tag">Exercise done</div>
        <div class="big-score">${right} / ${PAIRS.length}</div><p>fakes spotted</p>
        <div class="fb info" style="text-align:left"><b>Stop · Check · Report</b><br>Stop before you click. Check the sender, the link and what is asked. Report anything suspicious to your contact person.</div></div>`;
  };
  show();
}

/* ---------- SELF-CHECK ---------- */
function renderSelfCheck() {
  const app = $("#self-app");
  const answers = store.get("selfAnswers", {});
  const draw = () => {
    const chosen = store.get("firstStep", "");
    let html = "";
    WEAK_POINTS.forEach((w, wi) => {
      html += `<div class="card"><h3 style="margin-top:0">${esc(w.name)}</h3>`;
      w.q.forEach((q, qi) => {
        const key = wi + "_" + qi, v = answers[key];
        html += `<p style="color:var(--ink);margin-bottom:4px">${esc(q)}</p><div class="yn">
          <button data-key="${key}" data-v="1" class="${v === 1 ? "on" : ""}">Yes</button>
          <button data-key="${key}" data-v="0" class="${v === 0 ? "on" : ""}">No</button></div>`;
      });
      html += `</div>`;
    });
    const complete = WEAK_POINTS.every((w, wi) => w.q.every((q, qi) => answers[wi + "_" + qi] !== undefined));
    if (complete) {
      html += `<h2>Your result</h2>`;
      let weakest = 0, lowest = 99;
      WEAK_POINTS.forEach((w, wi) => {
        const score = w.q.reduce((sum, q, qi) => sum + answers[wi + "_" + qi], 0);
        if (score < lowest) { lowest = score; weakest = wi; }
        const cls = score === 2 ? "g" : score === 1 ? "o" : "r";
        const label = score === 2 ? "Good" : score === 1 ? "To improve" : "Act now";
        html += `<div class="light ${cls}"><span class="dot"></span>${esc(w.name)} – ${label}</div>`;
      });
      html += `<div class="card"><h3 style="margin-top:0">Choose your first step (this week)</h3>
        <p>Suggested for: <b>${esc(WEAK_POINTS[weakest].name)}</b></p>
        ${WEAK_POINTS[weakest].steps.map(s => `<button class="choice ${chosen === s ? "sel" : ""}" data-step="${esc(s)}">${esc(s)}</button>`).join("")}
        ${chosen ? `<div class="fb ok">✅ Your first step: <b>${esc(chosen)}</b>. It's also on your checklist.</div>` : ""}</div>`;
    }
    app.innerHTML = html;
    app.querySelectorAll(".yn button").forEach(b => b.onclick = () => { answers[b.dataset.key] = +b.dataset.v; store.set("selfAnswers", answers); draw(); });
    app.querySelectorAll("[data-step]").forEach(b => b.onclick = () => { store.set("firstStep", b.dataset.step); markDone("self-check"); draw(); });
  };
  draw();
}

/* ---------- CHECKLIST: show the participant's first step + feedback link ---------- */
function renderChecklist() {
  markDone("checklist");
  const note = $("#my-note");
  if (note) { note.value = store.get("myNote", ""); note.oninput = () => store.set("myNote", note.value); }
  const step = store.get("firstStep", "");
  if (step) $("#my-step").innerHTML = `<div class="fb ok">🎯 <b>My first step this week:</b> ${esc(step)}</div>`;
  if (CONFIG.feedback && CONFIG.feedback.url) $("#feedback").innerHTML = linkButton(CONFIG.feedback);
}

/* ---------- HELP: extra exercises from config ---------- */
function renderHelpExtras() {
  const list = (CONFIG.extra || []).filter(e => e.url);
  if (!list.length) return;
  $("#extra").innerHTML = `<h2>Practise more</h2>` + list.map(e =>
    `<div class="card"><b>${esc(e.label)}</b>${e.note ? `<p style="margin:4px 0 0">${esc(e.note)}</p>` : ""}${linkButton(e)}</div>`).join("");
}
