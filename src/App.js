import React from 'react';
import logo from './logo.svg';

import './app.css';

const App = () => {
  return (
    <>
      <div className='sidebar'>
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action active">
            Home
          </a>
          <a href="#" class="list-group-item list-group-item-action">About</a>
          <a href="#" class="list-group-item list-group-item-action">Main</a>
          {/* <a href="#" class="list-group-item list-group-item-action">Porta ac consectetur ac</a>
          <a href="#" class="list-group-item list-group-item-action disabled" tabindex="-1" aria-disabled="true">Vestibulum at eros</a> */}
        </div>
      </div>
      <div className='main-block'>
        <div className="alert alert-primary" role="alert">
          This is a primary alert—check it out!
      </div>
      </div>
    </>
  );
}

export default App;
