let myController;
let mySlideScene;
let pageScene;
let detailSlideScene;

function animationSlides() {
  myController = new ScrollMagic.Controller();
  const mySlides = document.querySelectorAll(".slide");
  const myHeader = document.querySelector(".nav-header");

  mySlides.forEach(function (slide, index, allSlides) {
    const revealImage = slide.querySelector(".reveal-img");
    const revealImage_img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    //+ GSAP
    const slidesTl = gsap.timeline({
      defaults: { duration: 0.5, ease: "power2.inOut" }
    });
    slidesTl.fromTo(revealImage, { x: "0%" }, { x: "100%" });
    slidesTl.fromTo(revealImage_img, { scale: 2 }, { scale: 1 }, "-=0.85");
    slidesTl.fromTo(revealText, { x: "0%" }, { x: "130%" }, "-=0.70");

    mySlideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.5,
      reverse: false
    })
      .setTween(slidesTl)
      .addIndicators({
        colorStart: "yellowgreen",
        colorEnd: "white",
        colorTrigger: "white",
        indent: 100,
        name: "mySlide"
      })
      .addTo(myController);

    const pageTimeline = gsap.timeline();
    let nextslide;
    if (allSlides.length - 1 === index) {
      nextslide = "end";
    } else {
      nextslide = allSlides[index + 1];
    }
    pageTimeline.fromTo(nextslide, { y: "0%" }, { y: "50%" });

    pageTimeline.fromTo(
      slide,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0.5 }
    );
    pageTimeline.fromTo(nextslide, { y: "50%" }, { y: "0%" }, "-=0.4");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0
    })
      .addIndicators({
        indent: 300,
        colorStart: "salmon",
        colorTrigger: "green",
        name: "pageScene"
      })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTimeline)
      .addTo(myController);
  });
}
const mouse = document.querySelector(".cursor");
const mouseText = document.querySelector(".cursor-text");
const hamBurger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  let item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("mouse-active");
  } else {
    mouse.classList.remove("mouse-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    mouseText.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}
function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "#263238" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "#263238" });
    gsap.to("#logo", 1, { color: "#263238" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100%-10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100%-10%)" });
    document.body.classList.remove("hide");
  }
}

//+ Barba Page Transitions

const myLogo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animationSlides();
        myLogo.href = "./index.html";
      },
      beforeLeave() {
        mySlideScene.destroy();
        pageScene.destroy();
        myController.destroy();
      }
    },
    {
      namespace: "fashion",
      beforeEnter() {
        myLogo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        detailControlller.destroy();
        detailSlideScene.destroy();
      }
    }
  ],
  transitions: [
    {
      leave(data) {
        let done = this.async();
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" }
        });
        tl.fromTo(data.current.container, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.4"
        );
      },
      enter(data) {
        let done = this.async();
        window.scrollTo(0, 0);
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" }
        });
        tl.fromTo(
          ".swipe",
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(data.next.container, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      }
    }
  ]
});

function detailAnimation() {
  detailControlller = new ScrollMagic.Controller();
  const detailSlides = document.querySelectorAll(".detail-slide");
  detailSlides.forEach(function (slide, index, slides) {
    const detailSLidesTimeline = gsap.timeline({
      defaults: { duration: 1 }
    });
    let nextslide;
    if (slides.length - 1 === index) {
      nextslide = "end";
    } else {
      nextslide = slides[index + 1];
    }
    let nextImg = nextslide.querySelector("img");
    detailSLidesTimeline.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    detailSLidesTimeline.fromTo(
      nextslide,
      { opacity: 0 },
      { opacity: 1 },
      "-=1"
    );
    detailSlideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(detailSLidesTimeline)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "detailAnimationScene"
      })
      .addTo(detailControlller);
  });
}

hamBurger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mousemove", activeCursor);
