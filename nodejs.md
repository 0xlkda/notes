# Node.JS wrapped each module inside function

```javascript
function (require, module, __filename, __dirname) {
// let exports = module.exports;

  // Your Code...

// return module.exports;
}
```

# How to check if the file is execute directly or from 'require' function

```javascript
if (require.main === module) {
  // The file is being executed directly (not with require)
}
```

sample:

```javascript
const printInFrame = (size, header) => {
  console.log('*'.repeat(size));
  console.log(header);
  console.log('*'.repeat(size));
};

if (require.main === module) {
  printInFrame(process.argv[2], process.argv[3]);
} else {
  module.exports = printInFrame;
}
```

# Forking process

```javascript
// script.js
const http = require("http")
const pid = process.pid

http
  .createServer((req, res) => {
    for (let i = 0; i < 1e3; i++); // simulate CPU work
    res.end()
  })
  .listen(8080, () => {
    console.log(`Started process ${pid}`)
  })
```

```javascript
const cluster = require("cluster")
const os = require("os")

if (cluster.isMaster) {
  const cpus = os.cpus().length

  console.log(`Forking for ${cpus} CPUs`)
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed.` + "Starting a new worker...")
      cluster.fork()
    }
  })
} else { require("./script.js")
}
```

# Dockerfile for node app

```Dockerfile
FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
```

Using volumes to achieve hot module reload
`-v /app/node_modules` tells docker to ignore node_modules directory

```bash
docker run -v $(pwd):/app -v /app/node_modules --name react-app -p 3000:3000 react-app-image 
```

# Streaming example

```JavaScript
const decoder = new TextDecoder();
const encoder = new TextEncoder();

const readableStream = new ReadableStream({
  start(controller) {
    const text = "Stream me!";
    controller.enqueue(encoder.encode(text));
    controller.close();
  },
});

const transformStream = new TransformStream({
  transform(chunk, controller) {
    const text = decoder.decode(chunk);
    controller.enqueue(encoder.encode(text.toUpperCase()));
  },
});

const writableStream = new WritableStream({
  write(chunk) {
    console.log(decoder.decode(chunk));
  },
});

readableStream
   .pipeThrough(transformStream)
   .pipeTo(writableStream); // STREAM ME!
```

# Reading the stream with fetch

```JavaScript
const decoder = new TextDecoder();

const response = await fetch('/api/stream');
const reader = response.body.getReader();

let done = false;

while (!done) {
  const { value, done: doneReading } = await reader.read();
  done = doneReading;
  const data = JSON.parse(decoder.decode(value));
  // Do something with data
}
```

# Backpressure 

```JavaScript
const stream = new WritableStream(...)

async function writeData(data) {
    const writer = stream.getWriter();
    for (const chunk of data) {
        // Wait for the ready promise to resolve before writing the next chunk
        await writer.ready;
        writer.write(chunk);
    }
    writer.close();
}
```
