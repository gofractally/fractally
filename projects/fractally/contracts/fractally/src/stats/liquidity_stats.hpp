#include <vector>

struct Liquidity_stats_for_week {
  private:
    eosio::asset deposits;
};

struct Team_stats {
    Liquidity_stats_for_week avg_deposits;
    std::vector<Liquidity_stats_for_week> liquidity_stats_history;
};
