document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('saveBtn');
  btn.addEventListener('click',()=>{
    const val=document.getElementById('moodInput').value.trim();
    if(val){alert('已記錄: '+val);document.getElementById('moodInput').value='';}
  });
});