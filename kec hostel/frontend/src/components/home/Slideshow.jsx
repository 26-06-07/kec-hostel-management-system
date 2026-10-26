import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: '/assets/slide-campus-life.jpg',
    tag: 'RESIDENTIAL CAMPUS EXCELLENCE',
    title: 'A Home Away From Home',
    desc: 'Safe, hygienic, and disciplined residential living fostering academic excellence at Kongu Engineering College.',
    primaryBtn: { text: 'Explore Hostels', target: 'our-hostels' },
    secondaryBtn: { text: 'Student Login', action: 'login' }
  },
  {
    image: '/assets/slide-dining-mess.jpg',
    tag: 'VIBRANT CAMPUS ENVIRONMENT',
    title: 'Serene & Disciplined Residential Living',
    desc: 'Well-ventilated hostel blocks, lush green landscape, and secure 24/7 campus facilities at KEC.',
    primaryBtn: { text: 'Explore Hostels', target: 'our-hostels' },
    secondaryBtn: { text: 'Access Portal', action: 'login' }
  }
];

export default function Slideshow({ onOpenAuthModal, onOpenInfoModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAction = (btn) => {
    if (btn.target) {
      const el = document.getElementById(btn.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (btn.action === 'login' || btn.action === 'signin') {
      onOpenAuthModal('login');
    } else if (btn.action === 'mess') {
      onOpenInfoModal('mess');
    }
  };

  return (
    <section className="slideshow-section">
      <div className="slideshow-container">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`slide ${idx === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="slide-img"
            />
            <div className="slide-overlay">
              <div className="slide-content">
                <span className="slide-badge">{slide.tag}</span>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.desc}</p>
                <div className="slide-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAction(slide.primaryBtn)}
                  >
                    {slide.primaryBtn.text}
                  </button>
                  <button
                    className="btn btn-outline-white"
                    onClick={() => handleAction(slide.secondaryBtn)}
                  >
                    {slide.secondaryBtn.text}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next Arrows */}
        <button
          className="slide-nav slide-prev"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          &#10094;
        </button>
        <button
          className="slide-nav slide-next"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          &#10095;
        </button>

        {/* Indicator Dots */}
        <div className="slideshow-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slide-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
