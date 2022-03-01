#include <string>
#include <vector>

#include <eosio/asset.hpp>

struct Sponsor_stakes {
    placeholder sponsor;
    time_point staked_until_time; // indexed for each weekly reward distribution
    uint64_t reward;
    eosio::asset deposit_amt;
};

struct Sponsor_pool {
  private:
    eosio::asset balance;
    std::vector<Sponsor_stakes> stakes;

  public: 
    eosio::asset getBalance();
    void depositRespect(eosio::asset amt);
};