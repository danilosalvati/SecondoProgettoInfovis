/** Questa funzione si occupa di generare delle flow entry in maniera random **/
function generateFlows() {

    /* Per prima cosa assegno tutti gli indirizzi ip */
    var ipAddresses = [];
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('10.0.0.0', '24', 30));
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('20.0.0.0', '24', 30));
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('30.0.0.0', '24', 44));
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('40.0.0.0', '24', 30));
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('50.0.0.0', '24', 30));
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('8.0.0.0', '16', 16));
    //    ipAddresses = ipAddresses.concat(generateIPAddresses('16.0.0.0', '16', 30));

    ipAddresses = ipAddresses.concat(generateIPAddresses('10.0.0.0', '24', 6));
    ipAddresses = ipAddresses.concat(generateIPAddresses('20.0.0.0', '24', 4));
    ipAddresses = ipAddresses.concat(generateIPAddresses('30.0.0.0', '24', 6));
    ipAddresses = ipAddresses.concat(generateIPAddresses('40.0.0.0', '24', 4));
    ipAddresses = ipAddresses.concat(generateIPAddresses('50.0.0.0', '24', 4));
    ipAddresses = ipAddresses.concat(generateIPAddresses('8.0.0.0', '16', 2));
    ipAddresses = ipAddresses.concat(generateIPAddresses('16.0.0.0', '16', 2));

    /* Adesso assegno un indirizzo mac ad ogni ip */
    var macAddresses = generateMACAddresses(ipAddresses.length);

    /* Adesso divido gli indirizzi trovati in gruppi (così distribuisco gli ip su più porte) */

    var totalAddresses = ipAddresses.length;

    var group1 = [{
        from: 0,
        to: totalAddresses / 14
    }, {
        from: totalAddresses / 14 * 10 - (totalAddresses / 14),
        to: totalAddresses / 14 * 10
    }];

    var group2 = [{
        from: totalAddresses / 14,
        to: totalAddresses / 14 + (totalAddresses / 14)
    }, {
        from: totalAddresses / 14 * 9 - (totalAddresses / 14),
        to: totalAddresses / 14 * 9
    }];

    var group3 = [{
        from: totalAddresses / 14 * 3 - (totalAddresses / 14),
        to: totalAddresses / 14 * 3
    }, {
        from: totalAddresses / 14 * 13 - (totalAddresses / 14),
        to: totalAddresses / 14 * 13
    }];

    var group4 = [{
        from: totalAddresses / 14 * 4 - (totalAddresses / 14),
        to: totalAddresses / 14 * 4
    }, {
        from: totalAddresses / 14 * 11 - (totalAddresses / 14),
        to: totalAddresses / 14 * 11
    }];

    var group5 = [{
        from: totalAddresses / 14 * 5 - (totalAddresses / 14),
        to: totalAddresses / 14 * 5
    }, {
        from: totalAddresses / 14 * 8 - (totalAddresses / 14),
        to: totalAddresses / 14 * 8
    }];

    var group6 = [{
        from: totalAddresses / 14 * 6 - (totalAddresses / 14),
        to: totalAddresses / 14 * 6
    }, {
        from: totalAddresses / 14 * 7 - (totalAddresses / 14),
        to: totalAddresses / 14 * 7
    }];

    var group7 = [{
        from: totalAddresses / 14 * 12 - (totalAddresses / 14),
        to: totalAddresses / 14 * 12
    }, {
        from: totalAddresses - (totalAddresses / 14),
        to: totalAddresses
    }];

    var groups = [group1, group2, group3, group4, group5, group6, group7];

    console.log(groups);


    /* Adesso costruisco l'array con gli indirizzi ip e mac */

    var ipAndmacAddresses = [];
    var i;
    for (i = 0; i < ipAddresses.length; i++) {
        ipAndmacAddresses.push({
            ip: ipAddresses[i],
            mac: macAddresses[i]
        });
    }

    /* Adesso creo i percorsi tra i vari gruppi, in modo tale che possa costruire delle rotte plausibili */


    // Questi sono tutti i percorsi che partono dal gruppo 1
    var paths = [{
        from: group1,
        to: group2,
        in : {
            s1: 3,
            s4: 1
        },
        out: {
            s1: 2,
            s4: 2
        }
    }, {
        from: group1,
        to: group3,
        in : {
            s1: 3,
            s2: 1,
            s3: 1
        },
        out: {
            s1: 1,
            s2: 2,
            s3: 2
        }
    }, {
        from: group1,
        to: group4,
        in : {
            s1: 3,
            s2: 1,
            s5: 1
        },
        out: {
            s1: 1,
            s2: 3,
            s5: 2
        }
    }, {
        from: group1,
        to: group5,
        in : {
            s1: 3,
            s2: 1,
            s5: 1
        },
        out: {
            s1: 1,
            s2: 3,
            s5: 3
        }
    }, {
        from: group1,
        to: group6,
        in : {
            s1: 3,
            s2: 1
        },
        out: {
            s1: 1,
            s4: 4
        }
    }, {
        from: group1,
        to: group7,
        in : {
            s1: 3,
            s4: 1
        },
        out: {
            s1: 2,
            s4: 3
        }
    }];


    // Questi sono tutti i percorsi che partono dal gruppo 2
    paths = paths.concat([{
        from: group2,
        to: group1,
        in : {
            s4: 2,
            s1: 2
        },
        out: {
            s4: 1,
            s1: 3
        }
    }, {
        from: group2,
        to: group3,
        in : {
            s4: 2,
            s1: 2,
            s2: 1,
            s3: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 2,
            s3: 2
        }
    }, {
        from: group2,
        to: group4,
        in : {
            s4: 2,
            s1: 2,
            s2: 1,
            s5: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 3,
            s5: 2
        }
    }, {
        from: group2,
        to: group5,
        in : {
            s4: 2,
            s1: 2,
            s2: 1,
            s5: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 3,
            s5: 3
        }
    }, {
        from: group2,
        to: group6,
        in : {
            s4: 2,
            s1: 2,
            s2: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 4
        }
    }, {
        from: group2,
        to: group7,
        in : {
            s4: 2,
        },
        out: {
            s4: 3
        }
    }]);

    // Questi sono tutti i percorsi che partono dal gruppo 3
    paths = paths.concat([{
        from: group3,
        to: group1,
        in : {
            s3: 2,
            s2: 2,
            s1: 1
        },
        out: {
            s3: 1,
            s2: 1,
            s1: 3
        }
    }, {
        from: group3,
        to: group2,
        in : {
            s3: 2,
            s2: 2,
            s1: 1,
            s4: 1
        },
        out: {
            s3: 1,
            s2: 1,
            s1: 2,
            s4: 2
        }
    }, {
        from: group3,
        to: group4,
        in : {
            s3: 2,
            s2: 2,
            s5: 1,
        },
        out: {
            s3: 1,
            s2: 3,
            s5: 2,
        }
    }, {
        from: group3,
        to: group5,
        in : {
            s3: 2,
            s2: 2,
            s5: 1
        },
        out: {
            s3: 1,
            s2: 3,
            s5: 3
        }
    }, {
        from: group3,
        to: group6,
        in : {
            s3: 2,
            s2: 2,
        },
        out: {
            s3: 1,
            s2: 4,
        }
    }, {
        from: group3,
        to: group7,
        in : {
            s3: 2,
            s2: 2,
            s1: 1,
            s4: 1
        },
        out: {
            s3: 1,
            s2: 1,
            s1: 2,
            s4: 3
        }
    }]);

    // Questi sono tutti i percorsi che partono dal gruppo 4
    paths = paths.concat([{
        from: group4,
        to: group1,
        in : {
            s5: 2,
            s2: 3,
            s1: 1
        },
        out: {
            s5: 1,
            s2: 1,
            s1: 3
        }
    }, {
        from: group4,
        to: group2,
        in : {
            s5: 2,
            s2: 3,
            s1: 1,
            s4: 1
        },
        out: {
            s5: 1,
            s2: 1,
            s1: 2,
            s4: 2
        }
    }, {
        from: group4,
        to: group3,
        in : {
            s5: 2,
            s2: 3,
            s3: 1,
        },
        out: {
            s5: 1,
            s2: 2,
            s3: 2,
        }
    }, {
        from: group4,
        to: group5,
        in : {
            s5: 2,
        },
        out: {
            s5: 3
        }
    }, {
        from: group4,
        to: group6,
        in : {
            s5: 2,
            s2: 3
        },
        out: {
            s5: 1,
            s2: 4
        }
    }, {
        from: group4,
        to: group7,
        in : {
            s5: 2,
            s2: 3,
            s1: 1,
            s4: 1
        },
        out: {
            s5: 1,
            s2: 1,
            s1: 2,
            s4: 3
        }
    }]);

    // Questi sono tutti i percorsi che partono dal gruppo 5
    paths = paths.concat([{
        from: group5,
        to: group1,
        in : {
            s5: 3,
            s2: 3,
            s1: 1
        },
        out: {
            s5: 1,
            s2: 1,
            s1: 3
        }
    }, {
        from: group5,
        to: group2,
        in : {
            s5: 3,
            s2: 3,
            s1: 1,
            s4: 1
        },
        out: {
            s5: 1,
            s2: 1,
            s1: 2,
            s4: 2
        }
    }, {
        from: group5,
        to: group3,
        in : {
            s5: 3,
            s2: 3,
            s3: 1
        },
        out: {
            s5: 1,
            s2: 2,
            s3: 2
        }
    }, {
        from: group5,
        to: group4,
        in : {
            s5: 3
        },
        out: {
            s5: 2
        }
    }, {
        from: group5,
        to: group6,
        in : {
            s5: 3,
            s2: 3
        },
        out: {
            s5: 1,
            s2: 4
        }
    }, {
        from: group5,
        to: group7,
        in : {
            s5: 3,
            s2: 3,
            s1: 1,
            s4: 1
        },
        out: {
            s5: 1,
            s2: 1,
            s1: 2,
            s4: 3
        }
    }]);

    // Questi sono tutti i percorsi che partono dal gruppo 6
    paths = paths.concat([{
        from: group6,
        to: group1,
        in : {
            s2: 4,
            s1: 1
        },
        out: {
            s2: 4,
            s1: 1
        }
    }, {
        from: group6,
        to: group2,
        in : {
            s2: 4,
            s1: 1,
            s4: 1
        },
        out: {
            s2: 1,
            s1: 2,
            s4: 2
        }
    }, {
        from: group6,
        to: group3,
        in : {
            s2: 4,
            s3: 1
        },
        out: {
            s2: 2,
            s3: 2
        }
    }, {
        from: group6,
        to: group4,
        in : {
            s2: 4,
            s5: 1
        },
        out: {
            s2: 3,
            s5: 2
        }
    }, {
        from: group6,
        to: group5,
        in : {
            s2: 4,
            s5: 1
        },
        out: {
            s2: 3,
            s5: 3
        }
    }, {
        from: group6,
        to: group7,
        in : {
            s2: 4,
            s1: 1,
            s4: 1
        },
        out: {
            s2: 1,
            s1: 2,
            s4: 3
        }
    }]);

    // Questi sono tutti i percorsi che partono dal gruppo 7
    paths = paths.concat([{
        from: group7,
        to: group1,
        in : {
            s4: 3,
            s1: 2
        },
        out: {
            s4: 1,
            s1: 3
        }
    }, {
        from: group7,
        to: group2,
        in : {
            s4: 3,
        },
        out: {
            s4: 2
        }
    }, {
        from: group7,
        to: group3,
        in : {
            s4: 3,
            s1: 2,
            s2: 1,
            s3: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 2,
            s3: 2
        }
    }, {
        from: group7,
        to: group4,
        in : {
            s4: 3,
            s1: 2,
            s2: 1,
            s5: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 3,
            s5: 2
        }
    }, {
        from: group7,
        to: group5,
        in : {
            s4: 3,
            s1: 2,
            s2: 1,
            s5: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 3,
            s5: 3
        }
    }, {
        from: group7,
        to: group6,
        in : {
            s4: 3,
            s1: 2,
            s2: 1
        },
        out: {
            s4: 1,
            s1: 1,
            s2: 4
        }
    }]);


    /* Adesso che ho i percorsi tra tutti i gruppi creo degli array con gli indirizzi separati per ogni gruppo */
    var group1Addresses = [];

    for (i = groups[0][0].from; i < groups[0][0].to; i++) {
        group1Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[0][1].from; i < groups[0][1].to; i++) {
        group1Addresses.push(ipAndmacAddresses[i]);
    }

    var group2Addresses = [];

    for (i = groups[1][0].from; i < groups[1][0].to; i++) {
        group2Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[1][1].from; i < groups[1][1].to; i++) {
        group2Addresses.push(ipAndmacAddresses[i]);
    }

    var group3Addresses = [];

    for (i = groups[2][0].from; i < groups[2][0].to; i++) {
        group3Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[2][1].from; i < groups[2][1].to; i++) {
        group3Addresses.push(ipAndmacAddresses[i]);
    }

    var group4Addresses = [];

    for (i = groups[3][0].from; i < groups[3][0].to; i++) {
        group4Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[3][1].from; i < groups[3][1].to; i++) {
        group4Addresses.push(ipAndmacAddresses[i]);
    }

    var group5Addresses = [];

    for (i = groups[4][0].from; i < groups[4][0].to; i++) {
        group5Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[4][1].from; i < groups[4][1].to; i++) {
        group5Addresses.push(ipAndmacAddresses[i]);
    }

    var group6Addresses = [];

    for (i = groups[5][0].from; i < groups[5][0].to; i++) {
        group6Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[5][1].from; i < groups[5][1].to; i++) {
        group6Addresses.push(ipAndmacAddresses[i]);
    }

    var group7Addresses = [];

    for (i = groups[6][0].from; i < groups[6][0].to; i++) {
        group7Addresses.push(ipAndmacAddresses[i]);
    }

    for (i = groups[6][1].from; i < groups[6][1].to; i++) {
        group7Addresses.push(ipAndmacAddresses[i]);
    }


    console.log(generateFlowEntry({
        ip: '10.0.0.12',
        mac: 'aaa:bb'
    }, {
        ip: '10.0.0.125',
        mac: '55:bb'
    }, '1', '2', 'arp'));


    var entries = {
        s1: [],
        s2: [],
        s3: [],
        s4: [],
        s5: []
    };

    // Costruisco le entries tra tutti i gruppi
    generateEntries(paths, group1, group2, group1Addresses, group2Addresses, entries);
    //    generateEntries(paths, group1, group3, group1Addresses, group3Addresses, entries);
    //    generateEntries(paths, group1, group4, group1Addresses, group4Addresses, entries);
    generateEntries(paths, group1, group5, group1Addresses, group5Addresses, entries);
    //    generateEntries(paths, group1, group6, group1Addresses, group6Addresses, entries);
    generateEntries(paths, group1, group7, group1Addresses, group7Addresses, entries);

    generateEntries(paths, group2, group1, group2Addresses, group1Addresses, entries);
    generateEntries(paths, group2, group3, group2Addresses, group3Addresses, entries);
    generateEntries(paths, group2, group4, group2Addresses, group4Addresses, entries);
    //    generateEntries(paths, group2, group5, group2Addresses, group5Addresses, entries);
    //    generateEntries(paths, group2, group6, group2Addresses, group6Addresses, entries);
    generateEntries(paths, group2, group7, group2Addresses, group7Addresses, entries);

    //    generateEntries(paths, group3, group1, group3Addresses, group1Addresses, entries);
    generateEntries(paths, group3, group2, group3Addresses, group2Addresses, entries);
    generateEntries(paths, group3, group4, group3Addresses, group4Addresses, entries);
    generateEntries(paths, group3, group5, group3Addresses, group5Addresses, entries);
    generateEntries(paths, group3, group6, group3Addresses, group6Addresses, entries);
    //    generateEntries(paths, group3, group7, group3Addresses, group7Addresses, entries);

    //    generateEntries(paths, group4, group1, group4Addresses, group1Addresses, entries);
    generateEntries(paths, group4, group2, group4Addresses, group2Addresses, entries);
    generateEntries(paths, group4, group3, group4Addresses, group3Addresses, entries);
    //    generateEntries(paths, group4, group5, group4Addresses, group5Addresses, entries);
    generateEntries(paths, group4, group6, group4Addresses, group6Addresses, entries);
    generateEntries(paths, group4, group7, group4Addresses, group7Addresses, entries);

    generateEntries(paths, group5, group1, group5Addresses, group1Addresses, entries);
    //    generateEntries(paths, group5, group2, group5Addresses, group2Addresses, entries);
    generateEntries(paths, group5, group3, group5Addresses, group3Addresses, entries);
    //    generateEntries(paths, group5, group4, group5Addresses, group4Addresses, entries);
    //    generateEntries(paths, group5, group6, group5Addresses, group6Addresses, entries);
    //    generateEntries(paths, group5, group7, group5Addresses, group7Addresses, entries);

    //    generateEntries(paths, group6, group1, group6Addresses, group1Addresses, entries);
    //    generateEntries(paths, group6, group2, group6Addresses, group2Addresses, entries);
    generateEntries(paths, group6, group3, group6Addresses, group3Addresses, entries);
    generateEntries(paths, group6, group4, group6Addresses, group4Addresses, entries);
    //    generateEntries(paths, group6, group5, group6Addresses, group5Addresses, entries);
    //    generateEntries(paths, group6, group7, group6Addresses, group7Addresses, entries);

    generateEntries(paths, group7, group1, group7Addresses, group1Addresses, entries);
    generateEntries(paths, group7, group2, group7Addresses, group2Addresses, entries);
    //    generateEntries(paths, group7, group3, group7Addresses, group3Addresses, entries);
    generateEntries(paths, group7, group4, group7Addresses, group4Addresses, entries);
    //    generateEntries(paths, group7, group5, group7Addresses, group5Addresses, entries);
    //    generateEntries(paths, group7, group6, group7Addresses, group6Addresses, entries);


    /* Adesso aggiungo gli id a tutte le entries */
    var id;
    for (var sw in entries) {
        for (i = 0; i < entries[sw].length; i++) {
            entries[sw][i].id = i + "";
        }
    }

    console.log(entries);

    /* Adesso creo il json con i nodi della rete */
    var nodes = {
        data: []
    };

    /* Aggiungo gli host */
    for (i = 0; i < ipAddresses.length; i++) {
        nodes.data.push({
            "interfaces": {
                eth0: ipAddresses[i] + ""
            },
            "nodeType": "Host",
            "name": "h" + (i + 1)
        });
    }

    /*Aggiungo gli switch */
    nodes.data.push({
        "interfaces": {
            lo: "127.0.0.1",
            eth1: "None",
            eth2: "None"
        },
        "nodeType": "OVSSwitch",
        "name": "s1"
    });

    nodes.data.push({
        "interfaces": {
            lo: "127.0.0.1",
            eth1: "None",
            eth2: "None"
        },
        "nodeType": "OVSSwitch",
        "name": "s2"
    });

    nodes.data.push({
        "interfaces": {
            lo: "127.0.0.1",
            eth1: "None",
            eth2: "None"
        },
        "nodeType": "OVSSwitch",
        "name": "s3"
    });

    nodes.data.push({
        "interfaces": {
            lo: "127.0.0.1",
            eth1: "None",
            eth2: "None"
        },
        "nodeType": "OVSSwitch",
        "name": "s4"
    });

    nodes.data.push({
        "interfaces": {
            lo: "127.0.0.1",
            eth1: "None",
            eth2: "None"
        },
        "nodeType": "OVSSwitch",
        "name": "s5"
    });

    /* Adesso aggiungo il controller */

    nodes.data.push({
        "interfaces": {
            "127.0.0.1": "6633"
        },
        "nodeType": "RemoteController",
        "name": "c0"
    });

    console.log(nodes);


    /* Adesso salvo il json su file */
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(entries));
    window.open(url, '_blank');
    window.focus();

    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(nodes));
    window.open(url, '_blank');
    window.focus();

}


