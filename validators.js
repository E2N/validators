/**
 * @license
 * Copyright (c) 2023 E2N GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

/**
 * @module @e2ngmbh/validators
 */

function luhn(input) {
    let sum = 0;
    let odd = false;
    /* start at the rightmost digit */
    for (let i = input.length - 1; i >= 0; i--) {
        let n = input.charCodeAt(i) - 48;
        /* double every second digit */
        n = odd ? n << 1 : n;
        odd = !odd;
        /* add the digit sum */
        sum += n / 10 | 0;
        sum += n % 10;
    }
    return sum % 10 === 0;
}

/* IBAN REGISTRY Release 95 – Jul 2023                                                                 */
const iban_registry = new Map(Object.entries({
    "AD": 24, "AE": 23, "AL": 28, "AT": 20, "AZ": 28, "BA": 20, "BE": 16, "BG": 22, "BH": 22, "BI": 27, "BR": 29,
    "BY": 28, "CH": 21, "CR": 22, "CY": 28, "CZ": 24, "DE": 22, "DJ": 27, "DK": 18, "DO": 28, "EE": 20, "EG": 29,
    "ES": 24, "FI": 18, "FK": 18, "FO": 18, "FR": 27, "GB": 22, "GE": 22, "GI": 23, "GL": 18, "GR": 27, "GT": 28,
    "HR": 21, "HU": 28, "IE": 22, "IL": 23, "IQ": 23, "IS": 26, "IT": 27, "JO": 30, "KW": 30, "KZ": 20, "LB": 28,
    "LC": 32, "LI": 21, "LT": 20, "LU": 20, "LV": 21, "LY": 25, "MC": 27, "MD": 24, "ME": 22, "MK": 19, "MN": 20,
    "MR": 27, "MT": 31, "MU": 30, "NI": 28, "NL": 18, "NO": 15, "PK": 24, "PL": 28, "PS": 29, "PT": 25, "QA": 29,
    "RO": 24, "RS": 22, "RU": 33, "SA": 24, "SC": 31, "SD": 18, "SE": 24, "SI": 19, "SK": 24, "SM": 27, "SO": 23,
    "ST": 25, "SV": 28, "TL": 23, "TN": 24, "TR": 26, "UA": 29, "VA": 22, "VG": 24, "XK": 20,
}));

/* EAN8, 13 and 18 weights                                                                              */
const ean_weights = [
    [ 3, 1, 3, 1, 3, 1, 3 ],
    [ 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3 ],
    [ 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3 ]
];

/* piece-wise calculation of number mod 97                                                              */
function mod97(value) {
    let i = 0, j = 9;
    let n = parseInt(value.slice(i, 9)) % 97;

    do {
        i = j;
        j = Math.min((n > 9) ? (i + 7) : (i + 8), value.length);
        n = (n + value.slice(i, j)) % 97;
    } while (i < value.length);

    return n;
}

/* digit sum of number in base 10.                                                                     */
function digit_sum(value) {
    let digit_sum = 0;
    while (value) {
        digit_sum += value % 10;
        value = value / 10 | 0;
    }
    return digit_sum;
}

/**
 * IBAN stands for International Bank Account Number. It is the ISO 13616 international
 * standard for numbering bank accounts.
 *
 * @public
 * @param {string} input
 * @returns {boolean} true, if the input is in ISO 13616-compliant national IBAN formats and passes the check-digit validation.
 */
