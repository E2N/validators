/** 
* @license
* This is free and unencumbered software released into the public domain.
* 
* Anyone is free to copy, modify, publish, use, compile, sell, or
* distribute this software, either in source code form or as a compiled
* binary, for any purpose, commercial or non-commercial, and by any
* means.
* 
* In jurisdictions that recognize copyright laws, the author or authors
* of this software dedicate any and all copyright interest in the
* software to the public domain. We make this dedication for the benefit
* of the public at large and to the detriment of our heirs and
* successors. We intend this dedication to be an overt act of
* relinquishment in perpetuity of all present and future rights to this
* software under copyright law.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
* OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
* 
* For more information, please refer to <https://unlicense.org>
/*

/* IBAN REGISTRY Release 94 - Apr 2023                                                                  */
const iban_registry = new Map(Object.entries({
    "AD": 24, "AE": 23, "AL": 28, "AT": 20, "AZ": 28, "BA": 20, "BE": 16, "BG": 22, "BH": 22, "BI": 27, "BR": 29,
    "BY": 28, "CH": 21, "CR": 22, "CY": 28, "CZ": 24, "DE": 22, "DJ": 27, "DK": 18, "DO": 28, "EE": 20, "EG": 29,
    "ES": 24, "FI": 18, "FO": 18, "FR": 27, "GB": 22, "GE": 22, "GI": 23, "GL": 18, "GR": 27, "GT": 28, "HR": 21,
    "HU": 28, "IE": 22, "IL": 23, "IQ": 23, "IS": 26, "IT": 27, "JO": 30, "KW": 30, "KZ": 20, "LB": 28, "LC": 32,
    "LI": 21, "LT": 20, "LU": 20, "LV": 21, "LY": 25, "MC": 27, "MD": 24, "ME": 22, "MK": 19, "MN": 20, "MR": 27,
    "MT": 31, "MU": 30, "NI": 28, "NL": 18, "NO": 15, "PK": 24, "PL": 28, "PS": 29, "PT": 25, "QA": 29, "RO": 24,
    "RS": 22, "RU": 33, "SA": 24, "SC": 31, "SD": 18, "SE": 24, "SI": 19, "SK": 24, "SM": 27, "SO": 23, "ST": 25,
    "SV": 28, "TL": 23, "TN": 24, "TR": 26, "UA": 29, "VA": 22, "VG": 24, "XK": 20,
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
        value = Math.floor(value / 10);
    }
    return digit_sum;
}

/* Luhn algorithm                                                                                      */


/**
 * A validation function for International Bank Account Numbers (IBAN).
 * This validator returns true if the input is in a compliant format and passes the check-digit validation.
 * An IBAN is validated by converting it into an integer and performing mod-97 operation (as described in ISO 7064) on it.
 * @public
 * @param {string} input
 * @returns {boolean}
 */
function iban(input) {
    /* Null, undefined and blank check                                                                      */
    if (!input) {
        return false;
    }

    /* Type check                                                                                           */
    if (typeof input !== "string") {
        return false;
    }

    /* Transform IBAN print format to IBAN electronic format                                                */
    input = input.replace(/\s/g, "");

    /* Check that the IBAN length matches the country's IBAN length                                         */
    let country_code          = input.slice(0, 2);
    let country_iban_length = iban_registry.get(country_code);

    if (country_iban_length === undefined) {
        return false;
    }

    if (country_iban_length !== input.length) {
        return false;
    }

    /* Move the four initial characters to the end of the string                                            */
    let d = input.slice(4) + input.slice(0, 4);


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

function isbn(input) {
    /* Null, undefined and blank check                                                                      */
    if (!input) {
        return false;
    }

    /* Type check                                                                                           */
    if (typeof input !== "string") {
        return false;
    }

    switch (input.length) {
        case 10: return isbn10(input);
        case 13: return isbn13(input);
        default: return false;
    }
}

function isbn10(input) {
    return false;
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
    /* Null, undefined and blank check                                                                      */
    if (!input) {
        return false;
    }

    /* Type check                                                                                           */
    if (typeof input !== "string") {
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
    /* Null, undefined and blank check                                                                      */
    if (!input) {
        return false;
    }

    /* Type check                                                                                           */
    if (typeof input !== "string") {
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
 * Verifies a International Article Number (EAN). The same numbers can be referred to as GTINs.
 * @public
 * @param {string} input 
 * @returns {boolean}
 */
function ean(input) {
    /* Null, undefined and blank check                                                                      */
    if (!input) {
        return false;
    }

    /* Type check                                                                                           */
    if (typeof input !== "string") {
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

    return (Math.ceil(ps / 10) * 10 - ps) == check_digit;
}

/**
 * Validates a <i>Betriebsnummer<i>.
 * @param {string} input
 * @returns {boolean}
 */
function betriebsnummer(input) {
    return false;
}

module.exports = {
    iban,
    isbn,
    vsnr,
    ean
}