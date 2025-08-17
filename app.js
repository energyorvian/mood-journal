let records = JSON.parse(localStorage.getItem('moodRecords') || '[]');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const recordsDiv = document.getElementById('records');
const ctx = document.getElementById('moodChart').getContext('2d');

function renderRecords() {
  recordsDiv.innerHTML = '';
  records.forEach((rec, i) => {
    const div = document.createElement('div');
    div.className = 'record';
    div.innerHTML = \`\${rec.date} 心情分數: \${rec.mood} 備註: \${rec.note}
      <button onclick="deleteRecord(\${i})">🗑️</button>\`;
    recordsDiv.appendChild(div);
  });
  localStorage.setItem('moodRecords', JSON.stringify(records));
  updateChart();
}

function deleteRecord(i) {
  records.splice(i, 1);
  renderRecords();
}

saveBtn.addEventListener('click', () => {
  const mood = document.getElementById('mood').value;
  const note = document.getElementById('note').value;
  const date = new Date().toLocaleString('zh-TW');
  records.push({ mood, note, date });
  renderRecords();
});

clearBtn.addEventListener('click', () => {
  if (confirm('確定要刪除所有記錄嗎？')) {
    records = [];
    renderRecords();
  }
});

exportBtn.addEventListener('click', () => {
  let csv = '日期,心情分數,備註\n';
  records.forEach(r => { csv += \`\${r.date},\${r.mood},\${r.note}\n\`; });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'mood_records.csv';
  a.click();
});

let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: records.map(r => r.date),
    datasets: [{
      label: '心情走勢',
      data: records.map(r => r.mood),
      borderColor: 'blue',
      fill: false
    }]
  }
});

function updateChart() {
  chart.data.labels = records.map(r => r.date);
  chart.data.datasets[0].data = records.map(r => r.mood);
  chart.update();
}

renderRecords();
