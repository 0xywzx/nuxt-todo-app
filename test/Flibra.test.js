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

    it('emits a post item event', async () => {
      result = await flibra.postItem(contractAddress, sellerLibraAddress, {from: user1})
      const log = result.logs[0]
      log.event.should.eq(('PostItem'))
      const event = log.args
      event.itemDetailContract.should.equal(contractAddress, 'item name is correct')
      event.seller.should.equal(sellerLibraAddress, 'item price is correct')
    })

  })



})