document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', saveMood);
  render();
});

let records = JSON.parse(localStorage.getItem("moodRecords")) || [];
let chartRef = null;

function saveMood() {
  const mood = document.getElementById("mood").value;
  const note = document.getElementById("note").value;
  const date = new Date().toLocaleDateString();
  records.push({ date, mood: parseInt(mood), note });
  localStorage.setItem("moodRecords", JSON.stringify(records));
  document.getElementById("note").value = "";
  render();
}

function render() {
  // history
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  const last7 = records.slice(-7);
  if(last7.length === 0){
    historyDiv.innerHTML = '<p>目前沒有任何記錄，先在上面新增一筆吧！</p>';
  } else {
    last7.forEach(r => {
      const p = document.createElement("p");
      p.textContent = `${r.date} · 心情分數: ${r.mood}${r.note ? "，備註: " + r.note : ""}`;
      historyDiv.appendChild(p);
    });
  }

  // chart
  const canvas = document.getElementById("moodChart");
  canvas.height = 260;
  if (chartRef) chartRef.destroy();
  const ctx = canvas.getContext("2d");
  chartRef = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last7.map(r => r.date),
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