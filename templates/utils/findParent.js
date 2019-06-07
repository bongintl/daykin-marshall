var findParent = ( el, fn ) => {
    if ( fn( el ) ) return el;
    if ( !el.parentNode || el.parentNode === document ) return false;
    return findParent( el.parentNode, fn );
}

export default findParent;