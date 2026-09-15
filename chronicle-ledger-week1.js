(()=>{
'use strict';
const WEEK=Number(new URLSearchParams(location.search).get('week')||1);
if(WEEK!==1)return;
const transfers=[
  ["Atlas' Mountains",'Aries It Out','Hercules Unchained',['atlas']],
  ["Hector's Ramparts",'Winging It','The Peasants of Troy',['hector']],
  ["Winged Messenger's Rest",'TroyisBetterthanOdyssey','🏺Hades Nutz',['winged','messenger']],
  ["Hercules' Palaestra",'The Beer of Olympus','Winged Victory Formation',['hercules','palaestra']],
  ["Agamemnon's High Hall",'Flight of JarYES',"Apollo's Archers",['agamemnon']],
  ['Moirai Loom','Uranus Colonizer','BeginnersRuck',['moirai']]
];
const norm=s=>String(s||'').normalize('NFKD').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const key=s=>norm(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const words=s=>norm(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(Boolean);
const ledger=document.querySelector('#ledger');
if(!ledger)return;
function cards(){return [...ledger.querySelectorAll('.territoryCard')].filter(c=>c.querySelector('h3')&&c.querySelector('.territoryNames'));}
function cardFor(team,cs){const want=key(team);return cs.find(c=>{const got=key(c.querySelector('h3')?.textContent);return got===want||got.endsWith(want)||want.endsWith(got);});}
function names(c){return [...c.querySelectorAll('.territoryNames span')];}
function territoryMatch(el,territory,hints){const got=key(el.textContent),want=key(territory);if(got===want||got.endsWith(want)||want.endsWith(got))return true;const ws=words(el.textContent);return hints.every(h=>ws.includes(h));}
function applyOnce(){
  const cs=cards();
  if(cs.length!==12)return false;
  for(const [territory,loser,winner,hints] of transfers){
    const lc=cardFor(loser,cs),wc=cardFor(winner,cs);
    if(!lc||!wc)return false;
    const lost=names(lc).filter(el=>territoryMatch(el,territory,hints));
    lost.forEach(el=>el.remove());
    const existing=names(wc).filter(el=>territoryMatch(el,territory,hints));
    if(!existing.length){const span=document.createElement('span');span.textContent=territory;wc.querySelector('.territoryNames').appendChild(span);}
    else existing.slice(1).forEach(el=>el.remove());
  }
  cs.forEach(c=>{const n=names(c).length;c.querySelector('.count').textContent=`${n} ${n===1?'territory':'territories'}`;});
  const all=cs.flatMap(names).map(el=>key(el.textContent));
  const counts=cs.map(c=>names(c).length);
  const valid=all.length===72&&new Set(all).size===72&&counts.filter(n=>n===7).length===6&&counts.filter(n=>n===5).length===6;
  if(valid){console.info('Week 1 Chronicle ledger verified: 72 unique territories, six teams at 7 and six at 5.');ledger.dataset.week1Verified='true';}
  else console.warn('Week 1 Chronicle ledger validation failed',{total:all.length,unique:new Set(all).size,counts});
  return valid;
}
let tries=0;
const timer=setInterval(()=>{tries++;if(applyOnce()||tries>=40)clearInterval(timer);},500);
setTimeout(applyOnce,100);
})();