function iban(input) {
    /* Type check                                                                                           */
    if (typeof input !== "string") {
        return false;
    }

    /* Transform IBAN print format to IBAN electronic format                                                */
    input = input.replace(/\s/g, "");

    /* Check the country code for existence                                                                 */
    let country_code          = input.slice(0, 2);
    /* Check that the IBAN length matches the country's IBAN length                                         */
    let country_iban_length = iban_registry.get(country_code);

    if (country_iban_length === undefined || country_iban_length !== input.length) {
        return false;
    }

    /* Move the four initial characters to the end of the string                                            */
    let d = input.slice(4) + input.slice(0, 4);

    /* An IBAN is validated by converting it into an integer and performing mod-97 operation (as described in ISO 7064) on it. */

    /* Replace each letter in the string with two digits                                                    */
    d = d.replaceAll("A", "10");
    d = d.replaceAll("B", "11");
    d = d.replaceAll("C", "12");
    d = d.replaceAll("D", "13");
    d = d.replaceAll("E", "14");
    d = d.replaceAll("F", "15");
    d = d.replaceAll("G", "16");
    d = d.replaceAll("H", "17");
    d = d.replaceAll("I", "18");
    d = d.replaceAll("J", "19");
    d = d.replaceAll("K", "20");
    d = d.replaceAll("L", "21");
    d = d.replaceAll("M", "22");
    d = d.replaceAll("N", "23");
    d = d.replaceAll("O", "24");
    d = d.replaceAll("P", "25");
    d = d.replaceAll("Q", "26");
    d = d.replaceAll("R", "27");
    d = d.replaceAll("S", "28");
    d = d.replaceAll("T", "29");
    d = d.replaceAll("U", "30");
    d = d.replaceAll("V", "31");
    d = d.replaceAll("W", "32");
    d = d.replaceAll("X", "33");
    d = d.replaceAll("Y", "34");
    d = d.replaceAll("Z", "35");

    /* Interpret the string as a decimal integer and compute the remainder of that number on division by 97 */
    let reminder =  mod97(d);

    /* Reminder must be 1                                                                                   */
    return reminder === 1;
}

/**
 * International Standard Book Number (ISBN)
 *
 * @param {string} input
 * @returns {boolean}
 */
function isbn(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    switch (input.length) {
        case 10: return isbn10(input);
        case 13: return isbn13(input);
        default: return false;
    }
}

function isbn10(input) {
    let sum = 0;
    sum += (input.charCodeAt(0)  - 48);
    sum += (input.charCodeAt(1)  - 48) * 2;
    sum += (input.charCodeAt(2)  - 48) * 3;
    sum += (input.charCodeAt(3)  - 48) * 4;
    sum += (input.charCodeAt(4)  - 48) * 5;
    sum += (input.charCodeAt(5)  - 48) * 6;
    sum += (input.charCodeAt(6)  - 48) * 7;
    sum += (input.charCodeAt(7)  - 48) * 8;
    sum += (input.charCodeAt(8)  - 48) * 9;
    if (input.charAt(9) === 'X') {
        sum += 100;
    } else {
        sum += (input.charCodeAt(9)  - 48) * 10;
    }

    return 0 === sum % 11;
}

function isbn13(input) {
    let check_digit= parseInt(input.charAt(12));
    let sum = 0;
    sum += (input.charCodeAt(0)  - 48);
    sum += (input.charCodeAt(1)  - 48) * 3;
    sum += (input.charCodeAt(2)  - 48);
    sum += (input.charCodeAt(3)  - 48) * 3;
    sum += (input.charCodeAt(4)  - 48);
    sum += (input.charCodeAt(5)  - 48) * 3;
    sum += (input.charCodeAt(6)  - 48);
    sum += (input.charCodeAt(7)  - 48) * 3;
    sum += (input.charCodeAt(8)  - 48);
    sum += (input.charCodeAt(9)  - 48) * 3;
    sum += (input.charCodeAt(10) - 48);
    sum += (input.charCodeAt(11) - 48) * 3;

    return check_digit === (10 - (sum % 10)) % 10;
}

/**
 * Krankenversichertennummer (KVNR) einer gesetzlichen Krankenkasse. Sie baut auf der
 * Rentenversicherungsnummer auf und ist ein Leben lang gültig.
 * @public
 */
function kvnr(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                         */
    if (!(input.length === 30 || input.length === 30 )) {
        return false;
    }

    /* Entweder 20 oder 30 Stellen */

    /* Unveränderbarer, 10-stelliger Teil, z. B. Max Mustermann A123456789 */

    /* Veränderbarer, 9-stelliger Teil (Institutionskennzeichen), z. B. 100696012 */

    /* Prüfziffer */
}


