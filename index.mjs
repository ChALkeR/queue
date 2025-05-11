export class Queue {
  #limit = 1;
  #busy = 0;
  #queue = [];

  constructor(limit = 1) {
    this.#limit = limit;
  }

  #run() {
    if (this.#busy < this.#limit && this.#queue.length > 0) this.#queue.shift()();
  }

  async claim() {
    if (this.#busy < this.#limit) {
      // Fast path
      this.#busy++;
      return;
    }

    let done = false;
    await new Promise(resolve => {
      this.#queue.push(() => {
        this.#busy++;
        resolve();
      });
      this.#run();
    });
  }

  release() {
    this.#busy--;
    this.#run();
  }

  get limit() {
    return this.#limit;
  }

  get size() {
    return this.#queue.length + this.#busy;
  }
}

export class Lock extends Queue {
  constructor() {
    super(1);
  }
}
