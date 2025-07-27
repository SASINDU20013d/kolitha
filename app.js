// Mobile-First Photography Portfolio JavaScript - Enhanced

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeroSlideshow();
    initPortfolioFilters();
    initLightbox();
    initTestimonials();
    initContactForm();
    initSmoothScrolling();
    initTouchGestures();
    initScrollAnimations();
    initHeaderScroll();
});

// Mobile Menu Functionality - Enhanced
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = menuToggle.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    function openMenu() {
        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
    }
    
    function closeMenu() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
    }
    
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    }
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            closeMenu();
        }
    });
}

// Hero Slideshow with Enhanced Touch Support
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    const slideshow = document.querySelector('.hero-slideshow');
    
    let currentSlide = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let autoSlideTimer;
    let isTransitioning = false;
    
    if (!slides.length) return;
    
    // Preload images for smoother transitions
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
    
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }
    
    function showSlide(n) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
        
        // Reset transitioning flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Button controls
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Indicator controls
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Enhanced touch gestures
    if (slideshow) {
        slideshow.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            stopAutoSlide();
        }, { passive: true });
        
        slideshow.addEventListener('touchmove', function(e) {
            // Prevent default only for horizontal swipes
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = Math.abs(touchX - touchStartX);
            const deltaY = Math.abs(touchY - touchStartY);
            
            if (deltaX > deltaY) {
                e.preventDefault();
            }
        }, { passive: false });
        
        slideshow.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchStartY - touchEndY);
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Initialize
    showSlide(0);
    startAutoSlide();
    
    // Pause auto-slide on hover (desktop only)
    if (slideshow && !isTouchDevice()) {
        slideshow.addEventListener('mouseenter', stopAutoSlide);
        slideshow.addEventListener('mouseleave', startAutoSlide);
    }
}

// Portfolio Filtering - Enhanced
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterButtons.length || !portfolioItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items with smooth animation
            portfolioItems.forEach((item, index) => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    
                    // Stagger animation for better visual effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Enhanced Lightbox Functionality
function initLightbox() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (!lightbox || !lightboxImg) return;
    
    let currentImages = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    function getVisibleImages() {
        return Array.from(portfolioItems)
            .filter(item => window.getComputedStyle(item).display !== 'none')
            .map(item => ({
                src: item.querySelector('img').src,
                alt: item.querySelector('img').alt || 'Portfolio Image'
            }));
    }
    
    function openLightbox(imageSrc) {
        currentImages = getVisibleImages();
        currentIndex = currentImages.findIndex(img => img.src === imageSrc);
        
        if (currentIndex === -1) currentIndex = 0;
        
        showLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard event listener
        document.addEventListener('keydown', handleLightboxKeyboard);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove keyboard event listener
        document.removeEventListener('keydown', handleLightboxKeyboard);
    }
    
    function showLightboxImage() {
        if (currentImages[currentIndex]) {
            const img = currentImages[currentIndex];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            // Preload next and previous images
            preloadAdjacentImages();
        }
    }
    
    function preloadAdjacentImages() {
        const nextIndex = (currentIndex + 1) % currentImages.length;
        const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        
        if (currentImages[nextIndex]) {
            const nextImg = new Image();
            nextImg.src = currentImages[nextIndex].src;
        }
        
        if (currentImages[prevIndex]) {
            const prevImg = new Image();
            prevImg.src = currentImages[prevIndex].src;
        }
    }
    
    function nextLightboxImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showLightboxImage();
    }
    
    function prevLightboxImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showLightboxImage();
    }
    
    function handleLightboxKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                nextLightboxImage();
                break;
            case 'ArrowLeft':
                prevLightboxImage();
                break;
        }
    }
    
    // Event listeners
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src);
            }
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextLightboxImage);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevLightboxImage);
    }
    
    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Enhanced touch gestures for lightbox
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    lightbox.addEventListener('touchmove', function(e) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);
        
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleLightboxSwipe();
    }, { passive: true });
    
    function handleLightboxSwipe() {
        const swipeThreshold = 50;
        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchStartY - touchEndY);
        
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                nextLightboxImage();
            } else {
                prevLightboxImage();
            }
        }
    }
}

