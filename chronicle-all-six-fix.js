(()=>{
'use strict';
/* Surgical Chronicle-only patch. Do not touch #conquest or its playback. */
const root=document.querySelector('#chronicle .fadeMap');
if(!root)return;
const after=root.querySelector('iframe.after');
if(!after)return;

/* The baseline week selector advances the historical board through the six
   conquest events. Keep AFTER invisible until that sequence has completed,
   so every WAS -> IS transition is Original -> complete Week 1. */
after.style.visibility='hidden';
root.dataset.allSixReady='0';

function finishWeek(){
  try{
    const d=after.contentDocument;
    if(!d)return;
    const play=d.querySelector('#playBtn');
    const reset=d.querySelector('#resetBtn');
    const speed=d.querySelector('#speedSelect');

    /* Start from the same original state every time this iframe initializes. */
    reset?.click();

    /* Use the board's own conquest engine, just at its fastest available speed. */
    if(speed){
      const values=[...speed.options].map(o=>o.value);
      const fastest=values.includes('0.25')?'0.25':values[0];
      speed.value=fastest;
      speed.dispatchEvent(new Event('change',{bubbles:true}));
    }
    setTimeout(()=>play?.click(),250);

    /* Six battles at the board's fast playback rate finish well inside this
       guard. The iframe remains live, so territory fills/labels stay pristine. */
    setTimeout(()=>{
      root.dataset.allSixReady='1';
      after.style.visibility='visible';
    },9000);
  }catch(e){console.warn('Chronicle all-six patch',e)}
}

if(after.contentDocument?.readyState==='complete')setTimeout(finishWeek,2100);
else after.addEventListener('load',()=>setTimeout(finishWeek,2100),{once:true});

/* Prevent the baseline fade from exposing AFTER before all six are complete. */
const guard=new MutationObserver(()=>{
  if(root.dataset.allSixReady!=='1' && root.classList.contains('showAfter')){
    after.style.visibility='hidden';
  }
});
guard.observe(root,{attributes:true,attributeFilter:['class']});
})();