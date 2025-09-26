import React, { PropsWithChildren } from 'react';
import { logError } from './logger';
export function ErrorBoundary({ children }: PropsWithChildren){
  return <Boundary>{children}</Boundary>;
}
class Boundary extends React.Component<{},{ hasError:boolean; error?: any }>{ 
  constructor(props:any){ super(props); this.state={hasError:false}; }
  static getDerivedStateFromError(error:any){ return { hasError:true, error }; }
  componentDidCatch(error:any, info:any){ logError('react_error', { error: String(error), info }); }
  render(){ if(this.state.hasError) return <div role="alert">خطا در بخش رابط کاربری</div>; return this.props.children as any; }
}