/**
 * Verifies the "Deutsche Rentenversicherungsnummer" (VSNR) in Germany.
 * Für jeden Versicherten in der gesetzlichen Rentenversicherung wird eine Versicherungsnummer vergeben.
 * @public
 * @param input
 */
function vsnr(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                         */
    if (input.length !== 12) {
        return false;
    }

    /* Modified Double-Add-Double-Methode or Luhn-Algorithmus                                               */
    let check_digit= parseInt(input.charAt(11));
    const weights = [2, 1, 2, 5, 7, 1, 2, 1, 2, 1, 2, 1];

    /* remove check digit and replace character at position 8 with its position in the alphabet             */
    let number = input.slice(0,8) + input.charCodeAt(8) - 64 + input.slice(9, 11)

    /* compute products and calculate digit sum                                                             */
    let ds = 0;
    for (let i = 0; i < weights.length; i++) {
        ds += digit_sum((number.charCodeAt(i) - 48) * weights[i]);

    }

    /* verify                                                                                               */
    return ds % 10 === check_digit;
}

/**
 * Verifies an International Article Number (EAN). The same numbers can be referred to as GTINs.
 * @public
 * @param {string} input 
 * @returns {boolean}
 */
function ean(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    let weights = [];

    /* Length check */
    switch(input.length) {
        case  8: weights = ean_weights[0]; break;
        case 13: weights = ean_weights[1]; break;
        case 18: weights = ean_weights[2]; break;
        default: return false;
    }

    let check_digit = parseInt(input.charAt(input.length - 1));
    let digits = input.slice(0, input.length);

    /* multiply every digit with its weight and sum the results                                                                             */
    let ps = 0;
    for (let i = 0; i < weights.length; i++) {
        ps += (digits.charCodeAt(i) - 48) * weights[i];
    }

    return (Math.ceil(ps / 10) * 10 - ps) === check_digit;
}

/**
 * Die Betriebsnummer (BBNR) ist ein Identifikationsmerkmal im Meldeverfahren aller Sozialversicherungsträger.
 *
 * @param {string} input
 * @returns {boolean}
 */
function bbnr(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check */
    if (input.length !== 8) {
        return false;
    }

    /* Die ersten drei Stellen müssen 010 bis 099 oder größer 110 sein. */
    let prefix = input.slice(0, 3);
    if (!((prefix >= 10 && prefix <= 99) || (prefix > 110))) {
        return false;
    }

    let check_digit = parseInt(input.charAt(input.length - 1));
    const weights = [1, 2, 1, 2, 1, 2, 1];

    let ps = 0;
    for (let i = 0; i < weights.length; i++) {
        let n = (input.charCodeAt(i) - 48);
        ps += digit_sum(n * weights[i]);
    }

    return ps % 10 === check_digit;
}

/**
 * Numéro d'inscription au Répertoire (NIR)
 *
 * @param {string} input
 * @returns {boolean}
 */
function nir(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                          */
    if (input.length !== 15) {
        return false;
    }

    /* syymmlloookkk cc */
    let number = parseInt(input.slice(0, 13), 10);
    let check_digit = parseInt(input.slice(13), 10);

    return check_digit === 97 - number % 97;
}

/**
 * A Payment card number like VISA or Mastercard
 *
 * @param {string} input
 * @returns {boolean}
 */
function pan(input) {
    return typeof input === "string" && luhn(input);
}

/**
 * International Mobile Equipment Identity (IMEI)
 *
 * @param {string} input
 * @returns {boolean}
 */
function imei(input) {
    return typeof input === "string" && /\d{15}/.test(input) && luhn(input);
}

/**
 * Codice fiscale (CF)
 *
 * @param {string} input
 * @returns {boolean}
 */
