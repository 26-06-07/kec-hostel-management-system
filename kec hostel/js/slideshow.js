/**
 * KEC HOSTELS - Slideshow Controller
 * Compact, responsive hero slider with automatic sliding, arrows, dots, and pause on hover.
 */

class HostelSlideshow {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.slides = this.container.querySelectorAll(".slide");
    this.dotsContainer = this.container.querySelector(".slideshow-dots");
    this.prevBtn = this.container.querySelector(".slide-prev");
    this.nextBtn = this.container.querySelector(".slide-next");

    this.currentIndex = 0;
    this.intervalTime = options.interval || 5000;
    this.timer = null;
    this.isPlaying = true;

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Build dots
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = "";
      this.slides.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.className = `slide-dot ${idx === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Slide ${idx + 1}`);
        dot.addEventListener("click", () => {
          this.goTo(idx);
          this.resetTimer();
        });
        this.dotsContainer.appendChild(dot);
      });
    }

    // Prev / Next button listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.prev();
        this.resetTimer();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.next();
        this.resetTimer();
      });
    }

    // Pause on hover
    this.container.addEventListener("mouseenter", () => this.pause());
    this.container.addEventListener("mouseleave", () => this.play());

    // Show initial slide
    this.showSlide(this.currentIndex);
    this.play();
  }

  showSlide(index) {
    this.slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === index);
    });

    const dots = this.dotsContainer ? this.dotsContainer.querySelectorAll(".slide-dot") : [];
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });

    this.currentIndex = index;
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  goTo(index) {
    if (index >= 0 && index < this.slides.length) {
      this.showSlide(index);
    }
  }

  play() {
    this.pause();
    this.timer = setInterval(() => {
      this.next();
    }, this.intervalTime);
  }

  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.play();
  }
}
