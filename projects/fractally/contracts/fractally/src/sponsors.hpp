#include <vector>

struct sponsor_stats_for_week {
   private:
    eosio::asset deposits;
};

struct sponsor_stats {
    sponsor_stats_for_week avg_deposits;
    std::vector<sponsor_stats_for_week> sponsor_stats_history;
};