import React, { Component } from 'react';
import './App.css';
import { UncontrolledCarousel, CarouselItem } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite';


// const likeAnimation = {
//     'from': { transform: 'rotate(10deg)', opacity: 1, left: '0px', top: '0px' },
//     'to': { transform: 'rotate(65deg)', opacity: 0, left: '200px', top: '300px' }
// };

// const nopeAnimation = {
//     'from': { transform: 'rotate(-10deg)', opacity: 1, right: '0px', top: '0px' },
//     'to': { transform: 'rotate(-65deg)', opacity: 0, right: '200px', top: '300px' },
// };

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
    // cardNope: {
    //    animationName: nopeAnimation,
    //     animationDuration: '1s',
    // },
    // cardLike: {
    //     animationName: likeAnimation,
    //     animationDuration: '1s',
    // }
}
)

export default class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    componentDidMount() {
        this.setState({loading: false}); // PLACEHOLDER FOR NOW
    }

    updateClassOnLike(event) {
        let card = document.querySelector(".profileCard");
        card.className += ' profileLikeAnimate';
        setTimeout(() => {
            card.className = 'card profileCard'; }, 1000);
    }

    updateClassOnNope(event) {
        let card = document.querySelector(".profileCard");
        card.className += ' profileNopeAnimate';
        setTimeout(() => {
            card.className = 'card profileCard'; }, 1000);
    }

    render() {
        //TO-DO:
        // Grab current dog object (or current profile) from firebase
        // If empty (no object), display "No More Users in Area" message
        // Create carousal pictures
        let dogObj = this.props.dog;
        let carouselItems = dogObj.images.map(function (img) {
            let obj = { src: '../' + img, altText: dogObj.name, caption: '' };
            return obj;
        })

        // if (this.props.liked) {
        //     this.updateClassOnLike();
        // }

        // let cardAnimation = css(
        //     this.props.liked && styles.cardLike,
        //     this.props.disliked && styles.cardNope
        // );
        return (
            <div className="d-flex justify-content-center">
                { this.state.loading ?  <div>Loading...</div> : //UPDATE LOADING TO INCLUDE LOGO + ANIMATIONS
                <div className={"card profileCard "/* + cardAnimation*/}>
                    <UncontrolledCarousel
                        items={carouselItems}
                        indicators={true}
                        controls={true}
                        autoPlay={false}>
                        <CarouselItem cssModule={{width: '100%'}}/>
                    </UncontrolledCarousel>
                    <div className="card-body">
                        <h3 className="card-title name">{dogObj.name + ', ' + dogObj.age}</h3>
                        <p className="card-text breed">{dogObj.sex + ', ' + dogObj.breed}</p>
                        <p className='card-text bio'>{dogObj.bio}</p>
                        <div className='row'>
                            <div className='col justify-content-center'> 
                                <button className={css(styles.btnLike, styles.btnNope)} onClick={(event) => 
                                    {this.props.onNopeCallback(event); this.updateClassOnNope(event); this.props.cardResetCallback(event);}}>
                                </button>
                            </div>
                            <div className='col justify-content-center'>
                                <button className={css(styles.btnLike, styles.btnOwner)}></button>
                            </div>
                            <div className='col justify-content-center'>
                                <button className={css(styles.btnLike)} onClick={(event) => 
                                    {this.props.onLikeCallback(event); this.updateClassOnLike(event); this.props.cardResetCallback(event);}}>
                                </button>
                            </div>
                        </div>
                    </div>
                </div> }
            </div>
        );
    }
}