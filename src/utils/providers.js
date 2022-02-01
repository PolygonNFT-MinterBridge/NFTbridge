const POSClient= require("@maticnetwork/maticjs")
const Network = require("@maticnetwork/meta/network")
const Web3 = require("web3")

const config = require("./config")
const rootChainManager = require("./abi/rootChainManager")

const network_testnet = new Network("testnet", "mumbai")
const network_mainnet = new Network("mainnet", "v1")

// will change http to wss (in config.json) if waiting for checkpoint is required in UI

const ethreum_provider_testnet = new Web3.providers.HttpProvider(config.GOERLI_RPC)
const ethreum_provider_mainnet = new Web3.providers.HttpProvider(config.ETH_RPC)

const matic_provider_testnet = new Web3.providers.HttpProvider(network_testnet.Matic.RPC)
const matic_provider_mainnet = new Web3.providers.HttpProvider(network_mainnet.Matic.RPC)

/**
 * use rootChainPrimaryProvider when primary (i.e provider injected by browser is connected
 * to eth/goerli)
 * 
 * returns matic's POS client instance used while calling maticjs functions
 */

export const rootChainPrimaryProvider = async (injected_provider, tokenAddr=null) => {
    let network_, version_, provider_, posRootChainManager_, posERC721Predicate_, posERC1155Predicate_;
    let web3, contract, isMintable;

    const chainId = await injected_provider.eth.net.getId();

    if (chainId === 1) {
        network_ = "mainnet"
        version_ = "v1"
        provider_ = matic_provider_mainnet
        posRootChainManager_ = network_mainnet.Main.POSContracts.RootChainManagerProxy

        web3 = await new Web3(new Web3.providers.HttpProvider(config.ETH_RPC))

        contract = await new web3.eth.Contract(
            rootChainManager,
            config.ROOTCHAIN_MANAGER_PROXY_MAINNET,
        )

        if(tokenAddr){
            isMintable = await contract.methods.tokenToType(tokenAddr).call().then(
                (value) => {
                    if (value === "0xd4392723c111fcb98b073fe55873efb447bcd23cd3e49ec9ea2581930cd01ddc"
                        || value === "0xb62883a28321b19a93c6657bfb8ea4cec51ed05c3ab26ecec680fa0c7efb31b9"
                    ) {
                        console.log(value)
                        return true
                    }
                    else {
                        console.log(value)
                        return false
                    }
                }
            )
        }

        if (isMintable) {
            posERC721Predicate_ = network_mainnet.Main.POSContracts.MintableERC721PredicateProxy
            posERC1155Predicate_ = network_mainnet.Main.POSContracts.MintableERC1155PredicateProxy
        }
        else {
            posERC721Predicate_ = network_mainnet.Main.POSContracts.ERC721PredicateProxy
            posERC1155Predicate_ = network_mainnet.Main.POSContracts.ERC1155PredicateProxy
        }
    }
    else { // chainId === 5
        network_ = "tesntet"
        version_ = "mumbai"
        provider_ = matic_provider_testnet
        posRootChainManager_ = network_testnet.Main.POSContracts.RootChainManagerProxy

        web3 = await new Web3(new Web3.providers.HttpProvider(config.GOERLI_RPC))

        contract = await new web3.eth.Contract(
            rootChainManager,
            config.ROOTCHAIN_MANAGER_PROXY_GOERLI,
        )

        if(tokenAddr){
            isMintable = await contract.methods.tokenToType(tokenAddr).call().then(
                (value) => {
                    if (value === "0xd4392723c111fcb98b073fe55873efb447bcd23cd3e49ec9ea2581930cd01ddc"
                        || value === "0xb62883a28321b19a93c6657bfb8ea4cec51ed05c3ab26ecec680fa0c7efb31b9"
                    ) {
                        console.log(value)
                        return true
                    }
                    else {
                        console.log(value)
                        return false
                    }
                }
            )
        }

        console.log(isMintable)

        if (isMintable) {
            posERC721Predicate_ = network_testnet.Main.POSContracts.MintableERC721PredicateProxy
            posERC1155Predicate_ = network_testnet.Main.POSContracts.MintableERC1155PredicateProxy
        }
        else {
            posERC721Predicate_ = network_testnet.Main.POSContracts.ERC721PredicateProxy
            posERC1155Predicate_ = network_testnet.Main.POSContracts.ERC1155PredicateProxy
        }

    }

    const account = await injected_provider.eth.getAccounts();
    // console.log(account)
    console.log(injected_provider)
    console.log(network_, version_, provider_, posRootChainManager_, posERC721Predicate_, posERC1155Predicate_)

    try {
        const posClient = new POSClient();
         await posClient.init({
            network: "testnet",
            version: "mumbai",
            // maticProvider: provider_,// injected_provider,
            // parentProvider: injected_provider,// provider_,
            // posRootChainManager: posRootChainManager_,
            // posERC721Predicate: posERC721Predicate_,
            // posERC1155Predicate: posERC1155Predicate_,
            // parentDefaultOptions: { from: account[0] },
            // maticDefaultOptions: { from: account[0] },
            parent: {
                provider: injected_provider,
                defaultConfig: {
                     from: account[0] 
                }
              },
              child: {
                provider: provider_,
                defaultConfig: {
                    from: account[0]
                }
              }

        })
        return posClient

    } catch (e) {
        console.error(e)
        // handle error
    }
}

