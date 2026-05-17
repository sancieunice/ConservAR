import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let ready: Promise<void> | null = null;

function ensureReady() {
  if (!ready) {
    ready = registerRoutes(app).then(() => undefined);
  }

  return ready;
}

export default async function handler(req: any, res: any) {
  await ensureReady();
  return app(req, res);
}
