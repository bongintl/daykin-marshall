class Slider extends HTMLElement {
    connectedCallback () {
        this.slides = [ ...this.querySelectorAll( '[slide]' ) ];
        this.curr = 0;
        [ ...this.querySelectorAll( '[slider-prev]' ) ].forEach( prev => {
            prev.addEventListener( 'click', this.prev.bind( this ) );
        });
        [ ...this.querySelectorAll( '[slider-next]' ) ].forEach( next => {
            next.addEventListener( 'click', this.next.bind( this ) );
        })
        this.render();
    }
    next () {
        this.curr = this.curr === this.slides.length - 1
            ? 0
            : this.curr + 1;
        this.render();
    }
    prev () {
        this.curr = this.curr === 0
            ? this.slides.length - 1
            : this.curr - 1;
        this.render();
    }
    render () {
        this.slides.forEach( ( slide, i ) => {
            slide.toggleAttribute( 'active', i === this.curr );
        })
    }
}

window.customElements.define( 'dms-slider', Slider );