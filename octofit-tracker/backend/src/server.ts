import express from 'express';
import './config/database.js';
import routes from './routes.js';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use(routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit Tracker API listening on port ${port}`);
  console.log(`API base URL: ${baseUrl}`);
});
