import { FormEvent, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  var numeros:any = []

  const [url, setIUrl] = useState("")
  const [filter, setFiler] = useState("")
  const [listItems, setListItems] = useState("")
  const [listFooter, setListFooter] = useState("")
  const [listText, setListText] = useState("")
  const [img, setImg] = useState("")
  const [btnFooter, setBtnFooter] = useState("")
  const [btnDesc, setBtnDesc] = useState("")
  const [listDesc, setListDesc] = useState("")
  
  function handleForm(e:FormEvent){
    e.preventDefault()
    const data = new FormData()
    
    data.append("dataBulk", url)
    data.append("dataBulk", filter)
    data.append("dataBulk", listItems)
    data.append("dataBulk", listFooter)
    data.append("dataBulk", listText)
    data.append("dataBulk", listDesc)
    data.append("dataBulk", btnFooter)
    data.append("dataBulk", btnDesc)
    data.append("dataBulk", img)

    console.log(data)

  }
  const handleImg = (img:any) => {
  var reader = new FileReader();
  reader.readAsDataURL(img); 
  reader.onloadend = function() {
  var base64data:string = reader.result;
  setImg(base64data)
  console.log(base64data);
}
  };

  return (
    <div className="App w-[100%] height-[90%] items-center justify-between">
      <div className=''>

      <form onSubmit={handleForm} id='disparo' className='items-start justify-between flex flex-col gap-2'> 
        {/* coloca as informações de envio */}
        <div>
          <label>Url: </label>
          <input type={"text"} id='url'/>
        </div>
        {/* Número de Telefone do cliente */}
        <div className='flex flex-col'>
          <label htmlFor="">Filtros para envios das mensagens: </label>
          <input type="text" />
          <button>Filtrar</button>
        </div>
        <div>

          <label htmlFor="">Números para o disparo</label>
        
        </div>

        {/* coloca as informações de mensagem */}

        {/* lista */}
        <div className='flex gap-1'>
          <input type={'checkbox'} onChange={()=>{
            document.querySelector('#lista')?.classList.toggle('hidden')
          }}/>
          <p>Marque para enviar uma Lista</p>
        </div>
        <section id='lista' className='hidden justify-around'>
          <div className='input-el'>
            <label>Itens da lista: </label>
            <input type={"text"} id='lista-itens' title='Separado com ";"'/>
          </div>
          {/* Rodapé da lista */}
          <div className='input-el'>
            <label>Rodapé da Lista: </label>
            <input type={"text"} id='lista-rdp'/>
          </div>
          {/* Texto da lista */}
          <div className='input-el'>
            <label>Texto da Lista: </label>
            <input type={"text"} id='lista-texto'/>
          </div>
          {/* Nome da Lista */}
          <div className='input-el'>
            <label>Título da lista: </label>
            <input type={"text"} id='lista-titulo'/>
          </div>
          {/* descrição da lista */}
          <div className='input-el'>
            <label>Descrição da Lista: </label>
            <input type={"text"} id='lista-desc'/>
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
          <p>Marque para enviar uma Imagem</p>
        </div>
        <section id='botao' className='hidden'>
          <div className='input-el'>
            <label>Rodapé do botão: </label>
            <input type={"text"} id='btn-rdp'/>
          </div>
          {/* Descrição do botão */}
          <div className='input-el'>
            <label>Descrição do botão: </label>
            <input type={"text"} id='btn-desc'/>
          </div>
        </section>


          <input type={"submit"} />
      </form>
      </div>
    </div>
  )
}

export default App
