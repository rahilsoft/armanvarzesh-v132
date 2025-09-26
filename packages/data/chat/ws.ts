// Simple event bus to emulate WebSocket across tabs/modules in mock mode
type Listener = (event: { type:string; payload:any }) => void;
const listeners: Listener[] = [];
export function wsConnect(url:string){
  return {
    url,
    send: (type:string, payload:any)=> { listeners.forEach(l => l({ type, payload })); },
    on: (fn:Listener)=> { listeners.push(fn); return () => { const i=listeners.indexOf(fn); if(i>=0) listeners.splice(i,1); }; },
    close: ()=> {}
  };
}
