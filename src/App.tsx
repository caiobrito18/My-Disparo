import { FormEvent, useState } from 'react'
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
  const [number, setNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [greet, setGreet] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [goodbye, setGoodBye] = useState("")
  const [fullMessage, setFullMessage] = useState("")

  // const [listTitle, setListTitle] = useState("")
  // const [listItems, setListItems] = useState("")
  // const [listText, setListText] = useState("")
  // const [listDesc, setListDesc] = useState("")
  // const [listFooter, setListFooter] = useState("")
  // const [img, setImg] = useState("")
  // const [btnFooter, setBtnFooter] = useState("")
  // const [btnDesc, setBtnDesc] = useState("")
  
  const api = axios.create({
    baseURL:url,
    proxy:undefined}
    )

  async function handleMessage(){

    const messages = [greet,messageBody,goodbye].join('\n')
    setFullMessage(messages)
  }

  async function handleForm(e:FormEvent){

    e.preventDefault()
  handleMessage()
  await api.post("/message/text?key=123",
  {
    "id":number,
    "message":fullMessage,
  }).then((response)=>console.log(response))
    
  }

//   const handleImg = (img:any) => {
//   var reader = new FileReader();
//   reader.readAsDataURL(img); 
//   reader.onloadend = function() {
//   //@ts-ignore
//   var base64data:string = reader.result;
//   setImg(base64data)
//   console.log(base64data);
// }
//   };

  function handleDebug(){
    console.log({
      number,
      greet,
      messageBody,
      goodbye,
      fullMessage
    })
  }

  return (
    <div className="App w-[100%] height-[90%] items-center justify-between">
      <div className=''>

      <form onSubmit={handleForm} id='disparo' className='items-start justify-between flex flex-col gap-2'> 
        {/* coloca as informações de envio */}
        <div>
          <label>Url: </label>
          <input type={"text"} id='url' value={url} onChange={(e)=>setUrl(e.target.value)}/>
        </div>
        {/* Número de Telefone do cliente */}
        <div className='flex flex-col'>
          <label htmlFor="">Filtros para envios das mensagens: </label>
          <input type="text" value={filter} onChange={(e)=>setFilter(e.target.value)}/>
          <button>Filtrar</button>
        </div>
        <div>

          <label htmlFor="">Números para o disparo</label>
        
        </div>

        {/* coloca as informações de mensagem */}
        {/* Corpo da Mensagem */}
        <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/>
          {/* Nome da Lista */}
          <div className='input-el'>
            <label>Saudações separadas por ; </label>
            <input type={"text"} id='lista-titulo' value={greet} onChange={(e)=>setGreet(e.target.value)}/>
          </div>
          {/* Itens da Lista */}
          <div className='input-el h-40'>
            <label>Corpo(s) das mensagens </label>
            <textarea id='lista-itens' className='h-64 resize-none scroll-auto' value={messageBody} onChange={(e)=>setMessageBody(e.target.value)} title='Separado com ";"'/>
          </div>
          {/* Texto da lista */}
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
          {/* Nome da Lista 
          <div className='input-el'>
            <label>Título da lista: </label>
            <input type={"text"} id='lista-titulo' value={listTitle} onChange={(e)=>setListTitle(e.target.value)}/>
          </div>
          {/* Itens da Lista 
          <div className='input-el'>
            <label>Itens da lista: </label>
            <input type={"text"} id='lista-itens' value={listItems} onChange={(e)=>setListItems(e.target.value)} title='Separado com ";"'/>
          </div>
          {/* Texto da lista 
          <div className='input-el'>
            <label>Texto da Lista: </label>
            <input type={"text"} id='lista-texto' value={listText} onChange={(e)=>setListText(e.target.value)}/>
          </div>
          {/* descrição da lista 
          <div className='input-el'>
            <label>Descrição da Lista: </label>
            <input type={"text"} id='lista-desc' value={listDesc} onChange={(e)=>setListDesc(e.target.value)}/>
          </div>
          {/* Rodapé da lista 
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

        {/*{/* Botão }
        <div className='flex gap-1'>
          <input type={'checkbox'} onChange={()=>{
            document.querySelector('#botao')?.classList.toggle('hidden')
          }}/>
          <p>Marque para enviar um Botão</p>
        </div>
        <section id='botao' className='hidden'>

          {/* Rodapé do Botão }
          <div className='input-el'>
            <label>Rodapé do botão: </label>
            <input type={"text"} id='btn-rdp' value={btnFooter} onChange={(e)=>setFilter(e.target.value)} />
          </div>
          {/* Descrição do botão }
          <div className='input-el'>
            <label>Descrição do botão: </label>
            <input type={"text"} id='btn-desc' value={btnDesc} onChange={(e)=>setFilter(e.target.value)} />
          </div>
        </section>*/}


          <input type={"submit"} className='rounded bg-red-600 my-2 px-3 py-1'value={'Disparar'}/>
          <input type={"button"} className='rounded bg-red-600 my-2 px-3 py-1' value={'Debug'} onClick={handleDebug}/>
      </form>
      </div>
    </div>
  )
}

export default App
