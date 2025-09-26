import dynamic from 'next/dynamic';
const HostComp = dynamic(() => import('../../src/components/LiveKitHost').catch(()=>({default:()=>null})), { ssr: false });
export default function HostPage(){ return <HostComp/> }