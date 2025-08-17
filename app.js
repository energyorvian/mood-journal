let records = JSON.parse(localStorage.getItem("moodRecords")) || [];

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
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "<h3>📝 記錄</h3>";

  records.slice(-7).forEach(r => {
    const p = document.createElement("p");
    p.textContent = `${r.date} - 心情分數: ${r.mood}, 備註: ${r.note}`;
    historyDiv.appendChild(p);
  });

  const ctx = document.getElementById("moodChart").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: records.slice(-7).map(r => r.date),
      datasets: [{
        label: '心情走勢',
        data: records.slice(-7).map(r => r.mood),
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.2)'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

render();