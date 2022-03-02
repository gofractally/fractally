#include <string>
#include <vector>

#include <eosio/asset.hpp>

struct team_balance {
    placeholder team_acct;
    eosio::asset balance;
};

struct team_pool {
   private:
    std::vector<team_balance> team_balances;

   public:
    eosio::asset getBalance();
    // likely just a xfer
    void depositRespect(placeholder team_acct, eosio::asset amt);
    std::vector<member> getCouncil();  // team_stats(0).order(earnings).take(12).team_lead
};
