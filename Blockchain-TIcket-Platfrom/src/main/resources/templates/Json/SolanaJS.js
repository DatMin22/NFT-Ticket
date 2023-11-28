var app = angular.module('myApp', []);

app.controller('indexCtrl', function ($scope, $http) {
 
  $scope.read_all_nfts = function(){
    let url ='https://api.shyft.to/sol/v1/nft/read_all?network=devnet&address='+to_address2;
    var requestOptions = {
      headers: {
        'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
      }
    };
    $scope.list_nft = [];

$http.get(url, requestOptions)
    .then(function(response) {
      $scope.list_nft = response.data.result;
      console.log($scope.list_nft);
    })
    .catch(function(error) {
      console.error('Error:', error);
    });

  }


$scope.getBalance = function() {
  var config = {
    headers: {
      'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
    }
  };

  $http.get('https://api.shyft.to/sol/v1/wallet/balance?network=devnet&wallet=' + to_address2, config)
    .then(function(response) {
      $scope.balance = response.data.result.balance;
    })
    .catch(function(error) {
      console.log('Error:', error);
    });
  }


// Gọi hàm getBalance khi controller được khởi tạo
$scope.getBalance();
$scope.read_all_nfts();
});

app.controller('browCtrl', function ($scope, $http) {
  var address_solana = '3weVG5Sxmr9QcRcVfritDHv9ee8DTxYkS3y9uTKfF7xU';

  $scope.getBalance = function() {
    var config = {
      headers: {
        'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
      }
    };

    $http.get('https://api.shyft.to/sol/v1/wallet/balance?network=devnet&wallet=' + to_address2, config)
      .then(function(response) {
        $scope.balance = response.data.result.balance;
        console.log($scope.balance);
      })
      .catch(function(error) {
        console.log('Error:', error);
      });
  };

  $scope.read_all_nfts = function(){
    let url ='https://api.shyft.to/sol/v1/nft/read_all?network=devnet&address='+address_solana;
    var requestOptions = {
      headers: {
        'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
      }
    };
    $scope.list_nft = [];

$http.get(url, requestOptions)
    .then(function(response) {
      $scope.list_nft = response.data.result;
      console.log($scope.list_nft);
    })
    .catch(function(error) {
      console.error('Error:', error);
    });

  }

  $scope.create_nft = async (item) =>{
    let fileInput = document.querySelector('#fileinput');

    var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var formdata = new FormData();
formdata.append("network", "devnet");
formdata.append("wallet", address_solana);
formdata.append("name", item.name);
formdata.append("symbol", item.symbol);
formdata.append("description", item.description);
formdata.append("attributes", "[ {    \"trait_type\": \"edification\",    \"value\": \"100\"  }]");
formdata.append("external_url", "https://shyft.to");
formdata.append("max_supply", 10);
formdata.append("royalty", 100);
formdata.append("file", item.files[0]);
formdata.append("receiver",to_address2);

var requestOptions = {
method: 'POST',
headers: myHeaders,
body: formdata,
redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
.then(async response => {
  let res = await response.json();
  console.log(res);
  let transaction = toTransaction(res.result.encoded_transaction);
  const signedTransaction = await window.phantom.solana.signTransaction(transaction);
  const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
})
.catch(error => console.log('error', error));
  }

  // Gọi hàm getBalance khi controller được khởi tạo
  $scope.getBalance();
  $scope.read_all_nfts();

  
});

app.controller('detailCtrl',function($scope, $http){
  $scope.nft = {
    'wallet':'9iHniQkhAHmTfGNb1sNMh6pkkVy7aNT6hEfhUFR1DQdG'
  };
  $scope.nft2 = {
    'wallet':'9iHniQkhAHmTfGNb1sNMh6pkkVy7aNT6hEfhUFR1DQdG'
  };
  $scope.send_sol = async () => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", X_Api_Key);
    myHeaders.append("Content-Type", "application/json");
    var tosend= document.getElementById("toad").value;
    var amount = document.getElementById("amountsend").value;
    var raw = JSON.stringify({
      "network": "devnet",
      "from_address": address_solana,
      "to_address": tosend,
      "amount": Number(amount)
    });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    fetch("https://api.shyft.to/sol/v1/wallet/send_sol", requestOptions)
      .then(async response => {
        let res = await response.json();
        let transaction = toTransaction(res.result.encoded_transaction);
        const signedTransaction = await window.phantom.solana.signTransaction(transaction);
        const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      })
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  $scope.getBalance = function() {
    var config = {
      headers: {
        'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
      }
    };
  
    $http.get('https://api.shyft.to/sol/v1/wallet/balance?network=devnet&wallet=' + to_address2, config)
      .then(function(response) {
        $scope.balance = response.data.result.balance;
      })
      .catch(function(error) {
        console.log('Error:', error);
      });
    }

    $scope.create_nft = async () =>{
      let fileInput = document.querySelector('#fileinput');

      var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);

var formdata = new FormData();
formdata.append("network", "devnet");
formdata.append("wallet", $scope.nft.wallet);
formdata.append("name", $scope.nft.name);
formdata.append("symbol", $scope.nft.symbol);
formdata.append("description", $scope.nft.description);
formdata.append("attributes", "[ {    \"trait_type\": \"edification\",    \"value\": \"100\"  }]");
formdata.append("external_url", "https://shyft.to");
formdata.append("max_supply", $scope.nft.max_supply);
formdata.append("royalty", $scope.nft.royalty);
formdata.append("file", fileInput.files[0]);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
  .then(async response => {
    let res = await response.json();
    let transaction = toTransaction(res.result.encoded_transaction);
    const signedTransaction = await window.phantom.solana.signTransaction(transaction);
    const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  })
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
    }

    $scope.update_nft = async () => {
      let fileInput = document.querySelector('#fileinput2');

      var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);
      console.log($scope.nft2);
var formdata = new FormData();
formdata.append("network", "devnet");
formdata.append("wallet", $scope.nft2.wallet);
formdata.append("token_address", $scope.nft2.token_address);
formdata.append("name", $scope.nft2.name);
formdata.append("symbol", $scope.nft2.symbol);
formdata.append("description", $scope.nft2.description);
formdata.append("attributes", "[{ \"trait_type\": \"edification\", \"value\": \"100\" }]");
formdata.append("royalty", $scope.nft2.royalty);
formdata.append("file", fileInput.files[0]);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/update_detach", requestOptions)
  .then(async response => {
    await signeTransaction(response);
  })
  .catch(error => console.log('error', error));
    }

    $scope.delete_nft = async () => {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", X_Api_Key);
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "network": "devnet",
        "wallet": to_address2,
        "nft_addresses": [
          $scope.nft3.token_address
        ],
        "close_accounts": true
      });
      
      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("https://api.shyft.to/sol/v1/nft/burn_many", requestOptions)
        .then(async response => {
          let res = await response.json();
  let transaction = await toTransaction(res.result.encoded_transactions[0]);
  const signedTransaction = await window.phantom.solana.signTransaction(transaction);
  const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  $scope.read_all_nfts();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    $scope.transfer_nft = async () =>{
      var myHeaders = new Headers();
myHeaders.append("x-api-key", X_Api_Key);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "network": "devnet",
  "token_address": $scope.nft4.token_address,
  "from_address": $scope.nft2.wallet,
  "to_address": $scope.nft4.to_address,
  "transfer_authority" : true,
  "fee_payer": $scope.nft2.wallet
})
console.log(raw);
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/nft/transfer_detach", requestOptions)
  .then(async response => {
    await signeTransaction(response);
  })
  .catch(error => console.log('error', error));
    }

    $scope.sell_nft = async () => {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", X_Api_Key);
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "network": "devnet",
    "wallet_address": "3weVG5Sxmr9QcRcVfritDHv9ee8DTxYkS3y9uTKfF7xU",
    "metadata_uri": "https://nftstorage.link/ipfs/bafkreic76glrlhf6yig4rsc6c4vlz27xbgeslkiff6jyf35xajvqblujnm",
    "decimals": 0,
    "fee_payer": "9iHniQkhAHmTfGNb1sNMh6pkkVy7aNT6hEfhUFR1DQdG"
      })
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("https://api.shyft.to/sol/v1/token/create_from_metadata", requestOptions)
        .then(async response => {
          let res = await response.json();
          console.log(res);
  let transaction = toTransaction(res.result.encoded_transaction);
  const signedTransaction = await window.phantom.solana.signTransaction(transaction);
  const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    $scope.getBalance();
    
});

