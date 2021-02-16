import './App.css';
import Canvas from './components/Canvas/canvas';
import Home from './components/Home/home';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import VideoChat from './components/Videochat/videochat';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/canvas" component={Canvas} />
            <Route path="/room" component={VideoChat} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
