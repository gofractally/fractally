#include <string>
#include <vector>
#include <eosio/system.hpp>

std::vector<uint64_t> rank_id_to_rank = {1, 2, 3, 5, 8, 13, ..., 283 };

struct global_config {
    std:string language;
    //linear recharging based on what time of day? midnight in the designated time zone?
    time_point vote_power_rollover_time;
};
