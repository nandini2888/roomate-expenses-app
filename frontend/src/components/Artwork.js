import React from 'react';

// Artwork 1: Cozy Desk Scene with Book Stack, Coffee Mug, and Cat mascot (Auth page)
export const AuthHeroArtwork = ({ className = 'w-full h-auto' }) => (
  <svg className={className} viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wallGlow" x1="100" y1="0" x2="400" y2="360" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBF5" />
        <stop offset="0.6" stopColor="#FBF7EE" />
        <stop offset="1" stopColor="#F5EFE0" />
      </linearGradient>
      <linearGradient id="sunBeam" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" stopOpacity="0.45" />
        <stop offset="1" stopColor="#FEF3C7" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="tableTop" x1="0" y1="280" x2="500" y2="360" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EADECB" />
        <stop offset="1" stopColor="#DECDB4" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Background warm surface */}
    <rect width="500" height="360" rx="24" fill="url(#wallGlow)" />

    {/* Sunbeam ambient diagonal light */}
    <path d="M0 0L320 0L480 360L0 360Z" fill="url(#sunBeam)" />

    {/* Wall Photo Frames */}
    <g filter="url(#softShadow)">
      {/* Photo 1: House */}
      <rect x="230" y="35" width="55" height="70" rx="4" fill="#FFFFFF" />
      <rect x="235" y="40" width="45" height="50" rx="2" fill="#E0F2FE" />
      <path d="M245 75L257 60L270 75H245Z" fill="#0EA5E9" fillOpacity="0.7" />
      <circle cx="265" cy="50" r="4" fill="#F59E0B" />

      {/* Photo 2: Friends */}
      <rect x="300" y="50" width="50" height="65" rx="4" fill="#FFFFFF" transform="rotate(4 300 50)" />
      <rect x="304" y="54" width="42" height="46" rx="2" fill="#FFE4E6" transform="rotate(4 300 50)" />
      <circle cx="318" cy="72" r="5" fill="#F43F5E" fillOpacity="0.6" />
      <circle cx="332" cy="74" r="5" fill="#10B981" fillOpacity="0.6" />

      {/* Tape on photos */}
      <rect x="245" y="30" width="25" height="10" rx="2" fill="#FDE68A" fillOpacity="0.7" />
      <rect x="315" y="44" width="22" height="10" rx="2" fill="#FDE68A" fillOpacity="0.7" transform="rotate(4 315 44)" />
    </g>

    {/* Potted plant behind books */}
    <g>
      <rect x="175" y="115" width="30" height="35" rx="6" fill="#F87171" fillOpacity="0.8" />
      {/* Plant leaves */}
      <path d="M190 115C185 85 165 80 160 85C165 100 180 110 190 115Z" fill="#10B981" />
      <path d="M190 115C195 80 215 75 220 80C215 95 200 110 190 115Z" fill="#059669" />
      <path d="M190 115C190 75 195 65 192 65C185 75 186 100 190 115Z" fill="#34D399" />
    </g>

    {/* Table Surface */}
    <path d="M0 270C80 268 400 268 500 270V360H0V270Z" fill="url(#tableTop)" />

    {/* Stack of Books with Labels */}
    <g filter="url(#softShadow)">
      {/* Book 1 (Bottom): Memories */}
      <rect x="140" y="240" width="130" height="26" rx="4" fill="#3B82F6" />
      <rect x="142" y="243" width="12" height="20" rx="2" fill="#1E40AF" />
      <text x="170" y="257" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="sans-serif">Memories</text>

      {/* Book 2: Friendships */}
      <rect x="145" y="214" width="120" height="24" rx="4" fill="#10B981" />
      <rect x="147" y="216" width="10" height="20" rx="2" fill="#065F46" />
      <text x="170" y="230" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="sans-serif">Friendships</text>

      {/* Book 3: Expenses */}
      <rect x="148" y="190" width="112" height="22" rx="4" fill="#F59E0B" />
      <rect x="150" y="192" width="10" height="18" rx="2" fill="#B45309" />
      <text x="173" y="205" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="sans-serif">Expenses</text>

      {/* Book 4 (Top): Rooms */}
      <rect x="152" y="168" width="104" height="20" rx="4" fill="#F43F5E" />
      <rect x="154" y="170" width="8" height="16" rx="2" fill="#9F1239" />
      <text x="176" y="182" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="sans-serif">Rooms</text>
    </g>

    {/* Coffee Mug: "Split Live Thrive ♡" */}
    <g filter="url(#softShadow)">
      {/* Mug Body */}
      <rect x="285" y="210" width="48" height="55" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      {/* Mug Handle */}
      <path d="M333 222C343 222 344 246 333 246" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <path d="M333 222C343 222 344 246 333 246" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      {/* Mug Text */}
      <text x="294" y="228" fill="#0F172A" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Split</text>
      <text x="293" y="238" fill="#F43F5E" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Live</text>
      <text x="290" y="248" fill="#0EA5E9" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Thrive ♡</text>
      {/* Warm Steam lines */}
      <path d="M298 200C295 190 302 185 298 178" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M312 202C309 192 316 187 312 180" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    </g>

    {/* Cute Black Cat figurine/mascot sitting next to books */}
    <g filter="url(#softShadow)">
      {/* Body */}
      <ellipse cx="108" cy="272" rx="26" ry="18" fill="#1E293B" />
      {/* Head */}
      <circle cx="95" cy="245" r="16" fill="#1E293B" />
      {/* Ears */}
      <polygon points="84,233 89,220 96,233" fill="#1E293B" />
      <polygon points="98,233 105,220 110,233" fill="#1E293B" />
      <polygon points="87,232 90,224 94,232" fill="#FDA4AF" />
      <polygon points="100,232 103,224 107,232" fill="#FDA4AF" />
      {/* Eyes */}
      <ellipse cx="89" cy="244" rx="3.5" ry="4" fill="#FEF08A" />
      <ellipse cx="101" cy="244" rx="3.5" ry="4" fill="#FEF08A" />
      <circle cx="90" cy="244" r="1.8" fill="#0F172A" />
      <circle cx="102" cy="244" r="1.8" fill="#0F172A" />
      {/* Nose & Whiskers */}
      <polygon points="94,249 96,251 93,251" fill="#FDA4AF" />
      <line x1="82" y1="248" x2="73" y2="246" stroke="#94A3B8" strokeWidth="1.2" />
      <line x1="82" y1="251" x2="74" y2="253" stroke="#94A3B8" strokeWidth="1.2" />
      <line x1="107" y1="248" x2="116" y2="246" stroke="#94A3B8" strokeWidth="1.2" />
      <line x1="107" y1="251" x2="115" y2="253" stroke="#94A3B8" strokeWidth="1.2" />
      {/* Paws */}
      <ellipse cx="94" cy="284" rx="6" ry="4" fill="#1E293B" />
      <ellipse cx="108" cy="284" rx="6" ry="4" fill="#1E293B" />
      {/* Tail curving */}
      <path d="M130 272C142 270 148 250 142 245C136 242 134 252 130 258" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    </g>

    {/* Laptop corner on right */}
    <g>
      <polygon points="350,295 470,270 490,295 380,320" fill="#E2E8F0" />
      <polygon points="380,320 490,295 490,302 380,327" fill="#CBD5E1" />
    </g>
  </svg>
);

