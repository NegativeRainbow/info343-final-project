import React, { Component } from 'react';
import firebase from 'firebase/app';
import './chatroom.css'


export class Chatroom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loading: true
        }
    }

    componentDidMount() {
        this.props.chatroom.on('value', (snapshot) => {
            let conversationArray = Object.keys(snapshot.val()).map((message) => {
                return {
                    message: snapshot.val()[message]
                }
            })
            this.setState({
                messages: conversationArray,
                loading: false
            })
        })
    }

    componentWillUnmount() {
        this.props.chatroom.off();
    }

    render() {
        let allMessages = [];
        if (!this.state.loading) {
            if (this.state.messages) {
                let displayArray = this.state.messages.slice(1, this.state.messages.length + 1);
                allMessages = Object.keys(displayArray).map((message) => {
                    let returnObj = {
                        id: message,
                        value: displayArray[message]
                    }
                    returnObj.value.id = message
                    return returnObj;
                });
            }
            allMessages = allMessages.map((message) => {
                return <Message key={message.id} message={message.value} id={message.id} user={this.props.user} />
            })
        }

        return (
            <div className="container" >
                <div className="container  border">
                    {allMessages}
                </div>
                <MessageInput user={this.props.user} chatroom={this.props.chatroom} />
            </div>);
    }

}

class Message extends Component {
    render() {
        let message = this.props.message.message;
        let myDate = new Date(message.time);
        myDate = myDate.toString().substring(0, 24);
        return (
            <div className="row py-4 bg-white border">
                <div className="col-xs-0 col-md-1 pl-1">
                    <img style={{height:60, width:80}} aria-label={"image of " + message.text} className="rounded-border avatar" src={message.userPhoto} alt={message.Name + ' avatar'} />
                </div>
                <div className="col pl-4 pl-lg-1">
                    <span className="handle" style={{ color: 'green', fontSize: 15 }}>{message.userName}</span>
                    <div>{message.text}</div>
                    <div style={{ color: 'gray', fontSize: 10 }} className="font-italic">{myDate}</div>
                </div>
            </div>
        );
    }
}


// Needs user as props and conversation name
class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
    }

    updateMessage(event) {
        this.setState({ message: event.target.value });
    }

    postMessage(event) {
        event.preventDefault();
        let newMessage = {
            text: this.state.message,
            userName: this.props.user.name,
            userPhoto: this.props.user.imgs[0],
            time: firebase.database.ServerValue.TIMESTAMP
        }
        this.props.chatroom.push(newMessage);
        this.setState({ message: '' });
    }

    render() {

        let user = this.props.user;
        return (
            <div className="container px-0">
                <div className="row py-3">
                    <div className="col-1">
                        <img style={{height:60, width:80}} aria-label={user.name + "avatar"} className="avatar" src={user.imgs[0]} alt={user.name + ' avatar'} />
                    </div>
                    <div className="col pl-4 pl-lg-1">
                        <form>
                            <textarea name="text" className="form-control mb-2" placeholder="Type a Message..."
                                value={this.state.message}
                                onChange={(e) => this.updateMessage(e)}
                            />
                            <div className="text-right">
                                <button aria-label={"Enter Text Button"} className="btn btn-primary"
                                    disabled={this.state.message.length === 0}
                                    onClick={(e) => this.postMessage(e)}>
                                    Enter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
