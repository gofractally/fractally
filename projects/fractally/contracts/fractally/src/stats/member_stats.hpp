#include <vector>

struct Member_stats_for_week {
  private:
    uint8_t rank = 0; // from this we can derive earnings, consensus aligned on, attendance?
    time_point arrival_time;
  public:
    eosio::asset getEarnings();
    bool in_consensus();
    bool attended();
};

struct Member_stats {
    Member_stats_for_week avg_rank;
    std::vector<Member_stats_for_week> member_stats_history;
};
