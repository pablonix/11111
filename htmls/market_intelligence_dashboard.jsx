import { useState, useMemo } from "react";
import { LayoutDashboard, TrendingUp, Share2, Users, Lightbulb, ChevronRight, BarChart3, LayoutGrid } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList, Treemap,
} from "recharts";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const S = {
  bg:"#0F172A", surf:"#1E293B", hi:"#253347",
  border:"#334155", brt:"#475569",
  text:"#F1F5F9", sub:"#94A3B8", dim:"#64748B",
  indigo:"#6366F1", emerald:"#10B981", rose:"#F43F5E",
  amber:"#F59E0B", cyan:"#22D3EE", violet:"#8B5CF6",
};

const DCOLOR = {
  "investing.com":"#6366F1", "finance.yahoo.com":"#F59E0B",
  "marketwatch.com":"#10B981", "tradingview.com":"#EF4444",
  "seekingalpha.com":"#F97316", "barchart.com":"#22D3EE",
  "stockanalysis.com":"#8B5CF6", "coinmarketcap.com":"#06B6D4",
};

const CH_C = {
  Direct:S.indigo, Organic:S.emerald, Social:S.violet,
  Referrals:S.rose, Email:S.cyan, Paid:S.amber, Display:S.dim,
};
const CH_KEYS = ["Direct","Organic","Social","Referrals","Email","Paid","Display"];

const TREE_C = ["#6366F1","#8B5CF6","#22D3EE","#10B981","#F59E0B","#F43F5E","#3B82F6","#06B6D4","#A78BFA","#34D399","#FCD34D","#FC8181"];

