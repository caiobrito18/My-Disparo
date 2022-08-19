import React, { useState } from 'react'
import api from '../services/api'

interface Instance{
  instancia:Array<string>;
}

const Instancias = () => {

  let instance:Instance[];
    instance = [];

  const [loading, setLoading] = useState(true);
  const [restored, setRestored] = useState(false);
  const [url, setUrl] = useState('');
  const [instanceArray, setInstanceArray] = useState(instance);
  async function loadInstances(url:string){
    const req = api(url)
    await req.get('/instance/restore').then(x => setRestored(true))
    await req.get('/instance/list').then(res=>setInstanceArray(res.data.data))
    console.log(instanceArray)
  }
  return (
    <main className='align-middle justify-around p-0 m-0 h-[100%]'>
    <input type="text" className="focus:outline-none rounded"  name="url" value={url} onChange={(e)=>setUrl(e.target.value)}/>
    <section className=' h-20 bg-slate-800 self-center m-0 p-0 grid-rows-1'>
    
      {instanceArray?.map((key,i)=>{
        return(
        <p>instância: <>{key}</> </p>
      )})}
    </section>
    <input type="button" className="round h-10 w-20 bg-red-900" name="search" onClick={()=>loadInstances(url)} value="listar"/>
    </main>
  )
}

export default Instancias