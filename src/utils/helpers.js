const Web3 = require("web3");
const config = require("./config.json")
const rootChainManager = require("./abi/rootChainManager")
const axios = require('axios').default;


/**
 * set isOnRootChain to true if input address is of root chain, else set to false (i.e if on child chain)
 * set isTestnet to true if input addzzress is of testnet chain, else set to flase (i.e if on mainnet)
 */
// const APIKEY = 'ckey_93bdd057b68a49b0a8a05372a6a'
export const checkMapping = async (addressValue, isOnRootChain, isTestnet) => {

    let web3;
    let contract;

    if (isTestnet === true) {
        web3 = await new Web3(new Web3.providers.HttpProvider(config.GOERLI_RPC))

        contract = await new web3.eth.Contract(
            rootChainManager,
            config.ROOTCHAIN_MANAGER_PROXY_GOERLI,
        )

    } else {
        web3 = await new Web3(new Web3.providers.HttpProvider(config.ETH_RPC))

        contract = await new web3.eth.Contract(
            rootChainManager,
            config.ROOTCHAIN_MANAGER_PROXY_MAINNET,
        )
    }

    console.log(contract)

    // console.log(rootChainManager);

    if (isOnRootChain === true) {
        const isMapped = await contract.methods.rootToChildToken(addressValue).call();
        return [(isMapped !== "0x0000000000000000000000000000000000000000"), isMapped]
    }
    else if (isOnRootChain === false) {
        const isMapped = await contract.methods.childToRootToken(addressValue).call();
        return [(isMapped !== "0x0000000000000000000000000000000000000000"), isMapped]
    }
    else {
        throw new Error("isOnRootChain_NOT_DEFINED")
    }

}

//test 

export const getMetadata = async (chain_id, contract_address, token_id) => {
    
    const URL = await axios({
        url: "https://api.covalenthq.com/v1/chains/status/${chain_id}/tokens/${contract_address}/nft_metadata/${token_id}/?key={process.env.covalent_key}&nft=true"});  
    
    const config = {
        baseURL: URL,
        headers: { Accept: "application/json" },
    };

    const request = await axios(config);

    if (request.status === 200) {
        console.log("API res", request.data.data.items)
        //  const metadata = request.data.data.items[0].nft_data[0].token_url;
        //  const token_balance = request.data.data.items[0].nft_data[0].token_balance;
        //  const image = request.data.data.items[0].nft_data[0].external_data?.image;

        //  return { metadata, token_balance, image };
        return request.data.data.items[0];
        // check for undefined in fronted, fetch "image"
    }
    else if (request.status === 404 || request.status === 500) {
        throw new Error("Not able to locate NFT")
    } else {
        throw new Error("NFT not found");
    }
}
