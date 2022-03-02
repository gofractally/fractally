#pragma once

#include <string>
#include <vector>

#include <eosio/system.hpp>

#include "member.hpp"

struct post_weight {
    uint64_t participant_like_votes = 0;
    uint64_t participant_dislike_votes = 0;
    uint32_t like_votes = 0;
    uint32_t dislike_votes = 0;
    uint64_t getPostVoteWeight();
};

struct post_rewards {
    uint64_t respect_rewarded;
};

struct post {
    member author;
    eosio::time_point creation_time;
    std::string source_fractal;
    std::string title;
    std::string body;
    std::vector<std::string> media;
    post_weight postVotes;
    post_rewards postRewards;

    // governance
    bool ispetition = false;
};
