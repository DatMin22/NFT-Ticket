var app = angular.module('myApp', []);

app.controller('solanaCtrl', function($scope, $http) {
  $scope.listsdsdsd = [];
  $scope.read_all_nfts2 = async () =>{
      var myHeaders = new Headers();
    myHeaders.append("x-api-key", X_Api_Key);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch("https://api.shyft.to/sol/v1/nft/read_all?network=devnet&address="+address_solana, requestOptions)
      .then(async response => response.json())
      .then(async result => $scope.listsdsdsd=result.result)
      .then(async result => console.log($scope.listsdsdsd))
      .catch(async error => console.log('error', error));
    
  }
});
var X_Api_Key = 'Pkt9qKkFbur5lZwo';
var address_solana ='3weVG5Sxmr9QcRcVfritDHv9ee8DTxYkS3y9uTKfF7xU';
var to_address = '8FvpJCjwou77Yj84a6YRqj65PJRuouAAhJw6v3BJ2u7U';
var to_address2 = '9iHniQkhAHmTfGNb1sNMh6pkkVy7aNT6hEfhUFR1DQdG';

const toTransaction = (encodedTransaction) => solanaWeb3.Transaction.from(Uint8Array.from(atob(encodedTransaction), c => c.charCodeAt(0)));

const connect = async () =>
{
    isConnected = await window.phantom.solana.isConnected;
   if (!isConnected) {
    console.log(isConnected);
    const connect = await window.phantom.solana.connect();
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

const get_balance = async () =>{
  var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/wallet/balance?network=devnet&wallet="+to_address2, requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

const signeTransaction = async (result) =>{
  const transaction = toTransaction(result.result.encoded_transaction);
    const signedTransaction = await window.phantom.solana.signTransaction(transaction);

    // Gửi giao dịch đã ký lên blockchain Solana
    const connection = new solanaWeb3.Connection("https://api.devnet.solana.com/");
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
}

const send_sol = async () => {
    var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "network": "devnet",
  "from_address": address_solana,
  "to_address": to_address2,
  "amount": 0.001
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/wallet/send_sol", requestOptions)
  .then(async response => {
    console.log(response);
    let res = await response.json();
            let transaction = toTransaction(res.result.encoded_transaction);
            const signedTransaction = await window.phantom.solana.signTransaction(transaction);
            const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  })
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
 }

 const create_detach = async ()=>{
  const fileInput = document.querySelector('#fileInput');
  var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var formdata = new FormData();
formdata.append("network", "devnet");
formdata.append("wallet", address_solana); //địa chỉ ví
formdata.append("name", "fish"); //Tiêu đề
formdata.append("symbol", "FYEEE"); //
formdata.append("description", "beautiful eyes");
formdata.append("attributes", "[ {    \"trait_type\": \"edification\",    \"value\": \"100\"  }]"); //thuộc tính
formdata.append("external_url", "https://sampleurl.com"); //đường dẫn bất kỳ
formdata.append("max_supply", "1");
formdata.append("royalty", "5");
formdata.append("file", fileInput.files[0]); //ảnh 

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
  .then(response => response.json())
  .then(async result => {console.log(result);
    const transaction = toTransaction(result.result.encoded_transaction);
    const signedTransaction = await window.phantom.solana.signTransaction(transaction);

    // Gửi giao dịch đã ký lên blockchain Solana
    const connection = new solanaWeb3.Connection("https://api.devnet.solana.com/");
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  })
  .catch(error => console.error('error', error));
 }

 

  // Hàm tạo và ký giao dịch
const createAndSignNFTTransaction = async () => {
  
  try {
    // Gọi API để tạo NFT
    let response = await fetch("https://api.shyft.to/sol/v1/nft/create_detach", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': X_Api_Key, // Thay YOUR_X_API_KEY bằng API key của bạn
      },
      body: JSON.stringify({
        // Thông tin NFT cần tạo
        network: 'devnet',
        wallet: address_solana, // Thay YOUR_SOLANA_WALLET_ADDRESS bằng địa chỉ ví Solana của bạn
        name: 'Sample NFT',
        symbol: 'SNFT',
        description: 'Sample NFT Description',
        attributes: '[{"trait_type": "sample_trait", "value": "sample_value"}]',
        external_url: 'https://sampleurl.com',
        max_supply: '1',
        royalty: '5',
      }),
    });

    let result = await response.json();

    // Kiểm tra xem có thông báo lỗi từ API không
    if (result.error) {
      console.error('Error creating NFT:', result.error);
      return;
    }

    // Chuyển đổi giao dịch từ base64 và ký giao dịch
    const transaction = toTransaction(result.result.encoded_transaction);
    const signedTransaction = await window.phantom.solana.signTransaction(transaction);

    // Gửi giao dịch đã ký lên blockchain Solana
    const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    console.log('NFT created successfully. Transaction Signature:', signature);
  } catch (error) {
    console.error('Error:', error);
  }
};

const read_all_nfts = async () =>{
  var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/read_all?network=devnet&address="+address_solana, requestOptions)
  .then(response => {response.json()})
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

const transaction_history = async () =>{
  var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/wallet/parsed_transaction_history?network=devnet&account="+address_solana+"&tx_num=5", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

const read_nft = async (token_nft) =>{
  var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/read?network=devnet&token_address="+token_nft, requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}


const transfer_nft = async () =>{
  var myHeaders = new Headers();
myHeaders.append("x-api-key", "Pkt9qKkFbur5lZwo");

var raw = JSON.stringify({
  "network": "devnet",
  "token_address": "GadLzLtirpVbirdoxDYPinXA8ZeoFpr2B6GbuvNa1GWj",
  "from_address": address_solana,
  "to_address": to_address2,
  "transfer_authority" : false,
  "fee_payer": address_solana
} );
console.log(raw);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/transfer_detach", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

(async () =>{
      await connect();
    
})();

