import {
  BigInt,
  dataSource,
  DataSourceContext,
  Address,
} from "@graphprotocol/graph-ts";
import { PairCreated as PairCreatedEvent } from "../../generated/TraderJoeFactory/TraderJoeFactory";
import {
  Mint as MintEvent,
  Burn as BurnEvent,
  Swap as SwapEvent,
} from "../../generated/templates/TraderJoePair/TraderJoePair";
import { TraderJoePair as TraderJoePairTemplate } from "../../generated/templates";
import { Market, Join, Exit, Swap } from "../../generated/schema";

let ZERO_BI = BigInt.fromString("0");

let OT_MARKETS_WHITELIST: Address[] = [
  Address.fromString("0x82DB765c214C1AAB16672058A3C22b12F6A42CD0"), // POOL_OT_QIUSDC_28_DEC_2023_X_USDC
  Address.fromString("0x5f973e06A59D0bAfe464FAf36d5B3B06e075c543"), // POOL_OT_QIAVAX_28_DEC_2023_X_USDC
  Address.fromString("0x82922e6fBe83547c5E2E0229815942A2108e4624"), // POOL_OT_JLP_WAVAX_PENDLE_28_DEC_2023_X_PENDLE
  Address.fromString("0xD1f377b881010cb97Ab0890a5Ef908c45bCf13F9"), // POOL_OT_XJOE_30_JUN_2022_X_USDC
  Address.fromString("0x588DC0Dd7C8be073E9DA79307E023F1F756F06C6"), // POOL_OT_WMEMO_24_FEB_2022_X_MIM
];

function isOTMarket(id: string): boolean {
  if (OT_MARKETS_WHITELIST.includes(Address.fromString(id))) {
    return true;
  } else {
    return false;
  }
}

export function handlePairCreated(event: PairCreatedEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let pair = event.params.pair.toHexString();
  let token0 = event.params.token0.toHexString();
  let token1 = event.params.token1.toHexString();

  if (!isOTMarket(pair)) {
    return;
  }

  let market = new Market(pair);
  market.hash = hash;
  market.timestamp = timestamp;
  market.block = block;
  market.market = pair;
  market.token0 = token0;
  market.token1 = token1;
  market.save();

  const context = new DataSourceContext();
  context.setString("market", pair);
  context.setString("token0", token0);
  context.setString("token1", token1);
  TraderJoePairTemplate.createWithContext(event.params.pair, context);
}

export function handleMint(event: MintEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let context = dataSource.context();
  let market = context.getString("market");

  let join = new Join(hash);
  join.hash = hash;
  join.timestamp = timestamp;
  join.block = block;
  join.market = market;
  join.token0Amount = event.params.amount0;
  join.token1Amount = event.params.amount1;
  join.sender = event.params.sender.toHexString();
  join.save();
}

export function handleBurn(event: BurnEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let context = dataSource.context();
  let market = context.getString("market");

  let exit = new Exit(hash);
  exit.hash = hash;
  exit.timestamp = timestamp;
  exit.block = block;
  exit.market = market;
  exit.token0Amount = event.params.amount0;
  exit.token1Amount = event.params.amount1;
  exit.sender = event.params.sender.toHexString();
  exit.save();
}

export function handleSwap(event: SwapEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let context = dataSource.context();
  let market = context.getString("market");
  let token0 = context.getString("token0");
  let token1 = context.getString("token1");

  let inToken: string;
  let outToken: string;

  let exactIn: BigInt;
  let exactOut: BigInt;

  if (event.params.amount0In.gt(ZERO_BI)) {
    inToken = token0;
    exactIn = event.params.amount0In;
    outToken = token1;
    exactOut = event.params.amount1Out;
  } else {
    inToken = token1;
    exactIn = event.params.amount1In;
    outToken = token0;
    exactOut = event.params.amount0Out;
  }

  let swap = new Swap(hash);
  swap.hash = hash;
  swap.timestamp = timestamp;
  swap.block = block;
  swap.market = market;
  swap.inToken = inToken;
  swap.outToken = outToken;
  swap.exactIn = exactIn;
  swap.exactOut = exactOut;
  swap.trader = event.params.sender.toHexString();
  swap.save();
}
