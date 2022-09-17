import { FormEvent, useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import "../css/App.css";
import api from "../services/api";
import useInstancias from "../components/Instancias";

const Disparo = () => {
  const { render, sessoes } = useInstancias();
  const webhook = "https://n8n01.siriusalpha.com.br/webhook-test";
  const [columns, setColumns] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [url, setUrl] = useState("");
  const [number, setNumber] = useState([]);
  const [filter, setFilter] = useState("");
  const [minWait, setMinWait] = useState("");
  const [maxWait, setMaxWait] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [goodbyeArray, setGoodByeArray] = useState([""]);
  const [greetArray, setGreetArray] = useState([""]);
  const [greet, setGreet] = useState("");
  const [goodbye, setGoodBye] = useState("");
  const [img, setImg] = useState("");

  const req = api(url);
  req.interceptors.request.use((x) => {
    console.log(x);
    return x;
  });

  async function handleMessage() {
    const splitg = greet.split(";");
    const splitgb = goodbye.split(";");
    setGoodByeArray(splitgb);
    setGreetArray(splitg);
  }

  async function handleForm(e: FormEvent) {
    e.preventDefault();
    let sessions = sessoes.map((e) => e.sessao);
    req.post("/custom/disparo", {
      MessageData: {
        MessageBody: messageBody,
        greets: greetArray,
        goodbyes: goodbyeArray,
        sessions: sessions,
      },
      minWait: minWait,
      maxWait: maxWait,
      Numbers: number,
    });
  }

  async function disparo(numero: string, mensagem: string, chave: string) {
    console.log(
      "mensagem enviada para: ",
      numero,
      " foi ",
      mensagem,
      " por ",
      chave
    );
    var rand4 = Math.floor(Math.random() * (10 - 5) + 10);
    await new Promise((r) => setTimeout(r, rand4 * 1000));
    await req
      .post(`/message/text?key=${chave}`, {
        id: numero,
        message: mensagem,
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
    return console.log("disparo realizado com sucesso");
  }

  async function handleInstance() {
    if (url == undefined) {
      return new Error();
    }
    api(webhook).post("status", {
      URL: url,
    });
  }
  async function handleFilter() {
    await req.get("/custom/numeros").then((res) => {
      const cols = [
        {
          name: "Telefone",
          selector: (row: any) => row.TELEFONE,
        },
        {
          name: "cidade",
          selector: (row: any) => row.CID_ABREV,
        },
      ];
      setColumns(cols);
      setData(res.data);
      const numberlist = res.data.map((a: any) => {
        if (a.TELEFONE.match(/^55.{10,11}/)) return a.TELEFONE;
        if (a.TELEFONE.match(/^[92].{10,11}|^[62].{10,11}/))
          return `55${a.TELEFONE}`;
      });
      setNumber(numberlist);
    });
  }
  async function handleDebug() {
    await handleMessage();
    console.log({
      number,
      sessoes,
      goodbyeArray,
      greetArray,
    });
  }
  // process CSV data
  const processData = (dataString: string) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            // @ts-ignore
            obj[headers[j]] = d;
          }
        }
        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }
    // prepare columns list from headers
    const columns = headers.map((c, i) => ({
      name: c,
      selector: (row: any) => row.TELEFONE,
    }));
    // @ts-ignore
    const data = list.map(({ NOME, DOCUMENTO, ENDERECO, CEP, ...rest }) => {
      return rest;
    });
    // @ts-ignore
    const newCols = columns.filter((arr) => {
      if (arr.name == "TELEFONE") {
        return arr;
      }
    });
    setData(data);
    setColumns(newCols);
    console.log("data:", data);
    console.log("columns", newCols, columns);
  };
  // handle file upload
  const handleFileUpload = (e: any) => {
    const file = e.target?.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays*/
      // @ts-ignore
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="App w-[100%] height-[90%] items-center justify-between flex">
      <div className="">
        <form
          onSubmit={handleForm}
          id="disparo"
          className="items-start justify-between flex flex-col gap-2"
        >
          {" "}
          {/* coloca as informações de envio */}{" "}
          <div>
            <label>Url: </label>
            <input
              type={"text"}
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {/* Número de Telefone do cliente */}
          <div>
            <div className="flex gap-1">
              <input
                type={"checkbox"}
                onChange={() => {
                  document
                    .querySelector("#csvFile")
                    ?.classList.toggle("hidden");
                }}
              />
              <p>Marque para enviar utilizando um arquivo ".CSV"</p>
            </div>
            <label htmlFor="">Números para o disparo</label>
            <br />
            <input
              type="file"
              name="csv"
              id="csvFile"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <DataTable
              className="w-[100px]"
              theme="dark"
              pagination
              highlightOnHover
              columns={columns}
              data={data}
            />
            <div className="flex flex-col">
              <label htmlFor="">Filtros para envios das mensagens: </label>
              <label htmlFor="">Cidade</label>
              <label htmlFor="">Estado</label>
              <label htmlFor="">Cep</label>

              <button
                type="button"
                className="rounded bg-red-600 my-2 px-3 py-1"
                onClick={handleFilter}
              >
                Filtrar
              </button>
            </div>
          </div>
          <label>Intervalo de envio entre mensagens</label>
          {/* <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/>  */}
          <div className="bg-slate500 flex justify-around align-middle">
            <input
              type="number"
              value={minWait}
              className="w-full mx-1"
              onChange={(e) => setMinWait(e.target.value)}
              placeholder="delay mínimo"
            />
            <input
              type="number"
              value={maxWait}
              className="w-full mx-1"
              onChange={(e) => setMaxWait(e.target.value)}
              placeholder="delay máximo"
            />
          </div>
          {/* coloca as informações de mensagem */}
          {/* Corpo da Mensagem */}
          {/* Saudação */}
          <div className="input-el">
            <label>Saudações separadas por ; </label>
            <input
              type={"text"}
              id="lista-titulo"
              value={greet}
              onChange={(e) => setGreet(e.target.value)}
            />
          </div>{" "}
          {/* Corpo */}{" "}
          <div className="input-el h-40">
            <label>Corpo(s) das mensagens </label>
            <textarea
              id="lista-itens"
              className="h-64 resize-none scroll-auto"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              title='Separado com ";"'
            />
          </div>
          {/* Despedidas */}
          <div className="input-el">
            <label>Despedidas separadas por ; </label>
            <input
              type={"text"}
              id="lista-texto"
              value={goodbye}
              onChange={(e) => setGoodBye(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <input
              type={"submit"}
              className="rounded bg-red-600 my-2 px-3 py-1"
              value={"Disparar"}
            />
            <input
              type={"button"}
              className="rounded bg-red-600 my-2 px-3 py-1"
              value={"instância"}
              onClick={handleInstance}
            />
            <input
              type={"button"}
              className="rounded bg-red-600 my-2 px-3 py-1"
              value={"Debug"}
              onClick={handleDebug}
            />
          </div>
        </form>
      </div>
      <div className="m-5">{render}</div>
    </div>
  );
};

export default Disparo;
