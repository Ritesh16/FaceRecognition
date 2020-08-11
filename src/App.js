import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'ad4917ee89a9492585dcb577ae012cf4'
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
           box:{}
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
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
        </div>
        );
      }
}

export default App;
