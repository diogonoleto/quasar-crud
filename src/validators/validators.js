import { isValidCpf, isValidPhone, isValidCep, isValidCnpj } from '@brazilian-utils/validators';

export const cpf = (value) => value ? isValidCpf(value) : true
export const cnpj = (value) => value ? isValidCnpj(value) : true
export const mobile = (value) => value ? isValidPhone(value) : true
export const cep = (value) => value ? isValidCep(value) : true
