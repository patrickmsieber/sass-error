class Navigation {
    /*
        options: {
            target: Navigation Wrapper, required
        }
    */
    constructor(options) {
        this.options = options || {}
        this.navbar_container = options.target;
        this.navbar_toggler = this.navbar_container.querySelector('.navbar-toggler');
        
        this.navbar_toggler_click_handler = this.navbar_toggler_click_handler.bind(this);
        
        this.init();
    }
    
    init() {
        this.navbar_toggler.addEventListener('click', this.navbar_toggler_click_handler);
    }
    
    navbar_toggler_click_handler(event) {
        event.preventDefault();
        this.navbar_container.classList.toggle('collapsed');
        document.getElementsByTagName('body')[0].classList.toggle('menuIsVisible');
    }
}

export default Navigation;