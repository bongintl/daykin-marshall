import * as opentype from 'opentype.js'
import computeLayout from 'opentype-layout'
import { promisify } from 'es6-promisify';
import resizeObserver from '~/utils/resizeObserver';

var fontURL = '/static/fonts/MonumentGroteskTrial-Medium.otf';
var loadFont = promisify( opentype.load );
var font;

var getLetterURL = code => `/static/normal/${ code }.png`;

class EngravedText extends HTMLElement {
    constructor () {
        super();
        this.render();
        // this.characters = [];
        this.words = [];
        // this.render = this.render.bind( this );
    }
    async connectedCallback () {
        // if ( !font ) font = await loadFont( fontURL );
        // this.canvas = document.createElement( 'canvas' );
        // this.ctx = this.canvas.getContext('2d');
        // this.appendChild( this.canvas );
        // this.render();
        // resizeObserver.observe( this, this.render );
    }
    async render () {
        if ( !font ) font = await loadFont( fontURL );
        // font.getPath( this.innerText)
        font.forEachGlyph( this.innerText, 0, 0, 1, undefined, ( glyph, x, y ) => {
            console.log( y );
        })
        // this.characters.forEach( c => this.removeChild( c ) );
        var style = window.getComputedStyle( this );
        // var { width } = this.getBoundingClientRect();
        var fontSize = parseFloat( style.fontSize );
        // console.log( fontSize )
        var scale = 1 / font.unitsPerEm;
        var parseValue = ( value, scale ) => {
            var f = parseFloat( value );
            if ( isNaN( f ) ) return undefined;
            return f * scale;
        }
        var layout = computeLayout( font, this.innerText, {
            // width: width / scale,
            lineHeight: 1.25 * font.unitsPerEm,
            letterSpacing: parseValue( style.letterSpacing, 1 / scale ),
            align: style.textAlign
        });
        // var glyphs = layout.glyphs.map( ({ position, index, data }) => {
        //     var box = data.getBoundingBox();
        //     var w = ( box.x2 - box.x1 );
        //     var h = ( box.y2 - box.y1 );
        //     var x = ( position[ 0 ] + box.x1 );
        //     var y = ( -( position[ 1 ] + box.y1 ) - h );
        //     return { position, index, x: x * scale, y: y * scale, w: w * scale, h: h * scale, data };
        // })
        var glyphs = font.stringToGlyphs( this.innerText );
        console.log( glyphs )
        var words = glyphs.reduce( ( words, glyph ) => {
            words[ words.length - 1 ].push( glyph );
            if ( glyph.name === 'space' ) {
                words.push( [] )
            }
            return words;
        }, [ [] ] );
        var children = words.map( word => {
            // if ( word.length === 1 && word[ 0 ].name === 'space' ) {
                // return this.createSpace( word[ 0 ], scale );
            // } else {
                return this.createWord( word, scale );
            // }
        })
        this.innerText = '';
        children.forEach( c => this.appendChild( c ) );
        
        // this.characters = layout.glyphs.map( glyph => {
        //     var el = document.createElement('div');
        //     var box = glyph.data.getBoundingBox();
        //     var w = ( box.x2 - box.x1 );
        //     var h = ( box.y2 - box.y1 );
        //     var x = ( glyph.position[ 0 ] + box.x1 );
        //     var y = ( -( glyph.position[ 1 ] + box.y1 ) - h );
        //     Object.assign( el.style, {
        //         position: 'absolute',
        //         border: '1px solid blue',
        //         width: w * scale + 'px',
        //         height: h * scale + 'px',
        //         left: x * scale + 'px',
        //         top: y * scale + 'px',
        //         fontSize: '1rem',
        //         color: 'red'
        //     })
        //     el.innerText = glyph.data.name;
        //     return el;
        // })
        // this.characters.forEach( c => this.appendChild( c ) );
        // await loadMaps( layout );
        // canvas.width = layout.width * scale * window.devicePixelRatio;
        // canvas.height = layout.height * scale * window.devicePixelRatio;
        // ctx.save();
        // ctx.scale( window.devicePixelRatio, window.devicePixelRatio );
        // ctx.scale( scale, -scale );
        // for ( var glyph of layout.glyphs ) {
        //     if ( !( glyph.data.unicode in maps ) ) continue;
        //     var box = glyph.data.getBoundingBox();
        //     var x = glyph.position[ 0 ] + box.x1;
        //     var y = glyph.position[ 1 ] + box.y1;
        //     var map = maps[ glyph.data.unicode ];
        //     var w = box.x2 - box.x1;
        //     var h = box.y2 - box.y1;
        //     ctx.drawImage( map, x, y, w, h );
        // }
        // ctx.restore();
        // return canvas;
    }
    createSpace ( space, scale ) {
        var el = document.createElement( 'span' );
        el.classList.add('space');
        el.style.width = space.advanceWidth * scale + 'em';
        return el;
    }
    createWord ( letters, scale ) {
        // console.log( letters );
        var el = document.createElement( 'span' );
        el.classList.add('word');
        letters.forEach( ( letter, i ) => {
            var next = i === letters.length - 1 ? null : letters[ i + 1 ];
            el.appendChild( this.createLetter( letter, next, scale ) );
        })
        return el;
    }
    createLetter( letter, next, scale ) {
        // console.log( letter );
        var img = new Image();
        var box = letter.getBoundingBox();
        var w = ( box.x2 - box.x1 );
        var h = ( box.y2 - box.y1 );
        var y = box.y2 - h;
        var kerning = next === null ? 0 : font.getKerningValue( letter, next );
        var advance = letter.advanceWidth + kerning;
        Object.assign( img.style, {
            width: w * scale + 'em',
            height: h * scale + 'em',
            marginLeft: box.x1 * scale + 'em',
            marginRight: ( advance - w - box.x1 ) * scale + 'em',
            marginBottom: box.y1 * scale + 'em'
        })
        // img.style.width = 
        // img.style.height = h + 'em';
        img.src = getLetterURL( letter.unicode );
        img.dataset.letter = letter.name
        return img;
    }
}

window.customElements.define( 'dms-engraved', EngravedText )