#include "../post.hpp"

// these stats are only for current week (the data that will determine this post's earnings)
struct Post_vote_ledger {
    post post;
    eosio::time_point posted_time;
    // these are only votes that count toward earnings
    uint64_t like_count;
    uint64_t dislike_count;
};
