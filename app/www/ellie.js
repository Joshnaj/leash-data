/* Ellie the elephant, drawn as SVG. Moods: happy, proud, careful, worried. */
window.ellieSvg = (mood, size) => {
  const m = mood || 'happy';
  const open = m !== 'proud';
  const look = m === 'careful' ? 3 : 0;
  const nervous = m === 'careful' || m === 'worried';
  const eyes = open
    ? '<g transform="translate(' + look + ' 0)"><ellipse cx="76" cy="76" rx="19" ry="23" fill="#fff"/><ellipse cx="144" cy="76" rx="19" ry="23" fill="#fff"/><ellipse cx="78" cy="79" rx="15" ry="19" fill="#3A2E5C"/><ellipse cx="142" cy="79" rx="15" ry="19" fill="#3A2E5C"/><ellipse cx="78" cy="87" rx="10" ry="9" fill="#7C6BE8"/><ellipse cx="142" cy="87" rx="10" ry="9" fill="#7C6BE8"/><circle cx="71" cy="69" r="6.5" fill="#fff"/><circle cx="135" cy="69" r="6.5" fill="#fff"/><circle cx="85" cy="89" r="3" fill="#fff"/><circle cx="149" cy="89" r="3" fill="#fff"/></g>'
    : '<g fill="none" stroke="#3A2E5C" stroke-width="6" stroke-linecap="round"><path d="M60 82q16-20 32 0"/><path d="M128 82q16-20 32 0"/></g>';
  const brows = m === 'worried' ? '<g fill="none" stroke="#3A2E5C" stroke-width="4.5" stroke-linecap="round"><path d="M60 46q12-8 24-5" transform="rotate(-14 72 44)"/><path d="M136 41q12-3 24 5" transform="rotate(14 148 44)"/></g><path class="e-drip" d="M56 96q-7 11 0 15 7-4 0-15z" fill="#8FD3F4"/>' : '';
  const sweat = nervous ? '<path class="e-drip" d="M172 34q-9 14 0 20 9-6 0-20z" fill="#8FD3F4"/>' : '';
  const trunk = nervous ? 'M110 92c0 18-2 32 2 42 3 8 12 7 16 2' : 'M110 92c0 16 0 28 8 34 9 6 22 2 28-10';
  const mouth = m === 'worried' ? 'M80 130q8-9 16 0' : m === 'careful' ? 'M78 126q5-5 9 0t9 0' : 'M80 122q9 11 17 3';
  const sparkles = m === 'proud' ? '<g class="e-spark" fill="#FFD66E"><path d="M26 20l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M192 12l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/></g>' : '';
  const labels = { happy: 'smiling', proud: 'beaming with pride', careful: 'looking a little nervous', worried: 'looking worried' };
  return '<svg class="ellie is-' + m + '" width="' + size + '" height="' + Math.round(size * 0.88) + '" viewBox="0 0 220 194" role="img" aria-label="Ellie the elephant ' + labels[m] + '">' +
    '<ellipse cx="110" cy="186" rx="62" ry="7" fill="#3A2E5C" opacity=".1"/>' +
    '<g class="e-ear l"><path d="M62 54C28 26-4 52 4 96c6 34 40 50 62 30z" fill="#A9B8EE"/><path d="M58 66C36 48 14 64 20 94c4 22 26 32 42 20z" fill="#FFC2D6"/></g>' +
    '<g class="e-ear r"><path d="M158 54c34-28 66-2 58 42-6 34-40 50-62 30z" fill="#A9B8EE"/><path d="M162 66c22-18 44-2 38 28-4 22-26 32-42 20z" fill="#FFC2D6"/></g>' +
    '<ellipse cx="110" cy="158" rx="48" ry="30" fill="#BFCBF6"/><ellipse cx="74" cy="178" rx="17" ry="9" fill="#A9B8EE"/><ellipse cx="146" cy="178" rx="17" ry="9" fill="#A9B8EE"/>' +
    '<path d="M78 136q32 18 64 0l-3 15q-29 14-58 0z" fill="#FF8FB1"/><circle cx="110" cy="154" r="7.5" fill="#FFD66E" stroke="#E7AE2E" stroke-width="2"/>' +
    '<path d="M110 18c-46 0-68 36-66 66 2 38 30 58 66 58s64-20 66-58c2-30-20-66-66-66z" fill="#C9D4FA"/><path d="M92 20q10-16 18-3 8-13 18 3-18-5-36 0z" fill="#A9B8EE"/>' +
    eyes + brows + sweat +
    '<ellipse cx="50" cy="107" rx="13" ry="7" fill="#FFB3CB" opacity=".85"/><ellipse cx="170" cy="107" rx="13" ry="7" fill="#FFB3CB" opacity=".85"/>' +
    '<path fill="none" stroke="#B4C2F2" stroke-width="20" stroke-linecap="round" d="' + trunk + '"/><path fill="none" stroke="#9FB0E8" stroke-width="2.5" stroke-linecap="round" d="M101 106h17M101 115h18"/>' +
    '<path d="' + mouth + '" fill="none" stroke="#3A2E5C" stroke-width="4" stroke-linecap="round"/>' + sparkles + '</svg>';
};
