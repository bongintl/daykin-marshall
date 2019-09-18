import createObserver from '~/utils/observer';
import 'intersection-observer';
import resizeObserver from '~/utils/resizeObserver'

var intersectionObserver = createObserver( IntersectionObserver, { rootMargin: '100% 0% 100% 0%' } );

class LazyImage extends HTMLImageElement {
    connectedCallback () {
        this.onIntersect = this.onIntersect.bind( this );
        this.onResize = this.onResize.bind( this );
        intersectionObserver.observe( this, this.onIntersect );
    }
    disconnectedCallback () {
        intersectionObserver.unobserve( this, this.onIntersect );
        resizeObserver.unobserve( this, this.onResize );
    }
    onResize ( entry ) {
        this.setAttribute( 'sizes', entry.contentRect.width + 'px' );
    }
    onIntersect ( entry ) {
        if ( entry.isIntersecting ) {
            this.setAttribute( 'sizes', this.getBoundingClientRect().width + 'px' );
            this.setAttribute( 'srcset', this.dataset.srcset );
            resizeObserver.observe( this, this.onResize )
        } else {
            resizeObserver.unobserve( this, this.onResize )
        }
    }
}

window.customElements.define( 'lazy-img', LazyImage, { extends: 'img' } );