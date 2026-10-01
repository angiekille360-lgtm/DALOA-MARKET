/**
 * Flying Cart Animation for DALOA MARKET
 * Animates a product image smoothly flying from the clicked location
 * into the shopping cart icon at the top right, with a bounce effect on landing!
 */

export function animateFlyToCart(
  imageUrl: string, 
  startCoords?: { x?: number; y?: number }
) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const targetCart = document.getElementById('header-cart-btn') || document.getElementById('header-cart-icon');
  if (!targetCart) return;

  const targetRect = targetCart.getBoundingClientRect();
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  // Starting position (default to center of screen if not provided)
  const startX = startCoords?.x ?? window.innerWidth / 2;
  const startY = startCoords?.y ?? window.innerHeight / 2;

  // Create flying element clone
  const flyer = document.createElement('div');
  flyer.className = 'fixed pointer-events-none z-[99999] overflow-hidden';
  flyer.style.width = '70px';
  flyer.style.height = '70px';
  flyer.style.borderRadius = '16px';
  flyer.style.boxShadow = '0 12px 28px rgba(0,0,0,0.28), 0 0 20px rgba(30,144,255,0.5)';
  flyer.style.border = '2.5px solid #1E90FF';
  flyer.style.backgroundColor = '#FFFFFF';
  flyer.style.left = `${startX - 35}px`;
  flyer.style.top = `${startY - 35}px`;
  flyer.style.willChange = 'transform, opacity';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  flyer.appendChild(img);

  document.body.appendChild(flyer);

  // Calculate delta
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Curved keyframe animation using native Web Animations API for 60fps smoothness
  const animation = flyer.animate(
    [
      {
        transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
        opacity: 1,
      },
      {
        transform: `translate(${deltaX * 0.45}px, ${deltaY * 0.25 - 60}px) scale(0.9) rotate(-15deg)`,
        opacity: 0.95,
        offset: 0.45,
      },
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2) rotate(20deg)`,
        opacity: 0.2,
      },
    ],
    {
      duration: 650,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    }
  );

  animation.onfinish = () => {
    flyer.remove();

    // Trigger Cart Icon Bounce & Counter Bounce
    triggerCartBounce();
  };
}

export function triggerCartBounce() {
  const cartBtn = document.getElementById('header-cart-btn');
  const cartBadge = document.getElementById('header-cart-badge');

  if (cartBtn) {
    cartBtn.classList.remove('animate-cart-pop');
    // Force reflow
    void cartBtn.offsetWidth;
    cartBtn.classList.add('animate-cart-pop');

    setTimeout(() => {
      cartBtn.classList.remove('animate-cart-pop');
    }, 700);
  }

  if (cartBadge) {
    cartBadge.classList.remove('animate-badge-bounce');
    void cartBadge.offsetWidth;
    cartBadge.classList.add('animate-badge-bounce');

    setTimeout(() => {
      cartBadge.classList.remove('animate-badge-bounce');
    }, 600);
  }
}
