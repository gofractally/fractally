#include "../petition.hpp"

enum petition_vote_outcome_types = { approved, rejected };

struct Petition_vote {
    Member voter;
    petition_vote_outcome_types vote;
};

enum petition_status = { approved, rejected, executed };

struct Petition_decision {
    Petition petition;
    petition_status petition_status;
    time_point execution_time;
    placeholder trxid;
    std::vector<Petition_vote> votes;
}