app.controller('profileCtrl', function ($scope, $http) {
  $scope.getBalance = function() {
    var config = {
      headers: {
        'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
      }
    };

    $http.get('https://api.shyft.to/sol/v1/wallet/balance?network=devnet&wallet=' + to_address2, config)
      .then(function(response) {
        $scope.balance = response.data.result.balance;
        console.log($scope.balance);
      })
      .catch(function(error) {
        console.log('Error:', error);
      });
  };

  $scope.read_all_nfts = function(){
    let url ='https://api.shyft.to/sol/v1/nft/read_all?network=devnet&address='+to_address2;
    var requestOptions = {
      headers: {
        'x-api-key': X_Api_Key // Thay thế bằng khóa API thực của bạn
      }
    };
    $scope.list_nft = [];

$http.get(url, requestOptions)
    .then(function(response) {
      $scope.list_nft = response.data.result;
      console.log($scope.list_nft);
    })
    .catch(function(error) {
      console.error('Error:', error);
    });

  }

  $scope.delete_nft = async (token2)=>{
    var myHeaders = new Headers();
      myHeaders.append("x-api-key", X_Api_Key);
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "network": "devnet",
        "wallet": to_address2,
        "nft_addresses": [
          token2
        ],
        "close_accounts": true
      });
      
      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("https://api.shyft.to/sol/v1/nft/burn_many", requestOptions)
        .then(async response => {
          let res = await response.json();
  let transaction = await toTransaction(res.result.encoded_transactions[0]);
  const signedTransaction = await window.phantom.solana.signTransaction(transaction);
  const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  $scope.read_all_nfts();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
  }

  $scope.create_nft = async () =>{
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
    .then(async response => {
     let json =  response.json();
      let res = await response.json();
      let transaction = toTransaction(res.result.encoded_transaction);
      const signedTransaction = await window.phantom.solana.signTransaction(transaction);
      const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    })
    .catch(error => console.error('error', error));
  }

  // Gọi hàm getBalance khi controller được khởi tạo
  $scope.getBalance();
  $scope.read_all_nfts();
});

