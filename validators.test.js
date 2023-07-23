const { iban, vsnr, ean } = require("./validators");

describe('iban', function() {
    test.each([
        ["AD1200012030200359100100",             true],
        ["AD12 0001 2030 2003 5910 0100",        true],
        ["AE070331234567890123456",              true],
        ["AE07 0331 2345 6789 0123 456",         true],
        ["AL47212110090000000235698741",         true],
        ["AL47 2121 1009 0000 0002 3569 8741",   true],
        ["AT611904300234573201",                 true],
        ["AT61 1904 3002 3457 3201",             true],
        ["AZ21NABZ00000000137010001944",         true],
        ["AZ21 NABZ 0000 0000 1370 1000 1944",   true],
        ["BA391290079401028494",                 true],
        ["BA39 1290 0794 0102 8494",             true],
        ["BE68539007547034",                     true],
        ["BE68 5390 0754 7034",                  true],
        ["BG80BNBG96611020345678",               true],
        ["BG80 BNBG 9661 1020 3456 78",          true],
        ["BH67BMAG00001299123456",               true],
        ["BH67 BMAG 0000 1299 1234 56",          true],
        ["BI4210000100010000332045181",          true],
        ["BI42 10000 10001 00003320451 81",      true],
        ["BR1800360305000010009795493C1",        true],
        ["BR18 0036 0305 0000 1000 9795 493C 1", true],
        ["BY13NBRB3600900000002Z00AB00",         true],
        ["BY13 NBRB 3600 9000 0000 2Z00 AB00",   true],
        ["CH9300762011623852957",                true],
        ["CH93 0076 2011 6238 5295 7",           true],
        ["CR05015202001026284066",               true],
        ["CR05 0152 0200 1026 2840 66",          true],
        ["CY17002001280000001200527600",         true],
        ["CY17 0020 0128 0000 0012 0052 7600",   true],
        ["CZ6508000000192000145399",             true],
        ["CZ65 0800 0000 1920 0014 5399",        true],
        ["DE89370400440532013000",               true],
        ["DE89 3704 0044 0532 0130 00",          true],
        ["DJ2100010000000154000100186",          true],
        ["DJ21 0001 0000 0001 5400 0100 186",    true],
        ["DK5000400440116243",                   true],
        ["DK50 0040 0440 1162 43",               true],
        ["DO28BAGR00000001212453611324",         true],
        ["DO28 BAGR 0000 0001 2124 5361 1324",   true],
        ["EE382200221020145685",                 true],
        ["EE38 2200 2210 2014 5685",             true],
        ["EG380019000500000000263180002",        true],
        ["ES9121000418450200051332",             true],
        ["ES91 2100 0418 4502 0005 1332",        true],
        ["FI2112345600000785",                   true],
        ["FI21 1234 5600 0007 85",               true],
        ["FO6264600001631634",                   true],
        ["FO62 6460 0001 6316 34",               true],
        ["FR1420041010050500013M02606",          true],
        ["FR14 2004 1010 0505 0001 3M02 606",    true],
        ["GB29NWBK60161331926819",               true],
        ["GB29 NWBK 6016 1331 9268 19",          true],
        ["GE29NB0000000101904917",               true],
        ["GE29 NB00 0000 0101 9049 17",          true],
        ["GI75NWBK000000007099453",              true],
        ["GI75 NWBK 0000 0000 7099 453",         true],
        ["GL8964710001000206",                   true],
        ["GL89 6471 0001 0002 06",               true],
        ["GR1601101250000000012300695",          true],
        ["GR16 0110 1250 0000 0001 2300 695",    true],
        ["GT82TRAJ01020000001210029690",         true],
        ["GT82 TRAJ 0102 0000 0012 1002 9690",   true],
        ["HR1210010051863000160",                true],
        ["HR12 1001 0051 8630 0016 0",           true],
        ["HU42117730161111101800000000",         true],
        ["HU42 1177 3016 1111 1018 0000 0000",   true],
        ["IE29AIBK93115212345678",               true],
        ["IE29 AIBK 9311 5212 3456 78",          true],
        ["IL620108000000099999999",              true],
        ["IL62 0108 0000 0009 9999 999",         true],
        ["IQ98NBIQ850123456789012",              true],
        ["IQ98 NBIQ 8501 2345 6789 012",         true],
        ["IS140159260076545510730339",           true],
        ["IS14 0159 2600 7654 5510 7303 39",     true],
        ["IT60X0542811101000000123456",          true],
        ["IT60 X054 2811 1010 0000 0123 456",    true],
        ["JO94CBJO0010000000000131000302",       true],
        ["JO94 CBJO 0010 0000 0000 0131 0003 02",true],
        ["KW81CBKU0000000000001234560101",       true],
        ["KW81 CBKU 0000 0000 0000 1234 5601 01",true],
        ["KZ86125KZT5004100100",                 true],
        ["KZ86 125K ZT50 0410 0100",             true],
        ["LB62099900000001001901229114",         true],
        ["LB62 0999 0000 0001 0019 0122 9114",   true],
        ["LC55HEMM000100010012001200023015",     true],
        ["LI21088100002324013AA",                true],
        ["LI21 0881 0000 2324 013A A",           true],
        ["LT121000011101001000",                 true],
        ["LT12 1000 0111 0100 1000",             true],
        ["LU280019400644750000",                 true],
        ["LU28 0019 4006 4475 0000",             true],
        ["LV80BANK0000435195001",                true],
        ["LT12 1000 0111 0100 1000",             true],
        ["LU280019400644750000",                 true],
        ["LU28 0019 4006 4475 0000",             true],
        ["LV80BANK0000435195001",                true],
        ["LV80 BANK 0000 4351 9500 1",           true],
        ["LY83002048000020100120361",            true],
        ["LY83 002 048 000020100120361",         true],
        ["MC5811222000010123456789030",          true],
        ["MC58 1122 2000 0101 2345 6789 030",    true],
        ["MD24AG000225100013104168",             true],
        ["MD24 AG00 0225 1000 1310 4168",        true],
        ["ME25505000012345678951",               true],
        ["ME25 5050 0001 2345 6789 51",          true],
        ["MK07250120000058984",                  true],
        ["MK07 2501 2000 0058 984",              true],
        ["MN121234123456789123",                 true],
        ["MN12 1234 1234 5678 9123",             true],
        ["MR1300020001010000123456753",          true],
        ["MR13 0002 0001 0100 0012 3456 753",    true],
        ["MT84MALT011000012345MTLCAST001S",      true],
        ["MU17BOMM0101101030300200000MUR",       true],
 //     ["NI04BAPR00000013000003558124",         true],
        ["NL91ABNA0417164300",                   true],
        ["NO9386011117947",                      true],
        ["PK36SCBL0000001123456702",             true],
        ["PL61109010140000071219812874",         true],
        ["PS92PALS000000000400123456702",        true],
        ["PT50000201231234567890154",            true],
        ["QA58DOHB00001234567890ABCDEFG",        true],
        ["RO49AAAA1B31007593840000",             true],
        ["RS35260005601001611379",               true],
//      ["RU1704452522540817810538091310419",    true],
        ["SA0380000000608010167519",             true],
        ["SC18SSCB11010000000000001497USD",      true],
        ["SD2129010501234001",                   true],
        ["SE4550000000058398257466",             true],
        ["SI56263300012039086",                  true],
        ["SK3112000000198742637541",             true],
        ["SM86U0322509800000000270100",          true],
        ["SO211000001001000100141",              true],
        ["ST23000100010051845310146",            true],
        ["SV62CENR00000000000000700025",         true],
        ["TL380080012345678910157",              true],
        ["TN5910006035183598478831",             true],
        ["TR330006100519786457841326",           true],
        ["UA213223130000026007233566001",        true],
        ["VA59001123000012345678",               true],
        ["VG96VPVG0000012345678901",             true],
        ["XK051212012345678906",                 true],
        ["DE89 3740 0044 0532 0130 00",          false],
        ["DE89 3740 0044 0532 0130",             false],
        ["US64SVBKUS6S3300958879",               false]
    ])('%s', (input, expected) => {
        expect(iban(input)).toBe(expected);
    });
});

describe('vsnr', function() {
    test.each([
        ["65180539W000", false],
        ["65180539W001", true ],
        ["65180539W002", false],
        ["65180539W003", false],
        ["65180539W004", false],
        ["65180539W005", false],
        ["65180539W006", false],
        ["65180539W007", false],
        ["65180539W008", false],
        ["65180539W009", false]
    ])('%s', (input, expected) => expect(vsnr(input)).toBe(expected));
});

describe('ean', function() {
    test.each([
        ["40123455", true],
        ["41223455", false],
        ["4006381333931", true],
        ["376104250021234569", true]
    ])('%s', (input, expected) => expect(ean(input)).toBe(expected));
});