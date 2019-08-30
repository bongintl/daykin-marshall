[ ...document.querySelectorAll( '.nav__dot, .nav__bg' ) ].forEach( el => {
    el.addEventListener( 'click', () => {
        document.body.classList.toggle('nav-open');
    })
});

[ ...document.querySelectorAll( '.nav a' ) ].forEach( el => {
    el.addEventListener( 'click', e => {
        if (
            el.target !== 'blank' &&
            !el.href.startsWith('mailto:') &&
            !el.href.startsWith('tel:')
        ) {
            e.preventDefault();
            document.body.classList.remove('nav-open');
        }
    })
});