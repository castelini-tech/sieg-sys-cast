import { Request, Response } from "express";
import { excelConvertToJson } from "../services/receipt/excelConvertToJson.service";
import { matchReceiptsCFOP } from "../services/sieg/matchReceiptsCfop.service";
import { resolveReceiptsDestination } from "../services/receipt/resolveReceiptsDestination";

export const insertReceiptInAsanaProject = async (req: Request, res: Response) => {
  try {

    //Convertendo a planilha recebida em JSON
    const json = await excelConvertToJson(req.file!.buffer);

    //Buscando o CFOP das notas
    const receiptsWithCFOP = await matchReceiptsCFOP(json);

    //Decidindo o caminho qual nota vai (Observação/Asana/Erro)
    const receiptsWithDestination = resolveReceiptsDestination(receiptsWithCFOP);

    return res.json(receiptsWithDestination);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
