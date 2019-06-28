export default src => new Promise( ( resolve, reject ) => {
    var img = new Image();
    img.onload = () => resolve( img );
    img.onerror = () => reject( img );
    img.src = src;
})