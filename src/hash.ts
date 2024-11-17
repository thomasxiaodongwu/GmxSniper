import { ethers } from "ethers";
const { keccak256, toUtf8Bytes } = ethers.utils;

export function encodeData(dataTypes: readonly (string | ethers.utils.ParamType)[], dataValues: readonly any[]) {
  const bytes = ethers.utils.defaultAbiCoder.encode(dataTypes, dataValues);
  return ethers.utils.hexlify(bytes);
}

export function hashData(dataTypes: readonly (string | ethers.utils.ParamType)[], dataValues: readonly any[]) {
  const bytes = ethers.utils.defaultAbiCoder.encode(dataTypes, dataValues);
  const hash = ethers.utils.keccak256(ethers.utils.arrayify(bytes));

  return hash;
}

export function hashString(string: string) {
  return hashData(["string"], [string]);
}

export function keccakString(string: string) {
  return keccak256(toUtf8Bytes(string));
}
