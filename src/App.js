import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  // add your own
  apiKey: ''
 });

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

class App extends Component{
      constructor(){
        super();
        this.state={
           input:'',
           imageUrl:'',
           box:{},
           route:'signin',
           isSignedIn:false
        };
      }

      displayFaceBox(box){
         this.setState({box:box});
      }

      calculateFaceLocation=(data)=>{
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
          this.setState({isSignedIn:false});
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

        app.models
           .predict(
                 Clarifai.FACE_DETECT_MODEL,
                 this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
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
               <Rank />
               <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
               <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
              </div>
               : ( this.state.route === "signin" ?
                  <Signin onRouteChange = {this.onRouteChange} /> :
                  <Register onRouteChange = {this.onRouteChange} />
               )
             }
        </div>
        );
      }
}

export default App;