/**
 * use childChainPrimaryProvider when primary (i.e provider injected by browser is connected
 * to mumbai/matic)
 * 
 * returns matic's POS client instance used while calling maticjs functions
 */

export const childChainPrimaryProvider = async (injected_provider) => {
    let network_, version_, provider_, posRootChainManager_, posERC721Predicate_, posERC1155Predicate_;

    const chainId = await injected_provider.eth.net.getId();
    console.log(chainId)
    if (chainId === 137) {
        network_ = "mainnet"
        version_ = "v1"
        provider_ = ethreum_provider_mainnet
        posRootChainManager_ = network_mainnet.Main.POSContracts.RootChainManagerProxy
        posERC721Predicate_ = network_mainnet.Main.POSContracts.ERC721PredicateProxy
        posERC1155Predicate_ = network_mainnet.Main.POSContracts.ERC1155PredicateProxy
    }
    else { // chainId === 80001
        network_ = "testnet"
        version_ = "mumbai"
        provider_ = ethreum_provider_testnet
        posRootChainManager_ = network_testnet.Main.POSContracts.RootChainManagerProxy
        posERC721Predicate_ = network_testnet.Main.POSContracts.ERC721PredicateProxy
        posERC1155Predicate_ = network_testnet.Main.POSContracts.ERC1155PredicateProxy
    }

    const account = await injected_provider.eth.getAccounts();
    // console.log(account)
    console.log(injected_provider)
    console.log(network_, version_, provider_, posRootChainManager_, posERC721Predicate_, posERC1155Predicate_)
    // try {
        const posClient = new POSClient();
        const POSclient = await posClient.init({
            network: network_,
            version: version_,
            parent: {
                provider: provider_,
                defaultConfig: {
                     from: account[0] 
                }
              },
              child: {
                provider: injected_provider,
                defaultConfig: {
                    from: account[0]
                }
              }

        })
        return POSclient


    // const POSClient = new POSClient({
    //     network: network_,
    //     version: version_,
    //     maticProvider: injected_provider,
    //     parentProvider: provider_,
    //     posRootChainManager: posRootChainManager_,
    //     posERC721Predicate: posERC721Predicate_,
    //     posERC1155Predicate: posERC1155Predicate_,
    //     parentDefaultOptions: { from: account[0] },
    //     maticDefaultOptions: { from: account[0] },

    // })
    // return POSClient

    // } catch (e) {
    //     console.error("Unable to create maticPOSClient", e)
    // }
}

