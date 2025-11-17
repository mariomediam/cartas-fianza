import { format, parse, addDays, isAfter, isBefore, diffDays } from '@formkit/tempo';

/**
 * Utilidades para manejo de fechas usando @formkit/tempo
 * Formato estándar del sistema: dd/mm/yyyy
 */

// Formatos estándar del sistema
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const ISO_FORMAT = 'YYYY-MM-DD';

/**
 * Formatea una fecha al formato estándar del sistema (dd/mm/yyyy)
 * @param {Date|string} date - Fecha a formatear
 * @param {string} formatStr - Formato deseado (por defecto DD/MM/YYYY)
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, formatStr = DATE_FORMAT) => {
  if (!date) return '';
  try {
    return format(date, formatStr, 'es');
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return '';
  }
};

/**
 * Formatea una fecha con hora al formato estándar del sistema
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATETIME_FORMAT);
};

/**
 * Formatea solo la hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Hora formateada
 */
export const formatTime = (date) => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * Parsea una fecha en formato dd/mm/yyyy a objeto Date
 * @param {string} dateString - Fecha en formato dd/mm/yyyy
 * @returns {Date} Objeto Date
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  try {
    return parse(dateString, DATE_FORMAT);
  } catch (error) {
    console.error('Error parseando fecha:', error);
    return null;
  }
};

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) para APIs
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato ISO
 */
export const toISODate = (date) => {
  return formatDate(date, ISO_FORMAT);
};

/**
 * Obtiene la fecha actual formateada
 * @returns {string} Fecha actual en formato dd/mm/yyyy
 */
export const getCurrentDate = () => {
  return formatDate(new Date());
};

/**
 * Obtiene la fecha y hora actual formateada
 * @returns {string} Fecha y hora actual
 */
export const getCurrentDateTime = () => {
  return formatDateTime(new Date());
};

/**
 * Suma días a una fecha
 * @param {Date|string} date - Fecha base
 * @param {number} days - Número de días a sumar
 * @returns {Date} Nueva fecha
 */
export const addDaysToDate = (date, days) => {
  return addDays(date, days);
};

/**
 * Verifica si una fecha es posterior a otra
 * @param {Date|string} date1 - Primera fecha
 * @param {Date|string} date2 - Segunda fecha
 * @returns {boolean} True si date1 es posterior a date2
 */
export const isDateAfter = (date1, date2) => {
  return isAfter(date1, date2);
};

/**
 * Verifica si una fecha es anterior a otra
 * @param {Date|string} date1 - Primera fecha
 * @param {Date|string} date2 - Segunda fecha
 * @returns {boolean} True si date1 es anterior a date2
 */
export const isDateBefore = (date1, date2) => {
  return isBefore(date1, date2);
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {Date|string} date1 - Primera fecha
 * @param {Date|string} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export const daysBetween = (date1, date2) => {
  return diffDays(date1, date2);
};

/**
 * Verifica si una fecha está vencida
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} True si la fecha ya pasó
 */
export const isExpired = (date) => {
  return isBefore(date, new Date());
};

/**
 * Obtiene el estado de una fecha de vencimiento
 * @param {Date|string} expiryDate - Fecha de vencimiento
 * @returns {object} {status: 'expired'|'warning'|'active', daysLeft: number}
 */
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return { status: 'unknown', daysLeft: null };
  
  const days = daysBetween(new Date(), expiryDate);
  
  if (days < 0) {
    return { status: 'expired', daysLeft: days };
  } else if (days <= 30) {
    return { status: 'warning', daysLeft: days };
  } else {
    return { status: 'active', daysLeft: days };
  }
};

/**
 * Valida si una cadena es una fecha válida en formato dd/mm/yyyy
 * @param {string} dateString - Cadena a validar
 * @returns {boolean} True si es válida
 */
export const isValidDate = (dateString) => {
  try {
    const parsed = parseDate(dateString);
    return parsed instanceof Date && !isNaN(parsed);
  } catch {
    return false;
  }
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  parseDate,
  toISODate,
  getCurrentDate,
  getCurrentDateTime,
  addDaysToDate,
  isDateAfter,
  isDateBefore,
  daysBetween,
  isExpired,
  getExpiryStatus,
  isValidDate,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  ISO_FORMAT,
};

