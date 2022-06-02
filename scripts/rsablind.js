const secureRandom = require('secure-random');
const { BigInteger } = require('jsbn');
const sha1 = require('sha1');
const NodeRSA = require('node-rsa');

function keyGeneration(params) {
  const key = new NodeRSA(params || { b: 2048 }, {
    signingScheme: 'pkcs1',
    signingSchemeOptions: {
      hash: 'sha1',
      saltLength: null,
    },
    encryptionScheme: 'pkcs1_oaep',
    encryptionSchemeOptions: {
      hash: 'sha1',
      label: null,
    },
  });
  return key;
}

function keyProperties(key) {
  return {
    E: new BigInteger(key.keyPair.e.toString()),
    N: key.keyPair.n,
    D: key.keyPair.d,
  };
}

function messageToHash(message) {
  return sha1(message);
}

function messageToHashInt(message) {
  const messageHash = messageToHash(message);
  return new BigInteger(messageHash, 16);
}

function blind({
  message, modulus, exponent,
}) {
  const messageHash = messageToHashInt(message);
  const N = new BigInteger(modulus.toString());
  const E = new BigInteger(exponent.toString());

  const bigOne = new BigInteger('1');
  let gcd;
  let r;
  do {
    r = new BigInteger(secureRandom(64)).mod(N);
    gcd = r.gcd(N);
  } while (
    !gcd.equals(bigOne)
    || r.compareTo(N) >= 0
    || r.compareTo(bigOne) <= 0
  );
  const blinded = messageHash.multiply(r.modPow(E, N)).mod(N);
  return {
    blindedMessage: blinded,
    privateKey: r,
  };
}

function sign({ message, key }) {
  const { N, D } = keyProperties(key);
  const messageInt = new BigInteger(message.toString());
  return messageInt.modPow(D, N);
}

function unBlind({
  signature, privateKey, modulus,
}) {
  const r = new BigInteger(privateKey.toString());
  const N = new BigInteger(modulus.toString());
  const signValue = new BigInteger(signature.toString());
  return signValue.multiply(r.modInverse(N))
    .mod(N);
}

function verify({
  unBlinded, message, modulus, exponent,
}) {
  const unBlindedValue = new BigInteger(unBlinded.toString());
  const messageHash = messageToHashInt(message);
  const N = new BigInteger(modulus.toString());
  const E = new BigInteger(exponent.toString());

  const originalMsg = unBlindedValue.modPow(E, N);
  return messageHash.equals(originalMsg);
}

module.exports = {
  keyGeneration,
  messageToHash,
  messageToHashInt,
  blind,
  sign,
  unBlind,
  verify,
};
