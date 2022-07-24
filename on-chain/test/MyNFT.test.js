const myNft = artifacts.require('MyNFT');


contract('MyNFT', (accounts) => {
    it('Name of nft collection', async () => {
        const myNftInstance = await myNft.new();
  
        const name = await myNftInstance.name();
        assert.equal(name.toString(), 'MyNFT', 'The nft collection name is wrong.');
      });

      it('Symbol of nft connection', async () => {
        const myNftInstance = await myNft.new();
  
        const symbol = await myNftInstance.symbol();
        assert.equal(symbol.toString(), 'NFT', 'The nft collection name is wrong.');

      });

    it('Mint an nft', async () => {
      const myNftInstance = await myNft.new();

      await myNftInstance.mintNFT(accounts[0], 'TokenURI');

      const nftOwner = await myNftInstance.ownerOf(1);
      assert.equal(nftOwner.toString(), accounts[0], 'The nft owner is wrong.');
    });
  });
  