export const approveERC1155 = async (pos_client, rootTokenAddress) => {
    const tx = await pos_client.approveERC1155ForDeposit(rootTokenAddress);
    console.log("approve", tx.transactionHash)
    return tx;
}

export const depositERC1155 = async (pos_client, rootTokenAddress, receiverAddress, tokenIds,tokenAmounts) => {
    const tx = await pos_client.depositBatchERC1155ForUser(
        rootTokenAddress,
        receiverAddress,
        tokenIds,
        tokenAmounts,
    )
    console.log("deposit", tx.transactionHash);
    return tx;
}

export const burnBatchERC1155 = async (pos_client, childTokenAddress, tokenIds, tokenAmounts) => {
    const tx = await pos_client.burnBatchERC1155(
        childTokenAddress,
        tokenIds,
        tokenAmounts,
    )
    console.log(tx, tx.transactionHash);
    return tx.transactionHash;
}

export const exitERC1155 = async (pos_client, txnHash) => {
    const tx = await pos_client.exitBatchERC1155(
        txnHash,
        // { from: from }
        // from address already set in defaults
    )
    console.log(tx, tx.transactionHash);
    return tx.transactionHash;
}