function cf(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                          */
    if (input.length !== 16) {
        return false;
    }

    let sum = 0;
    let even = false;

    for (let i = 0; i < input.length - 1; i++) {
        let char = input.charAt(i);
        sum += even ? cf_even.get(char) : cf_odd.get(char);
        even = !even;
    }

    let reminder = sum % 26;

    return input.charAt(15) === cf_reminder[reminder];
}

const cf_odd = new Map(Object.entries({
    "0":  1, "1":  0, "2":  5, "3":  7, "4":  9, "5": 13, "6": 15, "7": 17, "8": 19,
    "9": 21, "A":  1, "B":  0, "C":  5, "D":  7, "E":  9, "F": 13, "G": 15, "H": 17,
    "I": 19, "J": 21, "K":  2, "L":  4, "M": 18, "N": 20, "O": 11, "P":  3, "Q":  6,
    "R":  8, "S": 12, "T": 14, "U": 16, "V": 10, "W": 22, "X": 25, "Y": 24, "Z": 23
}));

const cf_even = new Map(Object.entries({
    "0":  0, "1":  1, "2":  2, "3":  3, "4":  4, "5":  5, "6":  6, "7":  7, "8":  8,
    "9":  9, "A":  0, "B":  1, "C":  2, "D":  3, "E":  4, "F":  5, "G":  6, "H":  7,
    "I":  8, "J":  9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16,
    "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25
}));

const cf_reminder = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

/**
 * Documento nacional de identidad (DNI)
 *
 * @param {string} input
 * @returns {boolean}
 */
function dni(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                          */
    if (input.length !== 9) {
        return false;
    }

    let number = parseInt(input.slice(0, 8));
    let check_digit = input.charAt(8);
    let reminder = number % 23;

    return check_digit === dni_reminder[reminder];
}

const dni_reminder = "TRWAGMYFPDXBNJZSQVHLCKE".split('');

/**
 * NHS number (NHS)
 *
 * @param {string} input
 * @returns {boolean}
 */
function nhs(input) {
    /* Type check                                                                                           */
    if (typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                          */
    if (input.length !== 10) {
        return false;
    }

    let check_digit = input[9].charCodeAt(0) - 48

    let sum = 0;

    for (let i = 0; i < input.length - 1; i++) {
        sum = (input[i].charCodeAt(0) - 48) * (10 - i)
    }

    let reminder = 11 - (sum % 11);

    if (reminder === 10) {
        return false;
    }

    if (reminder === 11) {
        reminder = 0;
    }

    return check_digit === reminder;
}

/**
 * The National Insurance number is a number used in the United Kingdom in the administration of the National Insurance
 * or social security system. It is also used for some purposes in the UK tax system.
 *
 * The number is sometimes referred to with the abbreviations NI No or NINO.
 *
 * @param {string} input
 * @returns {boolean}
 */
function nino(input) {
    /* Type check                                                                                           */
    if (typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                          */
    if (input.length !== 9) {
        return false;
    }

    return /[A-Z]{2}\d{6}[A-Z]/.test(input);

    /* The characters D, F, I, Q, U and V are not used as either the first or second letter of a NINO prefix. */
}

/**
 * Canadian Social Insurance Number (SIN)
 *
 * @param {string} input
 * @returns {boolean}
 */
function sin(input) {
    return typeof input === "string" && /\d{9}/.test(input) && luhn(input);
}

function pid(input) {
    /* Type check                                                                                           */
    if (!input && typeof input !== "string") {
        return false;
    }

    /* Length check                                                                                          */
    if (input.length !== 10) {
        return false;
    }

    let check_digit= parseInt(input.charAt(9));
    const weights = [7, 3, 1];

    /* https://de.wikipedia.org/wiki/Ausweisnummer#Berechnung_der_Prüfziffern */

    return false;
}

module.exports = {
    bbnr,
    cf,
    dni,
    ean,
    iban,
    imei,
    isbn,
    nhs,
    nino,
    nir,
    pan,
    sin,
    vsnr
}