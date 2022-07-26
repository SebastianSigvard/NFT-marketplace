const CheapNFTMarketplace = artifacts.require('CheapNFTMarketplace');
const MyNft = artifacts.require('MyNFT');
const MyERC20 = artifacts.require('MyERC20');
const truffleAssert = require('truffle-assertions');

contract('CheapNFTMarketplace', (accounts) => {
  let myERC20;
  let myNft;
  let cheapNFTMarket;

  let ownerAccount;
  let bidderAccount;
  let marketAccount;

  let tokenId;
  let erc20amount;

  let message;
  let signatureOwner;
  let signatureBidder;

  beforeEach(async function () {
    // Deploy contracts
    myERC20 = await MyERC20.new('MyERC20','ME2');
    myNft = await MyNft.new();
    cheapNFTMarket = await CheapNFTMarketplace.new();

    // Accounts
    ownerAccount = accounts[1];
    bidderAccount = accounts[2];
    marketAccount = cheapNFTMarket.address;

    // Sign massage
    tokenId = 1;
    erc20amount = 6;

    message = web3.utils.soliditySha3(
      {t: 'address', v: ownerAccount},
      {t: 'address', v: bidderAccount},
      {t: 'address', v: myNft.address},
      {t: 'uint256', v: tokenId},
      {t: 'address', v: myERC20.address},
      {t: 'uint256', v: erc20amount}
    )
    
    signatureOwner = await web3.eth.sign(message, ownerAccount);
    signatureBidder = await web3.eth.sign(message, bidderAccount);
    
  })

  it('Successful transaction', async () => {
    try {
      // Mint and aprove nft to market place
      await myNft.mintNFT(ownerAccount, 'TokenURI');
      await myNft.approve(marketAccount, tokenId, {from: ownerAccount});

      // Transfer and aprove ERC20 to market place
      await myERC20.transfer(bidderAccount, 100);
      await myERC20.approve(marketAccount, 10, {from: bidderAccount});

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

  it('NFT not owned by ownerAddr (reverts)', async () => {
    try {
      // Mint nft to wrong account
      await myNft.mintNFT(bidderAccount, 'TokenURI');

      // Execute Transaction
      await truffleAssert.reverts(cheapNFTMarket.executeTransaction(
        ownerAccount,
        bidderAccount,
        myNft.address,
        tokenId,
        myERC20.address,
        erc20amount,
        signatureOwner,
        signatureBidder
      ),'NFT is not owned by the ownerAddr')
      
    } catch(err) {
      console.error(err);
      assert.equal(false,true,'err');
    }
  });

  it('NFT not approved to market (reverts)', async () => {
    try {
      // Mint nft to wrong account
      await myNft.mintNFT(ownerAccount, 'TokenURI');

      // Execute Transaction
      await truffleAssert.reverts(cheapNFTMarket.executeTransaction(
        ownerAccount,
        bidderAccount,
        myNft.address,
        tokenId,
        myERC20.address,
        erc20amount,
        signatureOwner,
        signatureBidder
      ),'NFT must be approved to market')
      
    } catch(err) {
      console.error(err);
      assert.equal(false,true,'err');
    }
  });

  it('Not enough ERC approved to market (reverts)', async () => {
    try {
      // Mint and aprove nft to market place
      await myNft.mintNFT(ownerAccount, 'TokenURI');
      await myNft.approve(marketAccount, tokenId, {from: ownerAccount});

      // Transfer and aprove less ERC20 than needed to market place
      await myERC20.transfer(bidderAccount, 100);
      await myERC20.approve(marketAccount, 2, {from: bidderAccount});

      // Execute Transaction
      await truffleAssert.reverts(cheapNFTMarket.executeTransaction(
        ownerAccount,
        bidderAccount,
        myNft.address,
        tokenId,
        myERC20.address,
        erc20amount,
        signatureOwner,
        signatureBidder
      ),'Bidder must be approved at least the bid amount')
      
    } catch(err) {
      console.error(err);
      assert.equal(false,true,'err');
    }
  });

  it('Not properly signed by the owner (reverts)', async () => {
    try {
      // Mint and aprove nft to market place
      await myNft.mintNFT(ownerAccount, 'TokenURI');
      await myNft.approve(marketAccount, tokenId, {from: ownerAccount});

      // Transfer and aprove less ERC20 than needed to market place
      await myERC20.transfer(bidderAccount, 100);
      await myERC20.approve(marketAccount, 10, {from: bidderAccount});

      // Execute Transaction
      await truffleAssert.reverts(cheapNFTMarket.executeTransaction(
        ownerAccount,
        bidderAccount,
        myNft.address,
        tokenId,
        myERC20.address,
        erc20amount,
        signatureBidder,
        signatureBidder
      ),'Message it\'s not properly signed by the owner')
      
    } catch(err) {
      console.error(err);
      assert.equal(false,true,'err');
    }
  });

  it('Not properly signed by the bidder (reverts)', async () => {
    try {
      // Mint and aprove nft to market place
      await myNft.mintNFT(ownerAccount, 'TokenURI');
      await myNft.approve(marketAccount, tokenId, {from: ownerAccount});

      // Transfer and aprove less ERC20 than needed to market place
      await myERC20.transfer(bidderAccount, 100);
      await myERC20.approve(marketAccount, 10, {from: bidderAccount});

      // Execute Transaction
      await truffleAssert.reverts(cheapNFTMarket.executeTransaction(
        ownerAccount,
        bidderAccount,
        myNft.address,
        tokenId,
        myERC20.address,
        erc20amount,
        signatureOwner,
        signatureOwner
      ),'Message it\'s not properly signed by the bidder')
      
    } catch(err) {
      console.error(err);
      assert.equal(false,true,'err');
    }
  });
});
  