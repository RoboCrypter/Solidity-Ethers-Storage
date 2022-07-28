const ethers = require("ethers")
const { readFileSync } = require("fs-extra")
const fs = require("fs-extra")
require("dotenv").config()



async function main() {
    // http://127.0.0.1:7545  this is the 'rpc url' of our 'ganache blockchain'

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    //  this is the 'private key' of our 'ganache blockchain' "wallet"

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // const encryptedKey = fs.readFileSync("./.encryptedKey.json", "utf8")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedKey, process.env.PRIVATE_KEY_PASSWORD)
    // wallet = await wallet.connect(provider)

    const abi = fs.readFileSync("./Storage_sol_Storage.abi", "utf8")
    const binary = fs.readFileSync("./Storage_sol_Storage.bin", "utf8")

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

    console.log("Please Wait...Deploying the Contract")

    const contract = await contractFactory.deploy() // this is for "wait" for contract to "deploy"
    await contract.deployTransaction.wait(1)

    console.log(`Contract Address: ${contract.address}`)

    // Getting Favourite No from our 'Storage.sol' contract
    const favouriteNo = await contract.retreive()
    console.log(`favNo: ${favouriteNo.toString()}`)

    const storeFavouriteNo = await contract.store("100")
    await storeFavouriteNo.wait(1)

    const updatedFavouriteNo = await contract.retreive()
    console.log(`updatedFavNo: ${updatedFavouriteNo.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