/** Questa funzione genera una serie di indirizzi IP a partire da un prefisso ed una netmask
prefix: prefisso dell'indirizzo da generare
netmask: netmask dell'indirizzo
howManyToGenerate: quanti indirizzi generare
**/
function generateIPAddresses(prefix, netmask, howManyToGenerate) {

    var ipAddress;
    var ipAddressArray = [];
    var i;
    for (i = 0; i < howManyToGenerate; i++) {
        do {
            ipAddress = generateIPAddress(prefix, netmask);
        } while (ipAddress.endsWith('.0') || ipAddress.endsWith('.255') || contains(ipAddress, ipAddressArray));
        ipAddressArray.push(ipAddress);
    }

    return ipAddressArray;
}

/** Questa funzione genera un singolo indirizzo IP **/
function generateIPAddress(prefix, netmask) {

    IPv4_Address(prefix, netmask);

    // Calcolo i bit dell'indirizzo utilizzando un'apposita libreria
    var addressBits = this.addressBinStr;

    // Calcolo in maniera random la parte di indirizzo che non corrisponde al prefisso
    var numberOfbitsToChange = 32 - parseInt(netmask);
    var randomBits = "";
    for (i = 0; i < numberOfbitsToChange; i++) {
        randomBits += getRandBinary();
    }


    // Prendo solo i bit del prefisso dell'indirizzo di partenza
    var ipAddressBinary = addressBits.substring(0, netmask) + randomBits;

    // Calcolo l'indirizzo ip espresso nel formato usuale
    ipAddress = parseInt(ipAddressBinary.substring(0, 8), 2) + "." + parseInt(ipAddressBinary.substring(8, 16), 2) + "." +
        parseInt(ipAddressBinary.substring(16, 24), 2) + "." + parseInt(ipAddressBinary.substring(24, 32), 2);

    if (netmask !== '24') {
        ipAddress += "/" + netmask;
    }

    return ipAddress;

}



