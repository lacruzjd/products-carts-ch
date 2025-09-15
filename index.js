import { server } from './src/server.js';

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});