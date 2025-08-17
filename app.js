document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', saveMood);
  document.getElementById('clearAllBtn').addEventListener('click', clearAll);
  document.getElementById('rangeSelect').addEventListener('change', render);
  document.getElementById('exportBtn').addEventListener('click', exportCSV);
  render();
});

let records = JSON.parse(localStorage.getItem("moodRecords")) || [];
let chartRef = null;

function pad(n){return String(n).padStart(2,'0');}
function nowTimestamp() {
  const n = new Date();
  return `${n.getFullYear()}/${pad(n.getMonth()+1)}/${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

function saveMood() {
  const mood = document.getElementById("mood").value;
  const note = document.getElementById("note").value;
  const ts = nowTimestamp();
  records.push({ timestamp: ts, mood: parseInt(mood), note });
  persist();
  document.getElementById("note").value = "";
  render();
}

function deleteRecord(idx){
  records.splice(idx,1);
  persist();
  render();
}

function clearAll(){
  if(confirm('確定要清除所有記錄嗎？這個動作無法復原。')){
    records = [];
    persist();
    render();
  }
}

function exportCSV(){
  const header = 'timestamp,mood,note\n';
  const rows = records.map(r => `${r.timestamp},${r.mood},"${(r.note||'').replace(/"/g,'\"')}"`).join('\n');
  const blob = new Blob([header + rows], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mood_records.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function persist(){
  localStorage.setItem("moodRecords", JSON.stringify(records));
}

function getRangeRecords(){
  const sel = document.getElementById('rangeSelect').value;
  if(sel === 'all') return [...records];
  const n = parseInt(sel,10);
  return records.slice(-n);
}

function render() {
  const list = getRangeRecords();
  // 更新數量徽章
  const countBadge = document.getElementById('countBadge');
  countBadge.textContent = records.length;

  // history
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = '';
  if(list.length === 0){
    historyDiv.innerHTML = '<div class="item"><div class="meta"><div class="note">目前沒有任何記錄</div></div></div>';
  } else {
    list.forEach((r, i) => {
      const idx = records.indexOf(r);
      const row = document.createElement('div'); row.className='item';
      row.innerHTML = \`
        <div class="meta">
          <div class="ts">\${r.timestamp} · 心情分數: \${r.mood}</div>
          <div class="note">\${r.note ? r.note : ''}</div>
        </div>
        <div class="ops">
          <button class="icon-btn danger" title="刪除這筆" onclick="deleteRecord(\${idx})">🗑️</button>
        </div>\`;
      historyDiv.appendChild(row);
    });
  }

  // chart
  const canvas = document.getElementById("moodChart");
  canvas.height = 300;
  if (chartRef) chartRef.destroy();
  const ctx = canvas.getContext("2d");
  chartRef = new Chart(ctx, {
    type: 'line',
    data: {
      labels: list.map(r => r.timestamp),
      datasets: [{
        label: '心情走勢',
        data: list.map(r => r.mood),
        borderColor: '#5b67ff',
        backgroundColor: 'rgba(91,103,255,.18)',
        tension: .25,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { min: 0, max: 3, ticks: { stepSize: 1 } } },
      plugins: { legend: { display: true } }
    }
  });
}