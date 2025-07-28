/**
 * Minified by jsDelivr using Terser v5.37.0.
 * Original file: /npm/pixelmatch@7.1.0/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
export default function pixelmatch(t, e, a, r, i, n = {}) {
	const {
		threshold: l = 0.1,
		alpha: o = 0.1,
		aaColor: f = [255, 255, 0],
		diffColor: s = [255, 0, 0],
		includeAA: h,
		diffColorAlt: c,
		diffMask: d,
	} = n;
	if (!isPixelData(t) || !isPixelData(e) || (a && !isPixelData(a)))
		throw new Error('Image data: Uint8Array, Uint8ClampedArray or Buffer expected.');
	if (t.length !== e.length || (a && a.length !== t.length))
		throw new Error('Image sizes do not match.');
	if (t.length !== r * i * 4) throw new Error('Image data size does not match width/height.');
	const u = r * i,
		x = new Uint32Array(t.buffer, t.byteOffset, u),
		w = new Uint32Array(e.buffer, e.byteOffset, u);
	let M = !0;
	for (let t = 0; t < u; t++)
		if (x[t] !== w[t]) {
			M = !1;
			break;
		}
	if (M) {
		if (a && !d) for (let e = 0; e < u; e++) drawGrayPixel(t, 4 * e, o, a);
		return 0;
	}
	const m = 35215 * l * l,
		[y, g, P] = f,
		[b, A, E] = s,
		[D, S, p] = c || s;
	let C = 0;
	for (let n = 0; n < i; n++)
		for (let l = 0; l < r; l++) {
			const f = n * r + l,
				s = 4 * f,
				c = x[f] === w[f] ? 0 : colorDelta(t, e, s, s, !1);
			if (Math.abs(c) > m) {
				const o = antialiased(t, l, n, r, i, x, w) || antialiased(e, l, n, r, i, w, x);
				!h && o
					? a && !d && drawPixel(a, s, y, g, P)
					: (a && (c < 0 ? drawPixel(a, s, D, S, p) : drawPixel(a, s, b, A, E)), C++);
			} else a && !d && drawGrayPixel(t, s, o, a);
		}
	return C;
}
function isPixelData(t) {
	return ArrayBuffer.isView(t) && 1 === t.BYTES_PER_ELEMENT;
}
function antialiased(t, e, a, r, i, n, l) {
	const o = Math.max(e - 1, 0),
		f = Math.max(a - 1, 0),
		s = Math.min(e + 1, r - 1),
		h = Math.min(a + 1, i - 1),
		c = a * r + e;
	let d = e === o || e === s || a === f || a === h ? 1 : 0,
		u = 0,
		x = 0,
		w = 0,
		M = 0,
		m = 0,
		y = 0;
	for (let i = o; i <= s; i++)
		for (let n = f; n <= h; n++) {
			if (i === e && n === a) continue;
			const l = colorDelta(t, t, 4 * c, 4 * (n * r + i), !0);
			if (0 === l) {
				if ((d++, d > 2)) return !1;
			} else l < u ? ((u = l), (w = i), (M = n)) : l > x && ((x = l), (m = i), (y = n));
		}
	return (
		0 !== u &&
		0 !== x &&
		((hasManySiblings(n, w, M, r, i) && hasManySiblings(l, w, M, r, i)) ||
			(hasManySiblings(n, m, y, r, i) && hasManySiblings(l, m, y, r, i)))
	);
}
function hasManySiblings(t, e, a, r, i) {
	const n = Math.max(e - 1, 0),
		l = Math.max(a - 1, 0),
		o = Math.min(e + 1, r - 1),
		f = Math.min(a + 1, i - 1),
		s = t[a * r + e];
	let h = e === n || e === o || a === l || a === f ? 1 : 0;
	for (let i = n; i <= o; i++)
		for (let n = l; n <= f; n++)
			if ((i !== e || n !== a) && ((h += +(s === t[n * r + i])), h > 2)) return !0;
	return !1;
}
function colorDelta(t, e, a, r, i) {
	const n = t[a],
		l = t[a + 1],
		o = t[a + 2],
		f = t[a + 3],
		s = e[r],
		h = e[r + 1],
		c = e[r + 2],
		d = e[r + 3];
	let u = n - s,
		x = l - h,
		w = o - c;
	const M = f - d;
	if (!(u || x || w || M)) return 0;
	if (f < 255 || d < 255) {
		(u = (n * f - s * d - (48 + (a % 2) * 159) * M) / 255),
			(x = (l * f - h * d - (48 + (((a / 1.618033988749895) | 0) % 2) * 159) * M) / 255),
			(w = (o * f - c * d - (48 + (((a / 2.618033988749895) | 0) % 2) * 159) * M) / 255);
	}
	const m = 0.29889531 * u + 0.58662247 * x + 0.11448223 * w;
	if (i) return m;
	const y = 0.59597799 * u - 0.2741761 * x - 0.32180189 * w,
		g = 0.21147017 * u - 0.52261711 * x + 0.31114694 * w,
		P = 0.5053 * m * m + 0.299 * y * y + 0.1957 * g * g;
	return m > 0 ? -P : P;
}
function drawPixel(t, e, a, r, i) {
	(t[e + 0] = a), (t[e + 1] = r), (t[e + 2] = i), (t[e + 3] = 255);
}
function drawGrayPixel(t, e, a, r) {
	const i =
		255 +
		((0.29889531 * t[e] + 0.58662247 * t[e + 1] + 0.11448223 * t[e + 2] - 255) * a * t[e + 3]) /
			255;
	drawPixel(r, e, i, i, i);
}
//# sourceMappingURL=/sm/007e15819c7ab9d2f7d59a04c06ce9239741e0ddb33007437b56eb40fdf4f968.map
