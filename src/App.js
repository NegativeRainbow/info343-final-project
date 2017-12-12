import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Card from './Card';
import { Chatroom } from './chatroom.js';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import SignUpForm from './SignUp';
import SignInForm from './SignIn';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  matchImg: {
    borderRadius: '100%',
    width: 56,
    height: 56,
    margin: 12
  },
  matchCard: {
    width: '100%'
  },
  matchHeading: {
    fontSize: '32px'
  },
  logoImg: {
    maxHeight: '100%',
    maxWidth: '100%'
  },
  logoText: {
    fontSize: '400%'
  }
})


class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      potentialSwipes: [],
      loading: true,
      userFetchLoading: true,
      chatObjs: [],
      currentViewedProfile: {},
      currentUser: {},
      pulsing: false,
    };
  }

  componentDidMount() {
    var allUserRef = firebase.database().ref('users');
    allUserRef.once('value')
      .then((snapshot) => {
        if (snapshot.val()) {
          var allUsers = Object.keys(snapshot.val());
          this.setState({ potentialSwipes: allUsers });
          if (this.state.potentialSwipes.length > 0) {
            firebase.database().ref('users/' + this.state.potentialSwipes[0]).once('value')
              .then((snapshot) => {
                if (this.state.user) {
                  this.filterFunc();
                  this.matchCardMap();
                } else {
                  this.setState({ currentViewedProfile: snapshot.val() });
                  this.setCurrentViewNode();
                }
              })
          } else {
            this.setState({ pulsing: true });
          }
        } else {
          this.setState({ currentViewedProfile: {}, pulsing: true });
        }
      });

    this.unregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.setState({ user: firebaseUser });
        this.filterFunc();
        this.matchCardMap();
        this.setCurrentUser();

      }
      else {
        this.setState({ user: null });
      }
    });

  }

  setCurrentUser() {
    firebase.database().ref('users/' + this.state.user.uid).once('value')
    .then((snapshot) => {
      this.setState({currentUser: snapshot.val()});
    });
  }

  filterFunc() {
    firebase.database().ref('users/' + this.state.user.uid + '/yesSwipes').once('value')
      .then((snapshot) => {
        return Object.values(snapshot.val());
      })
      .then((val) => {
        firebase.database().ref('users/' + this.state.user.uid + '/noSwipes').once('value')
          .then((snapshot) => {
            return Object.values(snapshot.val());
          })
          .then((value) => {
            var allYesandNo = value.concat(val);
            var truncatedArray = this.state.potentialSwipes;
            truncatedArray = truncatedArray.filter((userid) => {
              // if (this.state.user.uid !== userid) {
                return this.state.user.uid !== userid && allYesandNo.indexOf(userid) < 0;
              // }
            });
            this.setState({ potentialSwipes: truncatedArray });
            this.setCurrentViewNode();
    
          })
      });
  }
  setCurrentViewNode() {
    if (this.state.potentialSwipes.length > 0) {
      var findUserRef = firebase.database().ref('users/' + this.state.potentialSwipes[0]);
      findUserRef.once('value')
        .then((snapshot) => {
          this.setState({ currentViewedProfile: snapshot.val(), userFetchLoading: false });
        })
    } else {
      this.setState({ pulsing: true, userFetchLoading: false });
    }
  }

  componentWillUnmount() {
    this.unregisterFunction();
    this.chatRef.off();
  }

  handleSignUp(email, password, petName, petImg, petGender, petAge, petBreed, ownerName, ownerImg, ownerAge, ownerOccupation, userBio) {
    this.setState({ errorMessage: null });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user1) => {
        let newNode = this.createUserNode(petName, petImg, petGender, petAge, petBreed, ownerName, ownerImg, ownerAge, ownerOccupation, userBio);
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

  pushUserNode(inputUser, bio, petData, ownerData) {
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

  createConversation(user2ID) {
    var countRef = firebase.database().ref('conversationCount');
    countRef.once("value")
      .then(function (snapshot) {
        var val = snapshot.val();
        val = val + 1;
        return val;
      })
      .then((val) => {
        countRef.set(val);
        var userOneRef = firebase.database().ref('users/' + this.state.user.uid + '/chats');
        var userTwoRef = firebase.database().ref('users/' + user2ID + '/chats');
        userOneRef.once("value")
          .then((snapshot) => {
            firebase.database().ref('users/' + user2ID).once('value')
              .then((snapshot2) => {
                console.log(snapshot2.val());
                return {
                  number: val,
                  name: snapshot2.val().pet.name,
                  img: snapshot2.val().pet.imgs[0]
                }
              }).then((pushObj) =>{
                var chatArray = snapshot.val();
                chatArray.push(pushObj);
                userOneRef.set(chatArray);
              });
          });
        userTwoRef.once("value")
        .then((snapshot) => {
          firebase.database().ref('users/' + this.state.user.uid).once('value')
            .then((snapshot2) => {
              console.log(snapshot2.val());
              return {
                number: val,
                name: snapshot2.val().pet.name,
                img: snapshot2.val().pet.imgs[0]
              }
            }).then((pushObj) =>{
              var chatArray = snapshot.val();
              chatArray.push(pushObj);
              userTwoRef.set(chatArray);
            });
        });
        var createdConvo = firebase.database().ref('allConversations/' + val);
        createdConvo.push('[Conversation Start Placeholder]');

      });

  }

  checkLikes(user2ID) {
    firebase.database().ref('users/' + user2ID +'/yesSwipes').once('value')
    .then((snapshot) =>{
      if (Object.values(snapshot.val()).includes(this.state.user.uid)) {
        this.createConversation(user2ID);
      }
    })
  }

  onLike(event) {
    setTimeout(() => {
      var userYesSwipeRef = firebase.database().ref('users/' + this.state.user.uid + '/yesSwipes');
      userYesSwipeRef.push(this.state.potentialSwipes[0]);
      this.checkLikes(this.state.potentialSwipes[0]);
      var newRef = this.state.potentialSwipes.slice(1);
      this.setState({ potentialSwipes: newRef });
      this.filterFunc();
    }, 700);

  }

  onNope(event) {
    setTimeout(() => {
      var userNoSwipeRef = firebase.database().ref('users/' + this.state.user.uid + '/noSwipes');
      userNoSwipeRef.push(this.state.potentialSwipes[0]);
      var newRef = this.state.potentialSwipes.slice(1);
      this.setState({ potentialSwipes: newRef });
      this.filterFunc();
    }, 1000);
  }


  matchCardMap(){
 
    this.chatRef = firebase.database().ref('users/' + this.state.user.uid +'/chats');
    this.chatRef.on('value', (snapshot) => {
      var toMap = snapshot.val().slice(1);
      this.setState({chatObjs: toMap});
    })
  }

  cardReset(event) {
    setTimeout(() => {
      this.setState({ liked: false, disliked: false });
    }, 1000);
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

    } else if ( !this.state.userFetchLoading ) {
      content = (
        <div className='row'>
          <div className="border col-2 px-0">
            <div className="container">
              <p className={css(styles.matchHeading)}>Matches {'<3'}</p>
              {this.state.chatObjs.map((chat) => {
                return <Link to={'/conversations/' + chat.number} key={chat.name}><MatchCard name={chat.name} image={chat.img}/></Link>
              })}
            </div>
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
                />}
              />

              {this.state.chatObjs.map((chat) => {
                return <Route key={chat} path={'/conversations/' + chat.number} component={() =>
                  <div>
                  <Chatroom chatroom={firebase.database().ref('allConversations/' + chat.number)} user={this.state.currentUser.pet} />
                  <Link to={'/swipe'}>
                  <button aria-label="Return to Swipes Button" className="btn btn-warning">
                    Return to Swipes
                  </button>
                  </Link>
                  </div>
                } />
              })}

              <Redirect to='/swipe' />

            </Switch>
          </div>
          <button aria-label="Log Out Button" className="btn btn-warning"
            onClick={() => this.handleSignOut()}>
            Log Out
          </button>
        </div>
      )
    } else {
      content = (
        <div>
          <h1>Loading Matches</h1>
        </div>
      )
    }

    return (
      <div>
        <header className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="row">
              <div className="col-md-2">
                <img className={css(styles.logoImg)} src="./img/dogLogo.png" alt="Woofr Logo" />
              </div>
              <div className="col-md">
                <h1 className={css(styles.logoText)}>Woofr</h1>
                <p>A tinder-like app for dog lovers in Seattle</p>
              </div>
            </div>
          </div>
        </header>
        <main className="container">
          {content}
        </main>

      </div>
    );
  }
}

class MatchCard extends Component {
  render() {
    return (
      <div className={css(styles.matchCard) + " card"}>
      <div className="container">
          <div className="row">
              <img className={css(styles.matchImg) + " col card-img"} src={this.props.image} alt={"Image of " + this.props.name}></img>
              <p className={"card-body"}>{this.props.name}</p>
          </div>
          </div>
      </div>
    );
  }
}

export default App;
