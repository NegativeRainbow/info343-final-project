import React, { Component } from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite';

const likeAnimation = {
    'from': {transform: 'rotate(10deg)', opacity: 1 },
    'to': { transform: 'rotate(65deg)', opacity: 0 },
  };
  
const nopeAnimation = {
    'from': {transform: 'rotate(-10deg)', opacity: 1 },
    'to': {transform: 'rotate(-65deg)', opacity: 0 },
  };

const styles = StyleSheet.create({
    btnLike: {
        fontSize: 24,
        color: 'white',
        backgroundColor: '#3cb371',
        borderRadius: '100%',
        border: 'transparent',
        width: 56,
        height: 56,
        display: 'inline-block',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        ':active': {
            boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 30px, rgba(0, 0, 0, 0.23) 0px 6px 10px'
        },
        outline: 0
    },
    btnNope: {
        color: 'white',
        backgroundColor: '#ff0000'

    },
    cardNope: {
        animationName: nopeAnimation,
        animationDuration: '1s',
    },
    cardLike: {
        animationName: likeAnimation,
        animationDuration: '1s',
    },
    cardStandard: {
        height: '475px'
    }
}
)

export default class Card extends Component {

    constructor(props) {
        super(props);
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

        let cardAnimation = css(
            styles.cardStandard,
            this.props.liked && styles.cardLike,
            this.props.disliked && styles.cardNope
        );
        return (
            <div className='d-flex justify-content-center'>
                <div className={"card " + cardAnimation}>
                    <div className="card-body">
                        <div className="container">
                            <UncontrolledCarousel
                                items={carouselItems}
                                indicators={false}
                                controls={true} />
                        </div>
                        <h3 className="card-title">{dogObj.name}</h3>
                        <p className="card-text">{dogObj.sex + ' ' + dogObj.breed}</p>
                        <p className='card-text'>{dogObj.bio}</p>
                        <div className='row'>
                            <div className='col text-left'>
                                <button className={css(styles.btnLike, styles.btnNope)} onClick={(event) => this.props.onNopeCallback(event)}>X</button>
                            </div>
                            <div className='col text-right'>
                                <button className={css(styles.btnLike)} onClick={(event) => this.props.onLikeCallback(event)}>{'<3'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}