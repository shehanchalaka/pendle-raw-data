import {
  BigInt,
  dataSource,
  DataSourceContext,
  Address,
} from "@graphprotocol/graph-ts";
import { PairCreated as PairCreatedEvent } from "../../generated/SushiFactory/SushiFactory";
import {
  Mint as MintEvent,
  Burn as BurnEvent,
  Swap as SwapEvent,
} from "../../generated/templates/SushiPair/SushiPair";
import { SushiPair as SushiPairTemplate } from "../../generated/templates";
import { Market, Join, Exit, Swap, DebugLog } from "../../generated/schema";

let ZERO_BI = BigInt.fromString("0");

let OT_MARKETS_WHITELIST: Address[] = [
  Address.fromString("0x0D8a21f2Ea15269B7470c347083ee1f85e6A723B"), // POOL_OT_AUSDC_29_DEC_2022_X_USDC
  Address.fromString("0x8B758d7fD0fC58FCA8caA5e53AF2c7Da5F5F8De1"), // POOL_OT_AUSDC_30_DEC_2021_X_USDC
  Address.fromString("0x2C80D72af9AB0bb9D98F607C817c6F512dd647e6"), // POOL_OT_CDAI_30_DEC_2021_X_USDC
  Address.fromString("0x4556C4488CC16D5e9552cC1a99a529c1392E4fe9"), // POOL_OT_CDAI_29_DEC_2022_X_USDC
  Address.fromString("0xb124C4e18A282143D362a066736FD60d22393Ef4"), // POOL_OT_SLP_PENDLE_WETH_29_DEC_2022_X_PENDLE
  Address.fromString("0x72972b21Ce425cFd67935E07C68e84300cE3F40F"), // POOL_OT_SLP_USDC_WETH_29_DEC_2022_X_USDC
  Address.fromString("0x4C5BE0fEa74c33455F81c85561146BdAF09633dA"), // POOL_OT_WXBTRFLY_21_APR_2022_X_USDC
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

  let debug = new DebugLog(hash);
  debug.message = pair;
  debug.save();

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
  SushiPairTemplate.createWithContext(event.params.pair, context);
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
