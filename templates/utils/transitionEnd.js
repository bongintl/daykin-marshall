export default ( el, apply ) => new Promise( resolve => {
    var onEnd = e => {
        if ( e.srcElement === el ) {
            el.removeEventListener( 'transitionend', onEnd );
            resolve();
        }
    }
    el.addEventListener( 'transitionend', onEnd );
    if ( apply ) apply();
})