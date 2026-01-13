import {Blockchain, Transaction} from "./blockchain.js";
import pkg from 'elliptic';
const {ec: EC} = pkg;

const ec = new EC('secp256k1');
//Creamos la blockchian y con el el bloque genesis
const nknCoin = new Blockchain();
//Todas las claves estan en importante.txt

//---------------BCE CREADOR DE LA RED------------

const BCEkey = ec.keyFromPrivate('f3ef493ab83a488df5ac1bbdb773b985ed8fb724990d566d7aaa646aae294072');
const walletBCE = BCEkey.getPublic('hex');
nknCoin.inicializarWallet(walletBCE, 600);//Al ser el BCE es normal que además sea el mas poderoso.

//const keyPrueba = ec.keyFromPrivate('7e75a138c1d3749466503c0792f39aec1d0ab2821a9876da95393f2591bdb378');
//---------------MI BANCO ILEGAL DE CONFIANZA-----

const myKey = ec.keyFromPrivate('0bc0de8d543402a45d1075272c4ce64100f19e2228bbc7cb7f3f36b60b469621'); //Le pasamos la clave privada creada anteriormente
const myWalletAddress = myKey.getPublic('hex'); //Hexadecimal de mi clave pública
nknCoin.inicializarWallet(myWalletAddress, 20); //Esto inicializa mi cartera con lo que pongas

//---------------SUCURSALES RICHARDSON------------

const keyRichard = ec.keyFromPrivate('e072c473556a64735e396dcd4cb52d94f33249f28daa860ad27a6387606d10d9');
const walletRich = keyRichard.getPublic('hex');

nknCoin.inicializarWallet(walletRich, 300);

//---------------BANCOS PORTER--------------------

const keyPorter = ec.keyFromPrivate('937a5bc4887b3f52f5f1d4bd2804adbf00c4e0df56ff6977efa191ec0139ebab');
const walletPor = keyPorter.getPublic('hex');

nknCoin.inicializarWallet(walletPor, 15);


//---------------PARTE PRÁCTICA-----------------
//Una vez creada la blockchain, mostramos por pantalla lo que hay en cada cuenta


