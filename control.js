
// Simple scoreboard controller - stores state in localStorage under 'kts_scoreboard'
const defaultState = {
  teamA: {name: 'Home', score: 0},
  teamB: {name: 'Away', score: 0},
  timer: {running:false, seconds:0, intervalRef:null},
  possession: '' // 'A' | 'B' | ''
};

function loadState(){
  try{
    const s = localStorage.getItem('kts_scoreboard');
    return s ? JSON.parse(s) : defaultState;
  }catch(e){ console.error(e); return defaultState; }
}
function saveState(state){
  // do not store intervalRef
  const copy = {...state, timer: {...state.timer, intervalRef: null}};
  localStorage.setItem('kts_scoreboard', JSON.stringify(copy));
  // trigger storage event for same-tab listeners via BroadcastChannel fallback
  try{
    // BroadcastChannel for same-origin cross-tab immediate broadcast
    if(window.bc) window.bc.postMessage(copy);
  }catch(e){}
}

const state = loadState();
window.bc = new BroadcastChannel && new BroadcastChannel('kts_channel');
if(window.bc){
  window.bc.onmessage = (ev)=>{
    // ignore messages that came from display
  };
}

function updateUIFromState(){
  document.getElementById('teamA_name').value = state.teamA.name;
  document.getElementById('teamB_name').value = state.teamB.name;
  document.getElementById('teamA_score').textContent = state.teamA.score;
  document.getElementById('teamB_score').textContent = state.teamB.score;
  document.getElementById('timer_display').textContent = formatTime(state.timer.seconds);
}
function formatTime(sec){
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  return m+':'+s;
}
function startTimer(){
  if(state.timer.running) return;
  state.timer.running = true;
  state.timer.intervalRef = setInterval(()=>{
    state.timer.seconds += 1;
    document.getElementById('timer_display').textContent = formatTime(state.timer.seconds);
    saveState(state);
  },1000);
  saveState(state);
}
function pauseTimer(){
  state.timer.running = false;
  if(state.timer.intervalRef) clearInterval(state.timer.intervalRef);
  state.timer.intervalRef = null;
  saveState(state);
}
function resetTimer(){
  state.timer.seconds = 0;
  pauseTimer();
  document.getElementById('timer_display').textContent = formatTime(state.timer.seconds);
  saveState(state);
}

document.getElementById('teamA_plus').addEventListener('click', ()=>{ state.teamA.score++; updateUIFromState(); saveState(state); });
document.getElementById('teamA_minus').addEventListener('click', ()=>{ state.teamA.score = Math.max(0,state.teamA.score-1); updateUIFromState(); saveState(state); });
document.getElementById('teamB_plus').addEventListener('click', ()=>{ state.teamB.score++; updateUIFromState(); saveState(state); });
document.getElementById('teamB_minus').addEventListener('click', ()=>{ state.teamB.score = Math.max(0,state.teamB.score-1); updateUIFromState(); saveState(state); });

document.getElementById('teamA_name').addEventListener('input', (e)=>{ state.teamA.name = e.target.value; updateUIFromState(); saveState(state); });
document.getElementById('teamB_name').addEventListener('input', (e)=>{ state.teamB.name = e.target.value; updateUIFromState(); saveState(state); });

document.getElementById('timer_start').addEventListener('click', startTimer);
document.getElementById('timer_pause').addEventListener('click', pauseTimer);
document.getElementById('timer_reset').addEventListener('click', resetTimer);

document.getElementById('pos_home').addEventListener('click', ()=>{ state.possession='A'; saveState(state); });
document.getElementById('pos_away').addEventListener('click', ()=>{ state.possession='B'; saveState(state); });
document.getElementById('pos_none').addEventListener('click', ()=>{ state.possession=''; saveState(state); });

document.getElementById('swap').addEventListener('click', ()=>{
  const tA = {...state.teamA}; state.teamA = {...state.teamB}; state.teamB = tA; updateUIFromState(); saveState(state);
});
document.getElementById('reset_all').addEventListener('click', ()=>{
  if(!confirm('Reset scores, names, timer and possession?')) return;
  state.teamA = {name:'Home',score:0}; state.teamB={name:'Away',score:0}; state.possession=''; resetTimer(); saveState(state); updateUIFromState();
});
document.getElementById('open_display').addEventListener('click', ()=>{
  const url = './display.html';
  window.open(url,'Scoreboard Display','width=1280,height=720');
});

// storage event listener to pick up changes from display or other tabs
window.addEventListener('storage', (ev)=>{
  if(ev.key==='kts_scoreboard'){
    const s = JSON.parse(ev.newValue);
    Object.assign(state, s);
    updateUIFromState();
  }
});
// BroadcastChannel listener
if(window.bc){
  window.bc.onmessage = (ev)=>{
    const s = ev.data;
    if(s) { Object.assign(state, s); updateUIFromState(); }
  };
}

// initialize UI and timer state
updateUIFromState();
if(state.timer.running){
  // resume running timer
  startTimer();
}
