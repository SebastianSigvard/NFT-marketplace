const MyERC20 = artifacts.require('MyERC20');


contract('MyERC20', (accounts) => {
    it('Name of ERC20', async () => {
        const myERC20Instance = await MyERC20.new('MyERC20','ME2');
  
        const name = await myERC20Instance.name();
        assert.equal(name.toString(), 'MyERC20', 'The ERC20 name is wrong.');
      });

      it('Symbol of ERC20', async () => {
        const myERC20Instance = await MyERC20.new('MyERC20','ME2');
  
        const symbol = await myERC20Instance.symbol();
        assert.equal(symbol.toString(), 'ME2', 'The ERC20 symbol is wrong.');
      });

    it('Balance of creator account', async () => {
      const myERC20Instance = await MyERC20.new('MyERC20','ME2');

      const balance = await myERC20Instance.balanceOf(accounts[0]);
      assert.equal(balance.toString(), '1000', 'The balance of owner is wrong.');
    });
  });
  