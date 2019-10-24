import Web3 from "web3";
import artifacts from "~/abis/Todo.json";
import flibra from "~/abis/Flibra.json";

export default async function({ store }, inject) {
  //const httpEndpoint = "https://bc.cheer-for.com:8545";
  //const wsEndpoint = "ws://127.0.0.1:8546"
  const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:8545'))
  let networkId = await web3.eth.net.getId()
  let contract = await new web3.eth.Contract(
    artifacts.abi,
    artifacts.networks[networkId].address
  )
  let flibraContract = await new web3.eth.Contract(
    flibra.abi,
    flibra.networks[networkId].address
  )
  //console.log(contract)
  const web3ws = await new Web3(new Web3.providers.WebsocketProvider('ws://0.0.0.0:8546'));
  let flibraContractWS = await new web3ws.eth.Contract(
    flibra.abi,
    flibra.networks[networkId].address
  )
  
  inject('web3',web3)
  inject('contract',contract)
  inject('flibraContract', flibraContract)
  inject('flibraContractWS', flibraContractWS)

  const privateKeyEther = "8aaf051fe6fb9c839481f770407760b4998916c276adaf6e04dfb4d7e81ee88c"
  const encryptPrivateKey = await web3.eth.accounts.encrypt(privateKeyEther, 'test!')
  //console.log(encryptPrivateKey)
  const decryptEtherAccount = await web3.eth.accounts.decrypt(encryptPrivateKey, 'test!')
  //console.log(decryptEtherAccount)
  await store.commit('todosChain/setAccount', decryptEtherAccount.address)
  await store.commit('todosChain/setPrivateKey', decryptEtherAccount.privateKey)
}