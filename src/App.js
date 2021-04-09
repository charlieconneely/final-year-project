import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import VideoChat from './components/Videochat/videochat';
import Canvas from './components/Canvas/canvas';
import Room from './components/Pages/room';
import Landing from './components/Pages/landing';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/room/:roomID" component={Room}/>
            <Route path="/canvas" component={Canvas} />
            <Route path="/videochat" component={VideoChat} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
