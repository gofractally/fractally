import { numToAsset } from "../utils";
import { Contract } from "./contract";

class Token extends Contract {
  constructor(
    public symbolCode: string,
    public precision: number,
    contract: string
  ) {
    super(contract);
  }

  get zero() {
    return numToAsset(0, this.precision, this.symbolCode);
  }
 
  public transfer(from: string, to: string, quantity: string, memo?: string) {
    return this.buildAction("transfer", {
      from,
      to,
      quantity,
      memo: memo ? memo : "",
    });
  }

  public open(owner: string, symbol: string, ram_payer: string) {
    return this.buildAction("open", { owner, symbol, ram_payer });
  }
}

export const eosToken = new Token("EOS", 4, "eosio.token");
