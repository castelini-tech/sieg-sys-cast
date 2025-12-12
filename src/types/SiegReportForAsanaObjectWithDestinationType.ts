import { ReceiptStatus } from "./ReceiptStatusType";
import { ISiegReportForAsanaObjectType } from "./SiegReportForAsanaObjectType";

export type ReceiptForAsanaBase = ISiegReportForAsanaObjectType

export interface SiegReportForAsanaObjectWithDestinationType extends ReceiptForAsanaBase {
    status: ReceiptStatus;
    statusDescription: string;
}



