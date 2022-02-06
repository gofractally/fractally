import { Action, ContractAction, ActionParams } from "./index";

export class Contract {
  public contractAccount: string;

  constructor(name: string) {
    this.contractAccount = name;
  }

  protected buildContractAction(action: Action): ContractAction {
    return {
      ...action,
      account: this.contractAccount,
    };
  }

  protected buildAction(name: string, params: ActionParams) {
    return this.buildContractAction({ name, data: params });
  }
}
