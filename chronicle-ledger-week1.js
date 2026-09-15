(()=>{
'use strict';
const WEEK=Number(new URLSearchParams(location.search).get('week')||1);
if(WEEK!==1)return;
const transfers=[
  ["Atlas' Mountains",'Aries It Out','Hercules Unchained'],
  ["Hector's Ramparts",'Winging It','The Peasants of Troy'],
  ["Winged Messenger's Rest",'TroyisBetterthanOdyssey','🏺Hades Nutz'],
  ["Hercules' Palaestra",'The Beer of Olympus','Winged Victory Formation'],
  ["Agamemnon's High Hall",'Flight of JarYES',"Apollo's Archers"],
  ['Moirai Loom','Uranus Colonizer','BeginnersRuck']
];
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ledger=document.querySelector('#ledger'),source=document.querySelector('#sourceFrame');
if(!ledger)return;
let applying=false,renderedExport=false;
function cards(){return [...ledger.querySelectorAll('.territoryCard')].filter(c=>c.querySelector('h3'));}
function cardFor(team){return cards().find(c=>norm(c.querySelector('h3')?.textContent)===team);}
function names(c){return c?[...c.querySelectorAll('.territoryNames span')]:[];}
function updateCount(c){if(!c)return;const n=names(c).length,el=c.querySelector('.count');if(el)el.textContent=`${n} ${n===1?'territory':'territories'}`;}
function captureAccents(){const out={};cards().forEach(c=>{const n=norm(c.querySelector('h3')?.textContent);if(n)out[n]=c.style.getPropertyValue('--team-accent')||getComputedStyle(c).borderTopColor});return out;}
function renderFromMainBoard(){
  if(renderedExport||!source)return false;
  try{
    const x=source.contentWindow?.__chronicleExport;
    if(!x||x.error||!Array.isArray(x.teams)||!Array.isArray(x.territories)||!x.teams.length)return false;
    const accents=captureAccents(),by={};
    x.teams.forEach(t=>by[t.id]=[]);
    x.territories.filter(t=>t.owner).forEach(t=>(by[t.owner]||(by[t.owner]=[])).push(t.name));
    ledger.innerHTML=x.teams.map(t=>{
      const list=(by[t.id]||[]).slice().sort((a,b)=>a.localeCompare(b));
      const color=accents[t.name]||'#9b702b';
      return `<div class="territoryCard" style="--team-accent:${esc(color)}"><div class="count">${list.length} ${list.length===1?'territory':'territories'}</div><h3>${esc(t.name)}</h3><div class="territoryNames">${list.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div>`;
    }).join('');
    renderedExport=true;
    return true;
  }catch(e){console.warn('Week 1 main-board ledger bootstrap failed',e);return false}
}
function enforce(){
  if(applying)return false;
  if(cards().length<12){renderFromMainBoard();if(cards().length<12)return false;}
  applying=true;
  for(const [territory,loser,winner] of transfers){
    const lc=cardFor(loser),wc=cardFor(winner);
    if(!lc||!wc)continue;
    names(lc).filter(x=>norm(x.textContent)===territory).forEach(el=>el.remove());
    const existing=names(wc).filter(x=>norm(x.textContent)===territory);
    if(!existing.length){const span=document.createElement('span');span.textContent=territory;wc.querySelector('.territoryNames')?.appendChild(span);}
    else existing.slice(1).forEach(el=>el.remove());
  }
  cards().forEach(updateCount);
  const all=cards().flatMap(names).map(x=>norm(x.textContent)),unique=new Set(all);
  const counts=cards().map(c=>Number((c.querySelector('.count')?.textContent||'0').match(/\d+/)?.[0]||0));
  const valid=all.length===72&&unique.size===72&&counts.filter(n=>n===7).length===6&&counts.filter(n=>n===5).length===6;
  if(!valid)console.warn('Week 1 Chronicle territory invariant failed',{total:all.length,unique:unique.size,counts});
  else console.info('Week 1 Chronicle ledger verified: 72 unique territories, six teams at 7 and six at 5.');
  applying=false;
  return valid;
}
const observer=new MutationObserver(()=>{if(!applying)queueMicrotask(enforce)});
observer.observe(ledger,{childList:true,subtree:true});
let tries=0;const timer=setInterval(()=>{tries++;if(enforce()||tries>120)clearInterval(timer)},250);
source?.addEventListener('load',()=>setTimeout(()=>{renderFromMainBoard();enforce()},900));
enforce();
})();