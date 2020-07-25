for (let i = 0; i < customProtocols.length; i++) {
    if (customProtocols[i].protocol !== "maker") {
      // since the spell structure for maker connectors is different from others
      switch (customProtocols[i].name) {
        case "borrow":
          if (!customProtocols[i].amount)
            throw new Error("Amount Mandatory for Borrow");
          else
            spells = await genericDSAOperations(
              spells,
              customProtocols[i].protocol,
              "borrow",
              customProtocols[i].asset,
              customProtocols[i].amount
            );

          break;

        case "deposit":
          if (!customProtocols[i].amount)
            spells = await genericDSAOperations(
              spells,
              customProtocols[i].protocol,
              "deposit",
              customProtocols[i].asset,
              "-1"
            );
          else
            spells = await genericDSAOperations(
              spells,
              customProtocols[i].protocol,
              "deposit",
              customProtocols[i].asset,
              customProtocols[i].amount
            );

          break;

        case "withdraw":
          if (!customProtocols[i].amount)
            throw new Error("Amount Mandatory for Withdraw");
          else
            spells = await genericDSAOperations(
              spells,
              customProtocols[i].protocol,
              "withdraw",
              customProtocols[i].asset,
              customProtocols[i].amount
            );

          break;

        case "payback":
          if (!customProtocols[i].amount)
            spells = await genericDSAOperations(
              spells,
              customProtocols[i].protocol,
              "payback",
              customProtocols[i].asset,
              "-1"
            );
          else
            spells = await genericDSAOperations(
              spells,
              customProtocols[i].protocol,
              "payback",
              customProtocols[i].asset,
              customProtocols[i].amount
            );

          break;

        case "flashBorrow":
          if (!customProtocols[i].amount)
            throw new Error("Amount Mandatory for Flash Borrow");
          else
            spells = await flashBorrow(
              spells,
              customProtocols[i].asset,
              customProtocols[i].amount
            );

          break;

        case "flashPayback":
          spells = await flashPayback(spells, customProtocols[i].asset)
          break;

        case "swap":
          if (customProtocols[i].buyingTokenSymbol === customProtocols[i].sellingTokenSymbol)
            throw new Error("Cannot have both assets same");
          
          if (!customProtocols[i].amount)
            throw new Error("Swap Amount is mandatory");
          const slippage = 2;
          const amount = web3.utils.fromWei(customProtocols[i].amount, 'ether')

          const swapDetail = await dsa[customProtocols[i].protocol.toString()].getBuyAmount(
            customProtocols[i].buyingTokenSymbol,
            customProtocols[i].sellingTokenSymbol,
            amount,
            slippage
          );
          spells = await swap(
            spells,
            customProtocols[i].protocol,
            customProtocols[i].buyAddress,
            customProtocols[i].asset,
            customProtocols[i].amount,
            swapDetail.unitAmt
          );
          break;

        default:
          throw new Error("Invalid Operation");
      }
    } else {
      switch (customProtocols[i].name) {
        case "openVault":
          spells = await openMakerVault(
            spells,
            this.state.makerVaultOptions[
              customProtocols[i].sellingTokenSymbol
            ]
          );
          break;

        case "deposit":
          if (!customProtocols[i].vaultId) customProtocols[i].vaultId = 0;
          
          if (customProtocols[i].sellingTokenSymbol === "DAI") {
            spells = await depositDai(spells, customProtocols[i].amount)
          } else {
            spells = await makerGenericOperations(
            spells,
            "deposit",
            customProtocols[i].vaultId,
            customProtocols[i].amount
          );
          }
         
          break;

        case "borrow":
          if (!customProtocols[i].vaultId) customProtocols[i].vaultId = 0;

          spells = await makerGenericOperations(
            spells,
            "borrow",
            customProtocols[i].vaultId,
            customProtocols[i].amount
          );
          break;

        case "payback":
          if (!customProtocols[i].vaultId) customProtocols[i].vaultId = 0;

          spells = await makerGenericOperations(
            spells,
            "payback",
            customProtocols[i].vaultId,
            customProtocols[i].amount
          );
          break;

        case "withdraw":
          if (!customProtocols[i].vaultId) customProtocols[i].vaultId = 0;

          if (customProtocols[i].sellingTokenSymbol === "DAI") {
            spells = await withdrawDai(spells, customProtocols[i].amount)
          } else {
            spells = await makerGenericOperations(
            spells,
            "withdraw",
            customProtocols[i].vaultId,
            customProtocols[i].amount
          );
          }
         
          break;

        default:
          throw new Error("Invalid Operation");
      }
    }
  }
  var data = {
    spells: spells,
  };

  
  // For Simulation Testing on tenderly
  var gasLimit = await dsa.estimateCastGas(data).catch((err) => {
    this.setState({
      errMessage: "Transaction is likely to fail, Check you spells once!",
    });
    this.showErrorModal();
  });
  const tx = await dsa.cast({spells: spells})
    .catch((err) => {
      throw new Error("Transaction is likely to fail, Check you spells once!")
    });
  if (tx) {
  this.setState({
    successMessage: "https://etherscan.io/tx/" + tx
  });
  this.showSuccessModal();
  }  
} catch (err) {
      this.setState({
        errMessage: err.message
      });
      this.showErrorModal();   
 }
}
