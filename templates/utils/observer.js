import Map from 'es6-map';

export default ( Observer, options ) => {
    var observer = new Observer( entries => entries.forEach( handle ), options )
    var callbacks = new Map();
    var handle = entry => {
        var cbs = callbacks.get( entry.target );
        if ( cbs ) cbs.forEach( cb => cb( entry ) );
    }
    var observe = ( el, cb ) => {
        if ( callbacks.has( el ) ) {
            callbacks.set( el, [ ...callbacks.get( el ), cb ] );
        } else {
            callbacks.set( el, [ cb ] );
            observer.observe( el );
        }
    }
    var unobserve = ( el, cb ) => {
        var cbs = callbacks.get( el );
        if ( cbs ) {
            cbs = cbs.filter( x => x !== cb );
            if ( cbs.length ) {
                callbacks.set( el, cbs );
            } else {
                callbacks.delete( el );
                observer.unobserve( el );
            }
        }
    }
    return { observe, unobserve };
}