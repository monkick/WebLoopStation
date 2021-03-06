import {Injectable} from '@angular/core';
import {BufferLoaderFoo} from "../lib/BufferLoaderFoo";
import {LooperAudioContext} from "../lib/LooperAudioContext";

@Injectable()
export class PlayService {
    private _context: AudioContext;
    private _playing: any = false;
    private _start: any   = false;
    private _stop: any    = false;

    private _sources: any[];
    private _soundDuration: number;

    private _audioURLs: string[];
    private _bufferList: any[];

    private _bufferLoader: any;

    private _voices: string[];
    private _delay: any;
    private _feedback: any;

    constructor() {
        this._context       = LooperAudioContext.getInstance();
        this._sources       = [];
        this._soundDuration = 0;
        this._audioURLs     = [];
        this._bufferList    = [];
        this._bufferLoader  = new BufferLoaderFoo(
            this._context,
            (bufferList) => {
                const bufferSources: AudioBufferSourceNode[] = [];

                for (let i = 0; i < bufferList.length; i++) {
                    bufferSources[i]        = this._context.createBufferSource();
                    bufferSources[i].buffer = bufferList[i];

                    this.playSound(bufferSources[i].buffer, 0);
                }
            }
        );
        this._voices                = [
            "../../assets/sounds/angular_83.m4a",
            "../../assets/sounds/angular_c.m4a",
            "../../assets/sounds/angular_q.m4a",
        ];
        this._delay                 = this._context.createDelay();
        // this._delay.delayTime.value = 0.08;
        this._delay.delayTime.value = 0.1;
        this._delay.connect(this.createGain(this._context));

        this._feedback            = this.createGain(this._context);
        // this._feedback.gain.value = 0.5;
        this._feedback.gain.value = 0.7;
        this._delay.connect(this._feedback);
        this._feedback.connect(this._delay);

    }

    get playing(): any {
        return this._playing;
    }

    set playing(value: any) {
        this._playing = value;
    }

    get start(): any {
        return this._start;
    }

    set start(value: any) {
        this._start = value;
    }

    get stop(): any {
        return this._stop;
    }

    set stop(value: any) {
        this._stop = value;
    }

    get soundDuration(): number {
        return this._soundDuration;
    }

    get audioURLs(): string[] {
        return this._audioURLs;
    }

    stopSound() {
        for (let i = 0; i < this._sources.length; i++) {
            const source = this._sources[i];
            source.stop();
        }
    }

    resetSoundParam() {
        this._sources       = [];
        this._soundDuration = 0;
        this._audioURLs     = [];
        this._bufferLoader.resetParam();
    }

    createGain(context: AudioContext): GainNode {
        const gainNode      = context.createGain();
        gainNode.gain.value = 0.5;
        gainNode.connect(context.destination);
        return gainNode
    }

    public setAudioURLs(url: string): void {
        this._audioURLs.push(url);
    }

    public playAudio(context: AudioContext): void {
        this._bufferLoader.load(this._audioURLs);
    }

    public playSound(buffer, time) {
        const source = this._context.createBufferSource();

        if (this._soundDuration === 0) {
            this._soundDuration = buffer.duration * 1000;
        }

        source.buffer = buffer;
        source.loop   = true;

        source.connect(this.createGain(this._context));
        source.start(time);

        this._sources.push(source);

        return source;
    }

    public playVoice(num: number) {
        const source = this._voices[num - 1];

        const convolverNode = this._context.createConvolver();
        let concertHallBuffer: any;

        this._bufferLoader.loadBufferFromURL(source, (buffer) => {
            concertHallBuffer = buffer;
            const source      = this._context.createBufferSource();
            source.buffer     = concertHallBuffer;
            source.connect(this.createGain(this._context));
            source.connect(this._delay);
            source.start(0);
        });

        convolverNode.buffer = concertHallBuffer;
        convolverNode.connect(this._context.destination);

    }
}
