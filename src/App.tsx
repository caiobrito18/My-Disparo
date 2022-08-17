import { FormEvent, useEffect, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import axios from 'axios'
import './App.css'


interface mensagem {
  jid:string,
  message:string,
  listaTitulo?:string,
  listaBtnTexto?:string,
  listaRodape?:string,
  listaItens?:string,
  listaDesc?:string,
}

function App() {
  var numeros:any = []
  
  const [url, setUrl] = useState("")
  const [instances, setInstances] = useState([])
  const [number, setNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [goodbyeArray, setGoodByeArray] = useState([""])
  const [greetArray, setGreetArray] = useState([""])
  const [greet, setGreet] = useState("")
  const [goodbye, setGoodBye] = useState("") 
  const [randGreet, setRandGreet] = useState("")
  const [randGoodbye, setRandGoodBye] = useState("")
  const [fullMessage, setFullMessage] = useState("")
  const [indicador, setIndicador] = useState("")
  const [listTitle, setListTitle] = useState("")
  const [listItems, setListItems] = useState("")
  const [listText, setListText] = useState("")
  const [listDesc, setListDesc] = useState("")
  const [listFooter, setListFooter] = useState("")
  const [img, setImg] = useState("")
  const [btnFooter, setBtnFooter] = useState("")
  const [btnDesc, setBtnDesc] = useState("")
  
  const api = axios.create({
    baseURL:url,
    proxy:undefined}
    )
  
    useEffect(()=>{
      async function getInstances(){
        const iList = await api.get("/instance/list")
        setInstances(iList.data.data)
      }
      getInstances()
    })
  async function handleMessage(){
    const splitg = greet.split(";");
    const splitgb = goodbye.split(";");
    setGoodByeArray(splitgb);
    setGreetArray(splitg);
  }
  async function randomizer(){
    var rand1 = Math.floor(Math.random() * (goodbyeArray.length - 0 + 1));
    var rand2 = Math.floor(Math.random() * (greetArray.length - 0 + 1));
    setRandGoodBye(goodbyeArray[rand1])
    setRandGreet(greetArray[rand2])
    setFullMessage([randGreet,messageBody,randGoodbye].join('\n'))
  }

  async function handleForm(e:FormEvent){
  e.preventDefault();
  await handleMessage();
  var rand = Math.floor(Math.random() * (instances.length - 0 + 1));
  const key = instances[rand];
  
  await api.post(`/message/text?key=${key}`,
  {
    "id":number,
    "message":fullMessage,
  }).then((response)=>console.log(response))
  }

  async function handleInstance(){
    await axios.get(`${url}/instance/init?key=${indicador}&token=123`)
    .then((response)=> {
      console.log(response.data.qrcode.url)
      window.open(response.data.qrcode.url)
    })}

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
    await randomizer();
    console.log(
      {
        number,
        fullMessage,
        indicador,
        goodbyeArray,
        greetArray,
        instances
      }
    )
  }

  return (
  <div className="App w-[100%] height-[90%] items-center justify-between">
  <div className=''>
    <form onSubmit={handleForm} id='disparo' className='items-start justify-between flex flex-col gap-2'> {/* coloca as informações de envio */} <div>
        <label>Url: </label>
        <input type={"text"} id='url' value={url} onChange={(e)=>setUrl(e.target.value)}/>
      </div> {/* Número de Telefone do cliente */} <div className='flex flex-col'>
        <label htmlFor="">Filtros para envios das mensagens: </label>
        <input type="text" value={filter} onChange={(e)=>setFilter(e.target.value)}/> <button>Filtrar</button>
      </div>
      <div>
        <label htmlFor="">Números para o disparo</label>
      </div> {/* coloca as informações de mensagem */} {/* Corpo da Mensagem */} <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/> {/* Saudação */} <div className='input-el'>
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

        {/* lista */}
        
			<div className='flex gap-1'>
				<input type={'checkbox'} onChange={()=>{
            document.querySelector('#lista')?.classList.toggle('hidden')
          }}/>
				<p>Marque para enviar uma Lista</p>
			</div>
			<section id='lista' className='hidden justify-around'>
          {/* Nome da Lista */}
          
				<div className='input-el'>
					<label>Título da lista: </label>
					<input type={"text"} id='lista-titulo' value={listTitle} onChange={(e)=>setListTitle(e.target.value)}/>
				</div>
          {/* Itens da Lista */}
          
				<div className='input-el'>
					<label>Itens da lista: </label>
					<input type={"text"} id='lista-itens' value={listItems} onChange={(e)=>setListItems(e.target.value)} title='Separado com ";"'/>
				</div>
          {/* Texto da lista */}
          
				<div className='input-el'>
					<label>Texto da Lista: </label>
					<input type={"text"} id='lista-texto' value={listText} onChange={(e)=>setListText(e.target.value)}/>
				</div>
          {/* descrição da lista */}
          
				<div className='input-el'>
					<label>Descrição da Lista: </label>
					<input type={"text"} id='lista-desc' value={listDesc} onChange={(e)=>setListDesc(e.target.value)}/>
				</div>
          {/* Rodapé da lista */}
          
				<div className='input-el'>
					<label>Rodapé da Lista: </label>
					<input type={"text"} id='lista-rdp' value={listFooter} onChange={(e)=>setListFooter(e.target.value)} />
				</div>
			</section>
        
        {/* Imagem */}
        
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

        {/* Botão */}
        
			<div className='flex gap-1'>
				<input type={'checkbox'} onChange={()=>{
            document.querySelector('#botao')?.classList.toggle('hidden')
          }}/>
				<p>Marque para enviar um Botão</p>
			</div>
			<section id='botao' className='hidden'>

          {/* Rodapé do Botão */}
          
				<div className='input-el'>
					<label>Rodapé do botão: </label>
					<input type={"text"} id='btn-rdp' value={btnFooter} onChange={(e)=>setBtnFooter(e.target.value)} />
				</div>
          {/* Descrição do botão */}
          
				<div className='input-el'>
					<label>Descrição do botão: </label>
					<input type={"text"} id='btn-desc' value={btnDesc} onChange={(e)=>setBtnDesc(e.target.value)} />
				</div>
			</section>
			<div className='flex gap-1'>
				<label>Insira o nome da instância</label>
				<input type={"text"} id='sessão' value={indicador} onChange={(e)=>setIndicador(e.target.value)} />
			</div>
			<div className='flex gap-2'>
				<input type={"submit"} className='rounded bg-red-600 my-2 px-3 py-1'value={'Disparar'}/>
				<input type={"button"} className='rounded bg-red-600 my-2 px-3 py-1'value={'instância'} onClick={handleInstance}/>
				<input type={"button"} className='rounded bg-red-600 my-2 px-3 py-1' value={'Debug'} onClick={handleDebug}/>
			</div>
		</form>
	</div>
</div>
  )
}

export default App
