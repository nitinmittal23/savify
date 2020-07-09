export const genericDSAtoggle = async (
    spells,
    protocol_withdraw,
    protocol_deposit,
    assetAddress,
    amount
) => {
    await spells.add({
        connector: protocol_withdraw,
        method: "withdraw",
        args: [assetAddress, "-1", 0, 0],
    });
    await spells.add({
        connector: protocol_deposit,
        method: "deposit",
        args: [assetAddress, amount, 0, 0],
    });
    return spells;
};

export const genericDSAdeposit = async (
    spells,
    protocol,
    assetAddress,
    amount
) => {
    await spells.add({
        connector: "basic",
        method: "deposit",
        args: [assetAddress, amount, 0, 0],
    });
    await spells.add({
        connector: protocol,
        method: "deposit",
        args: [assetAddress, amount, 0, 0],
    });
    return spells;
};

export const genericDSAwithdraw = async (
    spells,
    protocol,
    assetAddress,
    amount,
    userAddress
) => {
    await spells.add({
        connector: protocol,
        method: "withdraw",
        args: [assetAddress, amount, 0, 0],
    });
    await spells.add({
        connector: "basic",
        method: "withdraw",
        args: [assetAddress, amount,userAddress, 0, 0],
    });
    return spells;
};