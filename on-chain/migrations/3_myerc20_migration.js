const MyERC20 = artifacts.require("MyERC20");

module.exports = function (deployer) {
  deployer.deploy(MyERC20, 'MyERC20', 'ME2');
};
