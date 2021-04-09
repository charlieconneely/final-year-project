import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import VideoChat from './components/Videochat/videochat';
import Canvas from './components/Canvas/canvas';
import Room from './components/Pages/room';
import Landing from './components/Pages/landing';
import SocketContext from './socketContext'
import io from 'socket.io-client'

const socket = io.connect('/')

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div>
        <BrowserRouter>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/room" component={Room}/>
              <Route path="/canvas" component={Canvas} />
              <Route path="/videochat" component={VideoChat} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
