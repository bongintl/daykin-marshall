import sleep from '~/utils/sleep';

export default class Divider extends HTMLElement {
    setOffset ( offset ) {
        var prev = this.getAttribute('offset')
        this.setAttribute( 'offset', offset );
        if ( prev !== offset ) return sleep( 400 );
    }
}

window.customElements.define( 'dms-divider', Divider )