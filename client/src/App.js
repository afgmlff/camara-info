import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [pesquisa, setPesquisa] = useState("")  //"pesquisa" será utilizada para receber o input do usuário e realizar uma próxima query para obter demais informações
//sobre o deputado digitado em "pesquisa"

  const [dados, setDados] = useState([{}])

  const [id, setId] = useState()

  const[ocupacoes, setOcupacoes] = useState([{}])

  /**
   * Limpar o input box se o usuário clicar fora dele
   */

  const inputRef = useRef(null);
  const handleClickOutside = e => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      inputRef.current.value = '';
      setPesquisa(null)
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  /**
   * Fetch para o backend, onde são requisitados os dados da API da câmara
   */
  useEffect(() => {
    fetch("/data").then(
      response => response.json()
    ).then(
      data => {
        setDados(data)
      }
    )
  }, [])

  function getValue(e) {
    setPesquisa(e.target.value)
  }


  useEffect(() => {
    if(id) {
      console.log(id)
      sendId();
    }
  }, [id])


  const retryInterval = 3000;

  function handleClick() {
    if(pesquisa == null){
      alert('selecione um deputado na lista')
      return -1
    }
    const selected = dados.dados.find(dado => dado.nome.includes(pesquisa))
    console.log(selected)
    const id = selected.id;

    async function sendId() {
      let retryCount = 0;
      while (retryCount <= 3) {
          try {
              const response = await axios.post('/sendId', { id });
              if (response.status === 500) {
                  retryCount++;
                  console.log(`Erro 500. Tentando conectar novamente...`);
                  await new Promise(resolve => setTimeout(resolve, retryInterval));
              } else {
                  setOcupacoes(response.data);
                  break;
              }
          } catch (error) {
              console.log(error);
              break;
          }
      }
      if (retryCount > 3) {
          console.log("Limite de tentativas excedido.");
      }
  }

    sendId();
}



  /**
   * Enviando o ID pro backend, pra consultar a URL desejada da API pros casos
   */
  async function sendId() {
    let retryCount = 0;
    while (retryCount <= 3) {
        try {
          
            const response = await axios.post('/data/post', { id });
            console.log(response);
            break;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                retryCount++;
                let retryAfter = error.response.headers['Retry-After'];
                console.log('Limite excedido. Tentando novamente...');
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            } else {
                console.log(error);
                break;
            }
        }
    }
    if (retryCount > 3) {
        console.log("Limite de tentativas excedido.");
    }
}


  return (
    <div className='content'>
      
      <div className='consulta'>
          {(typeof dados.dados === 'undefined') ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...
            <p>Carregando...</p>
          ): (
            <>
            <input ref={inputRef} className='searchBar' type="text" placeholder='Insira o nome de um deputado' onChange={getValue} list="data"/>
            <datalist id="data">
              {dados.dados.map((dado, i) =>
                  <option key={i} value={dado.nome} />
              )}
            </datalist>
            <button className='searchButton' onClick={handleClick}>Buscar</button>
            </>
          )}
      </div>

    <div className='resultadoConsulta'>           
    <p>Deputado: {pesquisa}</p>
    </div>
    
    <div className='resultadoConsulta'>
    {(typeof ocupacoes.dados === 'undefined') ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...
        <p>Carregando...</p>
      ): (
        <>
        {ocupacoes.dados.map((ocupacao, i) => 
          <p>{ocupacao.titulo}</p>
        )}
        </>
      )}
    </div>
    


    
    </div>
  )
}

export default App