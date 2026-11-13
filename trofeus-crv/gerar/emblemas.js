// Emblemas das equipes em estilo silhueta, desenhados numa caixa 200x200.
// c = { main, shade, line, accent, eye } — cada um é um valor de fill SVG.
const r = n => Math.round(n * 10) / 10;

function penas(S, n, a0, passo, L0, dL, lado) {
  // leque de penas em lâmina a partir do ombro S
  let s = '';
  for (let k = 0; k < n; k++) {
    const a = (a0 - k * passo) * Math.PI / 180;
    const L = L0 - k * dL;
    const dx = Math.cos(a) * lado, dy = -Math.sin(a);
    const nx = -dy * lado * -1, ny = dx * lado * -1 * -1; // normal para o lado de cima
    const ux = Math.sin(a) * lado * -1 * -1 * -1, uy = -Math.cos(a);
    const P = (t, o) => `${r(S[0] + dx * t + ux * o)} ${r(S[1] + dy * t + uy * o)}`;
    s += `<path d="M${P(10, 7)} Q${P(L * .62, 13)} ${P(L, 5)} Q${P(L * .6, -3)} ${P(10, -6)} Z"/>`;
  }
  return s;
}

function aguia(c) {
  const T = [[197, 22], [194, 48], [188, 72], [178, 94], [166, 112], [152, 126], [138, 136]];
  const N = [[170, 46], [167, 68], [160, 88], [150, 104], [139, 117], [128, 127]];
  let d = 'M108 80 C126 56 158 34 197 22';
  for (let i = 0; i < N.length; i++) d += ` Q${T[i][0] - 6} ${T[i][1] + 16} ${N[i][0]} ${N[i][1]} Q${T[i + 1][0] - 14} ${T[i + 1][1] - 6} ${T[i + 1][0]} ${T[i + 1][1]}`;
  d += ' Q124 134 114 122 Z';
  const fendas = N.map((n, i) => `M${n[0]} ${n[1]} Q${r(118 + (n[0] - 118) * .55)} ${r(96 + (n[1] - 96) * .45 - 6 + i)} ${r(124 + i * -1)} ${r(84 + i * 6)}`).join(' ');
  const asa = `<path d="${d}"/><path d="${fendas}" fill="none" stroke-width="2.6" stroke-linecap="round"/>`;
  return `
  <g fill="${c.main}" stroke="${c.line}" stroke-width="1.8" stroke-linejoin="round">
    ${asa}<g transform="translate(200 0) scale(-1 1)">${asa}</g>
    <path d="M100 136 L130 186 L112 176 L100 198 L88 176 L70 186 Z"/>
    <path d="M100 150 L100 196 M94 150 L80 180 M106 150 L120 180" fill="none" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M78 84 Q100 72 122 84 L126 118 L100 160 L74 118 Z"/>
    <path d="M82 92 C76 66 84 42 104 39 C116 37 125 45 128 54 L146 61 C139 64 134 70 132 79 L124 68 L117 70 C115 80 117 90 120 98 Z"/>
  </g>
  <path d="M105 51 L121 55 L112 61 Z" fill="${c.line}"/>
  <path d="M100 104 L113 116 L100 146 L87 116 Z" fill="${c.line}" opacity=".85"/>
  <path d="M100 111 L107 117 L100 135 L93 117 Z" fill="${c.accent}"/>`;
}

