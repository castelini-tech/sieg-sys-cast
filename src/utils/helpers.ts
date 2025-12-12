import { XMLParser } from "fast-xml-parser";
import { suppliersData } from "../data/suppliersData";
import { onlyNumbers } from "./formatters";
import { ISuppliersObjectType } from "../types/SuppliersObjectType";

export const xmlToJson = (xmlString: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false, // mantém atributos como @Id
    attributeNamePrefix: "@_", // prefixo dos atributos
    allowBooleanAttributes: true,
  });

  const json = parser.parse(xmlString);

  return json;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout de ${ms}ms`)), ms)
  );

  return Promise.race([promise, timeout]);
}

export const getCFOPsFromNFe = (obj: any): string[] => {
  const det = obj?.nfeProc?.NFe?.infNFe?.det;

  if (!det) return [];

  // Garante que vamos sempre trabalhar com um array
  const detArray = Array.isArray(det) ? det : [det];

  const cfops = detArray
    .map((item) => item?.prod?.CFOP)
    .filter((cfop) => cfop !== null && cfop !== undefined)
    .map((cfop) => String(cfop)); // se quiser string; pode tirar se quiser number

  // Se quiser remover repetidos:
  return Array.from(new Set(cfops));
};

export const getSupplierInformation = (cnpjEmit: string): ISuppliersObjectType | undefined => {
  return suppliersData.find(
    (supplier) => supplier.cnpj === onlyNumbers(cnpjEmit)
  );
}
