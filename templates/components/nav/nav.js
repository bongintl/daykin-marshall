[ ...document.querySelectorAll( '.nav__dot' ) ].forEach( el => {
    el.addEventListener( 'click', () => {
        document.body.classList.toggle('nav-open');
    })
});