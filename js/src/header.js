let header = document.querySelector('.js-header');
let previousScroll = 0;

let throttleFn = debounce((isScrollDown) => {
    if(window.scrollY < 80) {
        header.classList.remove("js-header_scrolled");
        return header.classList.remove("js-header_hidden");
    } else {
        header.classList.add("js-header_scrolled");
    }

    if (isScrollDown)
        header.classList.add("js-header_hidden");
    else if (!isScrollDown)
        header.classList.remove("js-header_hidden");
}, 200);


document.addEventListener("scroll", () => {
    let isScrollDown = previousScroll < scrollY;
    throttleFn(isScrollDown);

    previousScroll = scrollY;
});