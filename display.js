
// Display page listens to localStorage and BroadcastChannel for updates
function formatTime(sec){ const m = Math.floor(sec/60).toString().padStart(2,'0'); const s = (sec%60).toString().padStart(2,'0'); return m+':'+s; }
function render(state){
  document.getElementById('disp_teamA_name').textContent = state.teamA.name;
  document.getElementById('disp_teamB_name').textContent = state.teamB.name;
  document.getElementById('disp_teamA_score').textContent = state.teamA.score;
  document.getElementById('disp_teamB_score').textContent = state.teamB.score;
  document.getElementById('disp_timer').textContent = formatTime(state.timer.seconds);
  let poss = '';
  if(state.possession==='A') poss = '▶ Home';
  if(state.possession==='B') poss = 'Away ▶';
  document.getElementById('disp_possession').textContent = poss;
}

function loadState(){
  try{ const s = localStorage.getItem('kts_scoreboard'); return s ? JSON.parse(s) : null; }catch(e){ return null; }
}

const bc = (typeof BroadcastChannel!=='undefined') ? new BroadcastChannel('kts_channel') : null;
if(bc){
  bc.onmessage = (ev)=>{ if(ev.data) render(ev.data); };
}

// listen to storage events (works across tabs)
window.addEventListener('storage', (ev)=>{
  if(ev.key==='kts_scoreboard'){
    const s = JSON.parse(ev.newValue);
    if(s) render(s);
  }
});

// on load, render current state (or default)
const initial = loadState() || {teamA:{name:'Home',score:0},teamB:{name:'Away',score:0},timer:{seconds:0,running:false},possession:''};
render(initial);

// Also poll every second to keep timer in sync if running
setInterval(()=>{
  const s = loadState();
  if(s) render(s);
},1000);
