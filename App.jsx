import { useState } from "react";

const TONES = ["Witty & Humorous", "Bold & Confident", "Premium & Minimal", "Friendly & Conversational", "Informative & Educational", "Playful & Gen-Z"];
const OBJECTIVES = ["Brand Awareness", "Product Promotion", "Engagement & Virality", "Community Building", "Launch Announcement", "Trend Participation"];
const INDUSTRIES = ["Tech / SaaS", "Fashion & Lifestyle", "Food & Beverage", "Finance & Fintech", "Health & Wellness", "E-commerce / Retail", "Entertainment", "Education", "Travel", "Automotive"];

const styleColors = {
  "Engaging":    { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
  "Promotional": { bg: "#FFF3E0", color: "#E65100", border: "#FFCC80" },
  "Witty":       { bg: "#F3E5F5", color: "#6A1B9A", border: "#CE93D8" },
  "Informative": { bg: "#E3F2FD", color: "#1565C0", border: "#90CAF9" },
  "Meme-style":  { bg: "#FCE4EC", color: "#880E4F", border: "#F48FB1" },
};

const LoadingDots = () => (
  <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
    {[0,1,2].map(i => (
      <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#F7C948", animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s`, display: "inline-block" }} />
    ))}
  </span>
);

export default function App() {
  const [form, setForm] = useState({ brandName: "", industry: "", objective: "", tone: "", products: "", extraContext: "" });
  const [phase, setPhase] = useState("form"); // form | loading | result
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.objective) { setError("Please select a campaign objective."); return; }
    setError("");
    setPhase("loading");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setPhase("result");
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setPhase("form");
    }
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    copy(result.tweets.map((t, i) => `${i+1}. ${t.text}`).join("\n\n"), "all");
  };

  const reset = () => { setPhase("form"); setResult(null); setForm({ brandName:"",industry:"",objective:"",tone:"",products:"",extraContext:"" }); };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#F0EDE6", fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1.1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .pill:hover { border-color: #F7C948 !important; color: #F7C948 !important; }
        .pill.on { background: #F7C948 !important; color: #0D0D0D !important; border-color: #F7C948 !important; font-weight: 600; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(247,201,72,0.1) !important; }
        .card { transition: all 0.2s ease; }
        .cpbtn:hover { background: #F7C948 !important; color: #0D0D0D !important; }
        .cpbtn { transition: all 0.15s; }
        .genbtn { transition: all 0.2s; }
        .genbtn:hover { background: #e6b800 !important; transform: scale(1.015); }
        input,textarea,select { outline: none; }
        input:focus,textarea:focus,select:focus { border-color: #F7C948 !important; }
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "#F7C948", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900 }}>✦</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 900, letterSpacing: -0.5 }}>TweetForge</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>AI Brand Tweet Generator</div>
          </div>
        </div>
        {phase === "result" && (
          <button onClick={reset} style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#888", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            ← New Brand
          </button>
        )}
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 20px" }}>

        {/* ── FORM ── */}
        {phase === "form" && (
          <div className="fade-up">
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 900, lineHeight: 1.12, marginBottom: 14 }}>
                Generate <span style={{ color: "#F7C948" }}>10 on-brand</span><br />tweets in seconds.
              </h1>
              <p style={{ color: "#777", fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 300 }}>Tell us about your brand. The AI handles the rest.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#666", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Brand Name</label>
                  <input value={form.brandName} onChange={e => set("brandName", e.target.value)} placeholder="e.g. Zomato, boAt, Apple…"
                    style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: "#F0EDE6", fontFamily: "'DM Sans',sans-serif", fontSize: 14, transition: "border-color 0.2s" }} />
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#666", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Industry</label>
                  <select value={form.industry} onChange={e => set("industry", e.target.value)}
                    style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: form.industry ? "#F0EDE6" : "#444", fontFamily: "'DM Sans',sans-serif", fontSize: 14, cursor: "pointer", appearance: "none", transition: "border-color 0.2s" }}>
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#666", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 9 }}>Campaign Objective <span style={{ color: "#F7C948" }}>*</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {OBJECTIVES.map(o => (
                    <button key={o} onClick={() => set("objective", o)} className={`pill${form.objective===o?" on":""}`}
                      style={{ background: "transparent", border: "1px solid #222", color: "#666", padding: "7px 15px", borderRadius: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#666", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 9 }}>Brand Tone <span style={{ color: "#444", fontSize: 10 }}>(optional — AI will infer if blank)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {TONES.map(t => (
                    <button key={t} onClick={() => set("tone", form.tone===t?"":t)} className={`pill${form.tone===t?" on":""}`}
                      style={{ background: "transparent", border: "1px solid #222", color: "#666", padding: "7px 15px", borderRadius: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#666", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 7 }}>About the Brand / Products</label>
                <textarea value={form.products} onChange={e => set("products", e.target.value)} rows={3}
                  placeholder="Describe what the brand sells, its USPs, recent campaigns, taglines…"
                  style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: "#F0EDE6", fontFamily: "'DM Sans',sans-serif", fontSize: 14, resize: "vertical", lineHeight: 1.6, transition: "border-color 0.2s" }} />
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#666", letterSpacing: 1.1, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Extra Instructions</label>
                <textarea value={form.extraContext} onChange={e => set("extraContext", e.target.value)} rows={2}
                  placeholder="e.g. Avoid competitor mentions, focus on festive season, include #XYZ…"
                  style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "11px 14px", color: "#F0EDE6", fontFamily: "'DM Sans',sans-serif", fontSize: 14, resize: "vertical", lineHeight: 1.6, transition: "border-color 0.2s" }} />
              </div>

              {error && <div style={{ color: "#ff6b6b", fontFamily: "'DM Sans',sans-serif", fontSize: 13, background: "#1a0a0a", border: "1px solid #3a1515", borderRadius: 8, padding: "10px 14px" }}>{error}</div>}

              <button onClick={generate} className="genbtn"
                style={{ background: "#F7C948", color: "#0D0D0D", border: "none", borderRadius: 12, padding: "15px", fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.2, marginTop: 6 }}>
                ✦ Generate 10 Tweets
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className="fade-up" style={{ textAlign: "center", padding: "90px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 22 }}>✦</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, marginBottom: 14 }}>Crafting your tweets…</h2>
            <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", marginBottom: 30 }}>Analysing brand voice · Writing 10 on-brand tweets</p>
            <LoadingDots />
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && result && (
          <div className="fade-up">
            {/* Brand Voice Card */}
            <div style={{ background: "#111", border: "1px solid #F7C948", borderRadius: 16, padding: "26px 28px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700 }}>{form.brandName || "Brand"} Voice Analysis</h2>
                  <p style={{ color: "#555", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 3 }}>Identified by AI</p>
                </div>
                <span style={{ background: "#F7C948", color: "#0D0D0D", borderRadius: 8, padding: "5px 13px", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 12 }}>
                  {result.brandVoice.tone}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                {[["Target Audience", result.brandVoice.audience], ["Personality", result.brandVoice.personality]].map(([label, val]) => (
                  <div key={label} style={{ background: "#0D0D0D", borderRadius: 10, padding: "13px 15px" }}>
                    <div style={{ fontSize: 10, color: "#444", letterSpacing: 1.1, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 5 }}>{label}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#bbb", lineHeight: 1.55 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#444", letterSpacing: 1.1, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 7 }}>Content Themes</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {result.brandVoice.themes.map(t => (
                    <span key={t} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 20, padding: "3px 11px", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#999" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tweets */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700 }}>10 Generated Tweets</h2>
              <button onClick={copyAll} className="cpbtn"
                style={{ background: "#161616", border: "1px solid #222", color: copied==="all"?"#F7C948":"#666", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
                {copied==="all" ? "✓ Copied All!" : "Copy All"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.tweets.map((tweet, i) => {
                const sc = styleColors[tweet.style] || styleColors["Engaging"];
                return (
                  <div key={tweet.id} className="card" style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 13, padding: "18px 20px", display: "flex", gap: 14 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, color: "#1e1e1e", lineHeight: 1, minWidth: 28, userSelect: "none" }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 0.4 }}>
                          {tweet.style}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, color: "#DDD" }}>{tweet.text}</p>
                      <div style={{ marginTop: 9, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#333" }}>{tweet.text.length}/280</span>
                        <button onClick={() => copy(tweet.text, tweet.id)} className="cpbtn"
                          style={{ background: "#161616", border: "1px solid #1e1e1e", color: copied===tweet.id?"#F7C948":"#555", padding: "4px 11px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11 }}>
                          {copied===tweet.id ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 28, textAlign: "center" }}>
              <button onClick={reset} className="genbtn"
                style={{ background: "#F7C948", color: "#0D0D0D", border: "none", borderRadius: 12, padding: "13px 30px", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                ✦ Try Another Brand
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
