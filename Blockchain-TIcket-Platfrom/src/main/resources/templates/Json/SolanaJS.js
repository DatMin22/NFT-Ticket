var address_solana ='';
var isConnected =false;

const connect = async () =>
{
    isConnected = await window.phantom.solana.isConnected;
   if (!isConnected) {
    console.log(isConnected);
    await window.phantom.solana.connect();
    console.log('Kết nối: '+await window.phantom.solana.isConnected);
   }else{
    console.log('Kết nối thành công');
   }
}

const get_address_solana = async () =>{
    await connect();
    address_solana = await window.phantom.solana.publicKey.toBase58();
    console.log(address_solana);
}

(async () =>{
    await connect();
})();