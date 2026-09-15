(()=>{'use strict';
const LEAGUE='1392257124943282176',WEEK=Number(new URLSearchParams(location.search).get('week')||1),API='https://api.sleeper.app/v1';
const wanted=['Caleb Williams','Josh Allen','Derrick Henry','Kenneth Walker III','D’Andre Swift','Bryce Young','Jahmyr Gibbs'];
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const palette={"Apollo's Archers":"#29a9c7","Hercules Unchained":"#c82127","The Peasants of Troy":"#f07c00","Winged Victory Formation":"#2d6f32","Aries It Out":"#35a8c5","Flight of JarYES":"#8120d4","The Beer of Olympus":"#759e34","TroyisBetterthanOdyssey":"#ef14d9","Uranus Colonizer":"#4a2d25","Winging It":"#1d57b7","BeginnersRuck":"#759e34","🏺Hades Nutz":"#77736a"};
async function get(path){const r=await fetch(API+path,{cache:'no-store'});if(!r.ok)throw new Error(path+' '+r.status);return r.json()}
function cards(){return qa('#legends .legendCard').map(c=>({card:c,name:norm(q('.legendIdentity strong',c)?.textContent),note:q('.legendNote',c)})).filter(x=>wanted.some(n=>norm(n)===x.name))}
async function run(){const cs=cards();if(!cs.length)return false;try{
 const [rosters,matchups,users,players]=await Promise.all([get(`/league/${LEAGUE}/rosters`),get(`/league/${LEAGUE}/matchups/${WEEK}`),get(`/league/${LEAGUE}/users`),get('/players/nfl')]);
 const playerId=new Map();Object.entries(players||{}).forEach(([id,p])=>{const name=norm(p?.full_name||[p?.first_name,p?.last_name].filter(Boolean).join(' '));if(name)playerId.set(name,id)});
 const rosterById=new Map((rosters||[]).map(r=>[String(r.roster_id),r]));
 const userById=new Map((users||[]).map(u=>[String(u.user_id),u]));
 const matchupByPlayer=new Map();(matchups||[]).forEach(m=>(m.players||[]).forEach(id=>matchupByPlayer.set(String(id),String(m.roster_id))));
 const stand=qa('#stand tr').map(tr=>({team:norm(tr.children[1]?.textContent),manager:norm(tr.children[2]?.textContent)})).filter(x=>x.team);
 let found=0;
 cs.forEach(x=>{const pid=playerId.get(x.name);const rid=pid&&matchupByPlayer.get(String(pid));const roster=rid&&rosterById.get(rid);const user=roster&&userById.get(String(roster.owner_id));if(!user||!x.note)return;
   let team=norm(user.metadata?.team_name||user.metadata?.team_name_update||'');let row=stand.find(s=>norm(s.team)===team);
   if(!row){const manager=norm(user.display_name||user.username);row=stand.find(s=>norm(s.manager).toLowerCase()===manager.toLowerCase())}
   if(row)team=row.team;const manager=row?.manager||norm(user.display_name||user.username);
   x.note.textContent=team?(team+(manager?' • '+manager:'')):manager;x.card.style.setProperty('--legend-accent',palette[team]||'#9a6a12');x.note.dataset.ownerSource='sleeper-week-'+WEEK;found++;
 });
 if(found<cs.length)console.warn(`Sleeper ownership resolved ${found}/${cs.length} Living Legends`);return found>0;
 }catch(e){console.error('Sleeper Living Legends ownership lookup failed',e);return false}}
function start(){if(run())return;const mo=new MutationObserver(()=>{if(cards().length){mo.disconnect();run()}});mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),10000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();