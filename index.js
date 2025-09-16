import { server } from './src/app.js';

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});