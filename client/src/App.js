import React, {useEffect, useState} from 'react'

function App() {

  const [pesquisa, setPesquisa] = useState("")
  const [dados, setDados] = useState([{}])


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



  return (
    <div>
      
      {(typeof dados.dados === 'undefined') ? ( //Apresenta uma mensagem durante o período de tentativas de fetch na API, pro caso do servidor possuir muitas requisições...
        <p>Carregando...</p>
      ): (
        <>
        <input type="text" placeholder='Insira o nome de um deputado' onChange={event => { setPesquisa(event.target.value) } } list="data"/>
        <datalist id="data">
          {dados.dados.map((dado, i) =>
              <option key={i} value={dado.nome} />
          )}
        </datalist>
        </>
      )}

      {(typeof dados.dados === 'undefined') ? (
        <></>
      ): (
        
        dados.dados.filter((valor) =>{
          if(pesquisa == ""){
            return valor
          } 
          else if (valor.nome.toLowerCase().includes(pesquisa.toLowerCase())){
            return valor
          }
        }).map((dado, i) => (          
          <p key={i}>{dado.nome}</p>
        ))

      )}

    

    </div>
  )
}

export default App