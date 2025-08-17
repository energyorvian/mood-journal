// 確保 DOM 準備好再綁定事件與渲染
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('saveBtn');
  btn.addEventListener('click', saveMood);
  // 首次渲染
  render();
});

let records = JSON.parse(localStorage.getItem("moodRecords")) || [];
let chartRef = null;

function saveMood() {
  const moodSel = document.getElementById("mood");
  const noteEl = document.getElementById("note");
  const mood = moodSel ? moodSel.value : "2";
  const note = noteEl ? noteEl.value : "";
  const date = new Date().toLocaleDateString();

  records.push({ date, mood: parseInt(mood), note });
  localStorage.setItem("moodRecords", JSON.stringify(records));

  if (noteEl) noteEl.value = "";
  render();
}

function render() {
  // 歷史區塊
  const historyDiv = document.getElementById("history");
  if (historyDiv) {
    historyDiv.innerHTML = "<h3>📝 記錄</h3>";
    const last7 = records.slice(-7);
    last7.forEach(r => {
      const p = document.createElement("p");
      p.textContent = `${r.date} - 心情分數: ${r.mood}${r.note ? "，備註: " + r.note : ""}`;
      historyDiv.appendChild(p);
    });
  }

  // 圖表
  const canvas = document.getElementById("moodChart");
  if (!canvas) return;

  // 關鍵：確保有固定高度（避免 0px 導致看不到）
  canvas.style.height = '240px';
  canvas.height = 240;

  try {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js 尚未載入');
      return;
    }

    const ctx = canvas.getContext("2d");
    if (chartRef) chartRef.destroy();

    const last7 = records.slice(-7);
    chartRef = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7.map(r => r.date),
        datasets: [{
          label: '心情走勢',
          data: last7.map(r => r.mood),
          borderColor: '#6c63ff',
          backgroundColor: 'rgba(108, 99, 255, 0.2)',
          tension: 0.2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 3, ticks: { stepSize: 1 } }
        }
      }
    });
  } catch (e) {
    console.error('渲染圖表發生錯誤：', e);
  }
}