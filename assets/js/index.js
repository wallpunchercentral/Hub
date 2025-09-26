
/* index.js - Enhanced for v2: manifest syncing, progress saving, microgames integration */
/* Credentials */
const CREDENTIALS = { username: "tess", password: "tickles" };
/* LocalStorage keys */
const LS_USER = "wpc_user";
const LS_FAV = "wpc_favorites";
const LS_PLAY = "wpc_playcounts";
const LS_RECENT = "wpc_recent";
const LS_MANIFEST = "wpc_manifest"; // cached manifest in localStorage
/* Paths */
const GAMES_MANIFEST_PATH = "games/games.json";

let games = [];

function qs(s,r=document){return r.querySelector(s);}
function qsa(s,r=document){return Array.from(r.querySelectorAll(s));}

document.addEventListener("DOMContentLoaded", init);

function init(){
  qsa(".nav-btn").forEach(b=>b.addEventListener("click", e=>{ const p=e.currentTarget.dataset.page; if(p) showPage(p); }));
  qs("#logout-btn").addEventListener("click", logout);
  qs("#login-btn").addEventListener("click", attemptLogin);
  qs("#login-password").addEventListener("keydown",(e)=>{ if(e.key==="Enter") attemptLogin(); });
  qs("#home-search").addEventListener("keydown",(e)=>{ if(e.key==="Enter") goToGamesSearch(e.target.value); });
  qs("#games-search").addEventListener("input",(e)=> filterGames(e.target.value));
  qs("#contact-category").addEventListener("change", onContactCategoryChange);
  qs("#draft-email").addEventListener("click",(e)=>{ e.preventDefault(); draftEmail(); });

  checkLogin();
  loadAndSyncManifest();
}

/* Login */
function checkLogin(){ const user=localStorage.getItem(LS_USER); if(user===CREDENTIALS.username) hideLogin(); else showLogin(); }
function showLogin(){ qs("#login-overlay").style.display="flex"; qs("#login-overlay").setAttribute("aria-hidden","false"); qs("#login-error").textContent=""; }
function hideLogin(){ qs("#login-overlay").style.display="none"; qs("#login-overlay").setAttribute("aria-hidden","true"); }
function attemptLogin(){ const u=qs("#login-username").value.trim(); const p=qs("#login-password").value; if(u===CREDENTIALS.username && p===CREDENTIALS.password){ localStorage.setItem(LS_USER,u); hideLogin(); showPage("home"); renderHome(); } else { qs("#login-error").textContent="Invalid username or password."; } }
function logout(){ localStorage.removeItem(LS_USER); showLogin(); }

/* Manifest: load from disk, compare with localStorage cached manifest, regenerate if mismatch */
async function loadAndSyncManifest(){
  try {
    const res = await fetch(GAMES_MANIFEST_PATH);
    if(!res.ok) throw new Error("manifest fetch failed");
    const remoteManifest = await res.json();
    // Ensure remote manifest is array of objects with folder,name...
    // Normalize sort by name
    remoteManifest.sort((a,b)=> (a.name||"").localeCompare(b.name||""));
    // Compare with cached
    const cachedRaw = localStorage.getItem(LS_MANIFEST);
    let cached = null;
    try{ cached = cachedRaw ? JSON.parse(cachedRaw) : null; } catch(e){ cached = null; }
    if(!cached || JSON.stringify(cached) !== JSON.stringify(remoteManifest)){
      // update cache
      localStorage.setItem(LS_MANIFEST, JSON.stringify(remoteManifest));
    }
    games = remoteManifest;
    renderGames();
    renderHome();
  } catch(err){
    console.error("Could not load games manifest:", err);
    // fallback: try to use cached manifest
    const cachedRaw = localStorage.getItem(LS_MANIFEST);
    if(cachedRaw){
      try{ games = JSON.parse(cachedRaw); renderGames(); renderHome(); return; } catch(e){}
    }
    qs("#games-list").innerHTML = "<p class='small'>Failed to load games manifest. Ensure games/games.json exists.</p>";
  }
}

/* Rendering */
function makeGameCard(game){
  const card=document.createElement("article"); card.className="game-card";
  const img=document.createElement("img"); img.className="game-thumb"; img.alt=game.name || ""; img.src = game.image || "games/template/image.png"; card.appendChild(img);
  const title=document.createElement("h3"); title.className="game-title"; title.textContent=game.name || "Unnamed"; card.appendChild(title);
  const desc=document.createElement("div"); desc.className="game-desc"; desc.textContent=game.description||""; card.appendChild(desc);
  const meta=document.createElement("div"); meta.className="small"; meta.textContent = "Type: "+(game.type||"Unknown"); card.appendChild(meta);
  const actions=document.createElement("div"); actions.className="actions";
  const playBtn=document.createElement("button"); playBtn.textContent="Play"; playBtn.addEventListener("click", ()=> playGame(game)); actions.appendChild(playBtn);
  const favBtn=document.createElement("button"); favBtn.textContent = isFavorite(game.folder) ? "Unfavorite":"Favorite"; favBtn.addEventListener("click", ()=>{ toggleFavorite(game); renderGames(); renderHome(); }); actions.appendChild(favBtn);
  const progBtn=document.createElement("button"); progBtn.textContent="Progress"; progBtn.addEventListener("click", ()=> showProgress(game)); actions.appendChild(progBtn);
  card.appendChild(actions);
  return card;
}

