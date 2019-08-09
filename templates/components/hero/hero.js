import resizeObserver from '~/utils/resizeObserver'

class Hero extends HTMLElement {
    constructor () {
        super()
        this.onResize = this.onResize.bind( this );
    }
    connectedCallback () {
        this.text = this.querySelector('[hero-text]');
        this.spacer = this.querySelector('[hero-spacer]');
        resizeObserver.observe( this.text, this.onResize );
    }
    disconnectedCallback () {
        resizeObserver.unobserve( this.text, this.onResize );
    }
    onResize ( e ) {
        this.spacer.style.height = e.contentRect.height + 'px';
        // this.style.paddingBottom = e.contentRect.height + 'px';
    }
}

window.customElements.define( 'dms-hero', Hero );