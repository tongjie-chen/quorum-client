// Hardcoded ABI for now
const deployedContractAbi = JSON.parse('[{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]');

// Functions copied from https://consensys.net/docs/goquorum/en/latest/tutorials/contracts/calling-contract-functions/
async function getValueAtAddress(host, deployedContractAbi, deployedContractAddress){
    const web3 = new Web3(host);
    const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
    const res = await contractInstance.methods.get().call();
    console.log("Obtained value at deployed contract is: "+ res);
    return res
}

// Functions copied from https://consensys.net/docs/goquorum/en/latest/tutorials/contracts/calling-contract-functions/
async function setValueAtAddress(host, accountAddress, value, deployedContractAbi, deployedContractAddress){
    const web3 = new Web3(host);
    const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
    const res = await contractInstance.methods.set(value).send({from: accountAddress, gasPrice: "0x0", gasLimit: "0x24A22"});
    return res
}

const getButton = document.getElementById("get-button")
const setButton = document.getElementById("set-button")

getButton.addEventListener("click", async (event, err) => {
    event.preventDefault();
    let host = document.getElementById("host").value;
    let deployedContractAddress = document.getElementById("contract-to-get").value || document.getElementById("deployed-contract-address").value;
    document.getElementById("value-returned").innerText = await getValueAtAddress(host, deployedContractAbi, deployedContractAddress);
})

setButton.addEventListener("click", async (event, err) => {
    event.preventDefault();
    let host = document.getElementById("host").value;
    let accountAddress = document.getElementById("account-address").value;
    let value = document.getElementById("value-to-set").value;
    let deployedContractAddress = document.getElementById("deployed-contract-address").value;
    let blockWritten = document.getElementById("block-written");
    setTimeout(async () => {
        blockWritten.innerText = "Time Out";
        blockWritten.classList.add("text-danger");
    }, 20000);
    
        try {
            // throw "Time out!";
            let blockInfo = await setValueAtAddress(host, accountAddress, value, deployedContractAbi, deployedContractAddress);
            blockWritten.classList.remove("text-danger");            
            blockWritten.innerText = blockInfo.blockNumber;
        }
        catch (e) {
            console.log(e);
        }
})

async function updateBlockCount() {
    let host = document.getElementById("host").value;
    const web3 = new Web3(host);
    let blockCount = document.getElementById("block-count");
    try {
        blockCount.innerText = await web3.eth.getBlockNumber();
    }
    catch(e) {
        console.log(e);
    }
}

const interval = setInterval(updateBlockCount, 5000);

function test() {
    const host = "http://localhost:22011";
    const deployedContractAbi = JSON.parse('[{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
    const deployedContractAddress = "0xD72d53bE97280B55E94354913A4F86984b1D67Ae";
    getValueAtAddress(host, deployedContractAbi, deployedContractAddress).then(console.log);
}
