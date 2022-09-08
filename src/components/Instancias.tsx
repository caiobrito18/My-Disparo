import React, { FormEvent, useState } from 'react'
import DataTable, { TableColumn, TableRow } from 'react-data-table-component';
import api from '../services/api'

type Instance ={
  instancia:string
}
type instancias = {
  ilist?:Array<string>;
}
interface DataRow {
  sessao:string,
  conexao:string,
  name:string,
  id:string,
}
export default function useInstancias(){
  
  const columns:TableColumn<DataRow>[] = [
    {
        name: 'sessão',
        selector: row => row.sessao,
    },
    {
      name: 'conexão',
      selector: row => row.conexao,
    },
    {
      name: 'id',
      selector: row  => row.id,
    },
    {
      name: 'name',
      selector: row  => row.name,
    }
  ];
  // @ts-ignore
  const [instanceArray, setInstanceArray] = useState<Array<DataRow>>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Array<any>>([]);
  const [url, setUrl] = useState('');
  
  const handleSelected = ({selectedRows}:TableRow)=>{
    //@ts-ignore
    setSelected(selectedRows)
  }

  async function loadInstances(e:FormEvent, url:string){
    e.preventDefault()
    const req = api(url)
    await req.get('/instance/list?active=true').then(async(res)=>{
      const slist = res.data.data
      console.log(slist)
      let data = [{
        sessao:"",
        conexao:"",
        name:"",
        id:""
      }]
      for(let i = 0; i < slist.length;i++){
        console.log(slist[i].phone_connected);
        data.push({
              sessao:slist[i].instance_key,
              conexao:slist[i].phone_connected ? 'conectado':'desconectado',
              name:slist[i].user.name,
              id:slist[i].user.id
            })
      }
    data.shift();
    return setInstanceArray(data)})
    console.log(instanceArray)
  }


  return {
    sessoes:selected,
    render:(
    <form onSubmit={(e)=>loadInstances(e,url)} className='align-middle justify-around p-0 m-0 h-[100%]'>
    <input type="text" className="focus:outline-none rounded"  name="url" value={url} onChange={(e)=>setUrl(e.target.value)}/>
    <section className=' h-20 bg-slate-800 self-center m-0 p-0 grid-rows-1'>
    <DataTable
    theme='dark'
    columns={columns}
    data={instanceArray}
    selectableRows
    onSelectedRowsChange={handleSelected}
    pagination
    />
    <input type="submit" className="round h-10 w-20 bg-red-900" name="search"  value="listar"/>
    </section>
    </form>)
  }
}