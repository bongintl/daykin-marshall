import * as opentype from 'opentype.js'
import computeLayout from 'opentype-layout'
import { promisify } from 'es6-promisify';
import resizeObserver from '~/utils/resizeObserver';
import loadImage from '~/utils/loadImage';

var fontURL = '/static/fonts/MonumentGrotesk-Medium.otf';
var loadFont = promisify( opentype.load );
var font;

var getLetterURL = ( code, darkness = 5 ) => `/static/bevel/${ darkness }/${ code }.png`;

class EngravedText extends HTMLElement {
    constructor () {
        super();
        this.render();
        this.darkness = this.getAttribute('darkness') || 5;
    }
    async render () {
        if ( !font ) font = await loadFont( fontURL );
        var scale = 1 / font.unitsPerEm;
        var glyphs = font.stringToGlyphs( this.innerText );
        var words = glyphs.reduce( ( words, glyph ) => {
            words[ words.length - 1 ].push( glyph );
            if ( glyph.name === 'space' ) {
                words.push( [] )
            }
            return words;
        }, [ [] ] );
        var children = await Promise.all( words.map( word => {
            return this.createWord( word, scale );
        }))
        this.innerText = '';
        children.forEach( c => this.appendChild( c ) );
    }
    createSpace ( space, scale ) {
        var el = document.createElement( 'span' );
        el.classList.add('space');
        el.style.width = space.advanceWidth * scale + 'em';
        return el;
    }
    async createWord ( chars, scale ) {
        var word = document.createElement( 'span' );
        word.classList.add('word');
        var letters = ( await Promise.all( chars.map(
            async char => ({ char, el: await this.createLetter( char ) })
        ))).filter( l => l.el !== null )
        letters.forEach( ({ char, el }, i ) => {
            var next = i === letters.length - 1 ? null : letters[ i + 1 ].char;
            Object.assign( el.style, this.getStyle( char, next, scale ) );
            word.appendChild( el );
        })
        return word;
    }
    async createLetter ( letter ) {
        if ( letter.name === 'space' ) return document.createElement('span');
        var el = null;
        try {
            el = await loadImage( getLetterURL( letter.unicode, this.darkness ) );
        } catch ( e ) {}
        return el;
    }
    getStyle ( letter, next, scale ) {
        var box = letter.getBoundingBox();
        var w = ( box.x2 - box.x1 );
        var h = ( box.y2 - box.y1 );
        var y = box.y2 - h;
        var kerning = next === null ? 0 : font.getKerningValue( letter, next );
        var advance = letter.advanceWidth + kerning;
        return {
            width: w * scale + 'em',
            height: h * scale + 'em',
            marginLeft: box.x1 * scale + 'em',
            marginRight: ( advance - w - box.x1 ) * scale + 'em',
            marginBottom: box.y1 * scale + 'em'
        }
    }
    // createLetter( letter, next, scale ) {
    //     var img = new Image();
    //     Object.assign( img.style, this.getStyle( letter, next, scale ) );
    //     img.src = getLetterURL( letter.unicode );
    //     img.dataset.letter = letter.name
    //     return img;
    // }
}

window.customElements.define( 'dms-engraved', EngravedText )