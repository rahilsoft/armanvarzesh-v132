import React from 'react';

type State = { hasError: boolean; error?: any };
export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State>{
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any){ return { hasError: true, error }; }
  componentDidCatch(error:any, info:any){ try{ console.warn('[ErrorBoundary]', error, info); }catch{} }
  render(){
    if(this.state.hasError){
      return <div role="alert" dir="rtl" style={{padding:16, border:'1px solid #f00', borderRadius:8}}>
        <b>مشکلی پیش آمد</b>
        <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
      </div>;
    }
    return this.props.children as any;
  }
}
export default ErrorBoundary;
