  // WEEKLY_NEWSLETTER_V820_START
  // Canonical newsletter bridge.
  // This code runs INSIDE the main application closure, so it is the only
  // newsletter code allowed to read Season Center's private analysis helpers.
  // The public weekly-recap page consumes this bridge through a same-origin
  // hidden iframe. No fantasy scoring, honors, standings, or legends logic is
  // reimplemented in the newsletter.
  let newsletterWeekV820=null;

  function newsletterCloneHtmlV830(){
    const content=document.getElementById('seasonHubContent');
    if(!content)return '';
    const clone=content.cloneNode(true);
    clone.querySelectorAll('script,iframe,style,link').forEach(x=>x.remove());
    clone.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
    clone.querySelectorAll('button,a').forEach(x=>{
      x.removeAttribute('onclick');
      if(x.tagName==='A'&&x.getAttribute('href')?.startsWith('javascript:'))x.removeAttribute('href');
    });
    return clone.innerHTML;
  }

  async function newsletterSettleV830(ms=120){
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    if(ms)await new Promise(r=>setTimeout(r,ms));
  }

  async function newsletterSnapshotTabV830(tab,week){
    const oldTab=seasonHubTab,oldWeek=seasonHubWeek;
    try{
      seasonHubWeek=Number(week);
      seasonHubTab=tab;
      renderSeasonHub();
      await newsletterSettleV830(160);
      // Some Sleeper-powered sections populate after a player-database fetch.
      if(/Loading/i.test(document.getElementById('seasonHubContent')?.textContent||'')){
        try{await hubEnsureSleeperPlayers?.()}catch(_){}
        renderSeasonHub();
        await newsletterSettleV830(220);
      }
      return newsletterCloneHtmlV830();
    }finally{
      seasonHubTab=oldTab;
      seasonHubWeek=oldWeek;
    }
  }

  function newsletterConquestV830(week){
    try{
      if(typeof stateThroughWeek!=='function'||!Array.isArray(teams)||!Array.isArray(territoryDefs))return null;
      const state=stateThroughWeek(Number(week))||{};
      const own=state.owners||{};
      const teamRows=teams.map(t=>({id:t.id,name:t.name,color:t.color||t.hex||null}));
      const territoryRows=territoryDefs.map(t=>({id:t.id,name:t.name,owner:own[t.id]??null}));
      const events=(Array.isArray(history)?history:[])
        .filter(ev=>Number(ev.week)===Number(week))
        .flatMap(ev=>(ev.transfers||[]).map(x=>({
          territoryId:x.territoryId,
          from:x.fromTeamId??x.from??null,
          to:x.toTeamId??x.to??null
        })));
      return {teams:teamRows,territories:territoryRows,events};
    }catch(err){
      console.warn('Newsletter conquest bridge unavailable',err);
      return null;
    }
  }

  async function newsletterWeekPackageV830(requestedWeek){
    const rec=seasonRegistry?.[activeSeasonId];
    const analysis=hubSeasonAnalysis(activeSeasonId);
    if(!rec||!analysis?.src)throw new Error('Season Center data is not ready');
    const src=analysis.src;
    const latest=Math.max(1,Number(src.latestWeek||1));
    const week=Math.min(Math.max(1,Number(requestedWeek||latest)),latest);
    const games=hubWeekGames(src,week).map((g,i)=>({
      index:i+1,
      a:g.a,b:g.b,
      teamA:hubTeamName(src,g.a),
      teamB:hubTeamName(src,g.b),
      managerA:hubManagerLabel?.(src.seasonId,hubTeamName(src,g.a))||'',
      managerB:hubManagerLabel?.(src.seasonId,hubTeamName(src,g.b))||'',
      scoreA:Number(g.sa||0),
      scoreB:Number(g.sb||0),
      winner:g.winner?hubTeamName(src,g.winner):null,
      loser:g.loser?hubTeamName(src,g.loser):null,
      final:Boolean(g.winner)
    }));
    const scores=games.flatMap(g=>[g.scoreA,g.scoreB]).filter(Number.isFinite);
    const average=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;
    const sorted=[...scores].sort((a,b)=>a-b);
    const median=sorted.length?(sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2):0;
    const high=games.flatMap(g=>[
      {team:g.teamA,score:g.scoreA},
      {team:g.teamB,score:g.scoreB}
    ]).sort((a,b)=>b.score-a.score)[0]||null;

    // Capture the ACTUAL Season Center views. These are presentation snapshots
    // produced by the live app's renderer, not newsletter-side recreations.
    // Season Center rendering uses shared mutable tab/week state, so snapshot
    // one view at a time. Parallel rendering would race and cross-contaminate
    // the captured sections.
    const honorsHtml=await newsletterSnapshotTabV830('week',week);
    const standingsHtml=await newsletterSnapshotTabV830('standings',week);
    const legendsHtml=await newsletterSnapshotTabV830('legends',week);

    let allPlayHtml='';
    try{allPlayHtml=hubWeekAllPlayTable(src,week)||''}catch(_){}

    return {
      version:1,
      generatedAt:new Date().toISOString(),
      seasonId:activeSeasonId,
      nflSeason:Number(rec.nflSeason||0),
      provider:String(rec.provider||''),
      week,latestWeek:latest,
      games,average,median,high,
      honorsHtml,standingsHtml,legendsHtml,allPlayHtml,
      conquest:newsletterConquestV830(week)
    };
  }

  window.OlympusWeekBridge={
    version:1,
    getWeekPackage:newsletterWeekPackageV830
  };

  function ensureNewsletterStylesV820(){
    if(document.getElementById('weeklyNewsletterStylesV820'))return;
    const s=document.createElement('style');s.id='weeklyNewsletterStylesV820';
    s.textContent='.weeklyNewsletterV820{max-width:1180px;margin:0 auto}.newsletterToolbarV820{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:10px}.newsletterToolbarV820 label{display:grid;gap:4px;font-size:10px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:#8d6013}.newsletterFrameWrapV820{height:calc(100vh - 250px);min-height:640px;border:1px solid rgba(212,167,44,.35);border-radius:8px;overflow:hidden;background:#fff}.newsletterFrameV820{width:100%;height:100%;border:0}@media(max-width:900px){.newsletterFrameWrapV820{height:calc(100vh - 220px);min-height:560px}}';
    document.head.appendChild(s);
  }

  function newsletterWeekOptionsV820(latest,week){
    return Array.from({length:Math.max(1,latest)},(_,i)=>i+1)
      .map(w=>'<option value="'+w+'" '+(w===week?'selected':'')+'>Week '+w+'</option>').join('');
  }

  function newsletterBindPickerV820(){
    document.getElementById('newsletterWeekPickerV820')?.addEventListener('change',e=>{
      newsletterWeekV820=Number(e.target.value);
      seasonHubWeek=newsletterWeekV820;
      renderSeasonHub();
    });
  }

  function renderWeeklyNewsletterV820(){
    ensureNewsletterStylesV820();
    const content=document.getElementById('seasonHubContent');
    const rec=seasonRegistry?.[activeSeasonId];
    const analysis=hubSeasonAnalysis(activeSeasonId);
    if(!content)return;
    document.querySelectorAll('[data-season-hub-tab]').forEach(b=>b.classList.toggle('active',b.dataset.seasonHubTab==='newsletter'));
    if(!analysis||!rec){content.innerHTML='<div class="hubEmpty">Season data is not available.</div>';return}
    const latest=Math.max(1,Number(analysis.src.latestWeek||1));
    let week=Number(newsletterWeekV820??seasonHubWeek??latest);
    week=Math.min(Math.max(1,week),latest);
    newsletterWeekV820=week;seasonHubWeek=week;
    const statusEl=document.getElementById('seasonHubStatus');
    if(statusEl)statusEl.textContent='Newsletter · Week '+week+(week===latest?' · Latest':'');
    content.innerHTML='<div class="weeklyNewsletterV820"><div class="newsletterToolbarV820"><label>Newsletter Week<select id="newsletterWeekPickerV820">'+newsletterWeekOptionsV820(latest,week)+'</select></label><div class="hubFilterNote">Canonical weekly Chronicle</div></div><div class="newsletterFrameWrapV820"><iframe class="newsletterFrameV820" title="Week '+week+' Newsletter" src="./weekly-recap.html?week='+week+'"></iframe></div></div>';
    newsletterBindPickerV820();
  }

  const renderSeasonHubV820Base=renderSeasonHub;
  renderSeasonHub=function(){
    if(seasonHubTab==='newsletter')return renderWeeklyNewsletterV820();
    return renderSeasonHubV820Base.apply(this,arguments);
  };

  const requestedSeasonTabV820=new URLSearchParams(location.search).get('tab');
  if(['bigboard','newsletter','week','overview','standings','players','managers','superlatives','legends','transactions'].includes(requestedSeasonTabV820)){
    seasonHubTab=requestedSeasonTabV820;
  }
  // WEEKLY_NEWSLETTER_V820_END