function gato(c) {
  return `
  <g stroke-linejoin="round">
    <path fill="${c.main}" stroke="${c.line}" stroke-width="2" d="M62 14 L86 40 C102 33 122 38 138 52 L152 62 C162 70 172 78 180 86
      C186 92 186 101 179 105 L167 107 L160 140 L150 111 L139 113 L134 124 L129 114 L110 117 L121 141 L139 149 L143 135 L149 151
      L163 153 C169 159 167 169 159 173 L129 181 L113 177 L105 197 L93 181 L80 199 L73 177 L53 190 L54 165 L32 170 L42 147
      L20 141 L38 123 L22 105 L42 97 C40 70 46 48 56 40 Z"/>
    <!-- listras -->
    <path fill="${c.line}" d="M42 147 L70 142 L56 152 Z M38 123 L68 122 L52 130 Z M54 165 L78 156 L66 168 Z M93 181 L98 160 L104 176 Z M73 177 L80 158 L86 172 Z"/>
    <path fill="${c.line}" d="M126 150 L140 158 L156 160 L140 166 L124 162 Z" opacity=".5"/>
    <!-- elmo -->
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="2" d="M50 104 C44 72 56 48 84 40 C104 33 124 38 140 51 L182 86 L170 94 L150 84 L146 104
      L124 110 L110 98 L86 108 L70 98 Z"/>
    <path fill="${c.main}" stroke="${c.line}" stroke-width="2" d="M62 14 L88 44 L62 52 Z"/>
    <path fill="${c.line}" d="M66 26 L80 44 L66 48 Z"/>
    <path fill="none" stroke="${c.line}" stroke-width="2" stroke-linecap="round" d="M60 62 C78 50 108 46 134 60"/>
    <path fill="${c.shade}" d="M56 96 C52 80 56 68 60 62 C78 50 108 46 134 60 L144 68 C120 56 86 58 64 74 Z" opacity=".55"/>
    <g fill="${c.line}"><circle cx="64" cy="90" r="2.6"/><circle cx="82" cy="98" r="2.6"/><circle cx="142" cy="96" r="2.6"/><circle cx="166" cy="84" r="2.6"/></g>
    <!-- olho -->
    <path fill="${c.eye}" stroke="${c.line}" stroke-width="2" d="M112 70 L142 76 L132 86 L118 83 Z"/>
    <!-- presas -->
    <path fill="#fff" stroke="${c.line}" stroke-width="1.4" d="M167 107 L160 140 L150 111 Z M139 113 L134 124 L129 114 Z M139 149 L143 135 L149 151 Z"/>
  </g>`;
}

function cavalo(c) {
  return `
  <g stroke-linejoin="round">
    <path fill="${c.main}" stroke="${c.line}" stroke-width="2" d="M114 34 L111 6 C120 14 126 25 128 36 C138 50 146 66 152 84 C158 100 166 114 172 126
      C177 134 177 144 171 150 C166 155 158 155 153 150 C150 146 148 142 144 139 C136 137 128 132 121 123
      C116 138 118 158 130 180 C136 190 142 196 148 199 L44 199 C40 150 56 86 100 44 C104 40 108 36 114 34 Z"/>
    <path fill="${c.shade}" d="M121 123 C116 138 118 158 130 180 C136 190 142 196 148 199 L122 199 C106 176 104 150 110 128 Z" opacity=".7"/>
    <!-- crina em mechas -->
    <g fill="${c.accent}" stroke="${c.line}" stroke-width="1.8">
      <path d="M62 132 C52 146 44 170 42 198 C50 178 58 164 68 152 Z"/>
      <path d="M68 110 C52 122 36 146 28 174 C42 154 56 140 70 132 Z"/>
      <path d="M76 88 C58 96 36 118 22 146 C42 126 60 116 76 110 Z"/>
      <path d="M86 68 C66 72 42 90 24 116 C46 100 66 92 82 88 Z"/>
      <path d="M98 52 C78 52 52 64 32 86 C56 74 76 70 92 68 Z"/>
      <path d="M112 34 C92 28 66 34 46 52 C68 46 88 46 104 50 Z"/>
      <path d="M116 34 C128 40 137 53 137 68 C130 55 122 47 110 42 Z"/>
    </g>
    <path fill="${c.line}" d="M115 14 C119 20 122 28 123 35 L116 33 Z"/>
    <!-- olho, narina, mandíbula -->
    <path fill="${c.line}" d="M128 67 C134 62 142 64 147 71 C140 74 133 73 128 67 Z"/>
    <path fill="${c.line}" d="M163 130 C167 127 171 130 171 135 C169 139 165 139 164 136 C166 135 166 132 163 130 Z"/>
    <path fill="none" stroke="${c.line}" stroke-width="2.4" stroke-linecap="round" d="M126 86 C142 96 142 120 122 123 M155 149 L168 145"/>
  </g>`;
}

module.exports = { aguia, gato, cavalo };
