const IPFS = require('ipfs-http-client');

export default async function({ store }, inject) {
  const ipfs = await new IPFS({host:'ipfs.infura.io', port: '5001', protocol: 'https'});
  inject('ipfs', ipfs)
}

