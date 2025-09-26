
'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';

const ThreeScene = dynamic(async ()=>{
  const THREE = await import('three');
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

  return function Scene({ url }:{ url?:string }){
    const ref = React.useRef<HTMLDivElement>(null);
    useEffect(()=>{
      if (!ref.current) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const w = ref.current.clientWidth || 800, h = ref.current.clientHeight || 480;
      renderer.setSize(w,h); ref.current.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
      camera.position.set(0,1.5,3);
      const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(2,3,4); scene.add(light);
      const amb = new THREE.AmbientLight(0xffffff, 0.6); scene.add(amb);
      const controls = new OrbitControls(camera, renderer.domElement);

      if (url){
        const loader = new GLTFLoader();
        loader.load(url, (g)=>{ scene.add(g.scene); }, undefined, (e)=> console.error(e) );
      } else {
        const geo = new THREE.SphereGeometry(0.5, 32, 32);
        const mat = new THREE.MeshStandardMaterial({ metalness:0.1, roughness:0.7 });
        const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
      }

      const onResize = ()=>{
        const W = ref.current!.clientWidth, H = ref.current!.clientHeight;
        renderer.setSize(W,H); camera.aspect = W/H; camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      let raf:any; const tick = ()=>{ controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(tick); }; tick();
      return ()=>{ cancelAnimationFrame(raf); renderer.dispose(); ref.current?.removeChild(renderer.domElement); window.removeEventListener('resize', onResize); };
    }, [url]);
    return <div ref={ref} style={{ width:'100%', height:540, border:'1px solid #eee', borderRadius:12 }} />;
  }
}, { ssr:false });

export default function Page(){
  const url = process.env.NEXT_PUBLIC_ANATOMY_GLTF_URL || '';
  return <div style={{ padding:24 }}>
    <h1>Three.js Anatomy (Beta)</h1>
    <p style={{ opacity:.7 }}>اگر URL مدل تنظیم نشود، نمونهٔ هندسی جایگزین نمایش داده می‌شود.</p>
    {/* @ts-ignore */}
    <ThreeScene url={url||undefined} />
  </div>;
}
