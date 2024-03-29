import { computeCRC } from "./crc16.ts";

interface Field {
  /**
   * Numeric id of the field
   */
  id: string;
  /**
   * Total field size
   */
  size: string;
  /**
   * Value of the field
   */
  value: string | Field[];
}

/**
 * Params to encode in the pix string
 *
 * **Note that some banks don't support special characters in pix codes;
 * make sure to strip those from all fields before encoding them**
 */
export interface Params {
  /**
   * Pix key
   */
  key: string;
  /**
   * Amount to be transfered
   */
  amount?: string;
  /**
   * Receiver name
   */
  name: string;
  /**
   * Receiver city
   */
  city: string;
}

const CRC16 = { id: "63", size: "04", value: "" };
const PAYLOAD_FORMAT_INDICATOR: Field = { id: "00", size: "02", value: "01" };
const MERCHANT_CATEGORY_CODE: Field = { id: "52", size: "04", value: "0000" };
const TRANSACTION_CURRENCY: Field = { id: "53", size: "03", value: "986" };
const COUNTRY_CODE: Field = { id: "58", size: "02", value: "BR" };

/**
 * These fields are not mandatory, but some banks require them.
 */
const TXID: Field = { id: "05", size: "03", value: "***" };
const ADDITIONAL_DATA_FIELD_TEMPLATE = { id: "62", size: "07", value: [TXID] };

const MERCHANT_NAME = (name: string): Field => ({
  id: "59",
  size: `${name.length}`,
  value: name,
});

const MERCHANT_CITY = (city: string): Field => ({
  id: "60",
  size: `${city.length}`,
  value: city,
});

const MERCHANT_ACCOUNT_INFORMATION__GUI: Field = {
  id: "00",
  size: "14",
  value: "br.gov.bcb.pix",
};

const MERCHANT_ACCOUNT_INFORMATION__KEY = (key: string): Field => ({
  id: "01",
  size: `${key.length}`,
  value: key,
});

const MERCHANT_ACCOUNT_INFORMATION = (key: string) => ({
  id: "26",
  size: "",
  value: [
    MERCHANT_ACCOUNT_INFORMATION__GUI,
    MERCHANT_ACCOUNT_INFORMATION__KEY(key),
  ],
});

const TRANSACTION_AMOUNT = (amount: string = "00.00") => ({
  id: "54",
  size: `${amount.length}`,
  value: amount,
});

function fieldToString(field: Field): string {
  if (!Array.isArray(field.value)) {
    return `${field.id}${`${field.size}`.padStart(2, "0")}${field.value}`;
  }

  const value = field.value.map(fieldToString).join("");
  const size = `${value.length}`.padStart(2, "0");
  return `${field.id}${size}${value}`;
}

/**
 * Generates a PIX code to be used in transferences.
 *
 * **Some banks do not allow special characters in the PIX code.
 * Make sure you remove such characters from all fields before calling this function**
 * @param params Transference information
 * @returns
 */
export function pix(params: Params) {
  const { key, amount, name, city } = params;
  const fields: Field[] = [
    PAYLOAD_FORMAT_INDICATOR,
    MERCHANT_ACCOUNT_INFORMATION(key),
    MERCHANT_CATEGORY_CODE,
    TRANSACTION_CURRENCY,
  ];

  if (amount) fields.push(TRANSACTION_AMOUNT(amount));

  fields.push(...[
    COUNTRY_CODE,
    MERCHANT_NAME(name),
    MERCHANT_CITY(city),
    ADDITIONAL_DATA_FIELD_TEMPLATE,
    CRC16,
  ]);

  const payload = fields.map(fieldToString).join("");

  const crcHash = computeCRC(payload).toUpperCase();

  return `${payload}${crcHash}`;
}
