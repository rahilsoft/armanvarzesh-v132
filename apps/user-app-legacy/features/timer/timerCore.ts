
export type TickHandler = (t:number)=>void;
export function countdown(seconds: number, onTick: TickHandler, onDone: ()=>void){
  let t = seconds;
  onTick(t);
  const id = setInterval(()=>{
    t -= 1;
    onTick(t);
    if(t <= 0){ clearInterval(id); onDone(); }
  }, 1000);
  return ()=> clearInterval(id);
}
export function emom(intervalSec: number, rounds: number, onTick: TickHandler, onRound:(r:number)=>void, onDone:()=>void){
  let round = 0; let t = intervalSec;
  onTick(t);
  const id = setInterval(()=>{
    t -= 1; onTick(t);
    if(t<=0){ round += 1; onRound(round); if(round>=rounds){ clearInterval(id); onDone(); } else { t = intervalSec; } }
  }, 1000);
  return ()=> clearInterval(id);
}