/** Questa funzione genera una serie di indirizzi MAC
howManyToGenerate: quanti indirizzi generare
**/
function generateMACAddresses(howManyToGenerate) {

    var macAddress;
    var macAddressArray = [];
    var i;
    for (i = 0; i < howManyToGenerate; i++) {
        do {
            macAddress = generateMACAddress();
        } while (contains(macAddress, macAddressArray));
        macAddressArray.push(macAddress);
    }

    return macAddressArray;
}

/** Questa funzione genera un singolo indirizzo MAC **/
function generateMACAddress() {


    // Calcolo in maniera random l'indirizzo mac in binario
    var randomBits = "";
    for (i = 0; i < 48; i++) {
        randomBits += getRandBinary();
    }

    // Adesso converto l'indirizzo nel formato usuale

    macAddress = "";
    var hex;
    for (i = 0; i < 40; i += 8) {
        hex = parseInt(randomBits.substring(i, i + 8), 2).toString(16);
        // Se il numero era minore di 16 aggiungo uno zero davanti
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        macAddress += hex + ":";
    }

    hex = parseInt(randomBits.substring(40, 48), 2).toString(16);
    if (hex.length === 1) {
        hex = '0' + hex;
    }
    macAddress += hex;


    return macAddress;
}

/** Questa funzione genera tutte le entries tra due gruppi
 * paths contiene l'array con tutti i percorsi tra i gruppi
 * from indica il gruppo di partenza
 * to indica il gruppo di destinazione
 * sourceAddresses è un array di oggetti contenenti indirizzi ip e mac per le sorgenti
 * destAddresses come sopra ma per le destinazioni
 * entries è l'oggetto con le entries generate fino a quel momento
 * **/
