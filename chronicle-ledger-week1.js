(()=>{
'use strict';
const WEEK=Number(new URLSearchParams(location.search).get('week')||1);
if(WEEK!==1)return;
const transfers=[
  ["Atlas' Mountains",'Aries It Out','Hercules Unchained','atlas'],
  ["Hector's Ramparts",'Winging It','The Peasants of Troy','hector'],
  ["Winged Messenger's Rest",'TroyisBetterthanOdyssey','🏺Hades Nutz','wingedmessenger'],
  ["Hercules' Palaestra",'The Beer of Olympus','Winged Victory Formation','hercules'],
  ["Agamemnon's High Hall",'Flight of JarYES',"Apollo's Archers",'agamemnon'],
  ['Moirai Loom','Uranus Colonizer','BeginnersRuck','moirai']
];
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const key=s=>norm(s).toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9']/g,'');
const ledger=document.querySelector('#ledger');
if(!ledger)return;
function cards(){return [...ledger.querySelectorAll('.territoryCard')].filter(c=>c.querySelector('h3')&&c.querySelector('.territoryNames'));}
function cardFor(team,cs){const want=key(team);return cs.find(c=>{const got=key(c.querySelector('h3')?.textContent);return got===want||got.endsWith(want)||want.endsWith(got);});}
function names(c){return [...c.querySelectorAll('.territoryNames span')];}
function apply(){
  const cs=cards();if(cs.length!==12)return false;
  for(const [territory,loser,winner,hint] of transfers){
    const lc=cardFor(loser,cs),wc=cardFor(winner,cs);if(!lc||!wc)return false;
    const matches=names(lc).filter(el=>key(el.textContent).includes(hint));
    matches.forEach(el=>el.remove());
    const existing=names(wc).filter(el=>key(el.textContent).includes(hint));
    if(!existing.length){const span=document.createElement('span');span.textContent=territory;wc.querySelector('.territoryNames').appendChild(span);}
    else existing.slice(1).forEach(el=>el.remove());
  }
  cs.forEach(c=>{const n=names(c).length;const count=c.querySelector('.count');if(count)count.textContent=`${n} ${n===1?'territory':'territories'}`;});
  const all=cs.flatMap(names).map(el=>key(el.textContent)),counts=cs.map(c=>names(c).length);
  const valid=all.length===72&&new Set(all).size===72&&counts.filter(n=>n===7).length===6&&counts.filter(n=>n===5).length===6;
  if(valid){ledger.dataset.week1Verified='true';console.info('Week 1 Chronicle ledger verified: 72 unique territories, six 7 / six 5.');}
  return valid;
}
// The historical board can take well over 20 seconds on mobile. Keep this passive
// retry alive without observing or touching the map/playback DOM.
let attempts=0;const timer=setInterval(()=>{attempts++;if(apply()||attempts>=180)clearInterval(timer)},1000);
setTimeout(apply,100);
})();