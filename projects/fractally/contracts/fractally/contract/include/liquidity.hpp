#include <vector>

struct liquidity_stats_for_week {
   private:
    eosio::asset deposits;
};

struct liquidity_stats {
    liquidity_stats_for_week avg_deposits;
    std::vector<liquidity_stats_for_week> liquidity_stats_history;
};
