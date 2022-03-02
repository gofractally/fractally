#include <string>
#include <vector>

#include <eosio/asset.hpp>

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