function generateEntries(paths, from, to, sourceAddresses, destAddresses, entries) {

    var path = getPath(paths, from, to);
    var packetTypes = ['arp', 'icmp', 'tcp', 'udp'];
    var i, j, z;
    for (i = 0; i < sourceAddresses.length; i++) {
        for (j = 0; j < destAddresses.length; j++) {
            for (z = 0; z < packetTypes.length; z++) {

                // Adesso devo generare le flow entry per ogni switch sul percorso
                for (var sw in path.in) {
                    // Genero la flow entry per questo switch
                    entries[sw].push(generateFlowEntry(sourceAddresses[i], destAddresses[j], path.in[sw], path.out[sw],
                        packetTypes[z]));
                }
            }
        }
    }
}

/** Questa funzione estrae un determinato percorso dati il gruppo di partenza e quello di arrivo **/
function getPath(paths, from, to) {
    var i;
    for (i = 0; i < paths.length; i++) {
        if (paths[i].from === from && paths[i].to === to) {
            return { in : paths[i].in,
                    out: paths[i].out
            };
        }
    }

    return false;
}

/** Questa funzione genera una singola flow entry **/
function generateFlowEntry(sourceAddresses, destAddresses, inPort, outPort, packetType) {

    return {
        'n_packets': Math.floor((Math.random() * 2000) + 500) + "",
        "vlan_tci": "0x0000",
        "n_bytes": Math.floor((Math.random() * 100) + 10) + "",
        "dl_src": sourceAddresses.mac,
        "actions": "actions=output:" + outPort,
        "id": "0",
        "ip_add_out": destAddresses.ip,
        "idle_timeout": Math.floor((Math.random() * 60) + 2) + "",
        "cookie": "0x0",
        "ip_add_in": sourceAddresses.ip,
        "duration": getRandTime(),
        "table": "0",
        "dl_dst": destAddresses.mac,
        "packetType": packetType,
        "in_port": inPort,
        "priority": "65535"
    }

}


/** Funzione di supporto che indica se un array contiene un valore **/
function contains(elem, array) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i] === elem) {
            return true;
        }
    }
    return false;
}

function getRandTime() {

    var rand = Math.floor((Math.random() * 100000) + 1000).toString();

    return rand.substring(0, rand.length - 3) + "." + rand.substring(rand.length - 3, rand.length) + "s";

}

function getRandBinary() {
    return Math.floor(Math.random() * 2);
}