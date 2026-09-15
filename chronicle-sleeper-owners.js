(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const week=Number(new URLSearchParams(location.search).get('week')||1);if(week!==1)return;
const palette={"Hercules Unchained":"#a91418","Aries It Out":"#1688a7","The Peasants of Troy":"#b95a00","Winging It":"#b3a600","🏺Hades Nutz":"#625d54","TroyisBetterthanOdyssey":"#b900a9","Winged Victory Formation":"#23672d","The Beer of Olympus":"#5e7c2a","Apollo's Archers":"#0879a8","Flight of JarYES":"#6820a5","BeginnersRuck":"#698c2b","Uranus Colonizer":"#43271f"};
const owners={
 'Caleb Williams':{team:"Apollo's Archers",manager:'Mike Quintero'},
 'Josh Allen':{team:'🏺Hades Nutz',manager:'Bernard Laguerre'},
 'Derrick Henry':{team:"Apollo's Archers",manager:'Mike Quintero'},
 'Kenneth Walker III':{team:'BeginnersRuck',manager:'Tomiwa Adetoyese-Olagunju'},
 "D'Andre Swift":{team:'Winging It',manager:'Kermmit Strachan'},
 'Jahmyr Gibbs':{team:'Hercules Unchained',manager:'Asim Conrad'}
};
function apply(){const cards=qa('#legends .legendCard');if(!cards.length)return false;for(const card of cards){const name=norm(q('.legendIdentity strong',card)?.textContent);if(name==='Bryce Young'){card.remove();continue}const o=owners[name];if(!o)continue;const note=q('.legendNote',card);const color=palette[o.team]||'#9a6a12';if(note){note.textContent=o.team+' • '+o.manager;note.style.color=color;note.dataset.ownerSource='week-1-hardcoded'}card.style.setProperty('--legend-accent',color)}return true}
function start(){if(apply())return;const mo=new MutationObserver(()=>{if(apply())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),10000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();