// Artwork 2: Twilight Architectural Window ("Shared spaces. Greater stories..." on Dashboard)
export const TwilightArchArtwork = ({ className = 'w-24 h-24' }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="twilightSky" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E1B4B" />
        <stop offset="0.5" stopColor="#312E81" />
        <stop offset="0.8" stopColor="#4338CA" />
        <stop offset="1" stopColor="#FB7185" />
      </linearGradient>
      <linearGradient id="interiorGlow" x1="60" y1="60" x2="60" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" stopOpacity="0.8" />
        <stop offset="1" stopColor="#F59E0B" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Frame arch */}
    <rect width="120" height="120" rx="20" fill="#F8FAFC" />
    {/* Archway Cutout */}
    <path d="M30 110V50C30 33.4315 43.4315 20 60 20C76.5685 20 90 33.4315 90 50V110H30Z" fill="url(#twilightSky)" />
    {/* Golden Moon */}
    <circle cx="72" cy="42" r="7" fill="#FEF08A" />
    <circle cx="70" cy="40" r="6" fill="url(#twilightSky)" />
    {/* Twinkling Stars */}
    <circle cx="48" cy="45" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
    <circle cx="58" cy="32" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="78" cy="62" r="1.2" fill="#FFFFFF" fillOpacity="0.7" />
    {/* Silhouetted Balcony & Window mullions */}
    <path d="M60 20V110" stroke="#0F172A" strokeWidth="2" strokeOpacity="0.4" />
    <path d="M30 65H90" stroke="#0F172A" strokeWidth="2" strokeOpacity="0.4" />
    {/* Balcony Potted Plant */}
    <path d="M30 95H90V110H30V95Z" fill="url(#interiorGlow)" />
    <ellipse cx="60" cy="98" rx="8" ry="4" fill="#F43F5E" />
    <path d="M60 96C58 90 50 88 48 90C50 94 56 96 60 96Z" fill="#34D399" />
    <path d="M60 96C62 90 70 88 72 90C70 94 64 96 60 96Z" fill="#10B981" />
  </svg>
);

