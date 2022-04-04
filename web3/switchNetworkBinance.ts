const switchNetworkBinance = async () => {
  try {
    // @ts-expect-error
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
  } catch (err) {
    // alert(err.message);
    if (err.code === 4902) {
      try {
        // @ts-expect-error
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x38",
              chainName: "Binance Smart Chain Mainnet",
              rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              blockExplorerUrls: ["https://bscscan.com/"],
            },
          ],
        });
      } catch (error) {
        alert(error.message);
      }
    }
  }
};

export default switchNetworkBinance;
