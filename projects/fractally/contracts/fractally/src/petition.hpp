
#pragma once

#include "member.hpp"
#include "post.hpp"

struct petition : post {
    petition()
        : post() { ispetition = true; };
    id proposer;
    eosio::time_point proposed_time;

    uint64_t primary_key() const { return proposer; }
};
EOSIO_REFLECT(petition, proposer, proposed_time);
