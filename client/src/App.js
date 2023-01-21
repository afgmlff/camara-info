import React, {useEffect, useState} from 'react'

function App() {

  const [pesquisa, setPesquisa] = useState("")  //"pesquisa" será utilizada para receber o input do usuário e realizar uma próxima query para obter demais informações
//sobre o deputado digitado em "pesquisa"

  const [dados, setDados] = useState([{}])

  const [id, setId] = useState()


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

  function handleClick() {    //setId de acordo com o deputado pesquisado
    {dados.dados.filter(function (selecionado) {
      return selecionado.nome.includes(pesquisa)
    }).map((dado, i) =>
      setId(dado.id)
    )}
    
  }

  return (
    <div>
      
      {(typeof dados.dados === 'undefined') ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...
        <p>Carregando...</p>
      ): (
        <>
        <input type="text" placeholder='Insira o nome de um deputado' onChange={getValue} list="data"/>
        <datalist id="data">
          {dados.dados.map((dado, i) =>
              <option key={i} value={dado.nome} />
          )}
        </datalist>
        <button onClick={handleClick}>Buscar</button>
        </>
      )}


    <p>Deputado: {pesquisa}</p>
    <p>Id: {id}</p>
    </div>
  )
}

export default App