/**
 * Utility to detect client device brand, model, and browser from navigator.userAgent
 */

export interface DeviceInfo {
  marque: string;
  modele: string;
  navigateur: string;
}

export function detectDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined' || !navigator) {
    return {
      marque: 'Inconnu',
      modele: 'Inconnu',
      navigateur: 'Inconnu',
    };
  }

  const ua = navigator.userAgent || '';
  let marque = 'Générique';
  let modele = 'Inconnu';
  let navigateur = 'Autre';

  // Detect Marque (Brand)
  if (/iPhone|iPad|iPod/i.test(ua)) {
    marque = 'Apple';
    modele = /iPhone/i.test(ua) ? 'iPhone' : /iPad/i.test(ua) ? 'iPad' : 'iPod';
  } else if (/Samsung|SM-|GT-/i.test(ua)) {
    marque = 'Samsung';
    const match = ua.match(/SM-[A-Z0-9]+/i) || ua.match(/GT-[A-Z0-9]+/i);
    modele = match ? match[0] : 'Galaxy';
  } else if (/Tecno/i.test(ua)) {
    marque = 'Tecno';
    const match = ua.match(/TECNO\s*([A-Za-z0-9_-]+)/i);
    modele = match ? match[1] : 'Tecno Mobile';
  } else if (/Infinix/i.test(ua)) {
    marque = 'Infinix';
    const match = ua.match(/Infinix\s*([A-Za-z0-9_-]+)/i);
    modele = match ? match[1] : 'Infinix Mobile';
  } else if (/Itel/i.test(ua)) {
    marque = 'Itel';
    const match = ua.match(/itel\s*([A-Za-z0-9_-]+)/i);
    modele = match ? match[1] : 'Itel Mobile';
  } else if (/Xiaomi|Redmi|POCO/i.test(ua)) {
    marque = 'Xiaomi';
    const match = ua.match(/(Redmi[^\s;)]+|POCO[^\s;)]+|Mi[^\s;)]+)/i);
    modele = match ? match[0] : 'Redmi/Mi';
  } else if (/Huawei|Honor/i.test(ua)) {
    marque = 'Huawei';
    modele = /Honor/i.test(ua) ? 'Honor' : 'Huawei Mobile';
  } else if (/Oppo/i.test(ua)) {
    marque = 'Oppo';
    modele = 'Oppo Mobile';
  } else if (/Vivo/i.test(ua)) {
    marque = 'Vivo';
    modele = 'Vivo Mobile';
  } else if (/Android/i.test(ua)) {
    marque = 'Android Phone';
    modele = 'Smartphone Android';
  } else if (/Windows/i.test(ua)) {
    marque = 'PC Windows';
    modele = 'Ordinateur Windows';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    marque = 'Apple Mac';
    modele = 'Macintosh';
  }

  // Detect Navigateur (Browser)
  if (/WhatsApp/i.test(ua)) {
    navigateur = 'WhatsApp In-App';
  } else if (/FBAN|FBAV/i.test(ua)) {
    navigateur = 'Facebook In-App';
  } else if (/Instagram/i.test(ua)) {
    navigateur = 'Instagram In-App';
  } else if (/Edg\//i.test(ua)) {
    navigateur = 'Microsoft Edge';
  } else if (/Chrome|CriOS/i.test(ua)) {
    navigateur = 'Google Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) {
    navigateur = 'Safari';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    navigateur = 'Mozilla Firefox';
  } else if (/Opera|OPR/i.test(ua)) {
    navigateur = 'Opera';
  }

  return { marque, modele, navigateur };
}
