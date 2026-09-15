(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],txt=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
const WEEK=Number(new URLSearchParams(location.search).get('week')||1);
const ledger=q('#ledger'),source=q('#sourceFrame');
if(!ledger||!source)return;

function setWeek(d,w){
  const sel=q('#mobileWeekSelect',d),slider=q('#weekSlider',d);
  if(sel){sel.value=String(w);sel.dispatchEvent(new Event('change',{bubbles:true}));}
  if(slider){slider.value=String(w);slider.dispatchEvent(new Event('input',{bubbles:true}));slider.dispatchEvent(new Event('change',{bubbles:true}));}
  const pill=qa('.weekPill',d).find(x=>new RegExp('(^|\\D)'+w+'(\\D|$)').test(txt(x)));
  pill?.click();
}
function accent(row){
  const b=q('.countBadge',row);
  try{return b?getComputedStyle(b).backgroundColor:'#9b702b'}catch(e){return '#9b702b'}
}
function render(){
  try{
    const d=source.contentDocument;if(!d)return false;
    const rows=qa('.countTR',d).map(r=>({
      team:txt(q('.countName',r))||txt(r.children[1]),
      count:Number(txt(q('.countVal',r))||txt(r.lastElementChild)),
      color:accent(r)
    })).filter(x=>x.team&&Number.isFinite(x.count));
    if(rows.length!==12)return false;
    const total=rows.reduce((s,r)=>s+r.count,0);
    if(total!==72)return false;
    ledger.innerHTML=rows.map(r=>`<div class="territoryCard mainBoardTerritoryCard" style="--team-accent:${r.color}"><div class="count">${r.count} ${r.count===1?'territory':'territories'}</div><h3></h3><div class="mainBoardSource">Post-Week ${WEEK} territory total from the League of Olympus main board</div></div>`).join('');
    qa('.mainBoardTerritoryCard',ledger).forEach((c,i)=>q('h3',c).textContent=rows[i].team);
    ledger.dataset.source='main-board-countTable';
    console.info('Chronicle ledger rendered directly from main-board territory standings.',rows);
    return true;
  }catch(e){console.warn('Chronicle main-board ledger',e);return false;}
}
function start(){
  let tries=0;
  const attempt=()=>{
    const d=source.contentDocument;
    if(d)setWeek(d,WEEK);
    if(render())return;
    if(++tries<120)setTimeout(attempt,500);
  };
  setTimeout(attempt,500);
}
if(source.contentDocument?.readyState==='complete')start();
else source.addEventListener('load',start,{once:true});
})();