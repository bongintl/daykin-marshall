// import Glide from '@glidejs/glide'
// import { SpringSystem } from 'rebound';

// var springSystem = new SpringSystem();

var wrap = ( x, limit ) => {
    while ( x > limit ) x -= limit;
    while ( x < 0 ) x += limit;
    return x;
}

class Slider extends HTMLElement {
    connectedCallback () {
        this.slideContainer = this.querySelector('[slides]');
        this.slides = [ ...this.slideContainer.querySelectorAll( '[slide]' ) ];
        // var clone = slides[ 0 ].cloneNode( true );
        // this.slideContainer.appendChild( clone );
        // this.slides = [ ...slides, clone ];
        
        this.curr = 0;
        // this.spring = springSystem.createSpring( 100, 15 );
        // this.spring.addListener({
        //     onSpringUpdate: spring => this.render( spring.getCurrentValue() )
        // })
        [ ...this.querySelectorAll( '[slider-next]' ) ].forEach( next => {
            next.addEventListener('click', this.next.bind( this ) );
        });
        [ ...this.querySelectorAll( '[slider-prev]' ) ].forEach( prev => {
            prev.addEventListener('click', this.prev.bind( this ) );
        })
        this.render();
    }
    go ( i ) {
        this.curr = wrap( i, this.slides.length - 1 );
        this.render();
    }
    prev () {
        this.go( this.curr - 1 );
    }
    next () {
        this.go( this.curr + 1 );
    }
    // prev () {
    //     this.curr = this.curr === 0
    //         ? this.slides.length - 1
    //         : this.curr - 1;
    //     this.render();
    // }
    render () {
        this.slides.forEach( ( slide, i ) => {
            slide.toggleAttribute( 'active', i % this.slides.length === this.curr )
            slide.style.transform = `translateX(${ i * 100 }%)`
        });
        this.slideContainer.style.transform = `translateX( ${ this.curr * -100 }% )`
        // this.slides.forEach( ( slide, i ) => {
        //     var slideOffset = i - ( offset % ( this.slides.length - 1 ) )
        //     slide.style.transform = `translateX( ${ slideOffset * 100 }% )`;
        // })
    }
}

window.customElements.define( 'dms-slider', Slider );