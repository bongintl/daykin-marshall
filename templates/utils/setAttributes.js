export default ( el, attrs ) => {
    for ( var [ attr, value ] of Object.entries( attrs ) ) {
        if ( value === true ) {
            el.setAttribute( attr, '' );
        } else if ( value === undefined || value === null || value === false ) {
            el.removeAttribute( attr )
        } else {
            el.setAttribute( attr, value );
        }
    }
}