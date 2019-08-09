import Navigo from 'navigo';

import Panel from './panel';

import groupBy from 'lodash/groupBy';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import sleep from '~/utils/sleep';
import findParent from '~/utils/findParent';
import breakpoints from '~/utils/breakpoints';
import setAttributes from '~/utils/setAttributes';

var base = document.querySelector('base').href;

var parser = new DOMParser();
var getPanels = el => {
    var left = el.querySelector( 'dms-panel[side=left]' )
    var rightCollapsed = el.querySelector( 'dms-panel[side=right][state=collapsed]' )
    var rightExpanded = el.querySelector( 'dms-panel[side=right][state=expanded]' )
    console.log({ left, rightCollapsed, rightExpanded })
    // var [ left, rightCollapsed, rightExpanded ] = el.querySelectorAll( 'dms-panel' );
    return { left, rightCollapsed, rightExpanded }
}
var getError = doc => {
    var left = document.createElement('dms-panel');
    return {
        left,
        rightCollapsed: document.createElement('dms-panel'),
        rightExpanded: document.createElement('dms-panel')
    }
}
var loadPanels = async url => {
    var res = await fetch( url );
    var html = await res.text();
    console.log(res);
    var doc = parser.parseFromString( html, 'text/html' );
    return res.status === 200 ? getPanels( doc ) : getError( doc );
}

class Panels extends HTMLElement {
    
    constructor () {
        super();
        // this.mode = window.location.href === base ? 'two' : 'one';
        this.focus = 'left';
        this.panels = [ null, null ];
    }
    
    connectedCallback () {
        this.addEventListener( 'click', this.onClick.bind( this ) );
        this.templates = getPanels( this );
        [ ...this.children ].forEach( el => this.removeChild( el ) );
        this.divider = document.createElement('dms-divider');
        this.appendChild( this.divider );
        this.render();
        this.router = new Navigo( base );   
        this.router.on({
            '*': () => this.navigate( location.href )
        })
        // breakpoints.addChangeListener( () => this.render() )
    }
    
    async onClick ( e ) {
        var a = findParent( e.target, el => el.tagName === 'A' && el.href );
        var panel = findParent( e.target, el => el instanceof Panel );
        var side = panel ? panel.getAttribute( 'side' ) : this.focus;
        if ( a && a.href && a.href.startsWith( base ) && !a.target ) {
            e.preventDefault();
            if ( a.href === location.href ) return;
            this.focus = side;
            this.router.navigate( a.href, true );
        } else if ( this.focus !== side ) {
            e.preventDefault();
            this.render( side );
        }
    }
    
    async navigate ( url, side = this.focus ) {
        this.templates = await loadPanels( url );
        // this.setAttribute( 'hide-images', '' )
        // await sleep( 200 );
        await this.render( side );
        // this.removeAttribute('hide-images')
    }
    
    render ( focus = this.focus ) {
        var { left, rightCollapsed, rightExpanded } = this.templates;
        var isSmall = breakpoints.atMost('s');
        var hasRight = Boolean( rightCollapsed && rightExpanded );
        if ( focus === 'right' && !hasRight ) throw Error('Cant change to right side it dont exist')
        this.focus = focus;
        if ( !hasRight ) {
            return this.transition([{
                page: left,
                attrs: {
                    width: 'full',
                    offset: undefined,
                    inactive: false
                }
            },{
                page: document.createElement('dms-panel'),
                attrs: {
                    width: 'small',
                    offset: 'full',
                    inactive: true
                }
            }])
        } else {
            switch ( focus ) {
                case 'left':
                    return this.transition([{
                        page: left,
                        attrs: {
                            width: 'large',
                            offset: undefined,
                            inactive: false
                        }
                    },{
                        page: rightCollapsed,
                        attrs: {
                            offset: 'large',
                            width: 'small',
                            inactive: true
                        }
                    }])
                case 'right':
                    return this.transition([{
                        page: left,
                        attrs: {
                            width: 'large',
                            offset: isSmall ? 'off-left-large' : 'off-left-half',
                            inactive: true
                        }
                    },{
                        page: rightExpanded,
                        attrs: {
                            offset: isSmall ? 'small' : 'half',
                            width: isSmall ? 'large' : 'half',
                            inactive: false
                        }
                    }])
            }
        }
    }
    
    transition ( nextPanels ) {
        var currPanels = this.panels;
        this.panels = nextPanels.map( p => p.page );
        return this.transitionPanels( zip( currPanels, nextPanels ) )
    }
    
    async transitionPanels ( panels ) {
        panels.forEach( ([ curr, next ]) => {
            if ( curr !== null ) curr.setAttribute( 'inactive', true );
            if ( curr !== next.page ) {
                setAttributes( next.page, { ...next.attrs, hidden: true, inactive: true });
                this.appendChild( next.page )
            }
        })
        var transitionElements = flatten( panels.map( ([ curr, next ]) => {
            if ( curr === null || curr === next.page ) return [];
            return this.createTransitionElements( curr, next.page );
        })).filter( el => el !== null )
        transitionElements.forEach( el => this.appendChild( el ) );
        await Promise.all( panels.map( async ([ curr, next ]) => {
            if ( curr !== next.page && curr !== null ) {
                return this.detach( curr );
            }
        }))
        await Promise.all([
            this.divider.setOffset( panels[ 1 ][ 1 ].attrs.offset ),
            ...transitionElements.map( el => el.transition() ),
            ...panels.map( ([ curr, next ]) => {
                if ( curr === next.page ) {
                    setAttributes( curr, next.attrs );
                    return sleep( 400 );
                }
            })
        ])
        await Promise.all( panels.map( ([ curr, next ]) => {
            if ( curr !== next.page ) {
                next.page.removeAttribute('hidden');
                return sleep( 400 )
            }
        }))
        transitionElements.forEach( el => this.removeChild( el ) );
        panels.forEach( ([ curr, next ]) => {
            next.page.toggleAttribute( 'inactive', next.attrs.inactive );
        })
    }
    
    async detach ( page ) {
        page.setAttribute( 'hidden', true );
        await sleep( 400 );
        this.removeChild( page );
    }
    
    createTransitionElements ( currPage, nextPage ) {
        var elements = [
            ...currPage.querySelectorAll('[data-transition-id]'),
            ...nextPage.querySelectorAll('[data-transition-id]')
        ]
        .map( el => ({ el, rect: el.getBoundingClientRect() }))
        return Object.values( groupBy( elements, ({ el }) => el.dataset.transitionId ) )
            .filter( group => group.length === 2 )
            .filter( els => els.some( ({ rect: { top, left, bottom, right } }) => (
                bottom > 0 &&
                right > 0 &&
                left < window.innerWidth &&
                top < window.innerHeight
            )))
            .filter( ([ from, to ]) => Math.abs( from.rect.top - to.rect.top ) < window.innerHeight * 2 )
            .map( ([ from, to ]) => {
                var el = document.createElement('dms-transition-element');
                el.setTransition( from.rect, to.rect );
                el.appendChild( from.el.cloneNode( true ) );
                return el;
            })
    }
}

window.customElements.define( 'dms-panels', Panels )