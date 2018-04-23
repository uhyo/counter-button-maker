/**
 * Sleeps given time in ms.
 */
export function sleep(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
