/* =====================================================================
   DATOS DEL NEGOCIO Y CATÁLOGO — Full Tech
   Para cambiar productos o precios, editá este archivo.
   price: en pesos, sin puntos. img: foto en /img (si no hay, usa icon).
   opts: opciones para elegir (modelo, color...). featured: sale en Inicio.
   ⚠ Productos y precios DE EJEMPLO hasta que el negocio pase los reales.
   ===================================================================== */
const SHOP = {
  name: "Full Tech",
  wa: "5491154140327",
  waShow: "11 5414-0327",
  address: "Av. Julián M. Castro 785",
  city: "Merlo, Buenos Aires",
  instagram: "https://www.instagram.com/ffulltech/",
  channel: "https://whatsapp.com/channel/0029Vb7ZggHJ3jv37bNb7K01",
  maps: "https://www.google.com/maps/search/?api=1&query=Av.+Juli%C3%A1n+M.+Castro+785,+Merlo,+Buenos+Aires",
  // [día (0=domingo), desde, hasta] en minutos
  hours: [1,2,3,4,5,6].flatMap(d => [[d, 570, 780], [d, 990, 1200]])
};

const CATS = [
  { id: "cel", name: "Celulares", t: "t-ph", icon: "phone", desc: "Nuevos en caja" },
  { id: "acc", name: "Fundas y templados", t: "t-ac", icon: "case", desc: "Para todos los modelos" },
  { id: "car", name: "Carga", t: "t-ca", icon: "charger", desc: "Cargadores, cables y más" },
  { id: "aud", name: "Audio", t: "t-au", icon: "buds", desc: "Auriculares y parlantes" },
  { id: "pc", name: "Computación", t: "t-pc", icon: "usb", desc: "Memorias y periféricos" },
  { id: "gor", name: "Gorras", t: "t-go", icon: "cap", desc: "Varios modelos" }
];

const MODELOS = ["Samsung A06", "Samsung A16", "Samsung A25", "Moto E15", "Moto G24", "Redmi A5", "iPhone 13", "Otro (aclarar)"];

