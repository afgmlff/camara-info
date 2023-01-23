
import './Pagina2.css'
import App from './App';

import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import './App.css'
import Header from './Header';

import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom' 

function Pagina2() {

  const [isLoading, setIsLoading] = useState(false); //constante p/ verificar a necessidade da animação de loading

  const [title, setTitle] = useState("")//constante p/ setar o Título da tabela que apresenta as ocupações (e, possívelmente, demais tabelas informacionais)

  const [pesquisa, setPesquisa] = useState("")  //"pesquisa" será utilizada para receber o input do usuário e realizar uma próxima query para obter demais informações
//sobre o deputado digitado em "pesquisa"

  const [deputado, setDeputado] = useState("") //constante com o nome do deputado da pesquisa atual

  const [dados, setDados] = useState([{}]) //json da consulta inicial de deputados por nome

  const [id, setId] = useState()//id do deputado

  const [ocupacoes, setOcupacoes] = useState([{}])//json da consulta de ocupações

  const [generic, setGeneric] = useState([{}])

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
    setDeputado(e.target.value)
  }




  const retryInterval = 3000;

  function handleClick() {
    
    if(pesquisa == null){
      alert('selecione um deputado na lista')
      return -1
    }

    setIsLoading(true)
    setTitle(deputado)
    
    const selected = dados.dados.find(dado => dado.nome.includes(pesquisa))
    console.log(selected)
    const id = selected.id;
    setGeneric(selected)
    setIsLoading(false)


}


  return (
    <>
        <p className='subtitulo'>Informações gerais</p>
        <p className='texto'>Selecione um deputado na busca acima para exibir informações.</p>

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
        {(title === '' || isLoading) ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...
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
                    <th>Estado</th>
                  </tr>
                </thead>
                <tr>
                  <td valign="top">{generic.nome}</td>
                  <td valign="top">{generic.siglaPartido}</td>
                  <td valign="top">{generic.siglaUf}</td>
                </tr>
                
              </table>
            </div>
          </>
        )}
      </div>
      </>
  )
}
export default Pagina2;
