document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', saveMood);
  render();
});

let records = JSON.parse(localStorage.getItem("moodRecords")) || [];
let chartRef = null;

function nowTimestamp() {
  const n = new Date();
  const pad = (x)=>String(x).padStart(2,'0');
  return `${n.getFullYear()}/${pad(n.getMonth()+1)}/${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

function saveMood() {
  const mood = document.getElementById("mood").value;
  const note = document.getElementById("note").value;
  const ts = nowTimestamp();
  records.push({ timestamp: ts, mood: parseInt(mood), note });
  localStorage.setItem("moodRecords", JSON.stringify(records));
  document.getElementById("note").value = "";
  render();
}

function render() {
  const last7 = records.slice(-7);
  // history
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = last7.length ? "" : '<p>目前沒有任何記錄，先在上面新增一筆吧！</p>';
  last7.forEach(r => {
    const p = document.createElement("p");
    p.textContent = `${r.timestamp} · 心情分數: ${r.mood}${r.note ? "，備註: " + r.note : ""}`;
    historyDiv.appendChild(p);
  });

  // chart
  const canvas = document.getElementById("moodChart");
  canvas.height = 300;
  if (chartRef) chartRef.destroy();
  const ctx = canvas.getContext("2d");
  chartRef = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last7.map(r => r.timestamp),
      datasets: [{
        label: '心情走勢',
        data: last7.map(r => r.mood),
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