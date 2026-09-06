// Decorative architectural material study. Geometry stays crisp at every screen size.
export function RoofAssembly() {
  return (
    <svg className="roof-assembly" viewBox="0 0 640 600" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="roof-slate" x1="100" y1="30" x2="400" y2="480" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6e8999" /><stop offset=".45" stopColor="#354e61" /><stop offset="1" stopColor="#122738" />
        </linearGradient>
        <linearGradient id="roof-copper" x1="100" y1="220" x2="520" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f1b17d" /><stop offset=".55" stopColor="#b36a40" /><stop offset="1" stopColor="#623920" />
        </linearGradient>
        <linearGradient id="roof-membrane" x1="230" y1="210" x2="400" y2="480" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b3b9b3" /><stop offset="1" stopColor="#536975" />
        </linearGradient>
        <pattern id="roof-shingles" width="96" height="56" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .4 -1 .58 320 95)">
          <path fill="#233b4b" d="M0 0h96v56H0z" />
          <path fill="#395363" d="M0 1h47v26H0zM49 1h47v26H49z" />
          <path fill="#314957" d="M0 29h23v25H0zM25 29h46v25H25zM73 29h23v25H73z" />
          <path stroke="#8a9ea8" strokeOpacity=".45" d="M0 1h96M0 29h96" />
          <path stroke="#0d2231" strokeWidth="2" d="M0 27h96M0 55h96" />
          <path stroke="#d2d9d7" strokeOpacity=".08" d="M5 7h30m20 6h27M30 36h22m-18 7h28M4 45h11M75 37h17" />
        </pattern>
        <filter id="roof-shadow" x="-30%" y="-35%" width="160%" height="180%">
          <feDropShadow dx="0" dy="20" stdDeviation="14" floodColor="#020d16" floodOpacity=".48" />
        </filter>
      </defs>
      <g className="roof-drafting" stroke="#8eacbd" strokeOpacity=".2" strokeWidth="1">
        <path d="m45 374 275-158 281 120M43 414l279 112 281-162M320 67v483M82 280v149m479-182v137" />
        <path strokeDasharray="4 7" d="m82 235 238 96 241-139M82 306l238 96 241-139M82 379l238 96 241-139" />
        <path d="m63 225 18-11m-18 194 18-11M65 219v185m-6-179 12-8m-12 184 12-8" />
        <circle cx="320" cy="95" r="5" /><circle cx="82" cy="235" r="5" /><circle cx="561" cy="192" r="5" />
      </g>
      <g className="roof-deck" filter="url(#roof-shadow)">
        <path d="m82 379 238 96 241-139-239-96z" fill="url(#roof-copper)" />
        <path d="m82 379 238 96v16L82 395z" fill="#80462d" /><path d="m320 475 241-139v16L320 491z" fill="#513326" />
        <g stroke="#f4ce9d" strokeOpacity=".22"><path d="m130 351 239 96m-190-124 238 96m-190-124 238 96m-190-124 238 96" /><path d="m100 381 220 88m-213-97 105 42m52 21 70 28" /></g>
      </g>
      <g className="roof-underlay" filter="url(#roof-shadow)">
        <path d="m82 306 238 96 241-139-239-96z" fill="url(#roof-membrane)" />
        <path d="m82 306 238 96v5L82 311z" fill="#334951" /><path d="m320 402 241-139v5L320 407z" fill="#283d49" />
        <path d="m138 273 238 97m-119-167 238 98" stroke="#e4e6dd" strokeOpacity=".35" strokeDasharray="5 4" />
      </g>
      <g className="roof-shingle-layer" filter="url(#roof-shadow)">
        <path d="m82 235 238 96 241-139L322 95z" fill="url(#roof-shingles)" />
        <path d="m82 235 238 96v9L82 244z" fill="#172e40" /><path d="m320 331 241-139v9L320 340z" fill="#0c202f" />
        <path d="m82 235 238 96 241-139M82 235 322 95l239 97" stroke="#acc3cf" strokeOpacity=".5" />
        <path d="m82 244 238 96 241-139" stroke="#df985e" strokeOpacity=".7" strokeWidth="2" />
      </g>
    </svg>
  );
}