// Artwork 3: Modern Architectural Pavilion/Villa ("More than just rooms..." banner on Rooms page)
export const ModernVillaArtwork = ({ className = 'w-full h-full' }) => (
  <svg className={className} viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyGrad" x1="300" y1="0" x2="300" y2="240" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" />
        <stop offset="0.7" stopColor="#F0FDF4" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="glassLight" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FEF08A" stopOpacity="0.8" />
        <stop offset="1" stopColor="#F59E0B" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="woodPanel" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Sky */}
    <rect width="600" height="240" fill="url(#skyGrad)" />

    {/* Distant Trees / Soft Forest */}
    <ellipse cx="120" cy="180" rx="60" ry="40" fill="#99F6E4" fillOpacity="0.4" />
    <ellipse cx="480" cy="170" rx="80" ry="50" fill="#99F6E4" fillOpacity="0.4" />
    <ellipse cx="540" cy="180" rx="60" ry="35" fill="#A7F3D0" fillOpacity="0.5" />

    {/* Modern House Wing 1 (Concrete / White cube) */}
    <rect x="220" y="70" width="140" height="110" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
    <rect x="235" y="85" width="110" height="85" rx="3" fill="url(#glassLight)" />
    {/* Window frames */}
    <line x1="290" y1="85" x2="290" y2="170" stroke="#0F172A" strokeWidth="2" strokeOpacity="0.3" />
    <line x1="235" y1="125" x2="345" y2="125" stroke="#0F172A" strokeWidth="2" strokeOpacity="0.3" />

    {/* Modern House Wing 2 (Upper Cantilevered Wood Box) */}
    <rect x="330" y="50" width="130" height="90" rx="4" fill="url(#woodPanel)" />
    {/* Large panoramic window */}
    <rect x="345" y="65" width="100" height="60" rx="2" fill="url(#glassLight)" />
    <line x1="395" y1="65" x2="395" y2="125" stroke="#451A03" strokeWidth="2" strokeOpacity="0.4" />

    {/* Ground Floor Extended Glass Lounge */}
    <rect x="330" y="140" width="140" height="50" rx="2" fill="#FFFFFF" />
    <rect x="340" y="145" width="120" height="40" rx="2" fill="url(#glassLight)" fillOpacity="0.6" />

    {/* Roof overhang accents */}
    <rect x="210" y="66" width="160" height="6" rx="2" fill="#0F172A" />
    <rect x="320" y="46" width="150" height="6" rx="2" fill="#0F172A" />

    {/* Modern Minimalist Deck & Lawn */}
    <rect x="180" y="180" width="320" height="15" rx="2" fill="#E2E8F0" />
    <path d="M0 190C150 185 450 185 600 190V240H0V190Z" fill="#10B981" fillOpacity="0.15" />

    {/* Landscaped Architectural Planters / Bushes */}
    <ellipse cx="200" cy="188" rx="18" ry="12" fill="#10B981" />
    <ellipse cx="225" cy="190" rx="14" ry="10" fill="#059669" />
    <ellipse cx="485" cy="188" rx="22" ry="14" fill="#059669" />
    <ellipse cx="510" cy="190" rx="16" ry="11" fill="#10B981" />

    {/* Warm Interior Lighting Figures inside window */}
    <circle cx="280" cy="120" r="4" fill="#0F172A" fillOpacity="0.5" />
    <path d="M276 132C276 126 284 126 284 132V140H276V132Z" fill="#0F172A" fillOpacity="0.5" />
    <circle cx="370" cy="98" r="4" fill="#0F172A" fillOpacity="0.5" />
    <path d="M366 110C366 104 374 104 374 110V118H366V110Z" fill="#0F172A" fillOpacity="0.5" />
  </svg>
);

// Artwork 4: Potted Succulent / Plant ("Fair splits brighter tomorrows" on Summary page)
export const PottedSucculentArtwork = ({ className = 'w-32 h-32' }) => (
  <svg className={className} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cloudGrad" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EEF2FF" />
        <stop offset="1" stopColor="#E0F2FE" />
      </linearGradient>
    </defs>
    {/* Soft sky background badge */}
    <rect width="140" height="140" rx="28" fill="url(#cloudGrad)" />
    {/* Fluffy clouds */}
    <ellipse cx="45" cy="40" rx="20" ry="12" fill="#FFFFFF" fillOpacity="0.8" />
    <ellipse cx="60" cy="35" rx="16" ry="10" fill="#FFFFFF" fillOpacity="0.8" />
    <ellipse cx="105" cy="65" rx="18" ry="10" fill="#FFFFFF" fillOpacity="0.7" />

    {/* Cute Ceramic Planter with kitty face */}
    <g transform="translate(10, 0)">
      {/* Pot Body */}
      <path d="M45 80C45 76 75 76 75 80L70 115C70 120 50 120 50 115L45 80Z" fill="#1E293B" />
      {/* Cute ears on pot */}
      <polygon points="45,80 43,72 50,78" fill="#1E293B" />
      <polygon points="75,80 77,72 70,78" fill="#1E293B" />
      {/* Cute eyes & smile on pot */}
      <circle cx="54" cy="94" r="2" fill="#FFFFFF" />
      <circle cx="66" cy="94" r="2" fill="#FFFFFF" />
      <path d="M57 99C59 101 61 101 63 99" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Lush Succulent leaves spreading out */}
      <path d="M60 76C55 50 40 45 35 50C40 65 52 72 60 76Z" fill="#10B981" />
      <path d="M60 76C65 48 80 42 85 48C80 62 68 72 60 76Z" fill="#059669" />
      <path d="M60 76C50 62 25 65 22 72C32 78 50 77 60 76Z" fill="#34D399" />
      <path d="M60 76C70 60 95 62 98 70C88 78 70 77 60 76Z" fill="#047857" />
      <path d="M60 76C60 40 54 30 60 30C66 30 60 40 60 76Z" fill="#6EE7B7" />
    </g>
  </svg>
);
