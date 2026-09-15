(()=>{
'use strict';
const WEEK=Number(new URLSearchParams(location.search).get('week')||1);
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
function text(el){return (el?.textContent||'').replace(/\s+/g,' ').trim()}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

/* Chronicle map: two deliberately different historical snapshots. We drive the board's existing week controls instead of trying to call lexical functions from the parent document. */
function stripBoard(d,opts={}){
  const st=d.createElement('style');
  st.textContent=`header,.controlbar,.weekRail,.side,.sidebar,.landscapeMenuPanel,.battle-banner,.battleBanner,.battleMessage,.conquestBanner,.conquest-banner,.legend,.maptop,.footerhint,.modalBackdrop,.gmbar,.drawer,[class*=sidebar],[class*=battle][class*=banner],[class*=conquest][class*=banner]{display:none!important}.app,.main,.mapPaneShell,.mapcard{display:block!important;width:100%!important;max-width:none!important;height:100vh!important;min-height:100vh!important;padding:0!important;margin:0!important;border:0!important;grid-template-columns:1fr!important}.mapcard{overflow:hidden!important}#mapSvg{display:block!important;width:100%!important;height:100vh!important;min-height:100vh!important;max-width:none!important;margin:0!important}html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#0c1822!important}`;
  d.head.appendChild(st);
  if(opts.noArmies){
    const a=d.createElement('style');
    a.textContent=`[class*=army],[class*=Army],[class*=unit],[class*=Unit],[class*=front],[class*=Front],[class*=line],[class*=Line]{opacity:0!important;pointer-events:none!important}`;
    d.head.appendChild(a);
  }
}
function driveHistorical(frame,targetWeek,opts={}){
  try{
    const d=frame.contentDocument;if(!d)return;
    stripBoard(d,opts);
    const ranges=qa('input[type=range]',d);
    let range=ranges.find(x=>Number(x.max)>=17)||ranges[0];
    if(range){range.value=String(targetWeek);['input','change'].forEach(t=>range.dispatchEvent(new Event(t,{bubbles:true})))}
    const pills=qa('button,.weekPill',d);
    const patterns=targetWeek===0?[/original/i,/start/i,/pre.?season/i,/week\s*0/i,/^w0$/i]:[new RegExp(`week\\s*${targetWeek}\\b`,'i'),new RegExp(`^w${targetWeek}$`,'i')];
    const b=pills.find(x=>patterns.some(re=>re.test(text(x)))); if(b)b.click();
    setTimeout(()=>{ if(range){range.value=String(targetWeek);['input','change'].forEach(t=>range.dispatchEvent(new Event(t,{bubbles:true})))} },250);
  }catch(e){console.warn('chronicle historical state',e)}
}
function setupChronicleMaps(){
  qa('.fadeMap').forEach((m,idx)=>{
    const before=q('.before',m),after=q('.after',m); if(!before||!after)return;
    before.onload=()=>setTimeout(()=>driveHistorical(before,Math.max(0,WEEK-1),{noArmies:idx>0}),650);
    after.onload=()=>setTimeout(()=>driveHistorical(after,WEEK,{noArmies:idx>0}),650);
  });
}

/* Conquest: use one board, play the board's own historical week animation, and keep the Chronicle's quiet before/after map separate. */
function upgradeConquest(){
 const pane=q('#conquest'); if(!pane)return;
 const map=q('.stateMap',pane); if(!map)return;
 map.classList.add('conquestPlayback');
 const before=q('.before',map),after=q('.after',map);
 if(before)before.style.display='none';
 if(after){after.style.opacity='1';after.classList.remove('after');after.classList.add('conquestLive');
   after.onload=()=>setTimeout(()=>{
     driveHistorical(after,Math.max(0,WEEK-1),{noArmies:true});
     setTimeout(()=>{
       try{const d=after.contentDocument;const buttons=qa('button',d);const play=buttons.find(b=>/play|replay/i.test(text(b)) && !/display/i.test(text(b)));if(play)play.click();else driveHistorical(after,WEEK,{noArmies:true});}catch(e){driveHistorical(after,WEEK,{noArmies:true})}
     },1200);
   },650);
 }
 const badge=q('.stateBadge',map);if(badge)badge.textContent=`Week ${WEEK} Conquest Playback`;
 const toggle=q('#toggleState');if(toggle)toggle.style.display='none';
 const pause=q('#pause');if(pause)pause.textContent='Replay conquest';
 if(pause&&after)pause.onclick=()=>{driveHistorical(after,Math.max(0,WEEK-1),{noArmies:true});setTimeout(()=>driveHistorical(after,WEEK,{noArmies:true}),900)};
}

/* Ledger: scrape the rendered historical board first. This avoids depending on non-global lexical variables in the 10MB app. */
function scrapeLedger(){
 const src=q('#sourceFrame');if(!src)return;
 const run=()=>{try{
   const d=src.contentDocument;if(!d)return; driveHistorical(src,WEEK,{noArmies:false});
   setTimeout(()=>{
     const rows=qa('.countTR',d).map(r=>({team:text(q('.countName',r))||text(r.children[1]),count:Number(text(q('.countVal',r))||text(r.children[r.children.length-1]))})).filter(x=>x.team&&Number.isFinite(x.count));
     const svg=q('#mapSvg',d); const territoryEls=svg?qa('[data-territory-id],[data-territory],[data-name]',svg):[];
     const namesByOwner={};
     territoryEls.forEach(el=>{const name=el.dataset.territoryName||el.dataset.name||el.getAttribute('aria-label')||text(q('title',el));const owner=el.dataset.owner||el.dataset.team||el.getAttribute('data-owner-id');if(name&&owner)(namesByOwner[owner]||(namesByOwner[owner]=new Set())).add(name)});
     const ledger=q('#ledger'); if(rows.length&&ledger){ledger.innerHTML=rows.map(x=>`<div class="territoryCard"><div class="count">${x.count} ${x.count===1?'territory':'territories'}</div><h3>${esc(x.team)}</h3><p class="territoryNames">${esc([...Object.values(namesByOwner)].flatMap(s=>[...s]).filter(Boolean).slice(0,0).join(' • '))}</p></div>`).join('');
       qa('.territoryNames',ledger).forEach((p,i)=>{if(!p.textContent)p.textContent='Territory names are shown on the map above.'});
     }
     const changed=q('#changed');
     if(changed){const events=qa('.event',d).filter(e=>/conquer|territor|captur|seiz|transfer/i.test(text(e)));if(events.length)changed.innerHTML=events.slice(0,12).map(e=>`<div class="change">${esc(text(e))}</div>`).join('')}
   },1000);
 }catch(e){console.warn('ledger scrape',e)}};
 if(src.contentDocument?.readyState==='complete')run();else src.addEventListener('load',run,{once:true});
}

/* More room on a dedicated Honors page: keep the original awards and add useful weekly distinctions. */
function expandHonors(){
 const box=q('#honorCards');if(!box)return;
 const existing=new Set(qa('.honor strong',box).map(text));
 const extras=[
 ['⚡ Thunderbolt','Apollo\'s Archers','133.06 points','Third-highest team score and part of the week\'s highest-scoring matchup.'],
 ['🛡️ Last Stand','BeginnersRuck','Won by 2.46','Held the line in one of Week 1\'s three battles decided by fewer than ten points.'],
 ['🏹 Bullseye','Winged Victory Formation','Won by 0.60','The narrowest successful strike of the opening campaign.'],
 ['🌋 Underworld Rising','🏺Hades Nutz','137.26 points','Second-highest score in the league, paired with a 49.56-point rout.'],
 ['🏛️ Mortal Defiance','The Peasants of Troy','3.76-point escape','The mortals survived their first trial and opened the conquest 1-0.'],
 ['⚖️ Cruelest Fate','The Beer of Olympus','117.56 points','Scored above the league median and still left the battlefield 0-1.'],
 ['🎲 Photo Finish','BeginnersRuck vs. Uranus Colonizer','2.46 points','The second-closest battle of Week 1.'],
 ['🔥 Scorched Earth','Hercules Unchained vs. Aries It Out','55.60 points','The widest gulf between two armies in the opening week.']
 ];
 extras.forEach(x=>{if(existing.has(x[1]))return;const c=document.createElement('div');c.className='honor';c.tabIndex=0;c.innerHTML=`<span>${x[0]}</span><strong>${x[1]}</strong><em>${x[2]}</em><b class="tap">Tap for details</b><div class="more">${x[3]}</div>`;const f=()=>c.classList.toggle('open');c.onclick=f;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}};box.appendChild(c)});
}

