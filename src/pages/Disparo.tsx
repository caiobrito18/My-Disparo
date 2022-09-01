import { FormEvent, useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import * as XLSX from 'xlsx';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import '../css/App.css';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import useInstancias from './Instancias';

const Disparo = () => {
  const navigate  = useNavigate()
  const { render, sessoes } = useInstancias();
  var numeros:any = []
  const webhook = "https://n8n01.siriusalpha.com.br/webhook-test";
  const [columns, setColumns] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [url, setUrl] = useState("")
  const [disparado, setDisparado] = useState([])
  const [number, setNumber] = useState("")
  const [numberArray, setNumberArray] = useState("")
  const [filter, setFilter] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [goodbyeArray, setGoodByeArray] = useState([""])
  const [greetArray, setGreetArray] = useState([""])
  const [greet, setGreet] = useState("")
  const [goodbye, setGoodBye] = useState("") 
  const [indicador, setIndicador] = useState("")
  const [listTitle, setListTitle] = useState("")
  const [listItems, setListItems] = useState("")
  const [listText, setListText] = useState("")
  const [listDesc, setListDesc] = useState("")
  const [listFooter, setListFooter] = useState("")
  const [img, setImg] = useState("")
  const [btnFooter, setBtnFooter] = useState("")
  const [btnDesc, setBtnDesc] = useState("") 
  const req = api(url)
  req.interceptors.request.use(
    x=> {console.log(x)
    return x}
  )
      
  async function handleMessage(){
    const splitg = greet.split(";");
    const splitgb = goodbye.split(";");
    setGoodByeArray(splitgb);
    setGreetArray(splitg);
  }
  async function handleForm(e:FormEvent){
  e.preventDefault();
  
  const splitn = number.split(';');
  splitn.forEach(async(numero)=>{
    var rand1 = Math.floor(Math.random() * (goodbyeArray.length - 0 ));
    var rand2 = Math.floor(Math.random() * (greetArray.length - 0));
    var rand3 = Math.floor(Math.random() * (sessoes.length - 0));
    let randGoodbye = (goodbyeArray[rand1])
    let randGreet = greetArray[rand2]
    let mensagem = [randGreet,messageBody,randGoodbye].join('\n')
    console.log(numero)
    let chave = sessoes[rand3].sessao;
    await disparo(numero,mensagem,chave);
    await new Promise(r => setTimeout(r, 3000));
  })
  
}
async function disparo(numero:string,mensagem:string,chave:string){
  console.log('mensagem enviada para: ',numero ,' foi ', mensagem,' por ', chave )
  await req.post(`/message/text?key=${chave}`,
  {
    "id":numero,
    "message":mensagem,
  }).then((response)=>console.log(response)).catch((err)=>console.log(err))  
}

  async function handleInstance(){
    if(url == undefined){
      return new Error
    }
    api(webhook).post("status",{
      URL:url
    })
    
  }

  const handleImg = (img:any) => {
  var reader = new FileReader();
  reader.readAsDataURL(img); 
  reader.onloadend = function() {
  //@ts-ignore
  var base64data:string = reader.result;
  setImg(base64data)
  console.log(base64data);
}
  };

  async function handleDebug(){
    await handleMessage();
    await axios.get(`${url}/instance/restore`).then(res=>console.log(res))
    console.log(
      {
        number,
        indicador,
        goodbyeArray,
        greetArray,
        sessoes
      }
    )
  }
    // process CSV data
    const processData = (dataString:string) => {
      const dataStringLines = dataString.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      const list = [];
      for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length == headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] == '"')
                d = d.substring(1, d.length - 1);
              if (d[d.length - 1] == '"')
                d = d.substring(d.length - 2, 1);
            }
            if (headers[j]) {
              // @ts-ignore
              obj[headers[j]] = d;
            }
          }
          // remove the blank rows
          if (Object.values(obj).filter(x => x).length > 0) {
            list.push(obj);
          }
        }
      }
      // prepare columns list from headers
      const columns = headers.map((c,i)=> ({
        name: c,
        selector: (row:any) => row.TELEFONE
      }));
      // @ts-ignore
      const data = list.map(({NOME,DOCUMENTO,ENDERECO,CEP, ...rest}) => {
        return rest;
      });
      // @ts-ignore
      const newCols = columns.filter((arr) => {
        if (arr.name == 'TELEFONE'){
          return arr
        }
      });
      setData(data);
      setColumns(newCols);
      console.log("data:",data);
      console.log("columns",newCols,columns);
    }
    // handle file upload
    const handleFileUpload = (e:any) => {
      const file = e.target?.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays*/
        // @ts-ignore 
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data);
      };
      reader.readAsBinaryString(file);
    }

  return (
  <div className="App w-[100%] height-[90%] items-center justify-between flex">
  <div className=''>
    <form onSubmit={handleForm} id='disparo' className='items-start justify-between flex flex-col gap-2'> {/* coloca as informações de envio */} <div>
        <label>Url: </label>
        <input type={"text"} id='url' value={url} onChange={(e)=>setUrl(e.target.value)}/>
      </div> 
      {/* Número de Telefone do cliente */} 
      <div>
      <div className='flex gap-1'>
				<input type={'checkbox'} onChange={()=>{
            document.querySelector('#csvFile')?.classList.toggle('hidden')
          }}/>
				<p>Marque para enviar utilizando um arquivo ".CSV"</p>
			</div>
        <label htmlFor="">Números para o disparo</label><br/>
        <input type="file" name="csv" id="csvFile" accept=".csv,.xlsx,.xls"onChange={handleFileUpload} className='hidden'/>
        <DataTable
        className='w-[100px]'
        theme='dark'
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
      <div className='flex flex-col'>
        <label htmlFor="">Filtros para envios das mensagens: </label>
        <input type="text" value={filter} onChange={(e)=>setFilter(e.target.value)}/>
        <button className='rounded bg-red-600 my-2 px-3 py-1'>Filtrar</button>
      </div>
      </div> 
      {/* coloca as informações de mensagem */}
      {/* Corpo da Mensagem */}
      <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/> 
      {/* Saudação */}
      <div className='input-el'>
        <label>Saudações separadas por ; </label>
        <input type={"text"} id='lista-titulo' value={greet} onChange={(e)=>setGreet(e.target.value)}/>
      </div> {/* Corpo */} <div className='input-el h-40'>
        <label>Corpo(s) das mensagens </label>
        <textarea id='lista-itens' className='h-64 resize-none scroll-auto' value={messageBody} onChange={(e)=>setMessageBody(e.target.value)} title='Separado com ";"'/>
			</div>
          {/* Despedidas */}
          
			<div className='input-el'>
				<label>Despedidas separadas por ; </label>
				<input type={"text"} id='lista-texto' value={goodbye} onChange={(e)=>setGoodBye(e.target.value)}/>
			</div>
{/* 
        {/* lista 
        
			<div className='flex gap-1'>
				<input type={'checkbox'} onChange={()=>{
            document.querySelector('#lista')?.classList.toggle('hidden')
          }}/>
				<p>Marque para enviar uma Lista</p>
			</div>
			<section id='lista' className='hidden justify-around'>
          {/* Nome da Lista *
          
				<div className='input-el'>
					<label>Título da lista: </label>
					<input type={"text"} id='lista-titulo' value={listTitle} onChange={(e)=>setListTitle(e.target.value)}/>
				</div>
          {/* Itens da Lista *
          
				<div className='input-el'>
					<label>Itens da lista: </label>
					<input type={"text"} id='lista-itens' value={listItems} onChange={(e)=>setListItems(e.target.value)} title='Separado com ";"'/>
				</div>
          {/* Texto da lista *
          
				<div className='input-el'>
					<label>Texto da Lista: </label>
					<input type={"text"} id='lista-texto' value={listText} onChange={(e)=>setListText(e.target.value)}/>
				</div>
          {/* descrição da lista *
          
				<div className='input-el'>
					<label>Descrição da Lista: </label>
					<input type={"text"} id='lista-desc' value={listDesc} onChange={(e)=>setListDesc(e.target.value)}/>
				</div>
          {/* Rodapé da lista *
          
				<div className='input-el'>
					<label>Rodapé da Lista: </label>
					<input type={"text"} id='lista-rdp' value={listFooter} onChange={(e)=>setListFooter(e.target.value)} />
				</div>
			</section>
        
        {/* Imagem 
        
			<div className='flex gap-1'>
				<input type={'checkbox'} onChange={()=>{
            document.querySelector('#imagem')?.classList.toggle('hidden')
          }}/>
				<p>Marque para enviar uma Imagem</p>
			</div>
			<section id='imagem' className='hidden'>
				<div className='input-el h-20'>
					<label>Imagem para envio: </label>
					<FileUploader className=''handleChange={handleImg} name="img" types={["PNG","JPEG","JPG","JFIF"]} />
				</div>
			</section> 

        {/* Botão 
        
			<div className='flex gap-1'>
				<input type={'checkbox'} onChange={()=>{
            document.querySelector('#botao')?.classList.toggle('hidden')
          }}/>
				<p>Marque para enviar um Botão</p>
			</div>
			<section id='botao' className='hidden'>

          {/* Rodapé do Botão *
          
				<div className='input-el'>
					<label>Rodapé do botão: </label>
					<input type={"text"} id='btn-rdp' value={btnFooter} onChange={(e)=>setBtnFooter(e.target.value)} />
				</div>
          {/* Descrição do botão *
          
				<div className='input-el'>
					<label>Descrição do botão: </label>
					<input type={"text"} id='btn-desc' value={btnDesc} onChange={(e)=>setBtnDesc(e.target.value)} />
				</div>
			</section>*/}
			<div className='flex gap-2'>
				<input type={"submit"} className='rounded bg-red-600 my-2 px-3 py-1'value={'Disparar'}/>
				<input type={"button"} className='rounded bg-red-600 my-2 px-3 py-1'value={'instância'} onClick={handleInstance}/>
				<input type={"button"} className='rounded bg-red-600 my-2 px-3 py-1' value={'Debug'} onClick={handleDebug}/>
			</div> 
		</form>
	</div>
  <div className='m-5'>
  {render}
  </div>
</div>
  )
}

export default Disparo