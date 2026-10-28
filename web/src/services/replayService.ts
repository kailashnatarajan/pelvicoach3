import { NormalizedSession } from './sessionSchema';
import * as SF from './signalFeedback';

export interface ReplayFeature {
  pf: number;       // Microvolts (4 - 100)
  pct: number;      // 0 - 100% squeeze
  mr: number;       // Mains ratio (0.03 or 0.6)
  quality: string;  // 'ok' | 'flat' | 'line_interference'
  inContraction: boolean;
  t: number;        // Current playback time in seconds
  duration: number; // Duration of session in seconds
  ab?: number;      // Abdominal co-activation if present
}

export type ReplayListener = () => void;

class ReplayService {
  private _session: NormalizedSession | null = null;
  private _summary: SF.SessionSummary | null = null;
  private _pos: number = 0;
  private _isPlaying: boolean = false;
  private _speed: number = 1;
  private _floor: number = 0.04;
  private _cfg: SF.FeedbackConfig = { ...SF.DEFAULTS };
  private _lastTime: number = 0;
  private _animId: number | null = null;
  private _listeners: Set<ReplayListener> = new Set();

  constructor() {
    this._loop = this._loop.bind(this);
    if (typeof window !== 'undefined') {
      (window as any).PelviReplay = {
        ready: () => this.isReady(),
        isPlaying: () => this._isPlaying,
        feature: (cal?: boolean) => this.feature(cal),
      };
    }
  }

  public subscribe(listener: ReplayListener): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  private _notify() {
    this._listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('ReplayService listener error:', err);
      }
    });
  }

  public get session(): NormalizedSession | null {
    return this._session;
  }

  public get summary(): SF.SessionSummary | null {
    return this._summary;
  }

  public get pos(): number {
    return this._pos;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get speed(): number {
    return this._speed;
  }

  public get cfg(): SF.FeedbackConfig {
    return this._cfg;
  }

  public get floor(): number {
    return this._floor;
  }

  public isReady(): boolean {
    return !!this._session && !!this._summary;
  }

  public setSession(s: NormalizedSession, cfg?: SF.FeedbackConfig) {
    this._session = s;
    if (cfg) this._cfg = { ...cfg };
    this._summary = SF.summarize(s, this._cfg);
    this._pos = s.t[0];
    const sortedEnv = Float64Array.from(s.envelope).sort();
    this._floor = sortedEnv[Math.floor(0.05 * s.t.length)] || 0.04;
    this._notify();
  }

  public setSpeed(speed: number) {
    this._speed = speed;
    this._notify();
  }

  public setConfig(cfg: SF.FeedbackConfig) {
    this._cfg = { ...cfg };
    if (this._session) {
      this._summary = SF.summarize(this._session, this._cfg);
    }
    this._notify();
  }

  public seek(t: number) {
    if (!this._session) return;
    const start = this._session.t[0];
    const end = this._session.t[this._session.t.length - 1];
    this._pos = Math.max(start, Math.min(end, t));
    this._notify();
  }

  public play() {
    if (!this._session) return;
    const end = this._session.t[this._session.t.length - 1];
    if (this._pos >= end) {
      this._pos = this._session.t[0];
    }
    this._isPlaying = true;
    this._lastTime = performance.now();
    if (!this._animId) {
      this._animId = requestAnimationFrame(this._loop);
    }
    this._notify();
  }

  public pause() {
    this._isPlaying = false;
    if (this._animId) {
      cancelAnimationFrame(this._animId);
      this._animId = null;
    }
    this._notify();
  }

  public togglePlay() {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private _loop(now: number) {
    if (!this._isPlaying || !this._session) {
      this._animId = null;
      return;
    }
    const dt = (now - this._lastTime) / 1000;
    this._lastTime = now;
    const end = this._session.t[this._session.t.length - 1];
    let nextPos = this._pos + dt * this._speed;
    if (nextPos >= end) {
      // Loop replay seamlessly so biofeedback session continues
      nextPos = this._session.t[0];
    }
    this._pos = nextPos;
    this._notify();
    this._animId = requestAnimationFrame(this._loop);
  }

  public feature(cal?: boolean): ReplayFeature | null {
    if (!this._session || !this._summary) return null;
    const s = this._session;
    const i = SF.indexAt(s, this._pos);
    const pk = this._summary.envelopePeak;
    const fl = this._floor;
    const fb = SF.feedbackAt(s, this._pos, this._cfg, this._summary.refLevel);
    const nrm = Math.max(0, Math.min(1.3, pk > fl ? (s.envelope[i] - fl) / (pk - fl) : 0));
    let pf = cal ? 100 : 4 + 96 * nrm;
    if (fb.quality === 'flat') pf = 0.4;
    const pct = Math.round(Math.min(100, cal ? 100 : nrm * 100));
    const mr = fb.quality === 'line_interference' ? 0.6 : 0.03;

    const inContraction = fb.level === 'above';

    return {
      pf,
      pct,
      mr,
      quality: fb.quality,
      inContraction,
      t: this._pos,
      duration: s.meta.durationS,
      ab: s.abd ? s.abd[i] : undefined,
    };
  }
}

export const replayService = new ReplayService();
