/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  private playTone(
    freqs: number[],
    durations: number[],
    type: OscillatorType = "sine",
    volumeMax = 0.1
  ) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      let time = this.ctx.currentTime;
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(volumeMax, time + 0.02);

      freqs.forEach((freq, idx) => {
        const stepTime = durations[idx] || 0.1;
        osc.frequency.setValueAtTime(freq, time);
        time += stepTime;
      });

      gainNode.gain.setValueAtTime(volumeMax, time - 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time);

      osc.start();
      osc.stop(time);
    } catch (e) {
      console.warn("AudioContext block: ", e);
    }
  }

  // 8-bit Crystal Crystal pick up
  public playPickup() {
    this.playTone([523.25, 659.25, 783.99, 1046.50], [0.05, 0.05, 0.05, 0.1], "triangle", 0.08);
  }

  // Speech blip (customized typewriter chatter)
  public playTalk(pitchOffset = 0) {
    const pitch = 150 + pitchOffset * 50;
    this.playTone([pitch, pitch - 20], [0.02, 0.02], "square", 0.02);
  }

  // Player bumped or took damage
  public playHit() {
    this.playTone([200, 100, 50], [0.05, 0.05, 0.1], "sawtooth", 0.12);
  }

  // Completing a Quest
  public playQuestComplete() {
    this.playTone(
      [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50],
      [0.08, 0.08, 0.08, 0.08, 0.08, 0.2],
      "square",
      0.08
    );
  }

  // Drink healing Potion
  public playDrinkPotion() {
    this.playTone(
      [300, 450, 400, 550, 500, 700],
      [0.05, 0.05, 0.05, 0.05, 0.05, 0.15],
      "sine",
      0.07
    );
  }

  // Monster attacking / Boss roar
  public playBossRoar() {
    this.playTone([120, 90, 80, 50], [0.1, 0.1, 0.1, 0.3], "sawtooth", 0.15);
  }

  // Transisi episode / Teleport
  public playTeleport() {
    this.playTone(
      [200, 300, 450, 600, 900, 1300],
      [0.04, 0.04, 0.04, 0.04, 0.04, 0.2],
      "sine",
      0.06
    );
  }

  // Player projectile shoot
  public playShoot() {
    this.playTone([800, 600, 300], [0.03, 0.03, 0.05], "triangle", 0.05);
  }

  // Active character select sound
  public playSelectCharacter() {
    this.playTone([440, 554, 659, 880], [0.06, 0.06, 0.06, 0.15], "sine", 0.08);
  }

  // Boss projectile hit shield/ground
  public playExplosion() {
    this.playTone([300, 150, 50], [0.06, 0.06, 0.12], "sawtooth", 0.1);
  }
}

export const sound = new SoundController();
