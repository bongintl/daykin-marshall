// import transitionEnd from '~/utils/transitionEnd';
import sleep from '~/utils/sleep';

var isOnScreen = ({ top, left, bottom, right }) => (
    bottom > 0 &&
    right > 0 &&
    left < window.innerWidth &&
    top < window.innerHeight
)

var isSame = ( rect1, rect2 ) => (
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.x === rect2.x &&
    rect1.y === rect2.y
)

export default class TransitionElement extends HTMLElement {
    setTransition ( from, to ) {
        Object.assign( this.style, {
            width: from.width + 'px',
            height: from.height + 'px',
            transform: `translate(${ from.x }px, ${ from.y }px)`
        })
        var scale = [ to.width / from.width, to.height / from.height ];
        this.to = `translate(${ to.x }px, ${ to.y }px) scale( ${ scale[ 0 ] }, ${ scale[ 1 ] } )`
        this.duration = isSame( from, to ) ? 0 : 400;
    }
    transition () {
        this.style.transform = this.to;
        return sleep( this.duration );
    }
}

window.customElements.define( 'dms-transition-element', TransitionElement );