import React, { Component } from 'react';
import './App.css';
import { UncontrolledCarousel, CarouselItem } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite';


// Aphrodite Style Sheet
// Button URLS from https://codepen.io/arjentienkamp/
const styles = StyleSheet.create({
    btnLike: {
        fontSize: 24,
        color: 'white',
        backgroundColor: '#FFF',
        borderRadius: '100%',
        background: 'url(http://web.arjentienkamp.com/codepen/tinder/heart.png)',
        backgroundSize: '30px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        border: '5px solid #f0f0f0',
        borderRadius: 50,
        width: 50,
        height: 50,
        display: 'inline-block',
        boxShadow: '1px 1px 1px 0px #e9e9e9',
        outline: 1,
        margin: 'auto',
        display: 'block'
    },
    btnNope: {
        background: 'url(http://web.arjentienkamp.com/codepen/tinder/delete.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '25px',
        backgroundPosition: 'center',
    },
    btnOwner: {
        background: 'url(http://web.arjentienkamp.com/codepen/tinder/info.png)',
        width: 56,
        height: 56,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '30px',
        backgroundPosition: 'center',
    },
    carouselWrap: {
        backgroundColor: '#505050',
        borderRadius: '5px',
    }
}
)

export default class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            morePets: this.props.noMorePets,
        }
    }

    componentDidMount() {
        this.setState({ loading: false }); // PLACEHOLDER FOR NOW
    }

    // Performs Like Animation on Pet Card
    updateClassOnLikePet(event) {
        let card = document.querySelector(".profileCardPet");
        card.className += ' profileLikeAnimate';
        setTimeout(() => {
            card.className = 'card profileCardPet';
        }, 1000);
    }

    // Performs Like Animation on Owner Card
    updateClassOnLikeOwner(event) {
        let card = document.querySelector(".profileCardOwner");
        card.className += ' profileLikeAnimate';
        setTimeout(() => {
            card.className = 'card profileCardOwner';
        }, 1000);
    }

    // Performs Nope Animation on Pet Card
    updateClassOnNopePet(event) {
        let card = document.querySelector(".profileCardPet");
        card.className += ' profileNopeAnimate';
        setTimeout(() => {
            card.className = 'card profileCardPet';
        }, 1000);
    }

    // Performs Nope Animation on Owner Card
    updateClassOnNopeOwner(event) {
        let card = document.querySelector(".profileCardOwner");
        card.className += ' profileNopeAnimate';
        setTimeout(() => {
            card.className = 'card profileCardOwner';
        }, 1000);
    }

    // Performs Flip Animaton on Switch
    updateClassOnSwitch(event, isPet) {
        if (isPet) {
            let card = document.querySelector(".card-flipper");
            card.className = 'card-flipper flipper';
        }
        else {
            let card = document.querySelector(".card-flipper");
            card.className = 'card-flipper flipBack';
        }
    }

    render() {
        // For ease of use
        let dogObj = this.props.user.pet;
        let ownerObj = this.props.user.owner;
        let petCarouselItems = dogObj.imgs.map(function (img) {
            let obj = { src: img , altText: dogObj.name, caption: '' };
            return obj;
        })

        let ownerCarouselItems = ownerObj.imgs.map(function (img) {
            let obj = { src: img, altText: ownerObj.name, caption: '' };
            return obj;
        })

        return (
            <div className="d-flex justify-content-center">
                {this.state.morePets ? <Pulser /> :
                    <div className="card-flipper">
                        <div className="flip">
                            <div className='petSide'>
                                <div className={"card profileCardPet"}>
                                    <div className={css(styles.carouselWrap)}>
                                        <UncontrolledCarousel
                                            items={petCarouselItems}
                                            indicators={true}
                                            controls={true}
                                            autoPlay={false}>
                                            <CarouselItem cssModule={{ width: '100%' }} />
                                        </UncontrolledCarousel>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title name">{dogObj.name + ', ' + dogObj.age}</h3>
                                        <p className="card-text breed">{dogObj.gender + ', ' + dogObj.breed}</p>
                                        <p className='card-text bio'>{this.props.user.bio}</p>
                                        <div className='row'>
                                            <div className='col justify-content-center'>
                                                <button className={css(styles.btnLike, styles.btnNope)} onClick={(event) => 
                                                    { this.props.onNopeCallback(event); 
                                                      this.updateClassOnNopePet(event); 
                                                      this.props.cardResetCallback(event); }}>
                                                </button>
                                            </div>
                                            <div className='col justify-content-center'>
                                                <button className={css(styles.btnLike, styles.btnOwner)} onClick={(event) => 
                                                    { this.updateClassOnSwitch(event, true) }}></button>
                                            </div>
                                            <div className='col justify-content-center'>
                                                <button className={css(styles.btnLike)} onClick={(event) => 
                                                    { this.props.onLikeCallback(event); 
                                                      this.updateClassOnLikePet(event); 
                                                      this.props.cardResetCallback(event); }}>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='ownerSide'>
                                <div className={"card profileCardOwner"}>
                                    <div className={css(styles.carouselWrap)}>
                                        <UncontrolledCarousel
                                            items={ownerCarouselItems}
                                            indicators={true}
                                            controls={true}
                                            autoPlay={false}>
                                            <CarouselItem cssModule={{ width: '100%' }} />
                                        </UncontrolledCarousel>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title name">{ownerObj.name + ', ' + ownerObj.age}</h3>
                                        <p className="card-text breed">{ownerObj.occupation}</p>

                                        <p className='card-text bio'>{this.props.user.bio}</p>
                                        <div className='row'>
                                            <div className='col justify-content-center'>
                                                <button className={css(styles.btnLike, styles.btnNope)} onClick={(event) => 
                                                    { this.props.onNopeCallback(event); 
                                                      this.updateClassOnNopeOwner(event); 
                                                      this.props.cardResetCallback(event); }}>
                                                </button>
                                            </div>
                                            <div className='col justify-content-center'>
                                                <button className={css(styles.btnLike, styles.btnOwner)} onClick={(event) => 
                                                    { this.updateClassOnSwitch(event, false) }}></button>
                                            </div>
                                            <div className='col justify-content-center'>
                                                <button className={css(styles.btnLike)} onClick={(event) => 
                                                    { this.props.onLikeCallback(event); 
                                                      this.updateClassOnLikeOwner(event); 
                                                      this.props.cardResetCallback(event); }}>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        );
    }
}

class Pulser extends Component {
    render() {
        return (
        <div className="test-container">
            <div className="search-anim">
            </div>
            <div className="search-anim2">
            </div>
            <div className="profPic">
            </div>
            <p>No More Puppers in Your Area!</p>
        </div>
        );
    }
}