import XLSX from "xlsx";
import { ISiegReportObjectType } from "../../types/SiegReportObjectType";

export const excelConvertToJson = async (buffer: Buffer): Promise<ISiegReportObjectType[]> => {
    // Lê o Excel a partir do buffer (upload)
    const workbook = XLSX.read(buffer, { type: "buffer" });

    //Selecionando o nome da primeira aba
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Começa na linha 3 (linha 1 = cabeçalho)
    const options = {
        range: 2 // ignora as 2 primeiras linhas
    };

    //Converte a aba para JSON
    const json = XLSX.utils.sheet_to_json<ISiegReportObjectType>(sheet, options);
    
    return json
};
