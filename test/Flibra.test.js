const FLibra = artifacts.require('./FLibra');

//import chai and chai as promised
require('chai')
  .use(require('chai-as-promised'))
  .should() 
 
contract('FLibra', ([deployer, user1, user2, user3, user4]) => {
  
  //fetch flibra contract before each async function
  beforeEach(async () => {
    flibra = await FLibra.new()
  })

  describe('test flibra contract', async() => {
    let result
    let sellerLibraAddress = "49f46445d3af962b9969e31ee6f0508771c7a787dff8a376ff86761685d47ca5"
    let contractAddress = "0x97B961625AA1E9517E81Cc1266bb109FC500b30c"
    let purchaserLibraAddress = "a2cfc5922cfd52f9796c09ddc3afd1cbe7f6205742be0fe0c7bb82d6a14a6dbb"

    beforeEach(async() => {
      result = await flibra.postItem(contractAddress, sellerLibraAddress, {from: user1})
    })

    it('emits a post item event', async () => {
      const log = result.logs[0]
      log.event.should.eq(('PostItem'))
      const event = log.args
      event.itemDetailContract.should.equal(contractAddress, 'item name is correct')
      event.seller.should.equal(sellerLibraAddress, 'item price is correct')
    })

    it('get my posted item', async () => {
      result = await flibra.getMyItemId(sellerLibraAddress, { from: user1 })
      result = await flibra.getMyItem(result[0], { from: user1 })
      let itemId = 1
      result.id.toString().should.equal(itemId.toString(), 'item price is correct')
      result.seller.should.equal(sellerLibraAddress, 'selling is true' )
    })

    describe('purchase item', async () => {
      beforeEach(async() => {
        result = await flibra.purchaseItem(1, purchaserLibraAddress, {from: user2})
      })

      it('emit purchase event', async () => {
        const log = result.logs[0]
        log.event.should.eq(('ItemPurchased'))
        const event = log.args
        event.purchaser.should.equal(purchaserLibraAddress, 'purchaser Address is correct')      
      })

      describe('write review', async () => {

        it('write review for purchaser', async () => {
          result = await flibra.writeReviewToPurchaser(1, 9, "Detail text",  sellerLibraAddress, {from: user1})
          const log = result.logs[0]
          log.event.should.eq(('WriteReviewToPurchaser'))
          const event = log.args
          event.star.toString().should.equal("9", 'star is correct')  
        })

        it('Reject if the libra address is different with item seller', async () => {
          result = await flibra.writeReviewToPurchaser(1, 9, "Detail text", purchaserLibraAddress, {from: user1}).should.be.rejected
        })

        it('write review for seller', async () => {
          result = await flibra.writeReviewToSeller(1, 8, "Detail text 22",  purchaserLibraAddress, {from: user2})
          const log = result.logs[0]
          log.event.should.eq(('WriteReviewToSeller'))
          const event = log.args
          event.star.toString().should.equal("8", 'star is correct')  
        })

        it('Reject if the libra address is different with item purchaser', async () => {
          result = await flibra.writeReviewToSeller(1, 8, "Detail text 22", sellerLibraAddress, {from: user2}).should.be.rejected
        })

      })

    })

  })

})