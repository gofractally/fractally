#include <string>
#include <vector>

struct TokenBalance {
    eosio::symbol token_symbol;
    eosio::asset token_balance;
};

struct Wallet {
    std::vector<TokenBalance> tokens_with_balances;
    std::vector<std::symbol> tokens_without_balances;
};
