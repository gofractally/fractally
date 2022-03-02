#include "../petition.hpp"

enum petition_vote_outcome_types = {approved, rejected};

struct petition_vote {
    member voter;
    petition_vote_outcome_types vote;
};

enum petition_status = {approved, rejected, executed};

struct petition_decision {
    petition petition;
    petition_status petition_status;
    eosio::time_point execution_time;
    placeholder trxid;
    std::vector<petition_vote> votes;
}