import { computeCRC } from './utils/crc16'

export type Field = {
  id: string
  size: string
  value: string | Field[]
}

export type Amount = `${number}.${number}`

export type Key =
  | `${string}@${string}.${string}` // Email
  | `${string}-${string}-${string}-${string}-${string}` // Chave aleatória
  | `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}` // CPF
  | `+${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}` // Telefone
  | `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}` // CNPJ

export type Params = {
  key: Key
  amount?: Amount
  name: string
  city: string
  reusable?: boolean
}

const CRC16 = { id: '63', size: '04', value: '' }
const PAYLOAD_FORMAT_INDICATOR: Field = { id: '00', size: '02', value: '01' }
const MERCHANT_CATEGORY_CODE: Field = { id: '52', size: '04', value: '0000' }
const TRANSACTION_CURRENCY: Field = { id: '53', size: '03', value: '986' }
const COUNTRY_CODE: Field = { id: '58', size: '02', value: 'BR' }

const POINT_OF_INITIATION_METHOD = (canBeReused: boolean): Field => ({
  id: '01',
  size: '02',
  value: canBeReused ? '11' : '12'
})

const MERCHANT_NAME = (name: string): Field => ({
  id: '59',
  size: `${name.length}`,
  value: name
})

const MERCHANT_CITY = (city: string): Field => ({
  id: '60',
  size: `${city.length}`,
  value: city
})

const MERCHANT_ACCOUNT_INFORMATION__GUI: Field = { id: '00', size: '14', value: 'br.gov.bcb.pix' }

const MERCHANT_ACCOUNT_INFORMATION__KEY = (key: Key): Field => ({
  id: '01',
  size: `${key.length}`,
  value: key
})

const MERCHANT_ACCOUNT_INFORMATION = (key: Key) => ({
  id: '26',
  size: '',
  value: [MERCHANT_ACCOUNT_INFORMATION__GUI, MERCHANT_ACCOUNT_INFORMATION__KEY(key)]
})

const TRANSACTION_AMOUNT = (amount: Amount = '00.00') => ({
  id: '54',
  size: `${amount.length}`,
  value: amount
})

function fieldToString(field: Field): string {
  if (!Array.isArray(field.value)) {
    return `${field.id}${`${field.size}`.padStart(2, '0')}${field.value}`
  }

  const value = field.value.map(fieldToString).join('')
  const size = `${value.length}`.padStart(2, '0')
  return `${field.id}${size}${value}`
}

export function pix({ key, amount, name, city, reusable = true }: Params) {
  const fields: Field[] = [
    PAYLOAD_FORMAT_INDICATOR,
    POINT_OF_INITIATION_METHOD(reusable),
    MERCHANT_ACCOUNT_INFORMATION(key),
    MERCHANT_CATEGORY_CODE,
    TRANSACTION_CURRENCY
  ]

  if (amount) fields.push(TRANSACTION_AMOUNT(amount))

  fields.push(...[COUNTRY_CODE, MERCHANT_NAME(name), MERCHANT_CITY(city), CRC16])

  const payload = fields.map(fieldToString).join('')

  const crcHash = computeCRC(payload).toUpperCase()

  return `${payload}${crcHash}`
}
