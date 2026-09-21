  // WEEKLY_NEWSLETTER_V820_START
  // Weekly Newsletter lives inside the main app closure so it shares the same
  // seasonHubTab/renderSeasonHub state as Matchups, Weekly Honors, and the
  // other Season Center tabs.
  let newsletterWeekV820=null;

  function ensureNewsletterStylesV820(){
    if(document.getElementById('weeklyNewsletterStylesV820'))return;
    const s=document.createElement('style');s.id='weeklyNewsletterStylesV820';
    s.textContent='.weeklyNewsletterV820{max-width:1180px;margin:0 auto}.newsletterToolbarV820{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:10px}.newsletterToolbarRightV820{display:flex;align-items:center;gap:10px}.newsletterDirectLinkV820{display:inline-flex;align-items:center;justify-content:center;min-height:30px;padding:6px 10px;border:1px solid rgba(212,167,44,.55);border-radius:7px;color:#f5d978;text-decoration:none;font:900 9px Arial;letter-spacing:.06em;text-transform:uppercase;background:rgba(212,167,44,.08)}.newsletterDirectLinkV820:hover{background:rgba(212,167,44,.16)}.newsletterToolbarV820 label{display:grid;gap:4px;font-size:10px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:#8d6013}.newsletterHeroV820{padding:18px 20px;border:1px solid rgba(212,167,44,.42);border-top:3px solid #d4a72c;border-radius:10px;background:linear-gradient(135deg,rgba(212,167,44,.11),rgba(18,29,48,.7));margin-bottom:10px}.newsletterKickerV820{font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#d4a72c}.newsletterTitleV820{font-family:Georgia,serif;font-size:30px;line-height:1;margin:3px 0 5px;color:#f5f7fb}.newsletterDeckV820{max-width:850px;color:#9fb0ca;font-family:Georgia,serif;font-style:italic;font-size:14px}.newsletterStatsV820{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.newsletterStatV820,.newsletterBattleV820,.newsletterMomentV820,.newsletterPlayerV820{padding:9px 10px;border:1px solid rgba(130,151,184,.22);border-radius:8px;background:#111d30}.newsletterStatV820 b{display:block;color:#f5d978;font-size:17px}.newsletterStatV820 span{display:block;color:#9fb0ca;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}.newsletterSectionV820{margin-top:13px}.newsletterSectionTitleV820{font-size:10px;font-weight:950;letter-spacing:.13em;text-transform:uppercase;color:#d4a72c;border-bottom:1px solid rgba(212,167,44,.35);padding-bottom:5px;margin-bottom:7px}.newsletterStoryV820{font-family:Georgia,serif;color:#dce4f0;font-size:13px;line-height:1.58;padding:12px 14px;border-left:3px solid #9a6a12;background:rgba(255,255,255,.025)}.newsletterBattlesV820{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.newsletterBattleTopV820{font-size:9px;color:#8fa3c2;text-transform:uppercase;letter-spacing:.08em;font-weight:900;margin-bottom:7px}.newsletterTeamV820{display:flex;justify-content:space-between;gap:8px;padding:4px 0;font-weight:850;color:#e8eef8}.newsletterTeamV820.leader{color:#f5d978}.newsletterResultV820{margin-top:6px;padding-top:6px;border-top:1px solid rgba(130,151,184,.18);font-size:10px;color:#9fb0ca}.newsletterMomentsV820,.newsletterPlayersV820{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.newsletterMomentV820 b,.newsletterPlayerV820 b{display:block;color:#f5d978;font-size:12px;margin-bottom:3px}.newsletterMomentV820 span,.newsletterPlayerV820 span{display:block;color:#9fb0ca;font-size:10px;line-height:1.35}.newsletterFrameWrapV820{height:calc(100vh - 250px);min-height:640px;border:1px solid rgba(212,167,44,.35);border-radius:8px;overflow:hidden;background:#fff}.newsletterFrameV820{width:100%;height:100%;border:0}.newsletterSourceV820{font-size:9px;color:#7588a6;margin-top:10px;text-align:right}.newsletterStateV820{display:inline-flex;align-items:center;gap:5px;margin-left:8px;padding:3px 6px;border:1px solid rgba(212,167,44,.45);border-radius:99px;font:900 8px Arial;text-transform:uppercase;color:#d4a72c}html[data-theme=light] .newsletterTitleV820{color:#20170e}html[data-theme=light] .newsletterDeckV820{color:#5e554b}html[data-theme=light] .newsletterHeroV820{background:linear-gradient(135deg,#fff8e8,#fff)}html[data-theme=light] .newsletterStatV820,html[data-theme=light] .newsletterBattleV820,html[data-theme=light] .newsletterMomentV820,html[data-theme=light] .newsletterPlayerV820{background:#fff;border-color:rgba(70,55,30,.18)}html[data-theme=light] .newsletterTeamV820{color:#2b251f}html[data-theme=light] .newsletterTeamV820.leader{color:#8d6013}html[data-theme=light] .newsletterStoryV820{color:#332b24;background:#fffaf0}@media(max-width:900px){.newsletterStatsV820{grid-template-columns:repeat(2,1fr)}.newsletterBattlesV820,.newsletterMomentsV820,.newsletterPlayersV820{grid-template-columns:1fr}.newsletterTitleV820{font-size:24px}.newsletterFrameWrapV820{height:calc(100vh - 220px);min-height:560px}}';
    document.head.appendChild(s);
  }

  function newsletterMedianV820(values){
    const a=[...values].filter(Number.isFinite).sort((x,y)=>x-y);
    return a.length?(a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2):0;
  }
  function newsletterGamesV820(src,week){
    return (src?.games||[]).filter(g=>Number(g.week)===Number(week)&&g.a&&g.b);
  }
  function newsletterWeekOptionsV820(latest,week){
    return Array.from({length:Math.max(1,latest)},(_,i)=>i+1).map(w=>'<option value="'+w+'" '+(w===week?'selected':'')+'>Week '+w+'</option>').join('');
  }
  function newsletterToolbarV820(latest,week,body){
    return '<div class="weeklyNewsletterV820"><div class="newsletterToolbarV820"><label>Newsletter Week<select id="newsletterWeekPickerV820">'+newsletterWeekOptionsV820(latest,week)+'</select></label><div class="newsletterToolbarRightV820"><a class="newsletterDirectLinkV820" href="./chronicle.html?week='+week+'" target="_blank" rel="noopener">Open direct newsletter ↗</a><div class="hubFilterNote">Weekly Chronicle archive</div></div></div>'+body+'</div>';
  }
  function newsletterBindPickerV820(){
    document.getElementById('newsletterWeekPickerV820')?.addEventListener('change',e=>{
      newsletterWeekV820=Number(e.target.value);
      seasonHubWeek=newsletterWeekV820;
      renderSeasonHub();
    });
  }
  function newsletterAllPlayV820(src,week,games,settled){
    if(settled)return hubWeekAllPlayTable(src,week);
    const scores=games.flatMap(g=>[{key:g.a,score:Number(g.sa||0)},{key:g.b,score:Number(g.sb||0)}]);
    if(!scores.length)return '<div class="hubEmpty">No Week '+week+' scores are available yet.</div>';
    const rows=scores.map(x=>{
      let w=0,l=0,t=0;
      scores.forEach(y=>{if(y.key===x.key)return;if(x.score>y.score)w++;else if(x.score<y.score)l++;else t++;});
      const den=w+l+t;
      return {...x,w,l,t,pct:den?(w+.5*t)/den:0,name:hubTeamName(src,x.key)};
    }).sort((a,b)=>b.w-a.w||b.score-a.score);
    return '<div class="weeklyAllPlayWrap"><div class="hubSectionTitle">Week '+week+' Live All-Play Snapshot</div><div class="hubIntro"><strong>Provisional until the fantasy week closes.</strong> Current scores are compared with every other current score in the league. This becomes the official all-play table when the final NFL game of the week is complete.</div><table class="hubTable"><thead><tr><th>#</th><th>Team / Dynasty Manager</th><th>Score</th><th>All-Play Record</th><th>All-Play %</th></tr></thead><tbody>'+rows.map((r,i)=>'<tr><td class="hubRank">'+(i+1)+'</td><td><div class="hubName">'+escapeHtml(r.name)+'</div><div class="hubManager">'+escapeHtml(hubManagerLabel(src.seasonId,r.name))+'</div></td><td class="num">'+hubFmt(r.score)+'</td><td class="num">'+r.w+'-'+r.l+(r.t?'-'+r.t:'')+'</td><td class="num">'+hubPct(r.pct)+'</td></tr>').join('')+'</tbody></table></div>';
  }
  function newsletterPlayersV820(week){
    const rec=seasonRegistry?.[activeSeasonId];
    if(rec?.provider!=='sleeper'||!sleeperData?.connected)return '';
    if(!hubSleeperPlayers){
      hubEnsureSleeperPlayers?.().then(()=>{if(currentSiteView==='season'&&seasonHubTab==='newsletter')renderSeasonHub();});
      return '<section class="newsletterSectionV820"><div class="newsletterSectionTitleV820">Players Who Shaped the Week</div><div class="hubEmpty">Loading Sleeper player performances…</div></section>';
    }
    const rows=hubSleeperWeekLineups(activeSeasonId,week)
      .flatMap(r=>r.starterRows.map(p=>({...p,team:r.team})))
      .filter(p=>Number.isFinite(p.score))
      .sort((a,b)=>b.score-a.score)
      .slice(0,6);
    if(!rows.length)return '';
    return '<section class="newsletterSectionV820"><div class="newsletterSectionTitleV820">Players Who Shaped the Week</div><div class="newsletterPlayersV820">'+rows.map(p=>'<article class="newsletterPlayerV820"><b>'+escapeHtml(p.name)+' · '+hubFmt(p.score,1)+'</b><span>'+escapeHtml(p.pos||'Starter')+' for '+escapeHtml(p.team)+'</span></article>').join('')+'</div></section>';
  }

  function renderWeeklyNewsletterV820(){
    ensureNewsletterStylesV820();
    const content=document.getElementById('seasonHubContent');
    const rec=seasonRegistry?.[activeSeasonId];
    const analysis=hubSeasonAnalysis(activeSeasonId);
    if(!content)return;
    document.querySelectorAll('[data-season-hub-tab]').forEach(b=>b.classList.toggle('active',b.dataset.seasonHubTab==='newsletter'));
    if(!analysis||!rec){content.innerHTML='<div class="hubEmpty">Season data is not available.</div>';return;}

    const title=document.getElementById('seasonHubTitle');
    const sub=document.getElementById('seasonHubSub');
    const statusEl=document.getElementById('seasonHubStatus');
    if(title)title.textContent=rec.mapTitle||rec.nflSeason+' Season';
    if(sub)sub.textContent=rec.nflSeason+' Season';

    const src=analysis.src;
    const latest=Math.max(1,Number(src.latestWeek||1));
    let week=Number(newsletterWeekV820??seasonHubWeek??latest);
    week=Math.min(Math.max(1,week),latest);
    newsletterWeekV820=week;
    seasonHubWeek=week;
    if(statusEl)statusEl.textContent='Newsletter · Week '+week+(week===latest?' · Latest':'');

    // The League of Olympus newsletter uses the same Chronicle shell every
    // week. Week 1 remains the published archive; Week 2+ are populated
    // dynamically from the live Sleeper/main-board data by chronicle.html.
    if(Number(rec.nflSeason)===2026){
      content.innerHTML=newsletterToolbarV820(latest,week,'<div class="newsletterFrameWrapV820"><iframe class="newsletterFrameV820" title="Week '+week+' Newsletter" src="./chronicle.html?week='+week+'"></iframe></div>');
      newsletterBindPickerV820();
      return;
    }

    // Other archived seasons retain the compact generated summary.
    const games=newsletterGamesV820(src,week);
    const settled=games.length>0&&games.every(g=>g.final!==false);
    const scores=games.flatMap(g=>[Number(g.sa),Number(g.sb)]).filter(Number.isFinite);
    const avg=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;
    const median=newsletterMedianV820(scores);
    const teamScores=games.flatMap(g=>[{key:g.a,score:Number(g.sa||0)},{key:g.b,score:Number(g.sb||0)}]).sort((a,b)=>b.score-a.score);
    const top=teamScores[0]||null;
    const big=[...games].sort((a,b)=>Math.abs(Number(b.sa||0)-Number(b.sb||0))-Math.abs(Number(a.sa||0)-Number(a.sb||0)))[0]||null;
    const close=[...games].sort((a,b)=>Math.abs(Number(a.sa||0)-Number(a.sb||0))-Math.abs(Number(b.sa||0)-Number(b.sb||0)))[0]||null;
    const combined=[...games].sort((a,b)=>(Number(b.sa||0)+Number(b.sb||0))-(Number(a.sa||0)+Number(a.sb||0)))[0]||null;
    const leaderName=top?hubTeamName(src,top.key):'No leader yet';

    const story=games.length
      ?(settled?'Week '+week+' passed into the record with '+games.length+' battles decided. ':'Week '+week+' is still being written, with '+games.length+' battles feeding live from Sleeper. ')
       +(top?leaderName+' set the scoring pace at '+hubFmt(top.score,1)+' points. ':'')
       +(close?'The tightest battle separated '+hubTeamName(src,Number(close.sa||0)>=Number(close.sb||0)?close.a:close.b)+' and '+hubTeamName(src,Number(close.sa||0)>=Number(close.sb||0)?close.b:close.a)+' by '+hubFmt(Math.abs(Number(close.sa||0)-Number(close.sb||0)),1)+' points. ':'')
       +(big?'The widest gap on the board stood at '+hubFmt(Math.abs(Number(big.sa||0)-Number(big.sb||0)),1)+' points.':'')
      :'Week '+week+' data has not arrived from Sleeper yet.';

    const battles=games.map((g,i)=>{
      const a=hubTeamName(src,g.a),b=hubTeamName(src,g.b),sa=Number(g.sa||0),sb=Number(g.sb||0),aLead=sa>sb,bLead=sb>sa;
      const result=settled
        ?(sa===sb?'Tie':(aLead?escapeHtml(a):escapeHtml(b))+' won by '+hubFmt(Math.abs(sa-sb),1))
        :(sa===sb?'Currently tied':(aLead?escapeHtml(a):escapeHtml(b))+' leads by '+hubFmt(Math.abs(sa-sb),1));
      return '<article class="newsletterBattleV820"><div class="newsletterBattleTopV820">Battle '+(i+1)+(settled?' · Final':' · Live')+'</div><div class="newsletterTeamV820 '+(aLead?'leader':'')+'"><span>'+escapeHtml(a)+'</span><span>'+hubFmt(sa,1)+'</span></div><div class="newsletterTeamV820 '+(bLead?'leader':'')+'"><span>'+escapeHtml(b)+'</span><span>'+hubFmt(sb,1)+'</span></div><div class="newsletterResultV820">'+result+'</div></article>';
    }).join('');

    const momentCard=(label,g,combinedMode=false)=>{
      if(!g)return '';
      const a=hubTeamName(src,g.a),b=hubTeamName(src,g.b),sa=Number(g.sa||0),sb=Number(g.sb||0);
      const value=combinedMode?hubFmt(sa+sb,1)+' combined points':hubFmt(Math.abs(sa-sb),1)+'-point gap';
      return '<article class="newsletterMomentV820"><b>'+label+'</b><span>'+escapeHtml(a)+' vs. '+escapeHtml(b)+' · '+value+'</span></article>';
    };

    const stateLabel=settled?'Official Chronicle':'Live Chronicle';
    const body=
      '<header class="newsletterHeroV820"><div class="newsletterKickerV820">The League of Olympus · Week '+week+' <span class="newsletterStateV820">'+stateLabel+'</span></div><div class="newsletterTitleV820">The Chronicle of Week '+week+'</div><div class="newsletterDeckV820">The battles, performances, turning points, and numbers shaping this chapter of the conquest.</div></header>'+
      '<div class="newsletterStatsV820"><div class="newsletterStatV820"><b>'+games.length+'</b><span>Battles</span></div><div class="newsletterStatV820"><b>'+hubFmt(avg,1)+'</b><span>Average Score</span></div><div class="newsletterStatV820"><b>'+hubFmt(median,1)+'</b><span>Median Score</span></div><div class="newsletterStatV820"><b>'+escapeHtml(leaderName)+'</b><span>Scoring Pace · '+(top?hubFmt(top.score,1):'—')+'</span></div></div>'+
      '<section class="newsletterSectionV820"><div class="newsletterSectionTitleV820">The Week in the Chronicle</div><div class="newsletterStoryV820">'+escapeHtml(story)+'</div></section>'+
      '<section class="newsletterSectionV820"><div class="newsletterSectionTitleV820">The Six Battles</div><div class="newsletterBattlesV820">'+(battles||'<div class="hubEmpty">No matchup scores are available yet.</div>')+'</div></section>'+
      '<section class="newsletterSectionV820"><div class="newsletterSectionTitleV820">Turning Points</div><div class="newsletterMomentsV820">'+momentCard('Closest Battle',close)+momentCard('Largest Gap',big)+momentCard('Highest Combined Matchup',combined,true)+'</div></section>'+
      newsletterPlayersV820(week)+
      '<section class="newsletterSectionV820">'+newsletterAllPlayV820(src,week,games,settled)+'</section>'+
      '<div class="newsletterSourceV820">'+(settled?'Official':'Provisional')+' Week '+week+' Chronicle generated from '+escapeHtml(String(rec.provider).toUpperCase())+' league data.</div>';

    content.innerHTML=newsletterToolbarV820(latest,week,body);
    newsletterBindPickerV820();
  }

  // Capture the final mature Season Center renderer and add Newsletter as an
  // explicit branch. Existing tab listeners now call this same binding, so
  // switching Matchups -> Newsletter and Honors -> Newsletter replaces content.
  const renderSeasonHubV820Base=renderSeasonHub;
  renderSeasonHub=function(){
    if(seasonHubTab==='newsletter')return renderWeeklyNewsletterV820();
    return renderSeasonHubV820Base.apply(this,arguments);
  };

  // Support direct links such as ?tab=newsletter#season.
  const requestedSeasonTabV820=new URLSearchParams(location.search).get('tab');
  if(['bigboard','newsletter','week','overview','standings','players','managers','superlatives','legends','transactions'].includes(requestedSeasonTabV820)){
    seasonHubTab=requestedSeasonTabV820;
  }
  // WEEKLY_NEWSLETTER_V820_END
