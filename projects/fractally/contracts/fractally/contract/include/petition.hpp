
#pragma once

#include "member.hpp"
#include "post.hpp"

enum petition_vote_outcomes { vote_approved,
                              vote_rejected };

struct petition_vote {
    member voter;
    petition_vote_outcomes vote;
};

enum petition_status { status_approved,
                       status_rejected,
                       status_executed };

struct petition_decision {
    id petition_id;
    petition_status petition_status;
    eosio::time_point execution_time;
    placeholder trxid;
    std::vector<petition_vote> votes;
};

struct petition : post {
    petition()
        : post() { post_type = post_petition; };
    id proposer;
    eosio::time_point proposed_time;
    bool is_important = false;

    uint64_t primary_key() const { return proposer; }
};
EOSIO_REFLECT(petition, proposer, proposed_time);
