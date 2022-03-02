#pragma once

#include <string>
#include <vector>

struct token_balance {
    eosio::symbol token_symbol;
    eosio::asset token_balance;
};

struct Wallet {
    std::vector<token_balance> tokens_with_balances;
    std::vector<eosio::symbol> tokens_without_balances;
};
