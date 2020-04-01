export const triggerClassByScroll = function(options) {
    if (!options.element) {
        console.error('triggerClassByScroll: No element set');
    }

    let class_to_trigger = options.class_to_trigger,
        scroll = options.scroll || 0,
        element = options.element,
        fix_position = options.fix_position != undefined ? options.fix_position : true;

    const scrollHandler = function () {
        if(window.scrollY >= scroll && !element.classList.contains(class_to_trigger)) {
            element.classList.add(class_to_trigger);
            if(fix_position) {
                element.style.top = `-${scroll}px`;
            }
        }
        else if(window.scrollY < scroll && element.classList.contains(class_to_trigger)) {
            element.classList.remove(class_to_trigger);
            if(fix_position) {
                element.style.top = 'auto';
            }
        }
    };

    window.addEventListener('scroll', () => {
        scrollHandler();
    });

    scrollHandler();

    return this;
}
