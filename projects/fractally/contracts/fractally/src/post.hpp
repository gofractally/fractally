#include <string>
#include <vector>

#include <eosio/system.hpp>

#include "member.hpp"

struct PostWeight  {
    uint64_t participant_like_votes = 0;
    uint64_t participant_dislike_votes = 0;
    uint32_t like_votes = 0;
    uint32_t dislike_votes = 0;
    uint64_t getPostVoteWeight();
};

struct PostRewards {
    uint64_t respect_rewarded;
};

struct Post {
    Member author;
    time_point creation_time;
    std::string source_fractal;
    std::string title;
    std::string body;
    std::vector<std::string> media;
    PostWeight postVotes;
    PostRewards postRewards;
    bool isPetition;

    // governance
    bool isPetition = false;
};
