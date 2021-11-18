export const approveERC721 = async (pos_client, rootTokenAddress) => {
    const tx = await pos_client.approveAllERC721ForDeposit(rootTokenAddress);
    console.log("approve", tx.transactionHash)
    return tx;
}

export const depositERC721 = async (pos_client, rootTokenAddress, receiverAddress, tokenIds) => {
    // console.log(rootTokenAddress)
    // console.log(pos_client)
    const tx = await pos_client.depositBatchERC721ForUser(
        rootTokenAddress,
        receiverAddress,
        tokenIds,
    )
    return tx;
}

export const burnERC721 = async (pos_client, childTokenAddress, tokenIds) => {
    const tx = await pos_client.burnBatchERC721(
        childTokenAddress,
        tokenIds,
        // { from: from }
    )
    console.log(tx, tx.transactionHash);
    return tx.transactionHash;
}

export const exitERC721 = async (pos_client, txnHash) => {
    const tx = await pos_client.exitBatchERC721(
        txnHash,
        // { from: from }
    )
    console.log(tx, tx.transactionHash);
    return tx.transactionHash;
}
