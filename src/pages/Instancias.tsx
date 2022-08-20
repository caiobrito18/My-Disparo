import React, { FormEvent, SetStateAction, useState } from 'react'
import api from '../services/api'


export interface Instance{
  instancia:string
}
interface instancias{
  ilist?:Array<string>;
}

const Instancias = ({ilist}:instancias) => {
  
  let instance: Instance[];
  // @ts-ignore
    instance = ['hello','bomdia','2'];
  const [instanceArray, setInstanceArray] = useState<Array<string> | undefined>([""]);
  const [loading, setLoading] = useState(true);
  const [restored, setRestored] = useState(false);
  const [url, setUrl] = useState('');
  
  async function loadInstances(e:FormEvent, url:string){
    e.preventDefault()
    const req = api(url)
    await req.get('/instance/restore').then(x => setRestored(true))
    await req.get('/instance/list').then(res=> ilist = (res.data.data))
    setInstanceArray(ilist)
    console.log(ilist)
  }


  return (
    <form onSubmit={(e)=>loadInstances(e,url)} className='align-middle justify-around p-0 m-0 h-[100%]'>
    <input type="text" className="focus:outline-none rounded"  name="url" value={url} onChange={(e)=>setUrl(e.target.value)}/>
    <section className=' h-20 bg-slate-800 self-center m-0 p-0 grid-rows-1'>
    <ul className='justify-items-start text-start'>
    {instanceArray?.map((k:any,i:any)=>{
          return(
            // @ts-ignore
            <li key={i}>
              <input type="checkbox" className='outline-none border-transparent' name={`instance ${i}`} />
              {` ${k}`}
            </li>
          )
        }
    )}
    </ul>
    </section>
    <input type="submit" className="round h-10 w-20 bg-red-900" name="search"  value="listar"/>
    </form>
  )
}

export default Instancias