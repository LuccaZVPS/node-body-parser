import { IncomingMessage } from "http";

const http = require('http');

const bodyParser = async (req:IncomingMessage) => {
  const limit = 1024 * 1024 // 1MB
  let data = Buffer.from("")
  return new Promise((resolve, reject) => {
    req.on("readable",() => {

        let chunk;

        while ((chunk = req.read()) != null) {
           if (data.length + chunk.length > limit) {
            return reject(null)
            
           }
         data =  Buffer.concat([data,chunk])

        }
    })
    req.on("end", () => {
        resolve(data.toString())
    })
  })
};

const server = http.createServer(async (req, res) => {
  try {
    const data = await bodyParser(req);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Recivided data: ${data}`);
  } catch (error) {
    res.writeHead(413, { 'Content-Type': 'text/plain' });
    res.end('Payload Too Large');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
