import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';



const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState={
    input:'',
    imageUrl:'',
    box:{},
    oute:'signin',
    isSignedIn:false,
    user:{
       email:'',
       name:'',
       entries: 0,
       id: '0',
       joined:''
      }
    };
class App extends Component{
      constructor(){
        super();
        this.state= initialState;
      }
      displayFaceBox(box){
         this.setState({box:box});
      }

      loadUser = (user) => {
          this.setState({user :{
            email: user.email,
            name: user.name,
            entries: user.entries,
            id: user.id,
            joined: user.joined
          }})
      } ;

      calculateFaceLocation = (data) => {
        const face=data.outputs[0].data.regions[0].region_info.bounding_box;
        const image=document.getElementById('inputimage');
        const width=Number(image.width);
        const height=Number(image.height);
        
        return {
            leftCol: face.left_col * width,
            topRow: face.top_row * height,
            rightCol:width - (face.right_col * width),
            bottomRow:height - (face.bottom_row * height)    
        };
      };

      onRouteChange = (route) => { 
        if(route==='signin'){
          this.setState(initialState);
        }
        else if(route==='home'){
          this.setState({isSignedIn:true});
        }
        this.setState({route: route});
      }

      onInputChange = (event) =>{
         this.setState({input: event.target.value});
      };

      onButtonSubmit = () =>{
        this.setState({imageUrl: this.state.input});
        fetch('https://stark-shore-03611.herokuapp.com/imageurl', {
          method:'post',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
        .then(response => response.json())
            .then(response => 
              {
                if(response){
                  fetch('https://stark-shore-03611.herokuapp.com/image', {
                    method:'put',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({
                      id: this.state.user.id
                    })
                  })
                  .then(response => response.json())
                  .then(count => this.setState(Object.assign(this.state.user, { entries: count})))
                }

                this.displayFaceBox(this.calculateFaceLocation(response))
              })
            .catch(error=> console.log(error));
      };

      render(){
        return (
          <div className="App">
          <Particles className='particles'
            params={particlesOptions}
          />
           <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange}  />
          {
               this.state.route === "home" ?
               <div>
               <Logo />
               <Rank name={this.state.user.name} entries={this.state.user.entries} />
               <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
               <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
              </div>
               : ( this.state.route === "signin" ?
                  <Signin onRouteChange = {this.onRouteChange} loadUser = {this.loadUser} /> :
                  <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser} />
               )
             }
        </div>
        );
      }
}

export default App;
