/**
 * Streaming of count-up event.
 */
import { EventEmitter2 } from 'eventemitter2';

/**
 * Event object.
 */
export interface CounterEvent {
  count: number;
}

/**
 * Make a stream.
 */
export function makeCounterStream(id: string): CounterStream {
  const stream = new TestingStream(id);
  return stream;
}

/**
 * Event object which is 使いまわされる.
 */
const eventObject: CounterEvent = {
  count: 0,
};

/**
 * stream of counter.
 */
export abstract class CounterStream {
  public readonly emitter: EventEmitter2;
  constructor(protected id: string) {
    // Init
    this.emitter = new EventEmitter2();

    this.start();
  }
  protected abstract start(): void;
  /**
   * Close this stream.
   */
  public abstract close(): void;
  /**
   * Emit counter event.
   */
  protected emit(count: number): void {
    eventObject.count = count;
    this.emitter.emit('count', eventObject);
  }
}

/**
 * CounterStream for testing.
 */
export class TestingStream extends CounterStream {
  protected timerid: any;
  protected start() {
    // randomly update counters.
    let counter = Math.floor(Math.random() * 10);
    this.emit(counter);
    const loop = () => {
      counter++;
      this.emit(counter);
      this.timerid = setTimeout(loop, Math.floor(Math.random() * 1500));
    };
    loop();
  }
  public close() {
    if (this.timerid != null) {
      clearTimeout(this.timerid);
    }
    this.emitter.emit('close');
  }
}
