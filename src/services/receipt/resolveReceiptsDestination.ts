import { CFOP_REMESSA_A_ORDEM, CFOP_VENDA_A_ORDEM } from "../../data/CFOPsData";
import { storesCNPJData } from "../../data/storesCNPJData";
import { ReceiptStatus } from "../../types/ReceiptStatusType";
import { ISiegReportForAsanaObjectType } from "../../types/SiegReportForAsanaObjectType";
import { SiegReportForAsanaObjectWithDestinationType } from "../../types/SiegReportForAsanaObjectWithDestinationType";
import { onlyNumbers } from "../../utils/formatters";
import { getSupplierInformation } from "../../utils/helpers";
import { receiptRules } from "../../utils/receiptRules";

export const resolveReceiptsDestination = (
    receipts: ISiegReportForAsanaObjectType[]
): SiegReportForAsanaObjectWithDestinationType[] => {
    //Para remover a nota origem do array ja que ela foi conciliada
    const matchedReceiptsOrderSaleForRemove: number[] = [];

    const receiptsDestination = receipts.map<SiegReportForAsanaObjectWithDestinationType>((receipt) => {

        //Regras gerais que vão tirando o que não é venda e va distribuindo por exemplo devoluções e afins
        const rule = receiptRules.find((rule) => rule.validate(receipt));

        //Caso não tenha caido em nenhuma Rule
        if (!rule) {
            return {
                ...receipt,
                status: "NAO_CLASSIFICADO",
                statusDescription: `NF ${receipt["Num NFe"]} - Nenhuma regra aplicada`
            }
        }

        //Ajustando o nome das notas com o fornecedor para ajustar o nome que irá para o Asana
        if (rule!.status === "OBSERVACAO" || rule!.status === "VENDA") {
            const supplierInformation = getSupplierInformation(receipt["CNPJ Emit"])
            const receiptNameInAsana = `NF ${receipt["Num NFe"]} - ${supplierInformation?.brand}`;

            return {
                ...receipt,
                status: rule.status as ReceiptStatus,
                statusDescription: rule.description,
                receiptNameInAsana
            }
        }

        //Ajustando as questões das remessas/origem
        if (rule.status === "REMESSA_A_ORDEM" || rule.status === "VENDA_A_ORDEM") {
            const receiptStatusIsOrder = (rule.status === "REMESSA_A_ORDEM"); //CFOP_REMESSA_A_ORDEM = ["6923"];
            const receiptStatusIsSaleOrder = (rule.status === "VENDA_A_ORDEM"); //CFOP_VENDA_A_ORDEM = ["6118", "5118"];


            //Caso eu tenha esse tipo e eu não encontre o match completo, valores diferentes por exemplo devo mover para observação  
            //Se por ventura vir com algum CNPj que não deveria


            if (receiptStatusIsOrder) { //Significa que muito provavelmente o CFOP é 6923 - Obrigatóriamente tenho que ter a 6118 pra ela
                var isMatch = false;

                for (let index = 0; index < receipts.length; index++) {
                    const receiptOriginalArrayForComparison = receipts[index];

                    //Para definir REMESSA/ORDEM
                    const isSameValue = Number(receipt.Valor) === Number(receiptOriginalArrayForComparison.Valor);
                    const isDifferentNfeNumber = Number(receipt["Num NFe"]) !== Number(receiptOriginalArrayForComparison["Num NFe"]);
                    const isSameIssuer = onlyNumbers(receipt["CNPJ Emit"]) === onlyNumbers(receiptOriginalArrayForComparison["CNPJ Emit"]);

                    const receiptForComparisonIsFromCD = (onlyNumbers(receiptOriginalArrayForComparison["CNPJ Dest"]) === onlyNumbers(storesCNPJData[13]));

                    const receiptForComparisonIsSaleOrder = receiptOriginalArrayForComparison.CFOP.some((cfop) =>
                        CFOP_VENDA_A_ORDEM.includes(String(cfop))
                    );

                    //Casos onde são o mesmo valor
                    if (isSameValue && isDifferentNfeNumber && isSameIssuer) {
                        const supplierInformation = getSupplierInformation(receipt["CNPJ Emit"])

                        //Verificando se é REMESSA_A_ORDEM ou VENDA_A_ORDEM
                        if (receiptStatusIsOrder && receiptForComparisonIsFromCD && receiptForComparisonIsSaleOrder) {
                            isMatch = true;

                            const receiptNameInAsana = `NF ${receipt["Num NFe"]} / ${receiptOriginalArrayForComparison["Num NFe"]} - ${supplierInformation?.brand}`;

                            //Para ficar somente a nota conciliada no objeto
                            matchedReceiptsOrderSaleForRemove.push(receiptOriginalArrayForComparison["Num NFe"]);

                            return {
                                ...receipt,
                                status: "REMESSA_ORIGEM",
                                statusDescription: "CFOP com Remessa e Origem",
                                receiptNameInAsana
                            }
                        }
                    }
                }

                //Siginificava que para essa nota 6923 não foi encontrado a sua respectiva 6118/5118, logo ela deve ir para observação
                if (!isMatch) {
                    return {
                        ...receipt,
                        status: "SEM_MATCH_REMESSA_ORIGEM" as ReceiptStatus,
                        statusDescription: `NF ${receipt["Num NFe"]} - CFOP 6923: (REMESSA A ORDEM) sem sua respectiva (VENDA A ORDEM) 6118/5118`,
                        receiptNameInAsana: ""
                    }
                }

            } else if (receiptStatusIsSaleOrder) { //Significa que muito provavelmente o CFOP é 6118 ou 5118 - Obrigatóriamente deve ter uma 6923 pra ela
                var isMatch = false;

                for (let index = 0; index < receipts.length; index++) {
                    const receiptOriginalArrayForComparison = receipts[index];

                    //Para definir REMESSA/ORDEM
                    const isSameValue = Number(receipt.Valor) === Number(receiptOriginalArrayForComparison.Valor);
                    const isDifferentNfeNumber = Number(receipt["Num NFe"]) !== Number(receiptOriginalArrayForComparison["Num NFe"]);
                    const isSameIssuer = onlyNumbers(receipt["CNPJ Emit"]) === onlyNumbers(receiptOriginalArrayForComparison["CNPJ Emit"]);

                    //Nesse caso como é a nota com o CFOP 6923, não pode ser para o CNPJ da 13
                    const receiptForComparisonNoIsFromCD = (onlyNumbers(receiptOriginalArrayForComparison["CNPJ Dest"]) !== onlyNumbers(storesCNPJData[13]));

                    const receiptForComparisonIsShipmentOrder = receiptOriginalArrayForComparison.CFOP.some((cfop) =>
                        CFOP_REMESSA_A_ORDEM.includes(String(cfop))
                    );

                    //Casos onde são o mesmo valor
                    if (isSameValue && isDifferentNfeNumber && isSameIssuer) {

                        //Verificando se Houve o match da nota com CFOP 6118/5118 com uma nota 6923
                        if (receiptStatusIsOrder && receiptForComparisonNoIsFromCD && receiptForComparisonIsShipmentOrder) {
                            //É setado para true, pois se caiu aqui e encontrou essa nota significa que no if anterior a nota 6923 já conciliada, caso contrário precisamos indicar que houve algum problema com essa nota
                            isMatch = true;
                        }
                    }
                }

                //Siginifica que não houve nenhum match pra essa nota, logo ela precisa ficar em observação
                if (!isMatch) {
                    return {
                        ...receipt,
                        status: "SEM_MATCH_REMESSA_ORIGEM" as ReceiptStatus,
                        statusDescription: `NF ${receipt["Num NFe"]} - CFOP 6118/5118: (VENDA A ORDEM) sem sua respectiva (REMESSA A ORDEM) 6923`,
                        receiptNameInAsana: ""
                    }
                }
            }
        }

        return {
            ...receipt,
            status: rule.status as ReceiptStatus,
            statusDescription: rule.description
        }

    })

    //Remove as notas que fooram conciliadas REMESSA/ORIGEM
    return receiptsDestination.filter(
        r => !matchedReceiptsOrderSaleForRemove.includes(r["Num NFe"])
    );


    //A questão de notas que tem o o valor errado costumam acontecer mais na Dakota, bom adicionar um observação nesses casos

    //Notas de venda 
}

