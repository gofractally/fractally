#pragma once

#include <eosio/system.hpp>
#include <string>
#include <vector>

struct global_config {
    std::string language;
    //linear recharging based on what time of day? midnight in the designated time zone?
    eosio::time_point vote_power_rollover_time;
    // constexpr std::vector<uint16_t> rank_id_to_rank = fibs_from_integers(num_ints);
};
