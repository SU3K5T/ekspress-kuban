let header = document.querySelector('.js-header');
let previousScroll = 0;

let throttleFn = throttle((isScrollDown) => {
if(window.scrollY < 80)
    return header.classList.remove("js-header_hidden");

if (isScrollDown)
    header.classList.add("js-header_hidden");
else if (!isScrollDown)
    header.classList.remove("js-header_hidden");
}, 500);


document.addEventListener("scroll", () => {
    let isScrollDown = previousScroll < scrollY;
    throttleFn(isScrollDown);

    previousScroll = scrollY;
});