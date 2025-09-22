import { server } from './src/app.js';
import { config } from './src/config/config.js';

const PORT = config.PORT;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});