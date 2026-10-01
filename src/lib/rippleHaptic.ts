/**
 * Global Wave Ripple & Haptic Vibration Effect for DALOA MARKET
 * 1. Creates an expanding Wave Blue (#1E90FF) ripple wave starting from click point
 * 2. Triggers navigator.vibrate(50) on every click
 */

export function setupGlobalWaveRipple() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    // 1. HAPTIC VIBRATION (50ms)
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(50);
      }
    } catch {
      // Ignored if device doesn't allow vibration
    }

    // 2. Locate closest clickable button or interactive card
    const target = (e.target as HTMLElement)?.closest('button, [role="button"], a.btn, .clickable-card') as HTMLElement | null;
    if (!target) return;

    // Check bounds
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Client Coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Ensure parent has relative positioning and overflow hidden
    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.position === 'static') {
      target.style.position = 'relative';
    }
    target.style.overflow = 'hidden';

    // Size of ripple circle
    const size = Math.max(rect.width, rect.height) * 2.2;

    const ripple = document.createElement('span');
    ripple.className = 'wave-ripple-circle';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    target.appendChild(ripple);

    // Clean up
    setTimeout(() => {
      ripple.remove();
    }, 650);
  };

  document.addEventListener('pointerdown', handlePointerDown, { passive: true });
}
