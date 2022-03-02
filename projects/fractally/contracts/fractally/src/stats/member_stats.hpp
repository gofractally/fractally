#include <vector>

struct member_stats_for_week {
   private:
    uint8_t rank = 0;  // from this we can derive earnings, consensus aligned on, attendance?
    eosio::time_point arrival_time;

   public:
    eosio::asset getEarnings();
    bool in_consensus();
    bool attended();
};

struct member_stats {
    member_stats_for_week avg_rank;
    std::vector<member_stats_for_week> member_stats_history;
};
