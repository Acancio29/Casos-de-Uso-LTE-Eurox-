import SHA256 from 'crypto-js/sha256.js';
import pkg from 'elliptic';
const { ec: EC } = pkg;

const ec = new EC('secp256k1');

/* CLASE TRANSACTION */

class Transaction {
    constructor(id, origen, destino, cantidad, pais_origen, pais_destino, concepto) {
        this.id = id;
        this.origen = origen;
        this.destino = destino;
        this.cantidad = cantidad;
        this.pais_origen = pais_origen;
        this.pais_destino = pais_destino;
        this.concepto = concepto;
        this.signature = null;
    }

    calculateHash() {
        return SHA256(
            this.id +
            this.origen +
            this.destino +
            this.cantidad +
            this.pais_origen +
            this.pais_destino +
            this.concepto
        ).toString();
    }

    signTransaction(signingKey) {
        if (this.origen !== signingKey.getPublic('hex')) {
            throw new Error('No puedes firmar transacciones de otras carteras');
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.origen === null) return true; // emisión/recompensa
        if (!this.signature) return false;
        const publicKey = ec.keyFromPublic(this.origen, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

/* CLASE BLOCK */

class Block {
    constructor(timestamp, transactions, previousHash, validator) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.validator = validator;
        this.hash = this.calculateHash();
        this.signature = null;
    }

    calculateHash() {
        return SHA256(
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.validator
        ).toString();
    }

    signBlock(signingKey) {
        if (signingKey.getPublic('hex') !== this.validator) {
            throw new Error("Este nodo no es el validador");
        }
        this.signature = signingKey.sign(this.hash, 'hex').toDER('hex');
    }

    isValidBlock() {
        if (!this.signature) return false;
        const key = ec.keyFromPublic(this.validator, 'hex');
        return key.verify(this.hash, this.signature);
    }

    hasValidTransactions() {
        return this.transactions.every(tx => tx.isValid());
    }
}

/* CLASE BLOCKCHAIN */

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.wallets = {}; // address -> stake
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], "0", "GENESIS");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    crearID() {
        let maxID = 0;
        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.id > maxID) maxID = tx.id;
            }
        }
        for (const tx of this.pendingTransactions) {
            if (tx.id > maxID) maxID = tx.id;
        }
        return maxID + 1;
    }

    inicializarWallet(address, cantidad) {
        this.wallets[address] = cantidad;
        const tx = new Transaction(
            this.crearID(),
            null,
            address,
            cantidad,
            null,
            null,
            "Emisión inicial EuroX"
        );
        this.pendingTransactions.push(tx);
    }

    addTransaction(transaction) {
        if (!transaction.origen || !transaction.destino) {
            throw new Error("Transacción inválida");
        }
        if (!transaction.isValid()) {
            throw new Error("Transacción no válida");
        }
        if (this.getBalanceOfAddress(transaction.origen) < transaction.cantidad) {
            throw new Error("Saldo insuficiente");
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = this.wallets[address] || 0;

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.origen === address) balance -= tx.cantidad;
                if (tx.destino === address) balance += tx.cantidad;
            }
        }

        for (const tx of this.pendingTransactions) {
            if (tx.origen === address) balance -= tx.cantidad;
            if (tx.destino === address) balance += tx.cantidad;
        }

        return balance;
    }

    selectValidator() {
        let totalStake = 0;
        const stakes = {};

        for (const addr in this.wallets) {
            const stake = this.getBalanceOfAddress(addr);
            if (stake > 0) {
                stakes[addr] = stake;
                totalStake += stake;
            }
        }

        let random = Math.random() * totalStake;
        let cumulative = 0;

        for (const addr in stakes) {
            cumulative += stakes[addr];
            if (cumulative >= random) {
                return addr;
            }
        }
        return null;
    }

    createBlockPOS(validatorKey, reward) {
        const validatorAddress = this.selectValidator();

        if (validatorKey.getPublic('hex') !== validatorAddress) {
            throw new Error("La clave no corresponde al validador elegido");
        }

        const block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash,
            validatorAddress
        );

        block.signBlock(validatorKey);

        if (!block.isValidBlock() || !block.hasValidTransactions()) {
            throw new Error("Bloque inválido");
        }

        this.chain.push(block);
        this.pendingTransactions = [];

        const rewardTx = new Transaction(
            this.crearID(),
            null,
            validatorAddress,
            reward,
            null,
            null,
            "Recompensa PoS EuroX"
        );

        this.pendingTransactions.push(rewardTx);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curr = this.chain[i];
            const prev = this.chain[i - 1];

            if (!curr.isValidBlock()) return false;
            if (!curr.hasValidTransactions()) return false;
            if (curr.previousHash !== prev.hash) return false;
        }
        return true;
    }
}

export { Blockchain, Transaction };
