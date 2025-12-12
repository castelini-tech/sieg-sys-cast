import { Router } from "express";
import multer from 'multer';

import { insertReceiptInAsanaProject } from "../controllers/receiptsController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

//ROTAS
router.post("/insertAll", upload.single('file'), insertReceiptInAsanaProject);

export default router;