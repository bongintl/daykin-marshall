// import Glide from '@glidejs/glide'
// import { SpringSystem } from 'rebound';

// var springSystem = new SpringSystem();

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
        this.querySelector('[slider-next]').addEventListener('click', this.next.bind( this ) );
        this.render();
    }
    next () {
        this.curr = ( this.curr + 1 ) % this.slides.length;
        this.render();
        // this.spring.setEndValue( ++this.curr )
        // this.render();
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