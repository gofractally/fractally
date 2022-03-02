#include "../petition.hpp"

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
    petition petition;
    petition_status petition_status;
    eosio::time_point execution_time;
    placeholder trxid;
    std::vector<petition_vote> votes;
};