function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const progressDots = document.querySelectorAll('.progress-dot');
    const testimonialsContainer = document.querySelector('.testimonials-container');
    
    let currentTestimonial = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let autoTestimonialTimer;
    let isTransitioning = false;
    
    if (!testimonialCards.length) return;
    
    function showTestimonial(n, direction = 'next') {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Remove all classes
        testimonialCards.forEach(card => {
            card.classList.remove('active', 'next', 'prev');
        });
        
        progressDots.forEach(dot => dot.classList.remove('active'));
        
        // Calculate new index
        const prevIndex = currentTestimonial;
        currentTestimonial = (n + testimonialCards.length) % testimonialCards.length;
        
        // Add transition classes
        if (direction === 'next') {
            testimonialCards[prevIndex].classList.add('prev');
            testimonialCards[currentTestimonial].classList.add('next');
        } else {
            testimonialCards[prevIndex].classList.add('next');
            testimonialCards[currentTestimonial].classList.add('prev');
        }
        
        // Animate to active state
        setTimeout(() => {
            testimonialCards[currentTestimonial].classList.remove('next', 'prev');
            testimonialCards[currentTestimonial].classList.add('active');
            
            // Update progress dots
            if (progressDots[currentTestimonial]) {
                progressDots[currentTestimonial].classList.add('active');
            }
            
            // Reset stars animation
            resetStarsAnimation();
            
            isTransitioning = false;
        }, 100);
    }
    
    function resetStarsAnimation() {
        const activeCard = testimonialCards[currentTestimonial];
        const stars = activeCard.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            star.style.animation = 'none';
            star.offsetHeight; // Trigger reflow
            star.style.animation = `starPop 0.6s ease forwards ${(index + 1) * 0.1}s`;
        });
    }
    
    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1, 'next');
    }
    
    function prevTestimonial() {
        showTestimonial(currentTestimonial - 1, 'prev');
    }
    
    function startAutoTestimonials() {
        stopAutoTestimonials();
        autoTestimonialTimer = setInterval(() => {
            if (!isTransitioning) {
                nextTestimonial();
            }
        }, 7000);
    }
    
    function stopAutoTestimonials() {
        if (autoTestimonialTimer) {
            clearInterval(autoTestimonialTimer);
            autoTestimonialTimer = null;
        }
    }
    
    // Enhanced button controls with haptic feedback
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextTestimonial();
            stopAutoTestimonials();
            startAutoTestimonials();
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevTestimonial();
            stopAutoTestimonials();
            startAutoTestimonials();
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Progress dots navigation
    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            const direction = index > currentTestimonial ? 'next' : 'prev';
            showTestimonial(index, direction);
            stopAutoTestimonials();
            startAutoTestimonials();
        });
    });
    
    // Enhanced touch gestures with better feedback
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            stopAutoTestimonials();
        }, { passive: true });
        
        testimonialsContainer.addEventListener('touchmove', function(e) {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = Math.abs(touchX - touchStartX);
            const deltaY = Math.abs(touchY - touchStartY);
            
            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
                
                // Visual feedback during swipe
                const activeCard = testimonialCards[currentTestimonial];
                const swipeProgress = (touchX - touchStartX) / window.innerWidth;
                activeCard.style.transform = `translateX(${swipeProgress * 100}px) scale(${1 - Math.abs(swipeProgress) * 0.1})`;
            }
        }, { passive: false });
        
        testimonialsContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            
            // Reset transform
            const activeCard = testimonialCards[currentTestimonial];
            activeCard.style.transform = '';
            
            handleTestimonialSwipe();
            setTimeout(() => startAutoTestimonials(), 500);
        }, { passive: true });
    }
    
    function handleTestimonialSwipe() {
        const swipeThreshold = 50;
        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchStartY - touchEndY);
        
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
    }
    
    // Initialize with animations
    showTestimonial(0);
    startAutoTestimonials();
    
    // Enhanced pause on hover with smooth transitions
    if (testimonialsContainer && !isTouchDevice()) {
        testimonialsContainer.addEventListener('mouseenter', function() {
            stopAutoTestimonials();
            this.style.transform = 'scale(1.02)';
        });
        
        testimonialsContainer.addEventListener('mouseleave', function() {
            startAutoTestimonials();
            this.style.transform = '';
        });
    }
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                resetStarsAnimation();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(testimonialsContainer);
}




// Smooth Scrolling Enhancement
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 60; // Fixed header height
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced Touch Gestures
function initTouchGestures() {
    const interactiveElements = document.querySelectorAll('.btn, .filter-btn, .hero-prev, .hero-next, .testimonial-prev, .testimonial-next');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.8';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
    });
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.portfolio-item, .service-card, .testimonial-card');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Header Scroll Behavior
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', throttle(updateHeader, 10));
}

// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Initialize touch device optimizations
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .touch-device * {
            -webkit-tap-highlight-color: rgba(168, 196, 168, 0.3);
        }
        
        .touch-device .btn:active,
        .touch-device .filter-btn:active,
        .touch-device .nav-link:active {
            transform: scale(0.95);
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Remove loading states and optimize for performance
    requestAnimationFrame(() => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.complete) {
                img.style.opacity = '1';
            }
        });
    });
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Could implement fallback image here
    }
}, true);
// Intersection Observer for About Section Animations
function initAboutAnimations() {
  const aboutSection = document.querySelector('.about');
  const aboutText = document.querySelector('.about-text');
  const aboutHeading = document.querySelector('.about-text h2');
  const aboutParagraphs = document.querySelectorAll('.about-text p');
  const socialLinks = document.querySelector('.social-links');
  const aboutImage = document.querySelector('.about-image');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate elements with staggered delays
        setTimeout(() => {
          aboutText.classList.add('animate');
          aboutHeading.classList.add('animate');
        }, 100);

        setTimeout(() => {
          aboutParagraphs.forEach(p => p.classList.add('animate'));
        }, 300);

        setTimeout(() => {
          socialLinks.classList.add('animate');
        }, 500);

        setTimeout(() => {
          aboutImage.classList.add('animate');
        }, 200);

        // Stop observing after animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe the about section
  if (aboutSection) {
    observer.observe(aboutSection);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAboutAnimations);
