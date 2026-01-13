import { Blockchain, Transaction } from "./blockchain.js";
import pkg from 'elliptic';
const { ec: EC } = pkg;

const ec = new EC('secp256k1');

/* CLAVES */

const BCEkey = ec.keyFromPrivate(
    'f3ef493ab83a488df5ac1bbdb773b985ed8fb724990d566d7aaa646aae294072'
);
const walletBCE = BCEkey.getPublic('hex');

const bankKey = ec.keyFromPrivate(
    '0bc0de8d543402a45d1075272c4ce64100f19e2228bbc7cb7f3f36b60b469621'
);
const walletBank = bankKey.getPublic('hex');

const richKey = ec.keyFromPrivate(
    'e072c473556a64735e396dcd4cb52d94f33249f28daa860ad27a6387606d10d9'
);
const walletRich = richKey.getPublic('hex');

/* BLOCKCHAIN */

const euroX = new Blockchain();

/* EMISIÓN */

euroX.inicializarWallet(walletBCE, 500);
euroX.inicializarWallet(walletBank, 100);
euroX.inicializarWallet(walletRich, 200);

/* TRANSACCIONES */

const tx1 = new Transaction(
    euroX.crearID(),
    walletBank,
    walletRich,
    50,
    "España",
    "Francia",
    "Pago internacional"
);

tx1.signTransaction(bankKey);
euroX.addTransaction(tx1);

/* BLOQUE */

euroX.createBlockPOS(bankKey, 10);

/* RESULTADOS */

console.log("Saldo BCE:", euroX.getBalanceOfAddress(walletBCE));
console.log("Saldo Banco:", euroX.getBalanceOfAddress(walletBank));
console.log("Saldo Richard:", euroX.getBalanceOfAddress(walletRich));

console.log("Blockchain válida:", euroX.isChainValid());
