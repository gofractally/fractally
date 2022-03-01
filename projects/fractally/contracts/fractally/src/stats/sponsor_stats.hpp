#include <vector>

struct Sponsor_stats_for_week {
  private:
    eosio::asset deposits;
};

struct Team_stats {
    Sponsor_stats_for_week avg_deposits;
    std::vector<Sponsor_stats_for_week> sponsor_stats_history;
};
