import { useState } from 'react'
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


  return (
    <div className="App">
      <div className='w-[80%] height-[90%] items-center justify-between'>

      <form className='items-start justify-between flex flex-col gap-2'> 
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

        {/* Itens da lista */}
        <div>
        <label>Itens da lista: </label>

        <input type={"text"} id='lista-itens' title='Separado com ";"'/>
        </div>
        {/* Rodapé da lista */}
        <div>
        <label>Rodapé da Lista: </label>

        <input type={"text"} id='lista-rdp'/>
        </div>
        {/* Texto da lista */}
        <div>
        <label>Texto da Lista: </label>

        <input type={"text"} id='lista-texto'/>
        </div>
        {/* Nome da Lista */}
        <div>
        <label>Título da lista: </label>

        <input type={"text"} id='lista-titulo'/>
        </div>
        {/* Imagem */}
        <div>
        <label>Imagem para envio: </label>

        <input type={"file"} id='img'/>
        </div>
        {/* Rodpé do Botão */}
        <div>
        <label>Rodapé do botão: </label>

        <input type={"text"} id='btn-rdp'/>
        </div>
        {/* Descrição do botão */}
        <div>
        <label>Descrição do botão: </label>

        <input type={"text"} id='btn-desc'/>
        </div>
        {/* descrição da lista */}
        <div>
        <label>Descrição da Lista: </label>

        <input type={"text"} id='lista-desc'/>
        </div>

        
      </form>
      </div>
    </div>
  )
}

export default App
