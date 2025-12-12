import { Router } from "express";

import receiptsRoutes from "./receipts.routes";

const router = Router();

router.use("/receipts", receiptsRoutes)

export default router;
