/**
 * Streaming of count-up event.
 */
import { EventEmitter2 } from 'eventemitter2';
import { Runtime } from '../../defs/runtime';
import * as firebase from 'firebase';
import { handleError } from '../error';
import { sleep } from '../sleep';

/**
 * Timeout for initial request to realtime database.
 */
const FIRST_TIMEOUT = 2000;

/**
 * Event object.
 */
export interface CounterEvent {
  count: number;
}

/**
 * Make a stream.
 * @param id Id of this counter.
 * @param serve whether this stream is for server.
 */
export function makeCounterStream(
  id: string,
  runtime: Runtime,
  server: boolean,
): CounterStream {
  //const stream = new TestingStream(id, server);
  const stream = new FirebaseStream(id, runtime, server);
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
  }
  /**
   * Initialize stream and return current count.
   * Result is null if it timed out.
   */
  public abstract start(): Promise<number | null>;
  /**
   * Close this stream.
   */
  public abstract close(): void;
  /**
   * Increment the counter.
   */
  public abstract increment(): void;
  /**
   * Emit counter event.
   */
  protected emit(count: number): void {
    eventObject.count = count;
    this.emitter.emit('count', eventObject);
  }
}

/**
 * Stream which receives data from firebase.
 */
export class FirebaseStream extends CounterStream {
  protected database: firebase.database.Database;
  protected ref: firebase.database.Reference | null = null;
  constructor(
    id: string,
    protected runtime: Runtime,
    protected server: boolean,
  ) {
    super(id);
    this.database = runtime.firebase.database();
  }
  public async start(): Promise<number | null> {
    // Initialize connection to realtime database.
    const ref = this.database.ref(this.id);
    this.ref = ref;
    if (this.server) {
      // fetch just once.
      const start_time = Date.now();
      return await Promise.race([
        sleep(FIRST_TIMEOUT).then(() => null),
        ref.once('value').then((snapshot: firebase.database.DataSnapshot) => {
          const count: number = snapshot.val();
          return count;
        }),
      ]);
    } else {
      // Listen to data.
      return new Promise<number | null>(resolve => {
        let res: typeof resolve | null = resolve;
        ref.on(
          'value',
          snapshot => {
            const val: number = snapshot ? snapshot.val() : 0;
            if (res != null) {
              resolve(val);
              res = null;
            }
            this.emit(snapshot ? snapshot.val() : 0);
          },
          handleError,
        );
        // set timeout.
        sleep(FIRST_TIMEOUT).then(() => {
          if (res != null) {
            res(null);
            res = null;
          }
        });
      });
    }
  }
  public close() {
    if (this.ref != null) {
      this.ref.off();
    }
    this.emitter.emit('close');
  }
  public increment() {
    if (this.ref != null) {
      this.ref.transaction((count: number | null) => {
        if (count == null) {
          return 1;
        } else {
          return count + 1;
        }
      });
    }
  }
}
/**
 * CounterStream for testing.
 */
export class TestingStream extends CounterStream {
  protected timerid: any;
  protected counter: number = 0;
  constructor(id: string, protected server: boolean) {
    super(id);
  }
  public async start() {
    await void 0;
    // If server, this decide initial counter.
    this.counter = Math.floor(Math.random() * 10);
    if (this.server) {
      this.emit(this.counter);
      return this.counter;
    }
    // randomly update counters.
    const loop = () => {
      this.counter++;
      this.emit(this.counter);
      this.timerid = setTimeout(loop, Math.floor(Math.random() * 9000));
    };
    loop();
    return this.counter;
  }
  public close() {
    if (this.timerid != null) {
      clearTimeout(this.timerid);
    }
    this.emitter.emit('close');
  }
  public increment() {
    this.emit(++this.counter);
  }
}
