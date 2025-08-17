// ====== Daily Quote (Vanilla JS) ======
// 設定
const DQ_QUOTES = [
  { id: 1,  text: "你的感受值得被看見。", theme: "接納" },
  { id: 2,  text: "把注意力放在能改變的事物上。", theme: "專注" },
  { id: 3,  text: "先照顧自己，才能照顧世界。", theme: "自我關懷" },
  { id: 4,  text: "情緒像海浪，來了，也會退去。", theme: "覺察" },
  { id: 5,  text: "今天只要前進 1% 就好。", theme: "漸進" },
  { id: 6,  text: "請為自己做一件小小的好事。", theme: "善待" },
  { id: 7,  text: "深呼吸三次，給自己一個重啟。", theme: "呼吸" },
  { id: 8,  text: "不急著成為誰，先成為喜歡自己的你。", theme: "自我" },
  { id: 9,  text: "把喜歡留給今天，把焦慮交給明天。", theme: "當下" },
  { id: 10, text: "你已做得很好，值得被肯定。", theme: "肯定" }
];

const DQ_KEYS = {
  FAVS: "dq:favs",
  SHOWN: "dq:shownIndex",
  LAST_DATE: "dq:lastDate",
  SHUFFLE_COUNT: "dq:shuffleCount"
};

const DQ_LIMIT = 2;

// 工具函式
const dqPad = (n) => String(n).padStart(2, "0");
const dqTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${dqPad(d.getMonth()+1)}-${dqPad(d.getDate())}`;
};
const dqGet = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } };
const dqSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let dqFavs = dqGet(DQ_KEYS.FAVS, []);
let dqIndex = (() => {
  const lastDate = dqGet(DQ_KEYS.LAST_DATE, "");
  const tKey = dqTodayKey();
  if (lastDate === tKey) return dqGet(DQ_KEYS.SHOWN, 0);
  const base = new Date().getDate() % DQ_QUOTES.length;
  dqSet(DQ_KEYS.LAST_DATE, tKey);
  dqSet(DQ_KEYS.SHUFFLE_COUNT, 0);
  dqSet(DQ_KEYS.SHOWN, base);
  return base;
})();
let dqShuffleCount = dqGet(DQ_KEYS.SHUFFLE_COUNT, 0);

const dqRoot = () => document.getElementById("daily-quote-root");

function dqRender() {
  const root = dqRoot();
  if (!root) return;
  const q = DQ_QUOTES[dqIndex];
  const favOn = dqFavs.includes(q.id);
  root.innerHTML = `
    <div class="dq-card">
      <div class="dq-head"><span class="dq-icon">🌿</span><div><div class="dq-title">每日提示語</div><div class="dq-sub">主題：${q.theme}</div></div></div>
      <p class="dq-text">${q.text}</p>
      <div class="dq-actions">
        <button class="dq-btn" id="dq-shuffle">換一句（今日 ${dqShuffleCount}/${DQ_LIMIT}）</button>
        <button class="dq-btn" id="dq-share">分享</button>
        <button class="dq-btn dq-fav ${favOn ? "is-on" : ""}" id="dq-fav">${favOn ? "已收藏 ★" : "收藏 ★"}</button>
      </div>
    </div>`;
  document.getElementById("dq-shuffle").onclick = dqShuffle;
  document.getElementById("dq-share").onclick = dqShare;
  document.getElementById("dq-fav").onclick = () => dqToggleFav(q.id);
}

function dqShuffle() {
  const tKey = dqTodayKey();
  let count = dqShuffleCount;
  if (dqGet(DQ_KEYS.LAST_DATE, "") !== tKey) { dqSet(DQ_KEYS.LAST_DATE, tKey); count = 0; }
  if (count >= DQ_LIMIT) { alert(`今天已換過 ${DQ_LIMIT} 次，明天再試 🙂`); return; }
  let nextIdx = dqIndex;
  for (let i=0;i<8;i++) { const r = Math.floor(Math.random()*DQ_QUOTES.length); if (r!==dqIndex){ nextIdx=r; break; } }
  dqIndex=nextIdx; dqSet(DQ_KEYS.SHOWN,dqIndex);
  dqShuffleCount=++count; dqSet(DQ_KEYS.SHUFFLE_COUNT,count);
  dqRender();
}
function dqToggleFav(id) { if (dqFavs.includes(id)) dqFavs = dqFavs.filter(x=>x!==id); else dqFavs=[...dqFavs,id]; dqSet(DQ_KEYS.FAVS,dqFavs); dqRender(); }
async function dqShare(){ const q=DQ_QUOTES[dqIndex]; const text=`【每日提示語】${q.text}（#${q.theme}）`; if(navigator.share){try{await navigator.share({text});}catch{}} else {try{await navigator.clipboard.writeText(text); alert("已複製，貼到 LINE / IG / Messenger 即可！");}catch{alert(text);} }}

document.addEventListener("DOMContentLoaded", dqRender);
