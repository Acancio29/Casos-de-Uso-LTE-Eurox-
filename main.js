import {Blockchain, Transaction} from "./blockchain.js";
import pkg from 'elliptic';
const {ec: EC} = pkg;

const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('0bc0de8d543402a45d1075272c4ce64100f19e2228bbc7cb7f3f36b60b469621');//Le pasamos la clave privada creada anteriormente
const myWalletAddress = myKey.getPublic('hex');//Hexadecimal de mi clave publica

const keyPrueba = ec.keyFromPrivate('7e75a138c1d3749466503c0792f39aec1d0ab2821a9876da95393f2591bdb378');

const nknCoin = new Blockchain();
nknCoin.inicializarWallet(myWalletAddress, 20);//Esto inicializa mi cartera con lo que pongas
nknCoin.CreacicionDeFondos();

//---------------PARTE PRACTICA-----------------

console.log();
console.log("Mi saldo actual es: ", nknCoin.getBalanceOfAddress(myWalletAddress));

console.log();

const tx5 = new Transaction( nknCoin.crearID() ,myWalletAddress, "048cf5f7394fbd1a76bde65c025d22c8b8e17481b69ec7240bb51ec7285c2c73a5f9e6697ef5be3fd49241646bda0832faa72b57bc79de15de4aaeea0326d53734", 10, "España", "España", "Compra de lavadora");
tx5.signTransaction(myKey);
console.log("Transacción creada, aún sin verificar.");//hay que verificar fondos y transacciones tal y como en la original

console.log("El origen tiene fondos suficientes? ", tx5.saldoSuficiente(myWalletAddress, nknCoin, 10) ? 'Yep' : 'Nop');
console.log("Origen y destino validos? ", tx5.direccionesValidas(myKey, "819613a98aca1c943b862e578d1b684c4f541121049cc7a31f0249a6e9007656") ? 'Yep' : 'Nop');

nknCoin.addTransaction(tx5);

nknCoin.CreacicionDeFondos(myWalletAddress);
console.log("Recompensa por minar: 0 (pendiente de mirar)");//l recompensa es 0 ya que no se pueden minar bloques en EuroX
console.log("Transacción realizada!");


console.log("Balance de mi cuenta: ",nknCoin.getBalanceOfAddress(myWalletAddress) + " (-10 por la transacción anterior.)");

//console.log(nknCoin.chain);

//------------Cosas a solucionar---------------
//Se puede minar en nuestra blockchain? entiendo que no, que solo pueden hacerlo los bancos para transpasar de fisico a digital
//El dinero de las cuentas solo debe des visible para los bancos que la tengan y por ende para el usuario, podemos cifrarla o algo asi y que la clave solo la tengan los bancos (en +ver_cuenta, +transferencias)