function renderGames(filter=""){
  const list = qs("#games-list"); list.innerHTML="";
  const q = (filter||"").trim().toLowerCase();
  const shown = games.filter(g => {
    if(!q) return true;
    return (g.name||"").toLowerCase().includes(q) || (g.type||"").toLowerCase().includes(q) || (g.description||"").toLowerCase().includes(q);
  });
  shown.forEach(g => list.appendChild(makeGameCard(g)));
}

/* Home sections */
function renderHome(){
  // favorites
  const favC = qs("#favorites"); favC.innerHTML="";
  const favs = getFavorites();
  if(!favs || favs.length===0){ // show 5 random games as fallback
    const sample = games.slice(); shuffle(sample); sample.slice(0,5).forEach(g=> favC.appendChild(makeGameCard(g)));
  } else {
    favs.forEach(folder => { const g = games.find(x=>x.folder===folder); if(g) favC.appendChild(makeGameCard(g)); });
  }
  // most played
  const mpC = qs("#most-played"); mpC.innerHTML="";
  const counts = getPlayCounts(); const entries = Object.entries(counts||{}); entries.sort((a,b)=> b[1]-a[1]);
  const top5 = entries.slice(0,5).map(([f,c])=> games.find(g=>g.folder===f)).filter(Boolean);
  if(top5.length===0){ const s=games.slice(); shuffle(s); s.slice(0,5).forEach(g=> mpC.appendChild(makeGameCard(g))); } else { top5.forEach(g=> mpC.appendChild(makeGameCard(g))); }
  // recent
  const recC = qs("#recently-played"); recC.innerHTML=""; const rec = getRecent(); if(!rec || rec.length===0){ recC.innerHTML="<p class='small'>No recent plays.</p>"; } else { rec.slice(0,5).forEach(folder=>{ const g = games.find(x=>x.folder===folder); if(g) recC.appendChild(makeGameCard(g)); }); }
}

/* Play handling */
function playGame(game){
  incrementPlay(game.folder);
  addRecent(game.folder);
  // open entry
  const entry = game.entry || ("games/"+game.folder+"/code/index.html");
  window.open(entry, "_blank");
  renderHome();
}

/* Favorites */
function getFavorites(){ try{ return JSON.parse(localStorage.getItem(LS_FAV) || "[]"); }catch(e){return [];} }
function setFavorites(a){ localStorage.setItem(LS_FAV, JSON.stringify(a)); }
function isFavorite(folder){ return getFavorites().includes(folder); }
function toggleFavorite(game){ const arr = getFavorites(); if(arr.includes(game.folder)){ arr.splice(arr.indexOf(game.folder),1); } else { arr.push(game.folder); } setFavorites(arr); }

/* Play counts and recent */
function getPlayCounts(){ try{ return JSON.parse(localStorage.getItem(LS_PLAY) || "{}"); }catch(e){return {};} }
function setPlayCounts(o){ localStorage.setItem(LS_PLAY, JSON.stringify(o)); }
function incrementPlay(folder){ const o = getPlayCounts(); o[folder] = (o[folder]||0)+1; setPlayCounts(o); }
function getRecent(){ try{ return JSON.parse(localStorage.getItem(LS_RECENT) || "[]"); }catch(e){return [];} }
function setRecent(a){ localStorage.setItem(LS_RECENT, JSON.stringify(a)); }
function addRecent(folder){ const arr = getRecent(); const ex = arr.indexOf(folder); if(ex!==-1) arr.splice(ex,1); arr.unshift(folder); if(arr.length>20) arr.length=20; setRecent(arr); }

/* Progress storage per-game */
function saveProgress(folder, data){
  try{ localStorage.setItem("progress_"+folder, JSON.stringify(data)); }catch(e){ console.error("saveProgress failed",e); }
}
function loadProgress(folder){
  try{ const raw = localStorage.getItem("progress_"+folder); return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
}
function showProgress(game){
  const p = loadProgress(game.folder);
  alert("Progress for "+game.name+":"+ (p ? "\\n"+JSON.stringify(p) : "\\nNo progress saved."));
}

/* Search helpers */
function goToGamesSearch(q){ showPage("games"); qs("#games-search").value=q; filterGames(q); }
function filterGames(q){ renderGames(q); }

/* Contact */
function onContactCategoryChange(e){ qs("#recommendation-link-row").style.display = e.target.value==="Game Recommendation" ? "block" : "none"; }
function draftEmail(){ const c = qs("#contact-category").value; const d = qs("#contact-details").value.trim(); const link = qs("#recommendation-link").value.trim(); if(!d){ alert("Please enter details."); return false; } if(c==="Game Recommendation" && (!link.startsWith("http://") && !link.startsWith("https://"))){ alert("Provide a valid http/https link."); return false; } const to="p4rgedev@outlook.com"; const subj=encodeURIComponent("[Wall Punchers Central] "+c); let body=c+"\\n\\n"+d+"\\n\\n"; if(link) body += "Recommendation link: "+link+"\\n\\n"; body += "Sent from Wall Punchers Central (local launcher)"; window.location.href = `mailto:${to}?subject=${subj}&body=${encodeURIComponent(body)}`; return false; }

/* Utilities */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }
function showPage(id){ qsa(".page").forEach(p=> p.setAttribute("aria-hidden","true")); const el = qs("#"+id); if(el){ el.setAttribute("aria-hidden","false"); if(id==="home") renderHome(); if(id==="games") renderGames(); } }
