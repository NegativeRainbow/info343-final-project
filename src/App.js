import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Card from './Card';

class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      pets:
        [
          {
            "name": "Fido",
            "sex": "Male",
            "breed": "Mix",
            "images": ["img/069b8257-f9db-4034-908f-12b8cea76693.jpg",
              "img/00654c82-4df9-418f-b5f1-c6d094457f1f.jpg",
              "img/7683254c-debd-4d9c-b0ef-7861d7ad0cd5.jpg"
            ],
            "bio": "1 gud boi. No Hookups"
          },
          {
            "name": "Spot",
            "sex": "Female",
            "breed": "Terrier",
            "images": ["img/78e41dd3-4216-47f1-9598-ea8220de354b.jpg",
              "img/867df82c-1b72-495e-a349-7c067c700132.jpg",
              "img/f4456b54-3c2c-4024-adc2-04fc19c5561b.jpg"
            ],
            "bio": "I may be a Terrier but I sure ain't Terrierfying"
          },
        {
          "name": "Cody",
          "sex": "Male",
          "breed": "Toy Poodle",
          "images": 
           ["img/cody3.jpg", 
            "img/cody2.jpg",
            "img/cody4.jpg"],
          "bio": "I am dumb and cute"
        }],
    };
  }


  onLike(event) {
    this.setState({liked: true});
    console.log('liked');
}

  onNope(event) {
    this.setState({disliked: true});
    console.log('nope');
}

  onSwitch(event) {
    this.setState({ownder: true});
    console.log('swapped');
  }

  render() {
    return (
      <div>
        <header>
        </header>
        <main>
          <div className="container">
            <Card dog={this.state.pets[2]} 
                  onLikeCallback={(event) => this.onLike(event)} 
                  onNopeCallback={(event) => this.onNope(event)}
                  onSwitchCallback={(event) => this.onSwitch(event)}
                  liked={this.state.liked}
                  disliked={this.state.disliked}/>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
