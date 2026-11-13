// Emblemas das equipes, desenhados numa caixa 200x200.
// c = { main, shade, line, accent, eye } — cada um é um valor de fill SVG.

function aguia(c) {
  return `
  <g stroke-linejoin="round">
    <path fill="${c.main}" stroke="${c.line}" stroke-width="3" d="M96 20 C122 16 146 30 154 54 L160 68 L152 100 L138 106 L141 120 L128 140
      L142 162 L123 157 L127 184 L107 169 L102 197 L86 175 L73 195 L66 169 L46 182 L50 153 L28 159 L42 131 L20 126 L40 105
      L22 89 L46 78 L34 57 L60 54 L57 33 L80 38 Z"/>
    <path fill="${c.shade}" d="M128 140 L142 162 L123 157 L127 184 L107 169 L102 197 L86 175 L73 195 L66 169 L46 182 L50 153 L28 159 L42 131
      L58 141 L74 129 L88 148 L102 134 L114 150 Z"/>
    <path fill="${c.shade}" d="M40 105 L62 104 L52 92 L74 90 L62 76 L46 78 L22 89 Z" opacity=".7"/>
    <path fill="none" stroke="${c.line}" stroke-width="2.5" stroke-linecap="round" d="M70 60 L84 66 M60 84 L78 86 M84 104 L98 100 M72 112 L60 118 M100 118 L112 112"/>
    <!-- bico -->
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="3" d="M152 52 C176 54 196 76 193 110 C192 122 187 130 180 135 C181 120 174 109 160 105 L136 105 C134 86 140 66 152 52 Z"/>
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="3" d="M138 108 L165 109 C167 119 159 128 146 128 C141 122 138 115 138 108 Z"/>
    <path fill="${c.line}" d="M168 84 C174 86 178 90 179 96 C174 93 170 92 165 92 Z"/>
    <path fill="#fff" opacity=".45" d="M156 60 C170 62 182 72 186 88 C178 76 168 70 152 68 Z"/>
    <!-- sobrancelha e olho -->
    <path fill="${c.line}" d="M92 54 L154 62 L150 76 L112 71 Z"/>
    <path fill="${c.eye}" stroke="${c.line}" stroke-width="2" d="M116 73 L147 77 C144 89 126 91 116 73 Z"/>
    <circle cx="135" cy="80" r="4.2" fill="${c.line}"/>
  </g>`;
}

function metadeGato(c) {
  return `
    <path fill="${c.main}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round" d="M100 56 L124 52 L152 16 L164 62 L178 84 L169 92 L188 112 L173 117 L186 140 L167 139
      L169 160 L149 153 L137 177 L118 186 L100 192 Z"/>
    <path fill="${c.line}" d="M148 32 L156 62 L133 56 Z"/>
    <path fill="${c.shade}" d="M188 112 L160 110 L173 117 Z M186 140 L156 128 L167 139 Z M169 160 L147 142 L149 153 Z"/>
    <path fill="${c.shade}" d="M100 150 C110 158 124 156 130 144 L140 160 L137 177 L118 186 L100 192 Z" opacity=".55"/>
    <!-- elmo -->
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round" d="M100 36 L120 42 L136 64 L166 86 L154 100 L126 93 L111 101 L107 130 L100 138 Z"/>
    <path fill="#fff" opacity=".28" d="M100 40 L118 45 L132 64 L120 60 L110 50 L100 48 Z"/>
    <circle cx="150" cy="87" r="3.4" fill="${c.line}"/>
    <!-- olho -->
    <path fill="${c.eye}" stroke="${c.line}" stroke-width="2.4" stroke-linejoin="round" d="M116 101 L150 104 L140 115 L122 113 Z"/>
    <!-- focinho e presas -->
    <path fill="${c.line}" d="M100 138 L111 135 L107 147 L100 151 Z"/>
    <path fill="${c.line}" d="M100 158 L127 152 L121 176 L100 183 Z"/>
    <path fill="#fff" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round" d="M114 155 L124 153 L120 181 Z"/>
    <path fill="none" stroke="${c.line}" stroke-width="2" stroke-linecap="round" d="M132 138 L156 134 M132 145 L154 148"/>`;
}

function gato(c) {
  return `
  <g>
    <g>${metadeGato(c)}</g>
    <g transform="translate(200 0) scale(-1 1)">${metadeGato(c)}</g>
    <!-- crista do elmo -->
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round" d="M100 6 L110 40 L105 96 L100 104 L95 96 L90 40 Z"/>
    <path fill="#fff" opacity=".3" d="M100 12 L104 40 L100 92 Z"/>
  </g>`;
}

function cavalo(c) {
  return `
  <g stroke-linejoin="round">
    <!-- crina -->
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="3" d="M116 30 C92 36 72 54 62 80 L38 70 C40 92 46 102 54 112 L24 110 C28 130 36 140 46 146
      L14 154 C22 170 32 178 44 182 L20 197 L96 197 C70 150 84 90 120 48 Z"/>
    <!-- cabeça e pescoço -->
    <path fill="${c.main}" stroke="${c.line}" stroke-width="3" d="M116 40 L107 12 L122 30 L128 8 L138 40 C152 60 164 90 176 118 C183 130 188 144 184 156
      C180 167 166 171 156 164 L150 152 C140 151 130 145 124 134 C120 152 128 174 144 197 L60 197 C60 150 76 86 116 40 Z"/>
    <path fill="${c.shade}" d="M124 134 C120 152 128 174 144 197 L120 197 C106 172 106 148 116 126 Z" opacity=".8"/>
    
    <path fill="none" stroke="${c.line}" stroke-width="2.6" stroke-linecap="round" d="M126 96 C146 104 150 130 126 134 M157 163 L170 153 M112 60 C100 76 92 96 88 118"/>
    <!-- topete -->
    <path fill="${c.accent}" stroke="${c.line}" stroke-width="2.4" d="M118 38 C132 46 140 60 138 80 C130 66 122 56 110 50 Z"/>
    <!-- orelha interna, olho, narina -->
    <path fill="${c.line}" d="M128 16 L133 38 L124 34 Z"/>
    <path fill="${c.eye}" stroke="${c.line}" stroke-width="2.2" d="M124 74 L144 79 C141 89 128 88 124 74 Z"/>
    <circle cx="135" cy="80" r="3.2" fill="${c.line}"/>
    <ellipse cx="174" cy="146" rx="3.6" ry="6" transform="rotate(-20 174 146)" fill="${c.line}"/>
  </g>`;
}

module.exports = { aguia, gato, cavalo };
