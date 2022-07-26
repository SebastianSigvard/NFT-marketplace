const CheapNFTMarketplace = artifacts.require("CheapNFTMarketplace");

module.exports = function (deployer) {
  deployer.deploy(CheapNFTMarketplace);
};
