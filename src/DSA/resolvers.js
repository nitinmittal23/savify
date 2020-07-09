export const genericResolver = async (dsa, protocol, dsaAddress) => {
    return await dsa[protocol].getPosition(dsaAddress);
}

export const getBalances = async (dsa, dsaAddress) => {
    return await dsa.balances.getBalances(dsaAddress)
}