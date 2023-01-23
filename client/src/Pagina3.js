import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import './App.css'
import './Pagina2.css'
import './Pagina3.css'


function Pagina3() {

  const [isLoading, setIsLoading] = useState(false); //constante p/ verificar a necessidade da animação de loading

  const [title, setTitle] = useState("")//constante p/ setar o Título da tabela que apresenta as ocupações (e, possívelmente, demais tabelas informacionais)

  const [pesquisa, setPesquisa] = useState("")  //"pesquisa" será utilizada para receber o input do usuário e realizar uma próxima query para obter demais informações
//sobre o deputado digitado em "pesquisa"

  const [deputado, setDeputado] = useState("") //constante com o nome do deputado da pesquisa atual

  const [dados, setDados] = useState([{}]) //json da consulta inicial de deputados por nome

  const [id, setId] = useState()//id do deputado

  const[ocupacoes, setOcupacoes] = useState([{}])//json da consulta de ocupações

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
    fetch("/uflist").then(
      response => response.json()
    ).then(
      data => {
        setDados(data)
      }
    )
  }, [])

  function getValue(e) {
    setPesquisa(e.target.value)
    setDeputado(e.target.value)
  }



  const retryInterval = 3000;

  function handleClick() {
    
    if(pesquisa == null){
      alert('selecione um estado na lista')
      return -1
    }

    setIsLoading(true)
    setTitle(deputado)
    
    const selected = dados.dados.find(dado => dado.nome.includes(pesquisa))
    console.log(selected)
    const id = selected.sigla

    async function sendId() {
      let retryCount = 0
      while (retryCount <= 3) {
        
          try {
              const response = await axios.post('/ufsearch', { id })
              if (response.status === 500) {
                  retryCount++;
                  console.log(`Erro 500. Tentando conectar novamente...`)
                  await new Promise(resolve => setTimeout(resolve, retryInterval))
              } else {
                  setOcupacoes(response.data)
                  setIsLoading(false)
                  break
              }
          } catch (error) {
              console.log(error)
              retryCount++
              await new Promise(resolve => setTimeout(resolve, retryInterval))
              
          }
      }
      if (retryCount > 3) {
          retryCount = 0
      }
  }

    sendId()
}





  return (
    <>

      
    <div className='content'>

    <p className='subtitulo'>Unidades Federativas</p>
        <p className='texto'>Selecione uma Unidade Federativa para exibir informações acerca dos deputados nela presentes.</p>
        <div className='consulta'>
          {(typeof dados.dados === 'undefined') ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...

            <img className="loadingInitial" src='/Rolling-1s-200px.gif' />
          ) : (
            <>
              <input ref={inputRef} className='searchBar' type="text" placeholder='Insira uma UF' onChange={getValue} list="data" />
              <datalist id="data">
                {dados.dados.map((dado, i) => <option key={i} value={dado.nome} />
                )}
              </datalist>
              <button className='searchButton' onClick={handleClick}>Buscar</button>
            </>
          )}
        </div>

        <div>
          {isLoading ? <img className="loadingNewQ" src='/Rolling-1s-200px.gif' /> : <></>}
        </div>

        <div className='resultadoConsulta'>
          {(typeof ocupacoes.dados === 'undefined' || isLoading) ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...
            <></>
          ) : (
            <>
              <div className='tableWrapper'>
                <h3>{title}</h3>
                <table className='tableStyle'>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Partido</th>
                    </tr>
                  </thead>
                  {ocupacoes.dados.map((ocupacao, i) => <tr>
                    <td valign="top">{ocupacao.nome}</td>
                    <td valign="top">{ocupacao.siglaPartido}</td>
                  </tr>
                  )}
                </table>
              </div>
            </>
          )}
        </div>

        



      </div>
      </>
  )
}

export default Pagina3