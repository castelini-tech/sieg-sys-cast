import { sleep, withTimeout, xmlToJson } from "../../utils/helpers";
import { ISiegReportObjectType } from "../../types/SiegReportObjectType";
import { fetchCFOPFromSieg } from "./fetchCFOPFromSieg.service";
import { ISiegReportForAsanaObjectType } from "../../types/SiegReportForAsanaObjectType";

export const matchReceiptsCFOP = async (receipts: ISiegReportObjectType[]): Promise<ISiegReportForAsanaObjectType[]> => {
    try {
        const receiptsWithCFOP: any[] = [];

        for (const receipt of receipts) {
            const nfeKey = receipt["Chave da NFe"];

            try {
                const cfop = await fetchCFOPFromSieg(nfeKey);

                receiptsWithCFOP.push({
                    ...receipt,
                    isSupplier: false,
                    CFOP: cfop,
                    error: null
                });
            } catch (error: any) {
                receiptsWithCFOP.push({
                    ...receipt,
                    isSupplier: false,
                    CFOP: [],
                    error: error?.message || "Erro desconhecido"
                });
            }

            // Aguarda 5 segundos ANTES da próxima requisição
            console.log("Aguardando 5 segundos...");
            await sleep(5000);
        }

        return receiptsWithCFOP;
    } catch (error: any) {
        console.error("Erro inesperado:", error);
        throw new Error("Erro geral ao buscar CFOP das notas");
    }
};
