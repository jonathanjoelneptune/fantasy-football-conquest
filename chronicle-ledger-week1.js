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
const ledger=document.querySelector('#ledger');
if(!ledger)return;
let applying=false;
function cards(){return [...ledger.querySelectorAll('.territoryCard')];}
function cardFor(team){return cards().find(c=>norm(c.querySelector('h3')?.textContent)===team);}
function names(c){return c?[...c.querySelectorAll('.territoryNames span')]:[];}
function updateCount(c){if(!c)return;const n=names(c).length,el=c.querySelector('.count');if(el)el.textContent=`${n} ${n===1?'territory':'territories'}`;}
function enforce(){
  if(applying||cards().length<12)return;
  applying=true;
  let changed=false;
  for(const [territory,loser,winner] of transfers){
    const lc=cardFor(loser),wc=cardFor(winner);
    if(!lc||!wc)continue;
    for(const el of names(lc).filter(x=>norm(x.textContent)===territory)){el.remove();changed=true;}
    const existing=names(wc).filter(x=>norm(x.textContent)===territory);
    if(!existing.length){const span=document.createElement('span');span.textContent=territory;wc.querySelector('.territoryNames')?.appendChild(span);changed=true;}
    else existing.slice(1).forEach(el=>{el.remove();changed=true;});
  }
  cards().forEach(updateCount);
  const all=cards().flatMap(names).map(x=>norm(x.textContent));
  const unique=new Set(all);
  if(all.length!==72||unique.size!==72)console.warn('Week 1 Chronicle territory invariant failed',{total:all.length,unique:unique.size});
  applying=false;
}
const observer=new MutationObserver(()=>{if(!applying)queueMicrotask(enforce)});
observer.observe(ledger,{childList:true,subtree:true});
enforce();
setTimeout(enforce,1900);
setTimeout(enforce,3200);
})();