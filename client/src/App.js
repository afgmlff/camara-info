import React, {useEffect, useState} from 'react'

function App() {

  const [dados, setDados] = useState([{}])

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

      {(typeof dados.dados === 'undefined') ? (
        <p>Carregando...</p>
      ): (
        dados.dados.map((dado, i) => (
          <p key={i}>{dado.nome}</p>
        ))
      )}

    </div>
  )
}

export default App