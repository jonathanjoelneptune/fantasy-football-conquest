(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const week=Number(new URLSearchParams(location.search).get('week')||1);if(week!==1)return;
const palette={"Hercules Unchained":"#e30613","🏺Hades Nutz":"#7a7a7a","The Peasants of Troy":"#ff8700","Winging It":"#9a7a00","TroyisBetterthanOdyssey":"#f000e8","Aries It Out":"#13bfdf","Apollo's Archers":"#1263bd","Winged Victory Formation":"#087b32","BeginnersRuck":"#7180a4","The Beer of Olympus":"#7dca36","Uranus Colonizer":"#633632","Flight of JarYES":"#7414df"};
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