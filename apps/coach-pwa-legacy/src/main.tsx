import { registerServiceWorker } from './register-sw';
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// List of feature modules exposed via the side navigation.  The
// addition of "corrective" enables a management interface for
// physiotherapists to view and create corrective exercises.
const feats = [
  "workouts",
  "nutrition",
  "booking",
  "chat",
  "payments",
  "notifications",
  "marketplace",
  "rewards",
  "assessments",
  "monitoring",
  "coaches",
  "analytics",
  "courses",
  "ai",
  "physio",
  "vip",
  "affiliate",
  "certificate",
  "corrective", // new feature for corrective exercise management
  "nutrition-plan", // new feature to manage and create nutrition plans
];

function Home(){ return <div><h2>Dashboard</h2></div> }
function NotFound(){ return <div>Not Found</div> }

const Lazy = (n:string)=> React.lazy(()=>import(`./features/${'${n}'}/index`))

function App(){
  return (
    <BrowserRouter>
      <div style={{display:'flex', minHeight:'100vh', fontFamily:'sans-serif'}}>
        <aside style={{width:240, borderInlineEnd:'1px solid #e5e7eb', padding:12}}>
          <h3>PWA</h3>
          <nav style={{display:'grid', gap:6}}>
            <Link to="/">خانه</Link>
            {feats.map(m => <Link key={m} to={`/f/${m}`}>{m}</Link>)}
          </nav>
        </aside>
        <main style={{flex:1, padding:16}}>
          <React.Suspense fallback={<div>Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              {feats.map(m => <Route key={m} path={`/f/${m}`} element={React.createElement(Lazy(m))} />)}
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </BrowserRouter>
  )
}

const root = registerServiceWorker();
createRoot(document.getElementById('root')!)
root.render(<App/>)