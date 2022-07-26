const CheapNFTMarketplace = artifacts.require('CheapNFTMarketplace');
const MyNft = artifacts.require('MyNFT');
const MyERC20 = artifacts.require('MyERC20');
const truffleAssert = require('truffle-assertions');

contract('CheapNFTMarketplace', (accounts) => {
    it('Successful transaction', async () => {
      try {
        // Deploy contracts
        const myERC20 = await MyERC20.new('MyERC20','ME2');
        const myNft = await MyNft.new();
        const cheapNFTMarket = await CheapNFTMarketplace.new();

        // Accounts
        const ownerAccount = accounts[1];
        const bidderAccount = accounts[2];
        const marketAccount = cheapNFTMarket.address;

        const tokenId = 1;
        const erc20amount = 6;

        // Mint and aprove nft to market place
        await myNft.mintNFT(ownerAccount, 'TokenURI');
        await myNft.approve(marketAccount, tokenId, {from: ownerAccount});

        // Transfer and aprove ERC20 to market place
        await myERC20.transfer(bidderAccount, 100);
        await myERC20.approve(marketAccount, 10, {from: bidderAccount});

        // Sign massage
        var message = web3.utils.soliditySha3(
          {t: 'address', v: ownerAccount},
          {t: 'address', v: bidderAccount},
          {t: 'address', v: myNft.address},
          {t: 'uint256', v: tokenId},
          {t: 'address', v: myERC20.address},
          {t: 'uint256', v: erc20amount}
        )
        
        const signatureOwner = await web3.eth.sign(message, ownerAccount);
        const signatureBidder = await web3.eth.sign(message, bidderAccount);

        // Execute Transaction
        const result = await cheapNFTMarket.executeTransaction(
          ownerAccount,
          bidderAccount,
          myNft.address,
          tokenId,
          myERC20.address,
          erc20amount,
          signatureOwner,
          signatureBidder
        )

        // Checks event 'TransactionExecuted'
        truffleAssert.eventEmitted(result, 'TransactionExecuted', (ev) => {
          return ev.id == 0 &&
            ev.ownerAddr == ownerAccount &&
            ev.bidderAddr == bidderAccount &&
            ev.nftContractAddr == myNft.address &&
            ev.tokenId == tokenId &&
            ev.erc20ContractAddr == myERC20.address &&
            ev.erc20amount == erc20amount &&
            ev.ownerSignature == signatureOwner &&
            ev.bidderSignature == signatureBidder
        })

        // Checks transaction of NFT
        const nftOwner = await myNft.ownerOf(tokenId);
        assert.equal(nftOwner.toString(), bidderAccount, 'The bidder it\'s not the nft owner after transaction.');

        // Checks transaction of ERC20
        const ownerERC20Amount = await myERC20.balanceOf(ownerAccount);
        assert.equal(ownerERC20Amount.toString(), erc20amount, 'The owner has not the correct amount of ERC20 after transaction.');
      } catch(err) {
        console.error(err);
        assert.equal(false,true,'err');
      }
    });
  });
  