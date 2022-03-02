
#pragma once

#include "member.hpp"
#include "post.hpp"

struct petition : post {
    member proposer;
    eosio::time_point proposed_time;
};
