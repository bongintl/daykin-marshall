// var instances = [];
// var instances = url => {
//     links.forEach( l => l.update( url ) )
// }

class Hover extends HTMLElement {
    connectedCallback () {
        Hover.instances.push( this );
        if ( !this.hasAttribute('no-send') ) {
            this.addEventListener( 'mouseenter', () => Hover.onHover( this.getAttribute('url') ) );
            this.addEventListener( 'mouseleave', () => Hover.onHover( null ) );
        }
        this.update();
    }
    disconnectedCallback () {
        Hover.instances = Hover.instances.filter( el => el !== this );
    }
    matches ( url ) {
        return this.getAttribute('url').split(',').some( u => u === url );
    }
    update ( hovered = null ) {
        this.toggleAttribute( 'matches-route', hovered === null && this.matches( location.href ) );
        var matchesHover = this.matches( hovered );
        this.toggleAttribute( 'matches-hover', matchesHover );
        this.toggleAttribute( 'unmatches-hover', hovered !== null && !matchesHover );
    }
}

Hover.instances = [];
Hover.onHover = url => Hover.instances.forEach( el => el.update( url ) );

window.customElements.define( 'dms-hover', Hover );