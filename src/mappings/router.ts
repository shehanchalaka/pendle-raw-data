import {
  MarketCreated as MarketCreatedEvent,
  Join as JoinEvent,
  Exit as ExitEvent,
  SwapEvent,
} from "../../generated/PendleRouter/PendleRouter";
import { Market, Join, Exit, Swap } from "../../generated/schema";

export function handleMarketCreated(event: MarketCreatedEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let market = new Market(event.params.market.toHexString());
  market.hash = hash;
  market.timestamp = timestamp;
  market.block = block;
  market.market = event.params.market.toHexString();
  market.marketFactoryId = event.params.marketFactoryId.toHexString();
  market.token0 = event.params.xyt.toHexString();
  market.token1 = event.params.token.toHexString();
  market.save();
}

export function handleJoin(event: JoinEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let join = new Join(hash);
  join.hash = hash;
  join.timestamp = timestamp;
  join.block = block;
  join.market = event.params.market.toHexString();
  join.token0Amount = event.params.token0Amount;
  join.token1Amount = event.params.token1Amount;
  join.exactOutLp = event.params.exactOutLp;
  join.sender = event.params.sender.toHexString();
  join.save();
}

export function handleExit(event: ExitEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let exit = new Exit(hash);
  exit.hash = hash;
  exit.timestamp = timestamp;
  exit.block = block;
  exit.market = event.params.market.toHexString();
  exit.token0Amount = event.params.token0Amount;
  exit.token1Amount = event.params.token1Amount;
  exit.exactInLp = event.params.exactInLp;
  exit.sender = event.params.sender.toHexString();
  exit.save();
}

export function handleSwap(event: SwapEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let swap = new Swap(hash);
  swap.hash = hash;
  swap.timestamp = timestamp;
  swap.block = block;
  swap.market = event.params.market.toHexString();
  swap.inToken = event.params.inToken.toHexString();
  swap.outToken = event.params.outToken.toHexString();
  swap.exactIn = event.params.exactIn;
  swap.exactOut = event.params.exactOut;
  swap.trader = event.params.trader.toHexString();
  swap.save();
}
