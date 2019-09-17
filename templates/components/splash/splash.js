[ ...document.querySelectorAll( '.splash__heading, .splash__video' ) ].forEach( el => {
    el.addEventListener( 'click', () => {
        console.log('test');

        document.body.classList.remove('splash-on');
            
  
    })
});