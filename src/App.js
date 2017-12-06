import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Card from './Card';
import { Chatroom } from './chatroom.js';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Switch, Route, Link, Redirect, NavLink } from 'react-router-dom';
import SignUpForm from './SignUp';
import SignInForm from './SignIn';


class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      conversationIDs: [],
      conversationCount: 0,
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
          "bio": "1 gud boi. No Hookups",
          "age": 3
        },
        {
          "name": "Spot",
          "sex": "Female",
          "breed": "Terrier",
          "images": ["img/78e41dd3-4216-47f1-9598-ea8220de354b.jpg",
            "img/867df82c-1b72-495e-a349-7c067c700132.jpg",
            "img/f4456b54-3c2c-4024-adc2-04fc19c5561b.jpg"
          ],
          "bio": "I may be a Terrier but I sure ain't Terrierfying",
          "age": 7
        },
        {
          "name": "Cody",
          "sex": "Male",
          "breed": "Toy Poodle",
          "images":
          ["img/cody3.jpg",
            "img/cody2.jpg",
            "img/cody4.jpg"],
          "bio": "I am dumb and cute",
          "age": 5
        },
        {
          "name": "Sasha",
          "sex": "Female",
          "breed": "Dog",
          "images":
          ["img/snoozle1.png",
            "img/snoozle2.png",
            "img/snoozle3.png"
          ],
          "bio": "My friends call me Sasha but you can call me Snoozle ;-)",
          "age": 8
        }
      ],
      currentPet: 0,
    };
  }

  componentDidMount() {
    this.unregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.setState({ user: firebaseUser });
      }
      else {
        this.setState({ user: null });
      }
    });
    this.allConvoRef = firebase.database().ref('allConversations');
    this.allConvoRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          conversationIDs: Object.keys(snapshot.val()),
          loading: false
        });
      }
    })
  }

  componentWillUnmount() {
    this.allConvoRef.off();
    this.unregisterFunction();
  }

  handleSignUp(email, password, handle, avatar) {
    this.setState({ errorMessage: null });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user1) => {
        return user1.updateProfile({
          displayName: handle,
          // photoURL: "https://www.gravatar.com/avatar/" + hash
        })
      })
      .catch((err) => this.setState({ errorMessage: err.message }));

  }

  handleSignIn(email, password) {
    this.setState({ errorMessage: null });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => this.setState({ errorMessage: err.message }))

  }
  handleSignOut() {
    this.setState({ errorMessage: null });
    firebase.auth().signOut()
      .catch((err) => this.setState({ errorMessage: err.message }))
  }

  createConversation() {
    this.allConvoRef.push(this.state.conversationCount);
    this.createdConvo = firebase.database().ref('allConversations/' + this.state.conversationCount);
    this.createdConvo.push('[Conversation Start Placeholder]');
    this.setState((prevState) => { conversationCount: prevState.conversationCount++ });
  }

  createUserNode() {
    console.log(this.state.user);
    this.userRef = firebase.database().ref('users');
    console.log(this.state.user.displayName);
    this.userRef.push(this.state.user.uid);
    
  }

  onLike(event) {
    setTimeout(() => {
      this.setState({ liked: true, currentPet: this.state.currentPet + 1 });
    }, 700);
    console.log('liked');
  }

  onNope(event) {
    setTimeout(() => {
      this.setState({ disliked: true, currentPet: this.state.currentPet + 1 });
    }, 700);
    console.log('nope');
  }

  onSwitch(event) {
    this.setState(this.state.owner ? { owner: false } : { owner: true });
    console.log('swapped');
  }

  cardReset(event) {
    setTimeout(() => {
      this.setState({ liked: false, disliked: false});
    }, 700);
    
    console.log('reset');
  }

  render() {
    let content = null;
    if (!this.state.user) {
      content = (
        <div className="container">
          <Switch>
            <Route path='/join' component={() =>
              <SignUpForm signUpCallback={(e, p, h, a) => this.handleSignUp(e, p, h, a)} />
            } />
            <Route path='/login' component={() =>
              <SignInForm signInCallback={(e, p) => this.handleSignIn(e, p)} />
            } />
            <Route exact path='/' component={() =>
              <SignInForm signInCallback={(e, p) => this.handleSignIn(e, p)} />
            } />
            <Redirect exact to='/' />
          </Switch>
        </div>

      )

    } else {
      this.createUserNode();
      content = (
        <div className='row'>
          <div className="border col-2">
          </div>
          <div className="container col-10">
            <Switch>
              <Route path='/swipe' component={() =>
                <Card dog={this.state.pets[this.state.currentPet] /*SHOULD GET PASSED A USER COMPONENT W/ OWNER INFO & PET INFO*/}
                  onLikeCallback={(event) => this.onLike(event)}
                  onNopeCallback={(event) => this.onNope(event)}
                  onSwitchCallback={(event) => this.onSwitch(event)}
                  cardResetCallback={(event) => this.cardReset(event)}
                  liked={this.state.liked}
                  disliked={this.state.disliked}
                  newCard={this.state.newCard} />
              } />
              
              <Route path='/conversations' component={() =>
                <Chatroom user={this.state.pets[0]} chatroom={firebase.database().ref('allConversations/' + this.state.conversationCount)} />
              } />
              <Redirect to='/swipe' />
            </Switch>
          </div>
          <button aria-label="Log Out Button" className="btn btn-warning"
              onClick={() => this.handleSignOut()}>
              Log Out {this.state.user.displayName}
            </button>
        </div>
      )



    }



    return (
      <div>
        <header>
        </header>
        <main>
          {content}
        </main>
      </div>
    );
  }
}

export default App;