/* ═══════════════════════════════════════════════
   DOMAIN DATA (pre-parsed, no citations)
═══════════════════════════════════════════════ */
const DOMAINS = [
  {
    domain:"investing.com", short:"investing",
    visitsM:539.6, bounce:54.93, dur:"4:33", desk:38.14, mob:61.86,
    ch:{ Direct:52.22, Organic:36.48, Social:4.70, Referrals:3.84, Email:0.97, Paid:0.70, Display:0.56 },
    refs:[
      {u:"msn.com",s:5.03},{u:"yandex.ru",s:4.18},{u:"yahoo.com",s:4.00},{u:"paramedya.com",s:3.91},
      {u:"finanzaonline.com",s:3.70},{u:"finanznachrichten.de",s:2.52},{u:"tradingview.com",s:2.20},
      {u:"forexpros.com",s:2.10},{u:"drudgereport.com",s:2.00},{u:"bit.ly",s:1.66},
      {u:"app.meltwater.com",s:1.55},{u:"wooyupost.com",s:1.40},
    ],
    affinity:["finance.yahoo.com","tradingview.com","marketwatch.com","cnbc.com","bloomberg.com","nasdaq.com","seekingalpha.com"],
  },
  {
    domain:"finance.yahoo.com", short:"yahoo fin.",
    visitsM:642.2, bounce:56.25, dur:"4:24", desk:60.09, mob:39.91,
    ch:{ Direct:50.40, Organic:27.88, Social:2.85, Referrals:15.78, Email:2.48, Paid:0.02, Display:0.27 },
    refs:[
      {u:"yahoo.com",s:82.59},{u:"consent.yahoo.com",s:10.11},{u:"news.yahoo.com",s:8.28},
      {u:"mail.yahoo.com",s:2.78},{u:"finviz.com",s:2.57},{u:"drudgereport.com",s:0.87},
      {u:"cnn.com",s:0.70},{u:"theguardian.com",s:0.49},{u:"nytimes.com",s:0.46},
      {u:"cnbc.com",s:0.36},{u:"foxnews.com",s:0.36},{u:"wikipedia.org",s:0.32},
    ],
    affinity:["cnbc.com","bloomberg.com","marketwatch.com","investing.com","tradingview.com","seekingalpha.com","wsj.com"],
  },
  {
    domain:"marketwatch.com", short:"marketwatch",
    visitsM:100.7, bounce:58.38, dur:"4:03", desk:53.44, mob:46.56,
    ch:{ Direct:68.15, Organic:20.16, Social:2.96, Referrals:3.30, Email:2.25, Paid:0.33, Display:2.42 },
    refs:[
      {u:"drudgereport.com",s:31.56},{u:"wsj.com",s:19.14},{u:"finviz.com",s:10.25},
      {u:"stockanalysis.com",s:5.01},{u:"yahoo.com",s:2.69},{u:"barrons.com",s:1.18},
      {u:"msn.com",s:1.12},{u:"news.ycombinator.com",s:1.04},{u:"cnbc.com",s:0.93},
      {u:"newsfilecorp.com",s:0.92},{u:"kadaza.com",s:0.88},{u:"cnn.com",s:0.88},
    ],
    affinity:["finance.yahoo.com","cnbc.com","seekingalpha.com","bloomberg.com","investing.com","tradingview.com","barrons.com"],
  },
  {
    domain:"tradingview.com", short:"tradingview",
    visitsM:730.9, bounce:47.63, dur:"4:27", desk:73.53, mob:26.47,
    ch:{ Direct:69.14, Organic:16.01, Social:8.18, Referrals:3.16, Email:1.41, Paid:0.30, Display:0.91 },
    refs:[
      {u:"tradovate.com",s:22.34},{u:"msn.com",s:7.13},{u:"chartink.com",s:3.32},
      {u:"gate.com",s:2.46},{u:"oxaam.com",s:2.40},{u:"cryptobubbles.net",s:2.40},
      {u:"sekai-kabuka.com",s:1.83},{u:"pepperstone.com",s:1.65},{u:"moneycontrol.com",s:1.43},
      {u:"secure.icmarkets.com",s:1.41},{u:"tradefinder.in",s:1.33},{u:"goldprice.org",s:1.29},
    ],
    affinity:["investing.com","finance.yahoo.com","finviz.com","marketwatch.com","coinmarketcap.com","cnbc.com","nasdaq.com"],
  },
  {
    domain:"seekingalpha.com", short:"seekingalpha",
    visitsM:55.54, bounce:41.42, dur:"5:11", desk:65.05, mob:34.95,
    ch:{ Direct:54.21, Organic:17.25, Social:2.28, Referrals:5.80, Email:12.44, Paid:4.09, Display:2.60 },
    refs:[
      {u:"stockanalysis.com",s:25.93},{u:"robinhood.com",s:9.28},{u:"msn.com",s:5.99},
      {u:"webull.com",s:5.47},{u:"finviz.com",s:5.37},{u:"marketbeat.com",s:4.62},
      {u:"yahoo.com",s:2.78},{u:"markets.businessinsider.com",s:2.61},{u:"finanznachrichten.de",s:1.89},
      {u:"go.rocket.chat",s:1.77},{u:"api.quotemedia.com",s:1.51},{u:"rememberthemilk.com",s:1.48},
    ],
    affinity:["finance.yahoo.com","marketbeat.com","tipranks.com","marketwatch.com","nasdaq.com","fool.com","tradingview.com"],
  },
  {
    domain:"barchart.com", short:"barchart",
    visitsM:25.29, bounce:43.97, dur:"21:07", desk:67.04, mob:32.96,
    ch:{ Direct:61.28, Organic:21.25, Social:8.61, Referrals:3.47, Email:3.41, Paid:0.02, Display:0.55 },
    refs:[
      {u:"yahoo.com",s:37.21},{u:"shesaidyes.com",s:4.36},{u:"abnewswire.com",s:4.29},
      {u:"finanznachrichten.de",s:3.70},{u:"theglobeandmail.com",s:3.10},{u:"app.impact.com",s:3.02},
      {u:"hub.marfeel.com",s:2.64},{u:"tradingview.com",s:2.04},{u:"msn.com",s:1.87},
      {u:"freeagentminds.com",s:1.80},{u:"app.stocktrak.com",s:1.60},{u:"tradingeconomics.com",s:1.59},
    ],
    affinity:["tradingview.com","finviz.com","investing.com","finance.yahoo.com","marketwatch.com","nasdaq.com","seekingalpha.com"],
  },
  {
    domain:"stockanalysis.com", short:"stockanalysis",
    visitsM:23.72, bounce:38.97, dur:"6:55", desk:60.47, mob:39.53,
    ch:{ Direct:60.51, Organic:30.24, Social:2.90, Referrals:4.00, Email:1.12, Paid:0.02, Display:0.17 },
    refs:[
      {u:"stockanalysis.knoji.com",s:13.44},{u:"yahoo.com",s:8.50},{u:"affiliateprogramdb.com",s:6.24},
      {u:"google.com",s:5.99},{u:"substack.com",s:5.61},{u:"dividendjournal.com",s:5.03},
      {u:"beehiiv.com",s:3.98},{u:"search.mail.com",s:3.82},{u:"uga.view.usg.edu",s:2.78},
      {u:"copilot.com",s:2.70},{u:"topdividendetfs.com",s:2.45},{u:"wallstreetzen.com",s:2.38},
    ],
    affinity:["finance.yahoo.com","investing.com","seekingalpha.com","nasdaq.com","morningstar.com","marketwatch.com","tradingview.com"],
  },
  {
    domain:"coinmarketcap.com", short:"coinmktcap",
    visitsM:156.1, bounce:null, dur:"N/A", desk:null, mob:null,
    ch:{ Direct:66.60, Organic:19.39, Social:6.96, Referrals:3.70, Email:1.81, Paid:0.01, Display:0.99 },
    refs:[
      {u:"whitebit.com",s:24.40},{u:"gate.com",s:5.35},{u:"msn.com",s:2.85},
      {u:"venice.ai",s:1.96},{u:"app.meltwater.com",s:1.72},{u:"coinw.com",s:1.71},
      {u:"coinsutra.com",s:1.56},{u:"1bank.com",s:1.46},{u:"nikkei225jp.com",s:1.28},
      {u:"filmoviplex.com",s:1.22},{u:"binance.com",s:1.21},{u:"yandex.ru",s:1.15},
    ],
    affinity:["kucoin.com","coingecko.com","binance.com","tradingview.com","gate.com","bitget.com","kraken.com"],
  },
];

