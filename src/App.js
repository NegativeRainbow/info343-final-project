import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Card from './Card';
import { Chatroom } from './chatroom.js';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Switch, Route, Redirect } from 'react-router-dom';
import SignUpForm from './SignUp';
import SignInForm from './SignIn';


class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      potentialSwipes: [],
      loading: true,
      userFetchLoading: true,
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
          "breed": "Black Lab Mix",
          "images":
          ["img/snoozle1.png",
            "img/snoozle2.png",
            "img/snoozle3.png"
          ],
          "bio": "Bring me food, rub my belly, and I'm yours.",
          "age": 11
        }
      ],
      owners:
      [
        {
          "name": "Joel",
          "sex": "Male",
          "occupation": "Professor",
          "images":
          ["img/joel.jpg"
          ],
          "bio": "Thumbs Up!",
          "age": "30-Something"
        }
      ],
      // owner: false,
      currentViewedProfile: {},
      pulsing: false,
    };
  }

  componentDidMount() {
    var allUserRef = firebase.database().ref('users');
    allUserRef.once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
      var allUsers = Object.keys(snapshot.val());
      this.setState({potentialSwipes: allUsers});
      if (this.state.potentialSwipes.length > 0) {
        firebase.database().ref('users/' + this.state.potentialSwipes[0]).once('value')
          .then((snapshot) => {
            this.setState({currentViewedProfile: snapshot.val()});
            this.setCurrentViewNode();

          })
      } else {
        this.setState({pulsing:true});
      }
    } else {
      this.setState({currentViewedProfile:{}, pulsing:true});
    }
    });
  
    this.unregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.setState({ user: firebaseUser });
      }
      else {
        this.setState({ user: null });
      }
    });
    
  }

  setCurrentViewNode(){
    if (this.state.potentialSwipes.length > 0) {
      var findUserRef =  firebase.database().ref('users/' + this.state.potentialSwipes[0]);
      findUserRef.once('value')
        .then((snapshot) => {
          console.log(snapshot.val());
          this.setState({currentViewedProfile: snapshot.val(), userFetchLoading:false});
        })
    } else {
      this.setState({pulsing:true});
    }
  }

  componentWillUnmount() {
    this.unregisterFunction();
  }

  handleSignUp(email, password, petName, petImg, petGender, petAge, petBreed, ownerName, ownerImg, ownerAge, ownerOccupation, userBio) {
    console.log('HANDLE SIGN UP FLAG');
    this.setState({ errorMessage: null });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user1) => {
        console.log(userBio);
        let newNode = this.createUserNode(petName, petImg, petGender, petAge, petBreed, ownerName, ownerImg, ownerAge, ownerOccupation, userBio);
        console.log(newNode);
        this.pushUserNode(user1.uid, newNode.bio, newNode.pet, newNode.owner);
      
      })
      .catch((err) => this.setState({ errorMessage: err.message }));

  }

  /* Potentially add in preferences */
  createUserNode(petName, petImgs, petGender, petAge, petBreed, ownerName, ownerImgs, ownerAge, ownerOccupation, userBio) {
    return {
      "pet": {
        "name": petName,
        "imgs": [petImgs],
        "gender": petGender,
        "age": petAge,
        "breed": petBreed
      },
      "owner": {
        "name": ownerName,
        "imgs": [ownerImgs],
        "age": ownerAge,
        "occupation": ownerOccupation
      },
      "bio": userBio
    }
  }

  // function writeUserData(userId, name, email, imageUrl) {
  //   firebase.database().ref('users/' + userId).set({
  //     username: name,
  //     email: email,
  //     profile_picture : imageUrl
  //   });
  // }

  pushUserNode(inputUser, bio, petData, ownerData) {
    console.log(bio, petData, ownerData );
    firebase.database().ref('users/' + inputUser).set({
      "bio": bio,
      "pet": petData,
      "owner": ownerData,
      "noSwipes": ['placeholder'],
      "yesSwipes": ['placeholder'],
      "chats": [0]
    })
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
    var countRef = firebase.database().ref('conversationCount');
    countRef.once("value")
    .then(function(snapshot) {
      var val = snapshot.val();
      val = val + 1;
      return val;
    })
    .then((val) => {
      countRef.set(val);
      var userOneRef = firebase.database().ref('users/' + 'bOvylagcPnSmQy7PYGnPF5lEKcx2'+ '/chats');
      var userTwoRef = firebase.database().ref('users/' + 'VAqylQwgL6MQODihTTR75u3zesd2' + '/chats');
      userOneRef.once("value")
      .then((snapshot) => {
        console.log(snapshot.val());
        var chatArray = snapshot.val();
        chatArray.push(val);        
        userOneRef.set(chatArray);
      })
      userTwoRef.once("value")
      .then((snapshot) => {
        var chatArray = snapshot.val();
        chatArray.push(val);
        userTwoRef.set(chatArray);
      })
      var createdConvo = firebase.database().ref('allConversations/' + val);
      createdConvo.push('[Conversation Start Placeholder]');

    });

  }



  onLike(event) {
    setTimeout(() => {
      var userYesSwipeRef = firebase.database().ref('users/' + this.state.user.uid + '/yesSwipes');
      userYesSwipeRef.push(this.state.potentialSwipes[0]);
      this.setState((prevState) => {potentialSwipes: prevState.potentialSwipes.slice(1)});
      /* need to change currentPet to potentialSwipe.pet at the 0 index*/
      this.setCurrentViewNode();
      // this.setState({ liked: true, currentPet: this.state.currentPet + 1});
    }, 700);
    console.log('liked');
  }

  onNope(event) {
    setTimeout(() => {
      var userNoSwipeRef = firebase.database().ref('users/' + this.state.user.uid + '/noSwipes');
      userNoSwipeRef.push(this.state.potentialSwipes[0]);
      this.setState((prevState) => {potentialSwipes: prevState.potentialSwipes.slice(1)});
      this.setCurrentViewNode();
      /* need to change currentPet to potentialSwipe.pet at the 0 index*/
      // this.setState({ disliked: true, currentPet: this.state.currentPet + 1 });
    }, 700);
    console.log('nope');
  }

 

  cardReset(event) {
    setTimeout(() => {
      this.setState({ liked: false, disliked: false });
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
              <SignUpForm signUpCallback={(e, p, pN, pI, pG, pA, pB, oN, oI, oA, oO, uB) => this.handleSignUp(e, p, pN, pI, pG, pA, pB, oN, oI, oA, oO, uB)} />
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

    } else if (this.state.potentialSwipes.length > 0 && !this.state.userFetchLoading){
      {console.log(this.state.potentialSwipes)};
      content = (
        <div className='row'>
          <div className="border col-2">
          </div>
          <div className="container col-10">
            <Switch>
              <Route path='/swipe' component={() => 
                <Card user={this.state.currentViewedProfile}
                  onLikeCallback={(event) => this.onLike(event)}
                  onNopeCallback={(event) => this.onNope(event)}
                  onSwitchCallback={(event) => this.onSwitch(event)}
                  cardResetCallback={(event) => this.cardReset(event)}
                  noMorePets={this.state.pulsing}
                   /> }
               />

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
    } else {
      content = (
        <div className='row'>
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