console.log();//Vemos el balance de cada uno, para ver quien tiene mas posibilades hay que mirar la tabla anterior a la que sale en cada bloque
console.log("El saldo del BCE: ", nknCoin.getBalanceOfAddress(walletBCE));
console.log();
console.log("Mi saldo actual es: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log();
console.log("El saldo de Richard: ", nknCoin.getBalanceOfAddress(walletRich));
console.log();
console.log("El saldo de Porter: ", nknCoin.getBalanceOfAddress(walletPor));
console.log();

//Creamos la primera transacción
const tx1 = new Transaction(nknCoin.crearID(), myWalletAddress, walletPor, 15, "España", "Francia", "transacción, por pago de cliente");

//La validamos
tx1.signTransaction(myKey)
console.log('Transacción firmada.');
console.log("Transacción ", nknCoin.isValidTransaction(tx1) ? 'valida' : 'no valida, algun campo de la transacción es erroneo');
nknCoin.addTransaction(tx1);

//Vemos la diferencia
console.log("Balance de mi banco: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log("Balance banco Porter: ", nknCoin.getBalanceOfAddress(walletPor));

//Añadimos el primer bloque, y como el anterior es genesis block, este tambien estara proporcionado por el BCE
nknCoin.createBlockPOS(BCEkey, 15);//Recordar que aquel que haga el bloque recibe premio

console.log("Balance tras bloque nuevo");//Ver resultado
console.log("El saldo del BCE: ", nknCoin.getBalanceOfAddress(walletBCE));
console.log();
console.log("Mi saldo actual es: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log();
console.log("El saldo de Richard: ", nknCoin.getBalanceOfAddress(walletRich));
console.log();
console.log("El saldo de Porter: ", nknCoin.getBalanceOfAddress(walletPor));
console.log();

//Nueva transacción
const tx2 = new Transaction(nknCoin.crearID(), walletBCE, myWalletAddress, 320, "Belgica", "España", "Compra de activos");

tx2.signTransaction(BCEkey)
console.log('Transacción firmada.') 
console.log("Transacción ", nknCoin.isValidTransaction(tx2) ? 'valida' : 'no valida, algun campo de la transacción es erroneo');
nknCoin.addTransaction(tx2);

console.log("Balance de mi banco: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log("Balance del BCE: ", nknCoin.getBalanceOfAddress(walletBCE));


console.log();
console.log();
console.log("Se ha acordado añadir nuevos fondos digitales. Iniciando seleccion de validador...");
let validador1 = nknCoin.selectValidator();//Se busca un validador, y devuelve el que tiene mas posibildades de salir

console.log("El validador es: " + validador1);//Obtenido al elegido, ahora le pasamos su key al creador de bloques.

nknCoin.createBlockPOS(BCEkey, 20);//BCE es el que tiene mas posibildades de ganar

console.log();//Volvemos a ver el balance
console.log("El saldo del BCE: ", nknCoin.getBalanceOfAddress(walletBCE));
console.log();
console.log("Mi saldo actual es: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log();
console.log("El saldo de Richard: ", nknCoin.getBalanceOfAddress(walletRich));
console.log();
console.log("El saldo de Porter: ", nknCoin.getBalanceOfAddress(walletPor));
console.log();

//No obstante, ahora que el BCE ha movido fondos, es mas probable que le toque a otro

const tx3 = new Transaction(nknCoin.crearID(), walletRich, myWalletAddress, 18, "Reino Unido", "España", "Cliente que cambio de banco");

tx3.signTransaction(keyRichard)
console.log('Transacción firmada.') 
console.log("Transacción ", nknCoin.isValidTransaction(tx3) ? 'valida' : 'no valida, algun campo de la transacción es erroneo');
nknCoin.addTransaction(tx3);

console.log("Balance de mi banco: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log("Balance de sucursales Richard: ", nknCoin.getBalanceOfAddress(walletBCE));


const tx4 = new Transaction(nknCoin.crearID(), walletRich, walletPor, 10, "Reino Unido", "Francia", "Pago por instruir empleados");

tx4.signTransaction(keyRichard)
console.log('Transacción firmada.') 
console.log("Transacción ", nknCoin.isValidTransaction(tx4) ? 'valida' : 'no valida, algun campo de la transacción es erroneo');
nknCoin.addTransaction(tx4);

console.log("Balance de sucursales Richard: ", nknCoin.getBalanceOfAddress(walletRich));
console.log("Balance de Bancos Porter: ", nknCoin.getBalanceOfAddress(walletPor));

console.log();
console.log();
console.log("Se ha acordado añadir nuevos fondos digitales. Iniciando seleccion de validador...");
let validador2 = nknCoin.selectValidator();//Tras 2 transacciones, volvemos a elegir validador

console.log("El validador es: " + validador2);//Mas probable, nuestro banco

nknCoin.createBlockPOS(myKey, 5);

console.log();
console.log("El saldo del BCE: ", nknCoin.getBalanceOfAddress(walletBCE));
console.log();
console.log("Mi saldo actual es: ", nknCoin.getBalanceOfAddress(myWalletAddress));
console.log();
console.log("El saldo de Richard: ", nknCoin.getBalanceOfAddress(walletRich));
console.log();
console.log("El saldo de Porter: ", nknCoin.getBalanceOfAddress(walletPor));
console.log();

//------------Cosas a solucionar---------------
//2: El dinero de las cuentas solo debe des visible para los bancos que la tengan y por ende para el usuario, podemos cifrarla o algo asi y que la clave solo la tengan los bancos (en +ver_cuenta, +transferencias)
//3: El validador no busca en las transaccione actuales, solo en los bloques ya creados
//4: Si hay alguien que tiene mas pasta que otro, pero va despues en la lista, entonces puede que no salga elegido, creo
//5: POS funciona por posibilidades, si yo que no tenia mas dinero aun así salgo elegido, entonces como haces para que yo firme el bloque? creo que selectValidator deberia devolver la llave, entonces si se podría
//Haceis CTRL + F en el blockchain.js y buscais "TODO"

//------------GUIA PARA VER QUIEN GANA---------
//Basta con comparar los primeros 4 dígitos
//Recordar que POS trabaja con posibilidades, es posible que no gane el que mas dinero tenga, solo aumenta sus posibilidades.
//BCE: 0412962daedbf8c5b22069438ccfe5657ce2ff0d356c2ad83b0be6d18dc1639985c2fff21aa7860a19062fc0c29ee7d62edc8829acfb2b16080644d54d9f96b535

//My banco ilegal de confianza: 048cf5f7394fbd1a76bde65c025d22c8b8e17481b69ec7240bb51ec7285c2c73a5f9e6697ef5be3fd49241646bda0832faa72b57bc79de15de4aaeea0326d53734

//Richardson: 045376c7dd5eaca50cf462bb1f9e48159e10ee6f9650e4967e1b672bcca999acc506ffa4f6c379fc61fa1a323e8c6320b3ccc971a038ba7a5c4167d845ecf16208

//Porter: 04e6d656264d353b512d52beaec2f95d47a36a9c67a58df0cda7920179735338274bde82d1f144fbbde6bc5d33883bebcf9ad51e93317536a7b81d9adfcdbf7b1e