import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import './App.css'
import Header from './Header';
import Pagina2 from './Pagina2';
import Pagina3 from './Pagina3';
import './Pagina2.css'

import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom' 

function App() {

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
   * Fetch para o backend, onde requisita-se a lista de deputados da API da câmara
   */
  useEffect(() => {
    fetch("https://dadosabertos.camara.leg.br/api/v2/deputados").then(
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


  /**
   * Função p/ utilizar o ID do deputado selecionado, no momento do clique em "buscar", para recuperar as demais informações em https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/ocupacoes
   */
  function handleClick() {
    
    if(pesquisa == null){       //alerta pro caso da tentativa de envio de uma caixa vazia
      alert('selecione um deputado na lista')
      return -1
    }

    setIsLoading(true)        //exibe o loading gif enquanto não obtem-se resposta
    setTitle(deputado)        //seta o título que será utilizado na tabela, de acordo com o deputado inserido na caixa
    
    const selected = dados.dados.find(dado => dado.nome.includes(pesquisa))   //procura, na lista, o deputado com o mesmo nome inserido na caixa de pesquisa
    console.log(selected)
    const id = selected.id      //resgata o ID do deputado para utilizar na URL de ocupações

    async function sendId() {
      let retryCount = 0
      while (retryCount <= 3) {     //Retry por conta da instabilidade no momento dos testes realizados
        
          try {
              const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/ocupacoes`, { id })    //depois de várias tentativas, foi necessário utilizar async/await 
              if (response.status === 500) {
                  retryCount++;
                  console.log(`Erro 500. Tentando conectar novamente...`)
                  await new Promise(resolve => setTimeout(resolve, retryInterval))  //intervalo de 3s
              } else {
                  setOcupacoes(response.data)     //seta o array de objetos JSON com a resposta do backend
                  setIsLoading(false)         //remove o loading gif
                  break
              }
          } catch (error) {
              console.log(error)
              retryCount++
              await new Promise(resolve => setTimeout(resolve, retryInterval))
              
          }
      }
      if (retryCount > 3) {
          console.log("Limite de tentativas excedido.")
      }
  }

    sendId()
}





  return (
    <>
    <Router>
      <Header />
      
    <div className='content'>
    <Switch>
    <Route exact path="/pagina2">
    <p className='subtitulo'>Carreira e ocupações</p>
        <p className='texto'>Selecione um deputado na busca abaixo para exibir informações acerca de sua carreira e ocupações.</p>
        <div className='consulta'>
          {(typeof dados.dados === 'undefined') ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...

            <img className="loadingInitial" src='/Rolling-1s-200px.gif' />
          ) : (
            <>
              <input ref={inputRef} className='searchBar' type="text" placeholder='Insira o nome de um deputado' onChange={getValue} list="data" />
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
                      <th>Entidade</th>
                      <th>Título</th>
                      <th>Ano de Início</th>
                      <th>Ano de Fim</th>
                    </tr>
                  </thead>
                  {ocupacoes.dados.map((ocupacao, i) => <tr>
                    <td valign="top">{ocupacao.entidade}</td>
                    <td valign="top">{ocupacao.titulo}</td>
                    <td valign="top">{ocupacao.anoInicio}</td>
                    <td valign="top">{ocupacao.anoFim}</td>
                  </tr>
                  )}
                </table>
              </div>
            </>
          )}
        </div>
        </Route>
        
          <Route exact path="/">
              <Pagina2 />
          </Route>

          <Route path="/pagina3">
              <Pagina3 />
          </Route>
        </Switch>            


      </div></Router>
      
      </>
  )
}

export default App