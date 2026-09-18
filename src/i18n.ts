import i18next from 'i18next';

const en = {
  translation: {
    boot: {
      initializing: "INITIALIZING SYSTEM..."
    },
    nav: {
      platform: "Platform",
      technology: "Technology",
      missions: "Missions",
      about: "About",
      careers: "Careers",
      contact: "CONTACT \u2192"
    },
    hero: {
      line1: "AUTONOMY",
      line2: "BUILT FOR",
      line3: "THE REAL WORLD.",
      subtitle: "Intelligent autonomous systems designed to perceive, decide and respond in real time.",
      ctaPrimary: "EXPLORE PLATFORM \u2192",
      ctaSecondary: "WATCH SYSTEM \u2192"
    },
    hud: {
      title: "SYSTEM INITIALIZATION",
      airframe: "AIRFRAME",
      vision: "VISION",
      aiCore: "AI CORE",
      telemetry: "TELEMETRY",
      gps: "GPS",
      online: "ONLINE",
      active: "ACTIVE",
      connected: "CONNECTED",
      locked: "LOCKED"
    },
    missions: {
      title: "ONE PLATFORM.<br>MANY MISSIONS.",
      m1: {
        title: "WILDFIRE RESPONSE",
        desc: "Rapid deployment in high-risk environments to provide critical aerial intelligence."
      },
      m2: {
        title: "CRITICAL INFRASTRUCTURE",
        desc: "Automated inspection and perimeter security for high-value assets."
      },
      m3: {
        title: "REMOTE SURVEILLANCE",
        desc: "Persistent overwatch in denied environments with edge AI processing."
      }
    },
    product: {
      title: "ENGINEERED<br>FOR AUTONOMY.",
      ann1: "500 KM/H",
      ann2: "VTOL",
      ann3: "MULTI-SENSOR",
      ann4: "EDGE AI",
      spec1Label: "SPEED",
      spec1Value: "500 KM/H",
      spec2Label: "RANGE",
      spec2Value: "500+ KM",
      spec3Label: "ENDURANCE",
      spec3Value: "24 HRS"
    },
    ai: {
      title: "INTELLIGENCE<br>AT THE EDGE.",
      events: "SYSTEM EVENTS",
      event1: "14:02:11 - TARGET ACQUIRED",
      event2: "14:02:15 - TRAJECTORY COMPUTED",
      event3: "14:02:40 - DATALINK SYNC"
    },
    tech: {
      layer1: "SENSORS",
      layer2: "PERCEPTION",
      layer3: "AI",
      layer4: "DECISION",
      layer5: "AUTONOMY",
      layer6: "MISSION"
    },
    ops: {
      title: "REAL SYSTEMS.<br>REAL MISSIONS."
    },
    footer: {
      title: "READY TO<br>DEPLOY?",
      cta: "CONTACT US \u2192"
    }
  }
};

const es = {
  translation: {
    boot: {
      initializing: "INICIALIZANDO SISTEMA..."
    },
    nav: {
      platform: "Plataforma",
      technology: "Tecnología",
      missions: "Misiones",
      about: "Nosotros",
      careers: "Empleos",
      contact: "CONTACTO \u2192"
    },
    hero: {
      line1: "AUTONOMÍA",
      line2: "CREADA PARA",
      line3: "EL MUNDO REAL.",
      subtitle: "Sistemas autónomos inteligentes diseñados para percibir, decidir y responder en tiempo real.",
      ctaPrimary: "EXPLORAR PLATAFORMA \u2192",
      ctaSecondary: "VER SISTEMA \u2192"
    },
    hud: {
      title: "INICIALIZACIÓN DEL SISTEMA",
      airframe: "FUSELAJE",
      vision: "VISIÓN",
      aiCore: "NÚCLEO IA",
      telemetry: "TELEMETRÍA",
      gps: "GPS",
      online: "EN LÍNEA",
      active: "ACTIVO",
      connected: "CONECTADO",
      locked: "BLOQUEADO"
    },
    missions: {
      title: "UNA PLATAFORMA.<br>MUCHAS MISIONES.",
      m1: {
        title: "RESPUESTA A INCENDIOS",
        desc: "Despliegue rápido en entornos de alto riesgo para inteligencia aérea."
      },
      m2: {
        title: "INFRAESTRUCTURA CRÍTICA",
        desc: "Inspección automatizada y seguridad perimetral para activos de alto valor."
      },
      m3: {
        title: "VIGILANCIA REMOTA",
        desc: "Vigilancia persistente en entornos denegados con procesamiento IA."
      }
    },
    product: {
      title: "DISEÑADO<br>PARA LA AUTONOMÍA.",
      ann1: "500 KM/H",
      ann2: "VTOL",
      ann3: "MULTI-SENSOR",
      ann4: "EDGE IA",
      spec1Label: "VELOCIDAD",
      spec1Value: "500 KM/H",
      spec2Label: "ALCANCE",
      spec2Value: "500+ KM",
      spec3Label: "RESISTENCIA",
      spec3Value: "24 HRS"
    },
    ai: {
      title: "INTELIGENCIA<br>EN EL BORDE.",
      events: "EVENTOS DEL SISTEMA",
      event1: "14:02:11 - OBJETIVO ADQUIRIDO",
      event2: "14:02:15 - TRAYECTORIA CALCULADA",
      event3: "14:02:40 - SINCRONIZACIÓN DE DATOS"
    },
    tech: {
      layer1: "SENSORES",
      layer2: "PERCEPCIÓN",
      layer3: "IA",
      layer4: "DECISIÓN",
      layer5: "AUTONOMÍA",
      layer6: "MISIÓN"
    },
    ops: {
      title: "SISTEMAS REALES.<br>MISIONES REALES."
    },
    footer: {
      title: "¿LISTO PARA<br>DESPLEGAR?",
      cta: "CONTÁCTANOS \u2192"
    }
  }
};

export function initI18n() {
  i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en,
      es
    }
  }).then(() => {
    updateContent();
  });
}

export function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      if (element.innerHTML.includes('<br>')) {
        element.innerHTML = i18next.t(key);
      } else {
        element.innerHTML = i18next.t(key);
      }
    }
  });
  
  // Special case for boot progress which has a dynamic span inside
  const bootText = document.querySelector('[data-i18n="boot.initializing"]');
  if (bootText) {
    const progressEl = document.getElementById('load-progress');
    const percent = progressEl ? progressEl.textContent : '0%';
    bootText.innerHTML = `${i18next.t('boot.initializing')} <span id="load-progress">${percent}</span>`;
  }
}

export function toggleLanguage() {
  const currentLang = i18next.language;
  const newLang = currentLang === 'en' ? 'es' : 'en';
  i18next.changeLanguage(newLang).then(() => {
    updateContent();
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = newLang === 'en' ? 'ES' : 'EN';
    document.documentElement.lang = newLang;
  });
}
