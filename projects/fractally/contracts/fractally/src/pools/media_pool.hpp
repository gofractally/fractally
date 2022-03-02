#include <string>
#include <vector>

#include <eosio/asset.hpp>

struct media_pool {
   private:
    eosio::asset balance;

   public:
    eosio::asset getBalance();
    void depositRespect(eosio::asset amt);
};