/* ═══════════════════════════════════════════════
   DERIVED DATASETS
═══════════════════════════════════════════════ */
const MACRO_DATA = DOMAINS.map(d => ({ name: d.short, domain: d.domain, ...d.ch }));

const GRAVITY_DATA = (() => {
  const m = {};
  DOMAINS.forEach(d => d.affinity.forEach(a => { m[a] = (m[a] || 0) + 1; }));
  return Object.entries(m).map(([domain, count]) => ({ domain, count }))
    .sort((a,b) => b.count - a.count).slice(0, 12);
})();

const TOP_AFF = ["tradingview.com","finance.yahoo.com","marketwatch.com","nasdaq.com","seekingalpha.com","cnbc.com","bloomberg.com","investing.com"];

/* ═══════════════════════════════════════════════
   TOOLTIP COMPONENTS
═══════════════════════════════════════════════ */
const TT = { background:S.hi, border:`0.5px solid ${S.brt}`, borderRadius:"9px", padding:"10px 14px", fontSize:"12px", color:S.text, boxShadow:"none" };

function MacroTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const items = [...payload].reverse().filter(p => p.value > 0);
  return (
    <div style={TT}>
      <div style={{ fontWeight:500, marginBottom:"7px", paddingBottom:"6px", borderBottom:`0.5px solid ${S.border}` }}>{label}</div>
      {items.map(p => (
        <div key={p.name} style={{ display:"flex", justifyContent:"space-between", gap:"20px", marginBottom:"3px" }}>
          <span style={{ display:"flex", alignItems:"center", gap:"5px", color:S.sub }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"2px", background:p.fill, display:"inline-block" }} />
            {p.name}
          </span>
          <span style={{ fontWeight:500 }}>{p.value.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
}

function RefTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={TT}>
      <div style={{ fontWeight:500, marginBottom:"4px" }}>{d.u}</div>
      <div style={{ color:S.sub }}>Share of referrals: <span style={{ color:S.cyan, fontWeight:500 }}>{d.s.toFixed(2)}%</span></div>
    </div>
  );
}

function GravTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT}>
      <div style={{ fontWeight:500, marginBottom:"4px" }}>{label}</div>
      <div style={{ color:S.sub }}>Gravity score: <span style={{ color:S.indigo, fontWeight:500 }}>{payload[0].value} of 8</span> affinity lists</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TREEMAP CELL
