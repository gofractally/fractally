#include <vector>

struct team_stats_for_week {
   private:
    eosio::asset earnings;

   public:
    eosio::asset getEarnings();
};

struct team_stats {
    team_stats_for_week avg_earnings;
    std::vector<team_stats_for_week> team_stats_history;
};
