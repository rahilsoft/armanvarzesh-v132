import React from 'react';
type State={hasError:boolean};
export default class ErrorBoundary extends React.Component<React.PropsWithChildren,State>{state:State={hasError:false};static getDerivedStateFromError(){return{hasError:true}};componentDidCatch(e:any){console.error(e)};render(){return this.state.hasError?<div style={{padding:'var(--space-xl)',color:'var(--color-danger)'}}>خطا رخ داد</div>:this.props.children;}}
