import { ReceiptStatus } from "./ReceiptStatusType";
import { ReceiptForAsanaBase } from "./SiegReportForAsanaObjectWithDestinationType";

export interface RulesValidationType {
    status: ReceiptStatus;
    description: string;
    validate: (receipt: ReceiptForAsanaBase) => boolean
}