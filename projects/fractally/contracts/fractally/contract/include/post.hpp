#pragma once

#include <string>
#include <vector>

#include <eosio/system.hpp>

// these stats are only for current week (the data that will determine this post's earnings)
struct post_vote_ledger {
    id post_id;
    eosio::asset creation_fee;  // used after voting 24-hour period is over
    eosio::time_point posted_time;
    // these are only votes that count toward earnings
    uint64_t like_count;
    uint64_t dislike_count;
};

struct post_weight {
    uint64_t member_like_votes = 0;
    uint64_t member_dislike_votes = 0;
    uint32_t like_votes = 0;
    uint32_t dislike_votes = 0;
    uint64_t getPostVoteWeight();
};

struct post_rewards {
    uint64_t respect_rewarded;
};

enum post_types { post_post,
                  post_petition };

struct post {
    post() = default;
    id author;
    eosio::time_point creation_time;
    std::string source_fractal;
    std::string title;
    std::string body;
    std::vector<std::string> media_urls;
    post_weight postVotes;
    post_rewards postRewards;

    // post specialization
    post_types post_type = post_post;

    uint64_t primary_key() const { return author; }
    // ACTION vote(...) { search member_stats_one_week[0] to ensure rank > 0 for most recent meeting }
};
EOSIO_REFLECT(post, creation_time, source_fractal, title, body, media_urls, postVotes, postRewards);