/* Hall of Living Legends: every starter above 30 in Week 1. */
function expandLegends(){
 const pane=q('#legends');if(!pane)return;const section=q('.section',pane);if(!section)return;
 const hall=[['Caleb Williams',37.3,"Apollo's Archers",'Mike Quintero'],['Josh Allen',35.7,'Hercules Unchained','Asim Conrad'],['Derrick Henry',34.8,'The Peasants of Troy','Joey Neptune'],['Kenneth Walker',32.6,'🏺Hades Nutz','Bernard Laguerre'],["D'Andre Swift",31.9,'Winged Victory Formation','Courtney Quintero']];
 const old=q('.legend',section);if(old)old.remove();const grid=document.createElement('div');grid.className='legendGrid';grid.innerHTML=hall.map((x,i)=>`<div class="legend"><div class="pts">${x[1].toFixed(1)}</div><b>${x[0]}</b><br>${x[2]} • ${x[3]}<span class="note">Legendary • Week ${WEEK}, 2026 • ${i===0?'Highest-scoring starter of the opening campaign':'30+ point performance'}</span></div>`).join('');section.appendChild(grid);
}
const css=document.createElement('style');css.textContent=`.legendGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.conquestPlayback{aspect-ratio:16/9}.conquestPlayback iframe{object-fit:contain}.territoryNames:empty:after{content:'Territory names are shown on the map above.'}@media(max-width:760px){.legendGrid{grid-template-columns:1fr}.conquestPlayback{height:390px!important}}`;document.head.appendChild(css);
setupChronicleMaps();upgradeConquest();scrapeLedger();expandHonors();expandLegends();
})();