/** One Euro Filter — low-lag smoothing used in production AR (Casiez et al.). */
export class OneEuro {
  private xPrev?: number;
  private dxPrev = 0;
  private tPrev?: number;

  constructor(
    private minCutoff = 1.2,
    private beta = 0.007,
    private dcutoff = 1.0,
  ) {}

  reset() {
    this.xPrev = undefined;
    this.dxPrev = 0;
    this.tPrev = undefined;
  }

  filter(x: number, t: number): number {
    if (this.tPrev === undefined || this.xPrev === undefined) {
      this.tPrev = t;
      this.xPrev = x;
      return x;
    }
    const dt = Math.max(0.001, (t - this.tPrev) / 1000);
    const dx = (x - this.xPrev) / dt;
    const edx = expSmooth(this.dxPrev, dx, alpha(dt, this.dcutoff));
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    const xOut = expSmooth(this.xPrev, x, alpha(dt, cutoff));
    this.tPrev = t;
    this.xPrev = xOut;
    this.dxPrev = edx;
    return xOut;
  }
}

function alpha(dt: number, cutoff: number) {
  const tau = 1 / (2 * Math.PI * cutoff);
  return 1 / (1 + tau / dt);
}

function expSmooth(prev: number, next: number, a: number) {
  return a * next + (1 - a) * prev;
}

export class VecFilter {
  private x = new OneEuro();
  private y = new OneEuro();

  filter(pt: { x: number; y: number }, t: number) {
    return { x: this.x.filter(pt.x, t), y: this.y.filter(pt.y, t) };
  }

  reset() {
    this.x.reset();
    this.y.reset();
  }
}
