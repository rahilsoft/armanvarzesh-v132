
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist','x-user-id':'specialist-1'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
function Num({label,value,onChange}:{label:string,value:any,onChange:(v:number)=>void}){
  return <label style={{display:'grid',gridTemplateColumns:'120px 1fr',alignItems:'center',gap:8}}>{label}<input type="number" value={value} onChange={e=>onChange(parseFloat(e.target.value||'0'))}/></label>;
}
export default function Page({ params }:{ params:{ userId:string } }){
  const [sex,setSex]=useState<'male'|'female'>('male');
  const [age,setAge]=useState(28); const [w,setW]=useState(75); const [h,setH]=useState(178);
  const [act,setAct]=useState('MODERATE'); const [goal,setGoal]=useState('recomp');
  const [calc,setCalc]=useState<any>(null);
  const [foods,setFoods]=useState<any[]>([]);
  const [tmpl,setTmpl]=useState<any>({name:'Custom',goal:'',days:[{meals:[{name:'breakfast',items:[]},{name:'lunch',items:[]},{name:'dinner',items:[]}]}]});
  const [weeks,setWeeks]=useState(4); const [start,setStart]=useState<string>(new Date().toISOString().slice(0,10));

  const compute=async()=>{ const d=await gql(`query($sex:String!,$age:Int!,$w:Float!,$h:Float!,$a:String!,$g:String){ computeTDEE(sex:$sex, age:$age, weightKg:$w, heightCm:$h, activity:$a, goal:$g) }`,{sex,age,w,h,a:act,g:goal}); setCalc(JSON.parse(d.computeTDEE)); };
  const loadFoods=async(q='')=>{ const d=await gql(`query($q:String){ listFoods(q:$q) }`,{q}); setFoods(JSON.parse(d.listFoods||'[]')); };
  useEffect(()=>{ compute(); loadFoods(); },[]);

  const addItem=(mealIdx:number, food:any)=>{
    const grams = 100;
    const next = {...tmpl, days: tmpl.days.map((d:any,i:number)=> i? d : { ...d, meals: d.meals.map((m:any,j:number)=> j===mealIdx? { ...m, items:[...m.items, { foodId: food.id, grams }]}:m) }) };
    setTmpl(next);
  };

  const saveTemplate=async()=>{
    const d=await gql(`mutation($name:String!,$goal:String,$json:String!){ upsertNutritionTemplate(name:$name, goal:$goal, json:$json) }`,{ name: tmpl.name, goal: tmpl.goal, json: JSON.stringify(tmpl) });
    alert('Template saved');
  };
  const generate=async()=>{
    const t=await gql(`mutation($name:String!,$goal:String,$json:String!){ upsertNutritionTemplate(name:$name, goal:$goal, json:$json) }`,{ name: tmpl.name, goal: tmpl.goal, json: JSON.stringify(tmpl) });
    const tpl = JSON.parse(t.upsertNutritionTemplate);
    const g=await gql(`mutation($u:String!,$tid:String!,$s:String!,$w:Int){ generateNutritionPlan(userId:$u, templateId:$tid, startDate:$s, weeks:$w) }`,{ u: params.userId, tid: tpl.id, s: start, w: weeks });
    alert('Plan generated');
  };

  return <div style={{padding:24, display:'grid', gap:16}}>
    <h1>Nutrition Plan Builder — {params.userId}</h1>
    <section style={{display:'grid',gridTemplateColumns:'repeat(2, minmax(280px, 1fr))', gap:12, alignItems:'center'}}>
      <Num label="سن" value={age} onChange={setAge}/>
      <Num label="وزن (کیلو)" value={w} onChange={setW}/>
      <Num label="قد (سانتی)" value={h} onChange={setH}/>
      <label>جنسیت<select value={sex} onChange={e=>setSex(e.target.value as any)}><option value="male">male</option><option value="female">female</option></select></label>
      <label>فعالیت<select value={act} onChange={e=>setAct(e.target.value)}>
        <option value="SEDENTARY">SEDENTARY</option><option value="LIGHT">LIGHT</option><option value="MODERATE">MODERATE</option><option value="ACTIVE">ACTIVE</option><option value="VERY_ACTIVE">VERY_ACTIVE</option>
      </select></label>
      <label>هدف<select value={goal} onChange={e=>setGoal(e.target.value)}>
        <option value="recomp">recomp</option><option value="cut">cut</option><option value="bulk">bulk</option><option value="maintain">maintain</option>
      </select></label>
      <button onClick={compute}>محاسبه</button>
      {calc && <div style={{gridColumn:'1 / -1', padding:12, border:'1px solid #eee', borderRadius:8}}>
        <div>کالری هدف: <b>{calc.targetCalories}</b> | پروتئین: {calc.macros.protein}g | کربوهیدرات: {calc.macros.carbs}g | چربی: {calc.macros.fat}g</div>
      </div>}
    </section>

    <section style={{display:'grid', gridTemplateColumns:'2fr 3fr', gap:12}}>
      <div style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
        <h3>Food DB</h3>
        <div style={{display:'grid', gap:8, maxHeight:360, overflow:'auto'}}>
          {foods.map((f:any)=> <div key={f.id} style={{display:'flex', justifyContent:'space-between'}}>
            <span>{f.nameFa}</span>
            <button onClick={()=> addItem(0, f)}>افزودن به صبحانه</button>
          </div>)}
        </div>
      </div>

      <div style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
        <h3>Template (روز ۱)</h3>
        <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(tmpl.days[0], null, 2)}</pre>
        <div style={{display:'flex', gap:8}}>
          <button onClick={saveTemplate}>ذخیرهٔ قالب</button>
          <button onClick={generate}>تولید برنامهٔ ۴ هفته‌ای</button>
        </div>
      </div>
    </section>
  </div>;
}
