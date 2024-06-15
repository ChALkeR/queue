# @chalker/queue

A trivial Queue / Lock implementation that I used in my personal projects.

Example: https://github.com/nodejs/Gzemnid/blob/main/src/queue.js

## Queue

Usage:

```js
import { Queue } from '@chalker/queue'

const queue = new Queue(10) // concurrency

async function run() {
  await queue.claim()
  // do async stuff with controlled maximum concurrency
  queue.release()
}
```

## Lock

`new Lock()` is just an alias to `new Queue(1)`, which can be used 

```js
import { Queue } from '@chalker/queue'

const lock = new Lock()

async function run() {
  await lock.claim()
  // do async stuff with maximum concurrency = 1
  lock.release()
}
```

## Full example

```js
import { Queue } from '@chalker/queue'

const queue = new Queue(3)

let concurrency = 0 // Just for testing purposes
async function run(x) {
  await queue.claim()
  console.log(`Start #${x}, concurrency: ${++concurrency}`)
  await new Promise(resolve => setTimeout(resolve, 1))
  console.log(`End #${x}, concurrency: ${concurrency--}`)
  queue.release()
}

const args = new Array(6).fill(0).map((_, i) => i + 1)
await Promise.all(args.map(run))
```

Output:
```
Start #1, concurrency: 1
Start #2, concurrency: 2
Start #3, concurrency: 3
End #1, concurrency: 3
Start #4, concurrency: 3
End #2, concurrency: 3
Start #5, concurrency: 3
End #3, concurrency: 3
Start #6, concurrency: 3
End #4, concurrency: 3
End #5, concurrency: 2
End #6, concurrency: 1
```

## License

[MIT](./LICENSE)