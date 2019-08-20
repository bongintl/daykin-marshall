
[ ...document.querySelectorAll( '.splash__dot' ) ].forEach( el => {
    el.addEventListener( 'click', () => {
        console.log('test');

        document.body.classList.remove('splash-on');
            
  
    })
});