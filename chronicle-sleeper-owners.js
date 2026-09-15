(()=>{'use strict';
const LEAGUE='1392257124943282176',WEEK=Number(new URLSearchParams(location.search).get('week')||1),API='https://api.sleeper.app/v1';
const wanted=['Caleb Williams','Josh Allen','Derrick Henry','Kenneth Walker III','D’Andre Swift','Bryce Young','Jahmyr Gibbs'];
const norm=s=>String(s||'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const key=s=>norm(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const palette={"Hercules Unchained":"#a91418","Aries It Out":"#1688a7","The Peasants of Troy":"#b95a00","Winging It":"#b3a600","🏺Hades Nutz":"#625d54","TroyisBetterthanOdyssey":"#b900a9","Winged Victory Formation":"#23672d","The Beer of Olympus":"#5e7c2a","Apollo's Archers":"#0879a8","Flight of JarYES":"#6820a5","BeginnersRuck":"#698c2b","Uranus Colonizer":"#43271f"};
async function get(path){const r=await fetch(API+path,{cache:'no-store'});if(!r.ok)throw new Error(path+' '+r.status);return r.json()}
function cards(){return qa('#legends .legendCard').map(c=>({card:c,name:norm(q('.legendIdentity strong',c)?.textContent),note:q('.legendNote',c)})).filter(x=>wanted.some(n=>norm(n)===x.name))}
function standings(){return qa('#stand tr').map(tr=>({team:norm(tr.children[1]?.textContent),manager:norm(tr.children[2]?.textContent)})).filter(x=>x.team)}
function findPlayerId(players,name){const target=key(name);for(const [id,p] of Object.entries(players||{})){const names=[p?.full_name,[p?.first_name,p?.last_name].filter(Boolean).join(' '),p?.search_full_name,p?.search_last_name].filter(Boolean);if(names.some(n=>key(n)===target))return String(id)}return ''}
function userToStanding(user,stand){if(!user)return null;const candidates=[user.display_name,user.username,user.metadata?.team_name,user.metadata?.team_name_update,user.metadata?.first_name,user.metadata?.last_name].filter(Boolean).map(key);return stand.find(s=>candidates.includes(key(s.manager))||candidates.includes(key(s.team)))||null}
async function run(){const cs=cards();if(!cs.length)return false;try{
 const [rosters,matchups,users,players]=await Promise.all([get(`/league/${LEAGUE}/rosters`),get(`/league/${LEAGUE}/matchups/${WEEK}`),get(`/league/${LEAGUE}/users`),get('/players/nfl')]);
 const rosterById=new Map((rosters||[]).map(r=>[String(r.roster_id),r]));
 const userById=new Map((users||[]).map(u=>[String(u.user_id),u]));
 const matchupByPlayer=new Map();(matchups||[]).forEach(m=>[...(m.players||[]),...(m.starters||[])].forEach(id=>matchupByPlayer.set(String(id),String(m.roster_id))));
 const stand=standings();let found=0;
 for(const x of cs){const pid=findPlayerId(players,x.name);let rid=pid&&matchupByPlayer.get(pid);
   if(!rid&&pid){const historical=(matchups||[]).find(m=>(m.players||[]).map(String).includes(pid)||(m.starters||[]).map(String).includes(pid));rid=historical&&String(historical.roster_id)}
   if(!rid&&pid){const current=(rosters||[]).find(r=>(r.players||[]).map(String).includes(pid));rid=current&&String(current.roster_id)}
   const roster=rid&&rosterById.get(String(rid));const user=roster&&userById.get(String(roster.owner_id));if(!user||!x.note)continue;
   const row=userToStanding(user,stand);const sleeperTeam=norm(user.metadata?.team_name||user.metadata?.team_name_update||'');const team=row?.team||sleeperTeam;const manager=row?.manager||norm(user.display_name||user.username);
   if(!team&&!manager)continue;x.note.textContent=team?(team+(manager?' • '+manager:'')):manager;x.card.style.setProperty('--legend-accent',palette[team]||'#9a6a12');x.note.style.color=palette[team]||'#6f4808';x.note.dataset.ownerSource='sleeper-week-'+WEEK;found++;
 }
 console.info(`Sleeper ownership resolved ${found}/${cs.length} Living Legends`);return found===cs.length;
 }catch(e){console.error('Sleeper Living Legends ownership lookup failed',e);return false}}
async function start(){for(let i=0;i<6;i++){if(await run())return;await new Promise(r=>setTimeout(r,700))}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();