var X_Api_Key = 'Pkt9qKkFbur5lZwo';
var address_solana = '3weVG5Sxmr9QcRcVfritDHv9ee8DTxYkS3y9uTKfF7xU';
var to_address = '8FvpJCjwou77Yj84a6YRqj65PJRuouAAhJw6v3BJ2u7U';
var to_address2 = '9iHniQkhAHmTfGNb1sNMh6pkkVy7aNT6hEfhUFR1DQdG';

const toTransaction = (encodedTransaction) => solanaWeb3.Transaction.from(Uint8Array.from(atob(encodedTransaction), c => c.charCodeAt(0)));

const connect = async () => {
  isConnected = await window.phantom.solana.isConnected;
  if (!isConnected) {
    console.log(isConnected);
    const connect = await window.phantom.solana.connect();
    console.log('Kết nối: ' + await window.phantom.solana.isConnected);
  } else {
    console.log('Kết nối thành công');
  }
}

const get_address_solana = async () => {
  await connect();
  address_solana = await window.phantom.solana.publicKey.toBase58();
  console.log(address_solana);
}

const get_balance = async () => {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", X_Api_Key);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://api.shyft.to/sol/v1/wallet/balance?network=devnet&wallet=" + to_address2, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result.result.balance))
    .catch(error => console.log('error', error));
}

const signeTransaction = async (result2) => {
  let res = await result2.json();
  let transaction = toTransaction(res.result.encoded_transaction);
  const signedTransaction = await window.phantom.solana.signTransaction(transaction);
  const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
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


const read_nft = async (token_nft) => {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", X_Api_Key);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://api.shyft.to/sol/v1/nft/read?network=devnet&token_address=" + token_nft, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


const transfer_nft = async () => {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", "Pkt9qKkFbur5lZwo");

  var raw = JSON.stringify({
    "network": "devnet",
    "token_address": "GadLzLtirpVbirdoxDYPinXA8ZeoFpr2B6GbuvNa1GWj",
    "from_address": address_solana,
    "to_address": to_address2,
    "transfer_authority": false,
    "fee_payer": address_solana
  });
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

(async () => {
  await connect();

})();

