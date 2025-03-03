
import './App.css';
import Search  from './components/search';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import List from './components/list';
import Host from './components/table/table'
import Login from './components/login/login'

function App () {
 
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={List} />
          <Route path='/PhoneBoock' Component={Search} />
          <Route path='/Host' Component={Host} />
          <Route path='/Login?' Component={Login} />
        </Routes>
      </BrowserRouter>
  );
  
}

export default App;