const PRODUCTS = [
  { id: 1, cat: "cel", brand: "Samsung", name: "Galaxy A16", spec: "Nuevo en caja · 128 GB", price: 299999, img: "img/galaxy-a16.jpg", badge: "Nuevo", featured: true,
    desc: "El Samsung más elegido para el día a día: pantalla grande, buena batería y muchos años de actualizaciones. Nuevo, en caja cerrada.",
    feats: ["Pantalla Super AMOLED de 6,7\"", "128 GB de almacenamiento", "Batería de 5.000 mAh", "Cámara principal de 50 MP", "Nuevo en caja con garantía"],
    opts: { label: "Color", values: ["Negro", "Gris", "Verde claro"] } },
  { id: 2, cat: "cel", brand: "Motorola", name: "Moto E15", spec: "2 GB RAM · 64 GB · con funda", price: 169999, icon: "phone", badge: "Oferta", featured: true,
    desc: "Un Motorola económico y confiable para WhatsApp, redes y llamadas. Viene con funda y cargador incluidos.",
    feats: ["2 GB de RAM y 64 GB de almacenamiento", "Batería de larga duración", "Incluye funda y cargador", "Nuevo en caja"],
    opts: { label: "Color", values: ["Azul", "Verde"] } },
  { id: 3, cat: "cel", brand: "Samsung", name: "Galaxy A06", spec: "Nuevo en caja · 64 GB", price: 189999, icon: "phone",
    desc: "La puerta de entrada a Samsung: simple, rendidor y con pantalla grande.",
    feats: ["Pantalla de 6,7\"", "64 GB de almacenamiento", "Batería de 5.000 mAh", "Nuevo en caja"] },
  { id: 4, cat: "cel", brand: "Xiaomi", name: "Redmi A5", spec: "Nuevo en caja · 128 GB", price: 199999, icon: "phone", featured: true,
    desc: "Mucho almacenamiento por buen precio, ideal para fotos y apps.",
    feats: ["128 GB de almacenamiento", "Pantalla de 6,88\"", "Batería de 5.200 mAh", "Nuevo en caja"] },
  { id: 5, cat: "acc", brand: "Full Tech", name: "Funda de silicona", spec: "Varios modelos y colores", price: 7999, icon: "case", featured: true,
    desc: "Funda de silicona suave al tacto, con interior de microfibra que cuida el celu.",
    feats: ["Interior de microfibra", "Protege la cámara", "Varios colores en el local"],
    opts: { label: "Modelo de celular", values: MODELOS } },
  { id: 6, cat: "acc", brand: "Full Tech", name: "Funda antigolpe", spec: "Bordes reforzados", price: 9999, icon: "case",
    desc: "Bordes reforzados con aire para aguantar las caídas del día a día.",
    feats: ["Esquinas reforzadas", "Transparente: se ve el color del celu", "Botones protegidos"],
    opts: { label: "Modelo de celular", values: MODELOS } },
  { id: 7, cat: "acc", brand: "Full Tech", name: "Vidrio templado", spec: "Colocación sin cargo en el local", price: 5999, icon: "glass", badge: "Te lo ponemos", featured: true,
    desc: "Vidrio templado 9H. Si lo comprás en el local te lo colocamos en el momento, sin burbujas y sin cargo.",
    feats: ["Dureza 9H", "Colocación sin cargo en el local", "No afecta el táctil"],
    opts: { label: "Modelo de celular", values: MODELOS } },
  { id: 8, cat: "car", brand: "Samsung", name: "Cargador 25 W tipo C", spec: "Carga rápida", price: 19999, icon: "charger", featured: true,
    desc: "Cargador de carga súper rápida para celulares con entrada tipo C.",
    feats: ["25 W de potencia", "Salida USB-C", "Compatible con la mayoría de los Android"] },
  { id: 9, cat: "car", brand: "Full Tech", name: "Cable USB-C reforzado", spec: "1 metro", price: 5999, icon: "cable",
    desc: "Cable mallado que aguanta el uso diario sin quebrarse en la punta.",
    feats: ["1 metro de largo", "Mallado reforzado", "Carga y datos"] },
  { id: 10, cat: "car", brand: "Full Tech", name: "Cable Lightning", spec: "Para iPhone · 1 metro", price: 7999, icon: "cable",
    desc: "Cable para iPhone con conector Lightning.",
    feats: ["1 metro de largo", "Carga y datos", "Compatible con iPhone 5 al 14"] },
  { id: 11, cat: "car", brand: "Full Tech", name: "Power bank 10.000 mAh", spec: "2 salidas USB", price: 24999, icon: "powerbank",
    desc: "Batería portátil para cargar el celu en cualquier lado. Rinde de 2 a 3 cargas completas.",
    feats: ["10.000 mAh", "2 salidas USB", "Indicador de carga"] },
  { id: 12, cat: "car", brand: "Full Tech", name: "Pilas recargables USB", spec: "AA · se cargan con el cable", price: 12999, icon: "battery",
    desc: "Olvidate de comprar pilas todo el tiempo: se cargan con un cable USB.",
    feats: ["Tamaño AA", "Se cargan por USB", "Reutilizables cientos de veces"] },
  { id: 13, cat: "aud", brand: "Full Tech", name: "Auriculares Bluetooth", spec: "In-ear con estuche de carga", price: 17999, icon: "buds", featured: true,
    desc: "Auriculares inalámbricos con estuche que los carga. Se conectan solos al abrir la tapa.",
    feats: ["Bluetooth 5.3", "Estuche de carga", "Micrófono para llamadas"],
    opts: { label: "Color", values: ["Blanco", "Negro"] } },
  { id: 14, cat: "aud", brand: "Full Tech", name: "Vincha Bluetooth", spec: "Plegable · con micrófono", price: 21999, icon: "headset",
    desc: "Vincha plegable, cómoda para usar muchas horas.",
    feats: ["Plegable", "Micrófono incorporado", "También funciona con cable"] },
  { id: 15, cat: "aud", brand: "Full Tech", name: "Parlante Bluetooth", spec: "Portátil · USB y micro SD", price: 26999, icon: "speaker",
    desc: "Parlante portátil con buen volumen para llevar a todos lados.",
    feats: ["Bluetooth", "Entrada USB y micro SD", "Batería recargable"] },
  { id: 16, cat: "aud", brand: "Full Tech", name: "Smartwatch", spec: "Notificaciones y deporte", price: 34999, icon: "watch",
    desc: "Recibí notificaciones, contá pasos y medí tu actividad.",
    feats: ["Notificaciones de WhatsApp", "Contador de pasos y ritmo cardíaco", "Compatible con Android y iPhone"],
    opts: { label: "Color", values: ["Negro", "Rosa", "Gris"] } },
  { id: 17, cat: "pc", brand: "Kingston", name: "Pendrive 64 GB", spec: "USB 3.2", price: 11999, icon: "usb",
    desc: "Pendrive Kingston original, rápido y confiable.",
    feats: ["64 GB", "USB 3.2", "Marca Kingston"] },
  { id: 18, cat: "pc", brand: "Kingston", name: "Memoria micro SD 64 GB", spec: "Con adaptador", price: 12999, icon: "sd",
    desc: "Más espacio para fotos y videos en tu celu.",
    feats: ["64 GB", "Clase 10", "Incluye adaptador SD"] },
  { id: 19, cat: "pc", brand: "Full Tech", name: "Mouse inalámbrico", spec: "Con receptor USB", price: 9999, icon: "mouse",
    desc: "Mouse inalámbrico cómodo para la compu o la notebook.",
    feats: ["Receptor USB", "Funciona con pila AA", "Silencioso"] },
  { id: 20, cat: "gor", brand: "Full Tech", name: "Gorra trucker", spec: "Varios modelos", price: 14999, icon: "cap",
    desc: "Gorras de distintos modelos y colores. Mirá todas en el local o pedinos fotos por WhatsApp.",
    feats: ["Talle regulable", "Varios modelos y colores"] }
];

