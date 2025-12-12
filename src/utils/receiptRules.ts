import { CFOP_DEVOLUCAO, CFOP_REMESSA_A_ORDEM, CFOP_REMESSA_BRINDE, CFOP_TRANSFERENCIA, CFOP_VENDA, CFOP_VENDA_A_ORDEM } from "../data/CFOPsData";
import { storesCNPJData } from "../data/storesCNPJData";
import { suppliersData } from "../data/suppliersData";
import { ReceiptStatus } from "../types/ReceiptStatusType";
import { RulesValidationType } from "../types/RulesValidationType";
import { onlyNumbers } from "./formatters";

export const receiptRules: RulesValidationType[] = [
    {
        status: "SEM_FORNECEDOR" as ReceiptStatus,
        description: "CNPJ sem fornecedor cadastrado",
        validate: (receipt) => {
            const cnpjEmitente = onlyNumbers(receipt["CNPJ Emit"]).padStart(14, "0");

            const hasSupplier = suppliersData.some(
                (supplier) => supplier.cnpj === cnpjEmitente
            );

            return !hasSupplier;
        },
    },//6118/5118 PARA cnpj DIREFERETE DA 13
    {
        status: "OBSERVACAO" as ReceiptStatus,
        description: "Venda p/ CNPJ do CD",
        validate: (receipt) => {
            if (!Array.isArray(receipt.CFOP)) {
                console.log("[RULE] CFOP inválido na nota:", {
                    cfop: receipt.CFOP,
                    chave: receipt["Chave da NFe"],
                    numero: receipt["Num NFe"],
                });
                return false; // não deixa estourar erro
            }

            const isSale = receipt.CFOP.some((cfop) =>
                CFOP_VENDA.includes(String(cfop))
            );

            const isCNPJofCD = onlyNumbers(receipt["CNPJ Dest"]) === storesCNPJData[13];

            return isSale && isCNPJofCD;
        },
    },
    {
        status: "DEVOLUCAO" as ReceiptStatus,
        description: "CFOP de Devolução",
        validate(receipt) {
            return receipt.CFOP.some((cfop) =>
                CFOP_DEVOLUCAO.includes(String(cfop))
            );
        },

    },
    {
        status: "TRANSFERENCIA" as ReceiptStatus,
        description: "CFOP de Transferência",
        validate(receipt) {
            return receipt.CFOP.some((cfop) =>
                CFOP_TRANSFERENCIA.includes(String(cfop))
            );
        },
    },
    {
        status: "REMESSA_A_ORDEM" as ReceiptStatus,
        description: "CFOP de remessa/origem",
        validate(receipt) {
            return receipt.CFOP.some((cfop) =>
                CFOP_REMESSA_A_ORDEM.includes(String(cfop))
            );
        },
    },
    {
        status: "VENDA_A_ORDEM" as ReceiptStatus,
        description: "CFOP de remessa/origem",
        validate(receipt) {
            return receipt.CFOP.some((cfop) =>
                CFOP_VENDA_A_ORDEM.includes(String(cfop))
            );
        },
    },
    {
        status: "REMESSA_BRINDE" as ReceiptStatus,
        description: "CFOP de brinde",
        validate(receipt) {
            return receipt.CFOP.some((cfop) =>
                CFOP_REMESSA_BRINDE.includes(String(cfop))
            );
        },
    },
    {
        status: "VENDA" as ReceiptStatus,
        description: "CFOP de venda",
        validate(receipt) {
            return receipt.CFOP.some((cfop) =>
                CFOP_VENDA.includes(String(cfop))
            );
        },
    },
    {
        status: "NAO_CLASSIFICADO" as ReceiptStatus,
        description: "CFOP não encontrado",
        validate(receipt) {
            const isSaleCFOP = receipt.CFOP.some((cfop) =>
                CFOP_VENDA.includes(String(cfop))
            );

            const isDevolutionCFOP = receipt.CFOP.some((cfop) =>
                CFOP_DEVOLUCAO.includes(String(cfop))
            );

            const isShipmentOrderCFOP = receipt.CFOP.some((cfop) =>
                CFOP_REMESSA_A_ORDEM.includes(String(cfop))
            );

            const isSaleOrderCFOP = receipt.CFOP.some((cfop) =>
                CFOP_VENDA_A_ORDEM.includes(String(cfop))
            );

            const isShipmentGiftCFOP = receipt.CFOP.some((cfop) =>
                CFOP_REMESSA_BRINDE.includes(String(cfop))
            );

            const isTransferCFOP = receipt.CFOP.some((cfop) =>
                CFOP_TRANSFERENCIA.includes(String(cfop))
            );

            return (
                !isSaleCFOP && !isDevolutionCFOP && !isShipmentOrderCFOP && !isSaleOrderCFOP && !isShipmentGiftCFOP && !isTransferCFOP
            );
        },

    }
]