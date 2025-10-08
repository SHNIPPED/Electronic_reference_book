import './App.css';
import PhoneBook from './components/phonebook/phoneBook';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Phone from './components/phone/phone'
import List from './components/list';
import Host from './components/hosts/hosts'
import Login from './components/login/login'
import SnakeGame from './components/snake/Snake'
import error from './components/error/error';
import removal from './removal/removal';

function App () {
  
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={List} />
          <Route path='/PhoneBook' Component={PhoneBook} />
          <Route path='/Host' Component={Host} />
          <Route path='/Login?' Component={Login} />
          <Route path='/SnakeGame' Component={SnakeGame} />
          <Route path='/Error' Component={error} />
          <Route path='/Removal' Component={removal} />
          <Route path='/Phone' Component={Phone} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;