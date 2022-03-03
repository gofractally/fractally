#include <string>
#include <vector>

#include <eosio/asset.hpp>

// MEDIA pool
struct media_pool {
   private:
    eosio::asset balance;

   public:
    eosio::asset getBalance();
    void depositRespect(eosio::asset amt);
};

// STAKING pool
struct sponsor_stakes {
    placeholder sponsor;
    eosio::time_point staked_until_time;  // indexed for each weekly reward distribution
    uint64_t reward;
    eosio::asset deposit_amt;
};

struct sponsor_pool {
   private:
    eosio::asset balance;
    std::vector<sponsor_stakes> stakes;

   public:
    eosio::asset getBalance();
    void depositRespect(eosio::asset amt);
};

// TEAM pool
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