const ICONS = {
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></svg>',
  case:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="1.5" width="14" height="21" rx="3.5"/><rect x="7.5" y="4" width="4" height="5" rx="1.5"/></svg>',
  glass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="m9 9 4-4M9 14l8-8M11 18l6-6"/></svg>',
  charger:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v5M15 2v5M6 7h12v5a6 6 0 0 1-12 0zM12 18v4"/><path d="m12.5 9-2 3h3l-2 3"/></svg>',
  cable:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="6" height="7" rx="1.5"/><path d="M6 9v4a5 5 0 0 0 10 0v-2a3 3 0 0 1 6 0"/></svg>',
  buds:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v7a1.5 1.5 0 0 0 3 0V7a3 3 0 0 0-3-3zM17 4a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v7a1.5 1.5 0 0 1-3 0V7a3 3 0 0 1 3-3z"/></svg>',
  headset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2.5" y="14" width="5" height="7" rx="2"/><rect x="16.5" y="14" width="5" height="7" rx="2"/></svg>',
  speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="6.5" r="1.2"/></svg>',
  usb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="14" rx="2"/><path d="M9 8V3h6v5M11 5h.01M13 5h.01"/></svg>',
  sd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M9 6v3M12 6v3M15 7v2"/></svg>',
  battery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="19" rx="2"/><path d="M10 1h4M12.5 8l-2 4h3l-2 4"/></svg>',
  powerbank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="m12.5 7-3 5h4l-3 5"/></svg>',
  watch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6l1-4h4l1 4M9 18l1 4h4l1-4M12 9v3l2 1"/></svg>',
  cap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15a9 9 0 0 1 18 0zM12 6V4M3 15h-1a2 2 0 0 0 2 2h9"/></svg>',
  mouse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v4"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.1.1.6-.1 1.2z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  store:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h13v11H1zM14 9h4l3 3v4h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>'
};
