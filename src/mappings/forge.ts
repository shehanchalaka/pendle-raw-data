import {
  NewYieldContracts as NewYieldContractsEvent,
  MintYieldTokens as MintYieldTokensEvent,
  RedeemYieldToken as RedeemYieldTokenEvent,
} from "../../generated/templates/IPendleForge/IPendleForge";
import { YieldContract, Mint, Redeem } from "../../generated/schema";
import { store } from "@graphprotocol/graph-ts";

export function handleNewYieldContracts(event: NewYieldContractsEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let yieldContract = new YieldContract(hash);
  yieldContract.hash = hash;
  yieldContract.timestamp = timestamp;
  yieldContract.block = block;
  yieldContract.forgId = event.params.forgeId.toString();
  yieldContract.expiry = event.params.expiry;
  yieldContract.underlyingAsset = event.params.underlyingAsset.toHexString();
  yieldContract.yieldBearingAsset = event.params.yieldBearingAsset.toHexString();
  yieldContract.ot = event.params.ot.toHexString();
  yieldContract.xyt = event.params.xyt.toHexString();
  yieldContract.save();
}

export function handleMintYieldTokens(event: MintYieldTokensEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let mint = new Mint(hash);
  mint.hash = hash;
  mint.timestamp = timestamp;
  mint.block = block;
  mint.forgeId = event.params.forgeId.toString();
  mint.expiry = event.params.expiry;
  mint.underlyingAsset = event.params.underlyingAsset.toHexString();
  mint.amountToTokenize = event.params.amountToTokenize;
  mint.amountTokenMinted = event.params.amountTokenMinted;
  mint.user = event.params.user.toHexString();
  mint.save();
}

export function handleRedeemYieldToken(event: RedeemYieldTokenEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let redeem = new Redeem(hash);
  redeem.hash = hash;
  redeem.timestamp = timestamp;
  redeem.block = block;
  redeem.forgeId = event.params.forgeId.toString();
  redeem.expiry = event.params.expiry;
  redeem.underlyingAsset = event.params.underlyingAsset.toHexString();
  redeem.amountToRedeem = event.params.amountToRedeem;
  redeem.redeemedAmount = event.params.redeemedAmount;
  redeem.user = event.params.user.toHexString();
  redeem.save();
}
