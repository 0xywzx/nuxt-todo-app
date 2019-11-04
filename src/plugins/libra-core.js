import { LibraClient, LibraNetwork } from 'kulap-libra';

const libraClient = new LibraClient({
  transferProtocol: 'https',
  host: 'ac-libra-testnet.kulap.io',
  port: '443',
  dataProtocol: 'grpc-web-text'
})

export default libraClient