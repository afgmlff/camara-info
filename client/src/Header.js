import React from 'react';
import './Header.css'
import {Link} from 'react-router-dom' 

function Header() {


  return (
    <>
    <header>
        <h1>Caso Técnico | Desenvolvedor</h1>
        <div className='menu'>
          <ul>
            <li className=''><Link to="/">Informações Gerais</Link></li>
            <li className=''><Link to="/pagina2">Ocupações</Link></li>
            <li className=''><Link to="/pagina3">Unidades Federativas</Link></li>
          </ul>
        </div>
    </header>
    
    </>
  )
}
export default Header;
