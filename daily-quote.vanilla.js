const quotes = [
  '保持微笑，生活會更美好。',
  '一步一步，慢慢也很好。',
  '相信自己，你比想像中更堅強。'
];
let currentQuote = document.getElementById('quote');
let savedQuotes = document.getElementById('savedQuotes');

function newQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  currentQuote.innerText = q;
}
document.getElementById('newQuote').addEventListener('click', newQuote);
document.getElementById('saveQuote').addEventListener('click', () => {
  let li = document.createElement('li');
  li.innerText = currentQuote.innerText;
  savedQuotes.appendChild(li);
});
document.getElementById('shareQuote').addEventListener('click', () => {
  if (navigator.share) {
    navigator.share({ text: currentQuote.innerText });
  } else {
    alert('無法分享：' + currentQuote.innerText);
  }
});
newQuote();
