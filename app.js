// v6.1 防雙觸發修正：只綁一次點擊事件（無 inline onclick）
function safeLoad(){
  try{const raw=localStorage.getItem('moodRecords');const arr=raw?JSON.parse(raw):[];return Array.isArray(arr)?arr:[];}catch(e){console.warn('localStorage 解析失敗，重置為空陣列。',e);return [];}
}
let records = safeLoad().map(r=>{
  if(!r.timestamp && r.date){return {timestamp:r.date+' 00:00',mood:parseInt(r.mood||2),note:r.note||''};}
  if(!r.timestamp){const n=new Date();const pad=x=>String(x).padStart(2,'0');const ts=`${n.getFullYear()}/${pad(n.getMonth()+1)}/${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;return {timestamp:ts,mood:parseInt(r.mood||2),note:r.note||''};}
  return {timestamp:r.timestamp,mood:parseInt(r.mood||2),note:r.note||''};
});
function persist(){localStorage.setItem('moodRecords',JSON.stringify(records));}persist();
let chartRef=null; const pad=n=>String(n).padStart(2,'0');
function nowTimestamp(){const n=new Date();return `${n.getFullYear()}/${pad(n.getMonth()+1)}/${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;}

document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('saveBtn');
  if(btn){ btn.addEventListener('click', saveMood, { once:false }); btn.dataset.bound='1';}
  const clr=document.getElementById('clearAllBtn'); if(clr) clr.addEventListener('click', clearAll, { once:false });
  const rg=document.getElementById('rangeSelect'); if(rg) rg.addEventListener('change', render, { once:false });
  const exp=document.getElementById('exportBtn'); if(exp) exp.addEventListener('click', exportCSV, { once:false });
  render();
});

function saveMood(){
  // 進一步保護：若多次觸發，0.5 秒內只接受一次（簡易節流）
  if(saveMood._lock && (Date.now()-saveMood._lock)<500) return;
  saveMood._lock = Date.now();

  const moodEl=document.getElementById('mood'); const noteEl=document.getElementById('note');
  const mood=moodEl?moodEl.value:2; const note=noteEl?noteEl.value:''; const ts=nowTimestamp();
  records.push({timestamp:ts,mood:parseInt(mood),note}); persist(); if(noteEl) noteEl.value=''; render();
}

function deleteRecord(idx){records.splice(idx,1); persist(); render();}
function clearAll(){ if(confirm('確定要清除所有記錄嗎？這個動作無法復原。')){records=[]; persist(); render();} }
function exportCSV(){const header='timestamp,mood,note\n'; const rows=records.map(r=>`${r.timestamp},${r.mood},"${(r.note||'').replace(/"/g,'\\"')}"`).join('\n'); const blob=new Blob([header+rows],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mood_records.csv'; a.click(); URL.revokeObjectURL(url);}
function getRangeRecords(){const selEl=document.getElementById('rangeSelect'); const sel=selEl?selEl.value:'7'; if(sel==='all') return [...records]; const n=parseInt(sel,10); return records.slice(-n);}

function render(){
  const list=getRangeRecords(); const countBadge=document.getElementById('countBadge'); if(countBadge) countBadge.textContent=records.length;
  const historyDiv=document.getElementById('history');
  if(historyDiv){historyDiv.innerHTML=''; if(list.length===0){historyDiv.innerHTML='<div class="item"><div class="meta"><div class="note">目前沒有任何記錄</div></div></div>'; } else { list.forEach((r)=>{ const idx=records.indexOf(r); const row=document.createElement('div'); row.className='item'; row.innerHTML = `<div class="meta"><div class="ts">${r.timestamp} · 心情分數: ${r.mood}</div><div class="note">${r.note?r.note:''}</div></div><div class="ops"><button class="icon-btn danger" title="刪除這筆" onclick="deleteRecord(${idx})">🗑️</button></div>`; historyDiv.appendChild(row);}); } }
  const hint=document.getElementById('chartHint'); const canvas=document.getElementById('moodChart'); if(!window.Chart){ if(hint) hint.style.display='block'; return; } else if(hint){ hint.style.display='none'; }
  canvas.height=300; if(chartRef) chartRef.destroy(); const ctx=canvas.getContext('2d');
  chartRef=new Chart(ctx,{type:'line',data:{labels:list.map(r=>r.timestamp),datasets:[{label:'心情走勢',data:list.map(r=>r.mood),borderColor:'#5b67ff',backgroundColor:'rgba(91,103,255,.18)',tension:.25,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:0,max:3,ticks:{stepSize:1}}},plugins:{legend:{display:true}}}});
}