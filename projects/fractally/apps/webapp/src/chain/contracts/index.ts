export interface ActionParams {
    [key: string]: string | number | boolean;
}

export interface Action {
    data: ActionParams;
    name: string;
}

export interface ContractAction extends Action {
    account: string;
}