═══════════════════════════════════════════════ */
function TreeCell({ x, y, width, height, name, s, tcolor }) {
  if (!width || !height || width < 2 || height < 2) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height}
        fill={tcolor || S.indigo} stroke={S.bg} strokeWidth={2} rx={3} />
      {width > 52 && height > 20 && (
        <text x={x + 6} y={y + 15} fill="rgba(255,255,255,0.9)" fontSize={10} fontWeight="500">
          {typeof name === "string" && name.length > 15 ? name.slice(0, 13) + "…" : name}
        </text>
      )}
      {width > 52 && height > 33 && (
        <text x={x + 6} y={y + 28} fill="rgba(255,255,255,0.55)" fontSize={9}>
          {typeof s === "number" ? s.toFixed(1) + "%" : ""}
        </text>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════
   INSIGHT BOX
═══════════════════════════════════════════════ */
function InsightBox({ items }) {
  return (
    <div style={{ marginTop:"16px", background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", overflow:"hidden" }}>
      <div style={{ padding:"9px 14px", background:"#111827", borderBottom:`0.5px solid ${S.border}`, display:"flex", alignItems:"center", gap:"7px" }}>
        <Lightbulb size={13} color={S.amber} />
        <span style={{ fontSize:"11px", fontWeight:500, color:S.sub, textTransform:"uppercase", letterSpacing:"0.07em" }}>Agency insights</span>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ padding:"11px 14px", borderBottom: i < items.length-1 ? `0.5px solid ${S.border}` : "none", display:"flex", gap:"10px" }}>
          <div style={{ width:"18px", height:"18px", borderRadius:"4px", background:it.color+"22", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
            <ChevronRight size={11} color={it.color} />
          </div>
          <p style={{ margin:0, fontSize:"12px", color:S.sub, lineHeight:"1.65" }}>
            <span style={{ fontWeight:500, color:it.color }}>{it.title} — </span>{it.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 1 — EXECUTIVE OVERVIEW
═══════════════════════════════════════════════ */
function ExecutiveTab() {
  const kpis = [
    { label:"Traffic leader",    val:"TradingView",    sub:"730.9M visits",    color:S.indigo  },
    { label:"Fastest growing",   val:"StockAnalysis",  sub:"+15.73% growth",   color:S.emerald },
    { label:"Best engagement",   val:"Barchart",       sub:"21:07 avg session", color:S.cyan   },
    { label:"Email retention",   val:"SeekingAlpha",   sub:"12.44% via email", color:S.rose    },
  ];
  const insights = [
    { color:S.emerald, title:"StockAnalysis is the only platform growing", body:"At +15.73% growth, it defies category-wide contraction. Its dividend-history keyword cluster (qqqi dividend history, schd dividend history) is a high-intent, low-competition content template investing.com should replicate at scale." },
    { color:S.amber,   title:"Barchart's 21:07 session duration is structural, not statistical", body:"Over 20× the industry average session time signals professional traders using Barchart as a primary workflow terminal. This depth of engagement cannot be created through SEO alone — it requires product integration." },
    { color:S.rose,    title:"Investing.com's mobile-engagement gap is the most exploitable weakness", body:"61.86% mobile traffic (highest in set) but only 2.80 pages/visit. TradingView achieves 8.65 pages/visit on a 73% desktop audience. Mobile Core Web Vitals and in-app content depth are the immediate fix — and a competitive opening." },
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"10px", marginBottom:"14px" }}>
        {kpis.map((k,i) => (
          <div key={i} style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", padding:"13px 15px" }}>
            <div style={{ fontSize:"10px", color:S.dim, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"6px" }}>{k.label}</div>
            <div style={{ fontSize:"15px", fontWeight:500, color:k.color }}>{k.val}</div>
            <div style={{ fontSize:"11px", color:S.sub, marginTop:"3px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background:S.hi }}>
                {["Domain","Visits","Bounce","Duration","Desktop","Mobile split"].map(h => (
                  <th key={h} style={{ padding:"9px 12px", textAlign:h==="Domain"?"left":"right", fontWeight:500, fontSize:"11px", color:S.sub, whiteSpace:"nowrap", borderBottom:`0.5px solid ${S.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOMAINS.map((d) => (
                <tr key={d.domain} style={{ borderBottom:`0.5px solid ${S.border}` }}>
                  <td style={{ padding:"9px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                      <span style={{ width:"8px", height:"8px", borderRadius:"2px", background:DCOLOR[d.domain], display:"inline-block", flexShrink:0 }} />
                      <span style={{ fontWeight:500 }}>{d.domain}</span>
                    </div>
                  </td>
                  <td style={{ padding:"9px 12px", textAlign:"right", fontWeight:500 }}>{d.visitsM}M</td>
                  <td style={{ padding:"9px 12px", textAlign:"right", color: d.bounce === null ? S.dim : d.bounce > 55 ? S.rose : d.bounce < 44 ? S.emerald : S.text }}>
                    {d.bounce !== null ? `${d.bounce}%` : "—"}
                  </td>
                  <td style={{ padding:"9px 12px", textAlign:"right", color: d.dur === "21:07" ? S.cyan : S.text }}>{d.dur}</td>
                  <td style={{ padding:"9px 12px", textAlign:"right" }}>{d.desk !== null ? `${d.desk}%` : "—"}</td>
                  <td style={{ padding:"9px 12px" }}>
                    {d.mob !== null ? (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:"6px" }}>
                        <div style={{ width:"48px", height:"4px", borderRadius:"2px", background:S.border, overflow:"hidden" }}>
                          <div style={{ width:`${d.mob}%`, height:"100%", background:S.violet, borderRadius:"2px" }} />
                        </div>
                        <span style={{ fontSize:"11px" }}>{d.mob}%</span>
                      </div>
                    ) : <span style={{ color:S.dim, textAlign:"right", display:"block" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <InsightBox items={insights} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 2 — TRAFFIC ACQUISITION
═══════════════════════════════════════════════ */
function AcquisitionTab() {
  const insights = [
    { color:S.rose,    title:"SeekingAlpha's 12.44% email share is an algorithm-proof moat", body:"Email-acquired traffic is 4–12× higher than all competitors. Direct email subscribers monetize at higher yields than SEO visitors. Investing.com's 0.97% email share is the biggest strategic gap in this dataset." },
    { color:S.indigo,  title:"TradingView's 69.14% direct traffic signals unmatched brand loyalty", body:"The highest direct share in the set means TradingView's audience navigates to it deliberately — not via Google. This is the definition of a moat: a brand so embedded in workflow that SEO competitors cannot disrupt it through keyword rankings alone." },
    { color:S.emerald, title:"Investing.com's 36.48% organic share is maximum Google dependency", body:"The highest organic share is simultaneously the greatest strength and the greatest risk. A core algorithm update that demotes financial data pages would remove more than a third of investing.com's traffic overnight. Diversification into direct and email channels is a strategic imperative." },
  ];

  return (
    <div>
      <div style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", padding:"18px" }}>
        <div style={{ marginBottom:"12px" }}>
          <h2 style={{ margin:"0 0 3px", fontSize:"14px", fontWeight:500 }}>Channel distribution across all domains</h2>
          <p style={{ margin:"0 0 12px", fontSize:"11px", color:S.sub }}>Percentage share of total traffic by acquisition channel</p>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            {CH_KEYS.map(k => (
              <span key={k} style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", color:S.sub }}>
                <span style={{ width:"9px", height:"9px", borderRadius:"2px", background:CH_C[k], display:"inline-block" }} />
                {k}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={MACRO_DATA.length * 44 + 40}>
          <BarChart data={MACRO_DATA} layout="vertical" margin={{ top:0, right:12, bottom:0, left:96 }}>
            <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" domain={[0,100]} tick={{ fontSize:11, fill:S.dim }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:S.sub }} tickLine={false} axisLine={false} width={96} />
            <Tooltip content={<MacroTip />} cursor={{ fill:"rgba(255,255,255,0.025)" }} />
            {CH_KEYS.map(k => <Bar key={k} dataKey={k} stackId="s" fill={CH_C[k]} maxBarSize={26} />)}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"9px", marginTop:"12px" }}>
        {CH_KEYS.map(ch => {
          const top = [...DOMAINS].sort((a,b) => (b.ch[ch]||0) - (a.ch[ch]||0))[0];
          return (
            <div key={ch} style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"8px", padding:"10px 12px", borderTop:`2px solid ${CH_C[ch]}` }}>
              <div style={{ fontSize:"10px", color:S.dim, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>{ch}</div>
              <div style={{ fontSize:"14px", fontWeight:500, color:CH_C[ch] }}>{top.ch[ch].toFixed(1)}%</div>
              <div style={{ fontSize:"10px", color:S.sub }}>{top.short}</div>
            </div>
          );
        })}
      </div>
      <InsightBox items={insights} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 3 — REFERRAL & PR ECOSYSTEM
═══════════════════════════════════════════════ */
function ReferralTab() {
  const [sel, setSel] = useState("marketwatch.com");
  const [mode, setMode] = useState("bar"); // "bar" | "tree"

  const activeD = useMemo(() => DOMAINS.find(d => d.domain === sel), [sel]);

  const barData = useMemo(() =>
    activeD ? [...activeD.refs].sort((a,b) => a.s - b.s) : [], [activeD]);

  const treeData = useMemo(() =>
    activeD ? activeD.refs.map((r,i) => ({ name: r.u, s: r.s, tcolor: TREE_C[i] })) : [], [activeD]);

  const maxS = barData.length ? barData[barData.length - 1].s : 1;

  const insights = [
    { color:S.rose,    title:"MarketWatch gets 31.56% of referrals from DrudgeReport alone", body:"This is a catastrophic single-point-of-failure. One editorial relationship change or algorithm update removes a third of all referral traffic overnight. No SEO playbook can mitigate it — only diversification can." },
    { color:S.amber,   title:"Yahoo Finance's 82.59% internal referral loop is structurally unassailable", body:"Yahoo.com, consent.yahoo.com, news.yahoo.com, and mail.yahoo.com collectively dominate all measured referral traffic. Only finviz.com (2.57%) breaks through. No external PR campaign can replicate Yahoo's internal amplification flywheel." },
    { color:S.cyan,    title:"StockAnalysis.com punches far above its weight as a referral source", body:"Despite being the smallest domain by volume, stockanalysis.com appears as the #1 referrer to seekingalpha.com (25.93%) and #4 to marketwatch.com (5.01%). Content cross-pollination at this scale from a small competitor is a digital PR model worth studying." },
  ];

  const toggleBtn = (label, id, Icon) => (
    <button onClick={() => setMode(id)} style={{
      display:"flex", alignItems:"center", gap:"5px",
      padding:"5px 11px", borderRadius:"6px", fontSize:"11px", fontWeight:500,
      border:"none", cursor:"pointer",
      background: mode === id ? S.hi : "transparent",
      color: mode === id ? S.cyan : S.dim,
      outline: mode === id ? `1px solid ${S.brt}` : "none",
    }}>
      <Icon size={12} />{label}
    </button>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"12px" }}>
        {DOMAINS.map(d => (
          <button key={d.domain} onClick={() => setSel(d.domain)} style={{
            padding:"5px 12px", borderRadius:"6px", fontSize:"11px", fontWeight:500,
            border:"none", cursor:"pointer",
            background: sel === d.domain ? DCOLOR[d.domain]+"25" : S.surf,
            color: sel === d.domain ? DCOLOR[d.domain] : S.sub,
            outline: sel === d.domain ? `1px solid ${DCOLOR[d.domain]}60` : `0.5px solid ${S.border}`,
          }}>{d.short}</button>
        ))}
      </div>

      {activeD && (
        <div style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px", flexWrap:"wrap", gap:"8px" }}>
            <div>
              <h2 style={{ margin:"0 0 3px", fontSize:"14px", fontWeight:500 }}>
                Top referrers — <span style={{ color:DCOLOR[activeD.domain] }}>{activeD.domain}</span>
              </h2>
              <p style={{ margin:0, fontSize:"11px", color:S.sub }}>Share of total referral traffic per source</p>
            </div>
            <div style={{ display:"flex", gap:"4px", background:S.hi, padding:"3px", borderRadius:"7px" }}>
              {toggleBtn("Bar chart", "bar", BarChart3)}
              {toggleBtn("Treemap", "tree", LayoutGrid)}
            </div>
          </div>

          {mode === "bar" && (
            <ResponsiveContainer width="100%" height={barData.length * 40 + 36}>
              <BarChart data={barData} layout="vertical" margin={{ top:0, right:52, bottom:0, left:160 }}>
                <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[0, maxS * 1.12]} tick={{ fontSize:11, fill:S.dim }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(0)}%`} />
                <YAxis type="category" dataKey="u" tick={{ fontSize:11, fill:S.sub }} tickLine={false} axisLine={false} width={160} />
                <Tooltip content={<RefTip />} cursor={{ fill:"rgba(255,255,255,0.025)" }} />
                <Bar dataKey="s" radius={[0,4,4,0]} maxBarSize={20}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={TREE_C[barData.length - 1 - i] || S.indigo} />
                  ))}
                  <LabelList dataKey="s" position="right"
                    style={{ fontSize:"11px", fill:S.dim, fontWeight:500 }}
                    formatter={v => `${v.toFixed(2)}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {mode === "tree" && (
            <div style={{ width:"100%", height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <Treemap data={treeData} dataKey="s" content={<TreeCell />}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload || {};
                      return (
                        <div style={TT}>
                          <div style={{ fontWeight:500, marginBottom:"4px" }}>{d.name}</div>
                          <div style={{ color:S.sub }}>Share: <span style={{ color:S.cyan, fontWeight:500 }}>{typeof d.s === "number" ? d.s.toFixed(2) : ""}%</span></div>
                        </div>
                      );
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
      <InsightBox items={insights} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 4 — AUDIENCE AFFINITY
═══════════════════════════════════════════════ */
function AffinityTab() {
  const insights = [
    { color:S.indigo,  title:"TradingView has the highest market gravity of any external domain", body:"Appearing in 7 of 8 competitor affinity lists — including the crypto cluster (coinmarketcap) and all traditional finance domains — TradingView is the single most leveraged PR and partnership target in the ecosystem. A data integration or co-branded feature with TradingView reaches every segment simultaneously." },
    { color:S.violet,  title:"CoinMarketCap's affinity cluster is entirely isolated from traditional finance", body:"KuCoin, CoinGecko, Binance, Gate.io, Bitget, Kraken — 100% crypto exchanges. Not one traditional finance domain appears. This confirms that the crypto audience requires a completely separate content taxonomy, keyword universe, and PR playbook. Traditional finance SEO will find zero organic audience bridge." },
    { color:S.amber,   title:"CNBC's gravity (4 lists) is disproportionate for a general news brand", body:"CNBC appears in investing.com, finance.yahoo.com, marketwatch.com, and tradingview.com affinity lists — more than Bloomberg. This suggests financial editorial segments on CNBC have cross-market amplification that a standard 'financial media outreach' plan consistently underestimates." },
  ];

  return (
    <div>
      <div style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", padding:"18px", marginBottom:"12px" }}>
        <div style={{ marginBottom:"14px" }}>
          <h2 style={{ margin:"0 0 3px", fontSize:"14px", fontWeight:500 }}>Market gravity score</h2>
          <p style={{ margin:0, fontSize:"11px", color:S.sub }}>How many times each external domain appears across all 8 analyzed competitors' audience affinity lists</p>
        </div>
        <ResponsiveContainer width="100%" height={GRAVITY_DATA.length * 34 + 36}>
          <BarChart data={GRAVITY_DATA} layout="vertical" margin={{ top:0, right:50, bottom:0, left:130 }}>
            <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" domain={[0,9]} tick={{ fontSize:11, fill:S.dim }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="domain" tick={{ fontSize:11, fill:S.sub }} tickLine={false} axisLine={false} width={130} />
            <Tooltip content={<GravTip />} cursor={{ fill:"rgba(255,255,255,0.025)" }} />
            <Bar dataKey="count" radius={[0,4,4,0]} maxBarSize={20}>
              {GRAVITY_DATA.map((d,i) => (
                <Cell key={i} fill={DCOLOR[d.domain] || (i < 3 ? S.indigo : i < 6 ? S.violet : S.dim)} />
              ))}
              <LabelList dataKey="count" position="right"
                style={{ fontSize:"11px", fill:S.dim, fontWeight:500 }}
                formatter={v => `${v}/8`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background:S.surf, border:`0.5px solid ${S.border}`, borderRadius:"10px", overflow:"hidden" }}>
        <div style={{ padding:"12px 14px", borderBottom:`0.5px solid ${S.border}` }}>
          <h2 style={{ margin:"0 0 2px", fontSize:"14px", fontWeight:500 }}>Affinity connection matrix</h2>
          <p style={{ margin:0, fontSize:"11px", color:S.sub }}>Which analyzed domains share each top external domain in their affinity lists</p>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11px" }}>
            <thead>
              <tr style={{ background:S.hi }}>
                <th style={{ padding:"8px 12px", textAlign:"left", fontWeight:500, color:S.sub, whiteSpace:"nowrap", borderBottom:`0.5px solid ${S.border}`, minWidth:"110px" }}>Domain</th>
                {TOP_AFF.map(a => (
                  <th key={a} style={{ padding:"8px 8px", textAlign:"center", fontWeight:400, color:S.dim, whiteSpace:"nowrap", borderBottom:`0.5px solid ${S.border}`, fontSize:"10px", maxWidth:"80px" }}>
                    {a.replace(".com","").replace("finance.","yahoo-")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOMAINS.map((d,ri) => (
                <tr key={d.domain} style={{ borderBottom:`0.5px solid ${S.border}` }}>
                  <td style={{ padding:"8px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <span style={{ width:"7px", height:"7px", borderRadius:"2px", background:DCOLOR[d.domain], display:"inline-block", flexShrink:0 }} />
                      <span style={{ fontWeight:500, fontSize:"11px" }}>{d.short}</span>
                    </div>
                  </td>
                  {TOP_AFF.map(a => {
                    const has = d.affinity.includes(a);
                    return (
                      <td key={a} style={{ padding:"8px", textAlign:"center" }}>
                        {has ? (
                          <span style={{ display:"inline-block", width:"14px", height:"14px", borderRadius:"3px", background:DCOLOR[a]||S.indigo, opacity:0.85 }} />
                        ) : (
                          <span style={{ display:"inline-block", width:"14px", height:"14px", borderRadius:"3px", background:S.border }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"8px 14px", borderTop:`0.5px solid ${S.border}`, display:"flex", gap:"16px", flexWrap:"wrap" }}>
          <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"10px", color:S.dim }}>
            <span style={{ width:"10px", height:"10px", borderRadius:"2px", background:S.indigo, display:"inline-block" }} />
            In affinity list
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"10px", color:S.dim }}>
            <span style={{ width:"10px", height:"10px", borderRadius:"2px", background:S.border, display:"inline-block" }} />
            Not included
          </span>
        </div>
      </div>
      <InsightBox items={insights} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT DASHBOARD
═══════════════════════════════════════════════ */
export default function Dashboard() {
  const [tab, setTab] = useState("exec");

  const tabs = [
    { id:"exec",     label:"Executive overview",       Icon:LayoutDashboard },
    { id:"acq",      label:"Traffic acquisition",      Icon:TrendingUp       },
    { id:"ref",      label:"Referral ecosystem",       Icon:Share2           },
    { id:"affinity", label:"Audience affinity",        Icon:Users            },
  ];

  return (
    <div style={{ background:S.bg, minHeight:"100vh", fontFamily:"var(--font-sans)", color:S.text }}>

      {/* ── Header ── */}
      <header style={{ background:S.surf, borderBottom:`0.5px solid ${S.border}`, padding:"14px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <div style={{ fontSize:"10px", fontWeight:500, color:S.indigo, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"3px" }}>
              Market intelligence · Feb – Apr 2026
            </div>
            <h1 style={{ margin:"0 0 2px", fontSize:"18px", fontWeight:500 }}>Competitive landscape — financial media ecosystem</h1>
            <p style={{ margin:0, fontSize:"12px", color:S.sub }}>8 domains · SimilarWeb analytics · tier-1 agency analysis</p>
          </div>
          <div style={{ display:"flex", gap:"2px", background:S.hi, padding:"3px", borderRadius:"10px", border:`0.5px solid ${S.border}`, flexWrap:"wrap" }}>
            {tabs.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                display:"flex", alignItems:"center", gap:"6px",
                padding:"7px 13px", borderRadius:"8px", fontSize:"12px", fontWeight:500,
                border:"none", cursor:"pointer",
                background: tab === id ? S.surf : "transparent",
                color: tab === id ? S.text : S.dim,
                outline: tab === id ? `0.5px solid ${S.brt}` : "none",
                transition:"all 0.1s",
              }}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main style={{ padding:"20px" }}>
        {tab === "exec"     && <ExecutiveTab />}
        {tab === "acq"      && <AcquisitionTab />}
        {tab === "ref"      && <ReferralTab />}
        {tab === "affinity" && <AffinityTab />}
      </main>
    </div>
  );
}
