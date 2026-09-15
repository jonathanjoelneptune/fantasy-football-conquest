(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ledger=q('#ledger'),source=q('#sourceFrame');
if(!ledger||!source)return;
let renderedKey='';
function renderNativeSnapshot(){
 try{
  const x=source.contentWindow?.__chronicleExport;
  if(!x||x.error||!Array.isArray(x.teams)||!Array.isArray(x.territories))return false;
  const owned=x.territories.filter(t=>t.owner);
  const unique=new Set(owned.map(t=>t.id));
  if(owned.length!==72||unique.size!==72){console.warn('Native territory snapshot is not 72 unique territories',owned.length,unique.size);return false}
  const colors={};
  qa('.territoryCard',ledger).forEach(c=>{const n=q('h3',c)?.textContent?.trim();if(n)colors[n]=c.style.getPropertyValue('--team-accent')||getComputedStyle(c).borderTopColor});
  const by={};x.teams.forEach(t=>by[t.id]=[]);owned.forEach(t=>(by[t.owner]||(by[t.owner]=[])).push(t.name));
  const counts=x.teams.map(t=>(by[t.id]||[]).length);
  const key=counts.join(',')+'|'+owned.map(t=>t.id+':'+t.owner).join('|');
  if(key===renderedKey)return true;
  renderedKey=key;
  ledger.innerHTML=x.teams.map(t=>{
   const list=(by[t.id]||[]).slice().sort((a,b)=>a.localeCompare(b));
   const color=colors[t.name]||'#9b702b';
   return `<div class="territoryCard" style="--team-accent:${esc(color)}"><div class="count">${list.length} ${list.length===1?'territory':'territories'}</div><h3>${esc(t.name)}</h3><div class="territoryNames">${list.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div>`;
  }).join('');
  const total=counts.reduce((a,b)=>a+b,0);
  console.info('Chronicle ledger loaded from main-board stateThroughWeek snapshot:',counts,'total',total);
  return true;
 }catch(e){console.warn('Native Chronicle ledger render failed',e);return false}
}
let tries=0;const timer=setInterval(()=>{tries++;if(renderNativeSnapshot()||tries>80)clearInterval(timer)},250);
source.addEventListener('load',()=>{tries=0;setTimeout(renderNativeSnapshot,1200)});
})();