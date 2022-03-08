#pragma once

#include <string>
#include <vector>

#include "fractal.hpp"
#include "shared.hpp"
// #include "team.hpp"
#include "wallet.hpp"

struct member_stats_one_week {
   private:
    uint8_t rank = 0;  // from this we can derive earnings, consensus aligned on, attendance?, eligibility to vote on post
    eosio::time_point arrival_time;

   public:
    eosio::asset getEarnings() const;
    bool in_consensus() const { return getRank() > 0; };
    bool attended() const { return getRank() > 0; };
    uint64_t getRank() const { return rank; };
};

struct member_stats {
    member_stats_one_week avg_rank;
    // history where 0 = most recent meeting; 1 = 2 meetings back, etc.
    std::vector<member_stats_one_week> member_stats_history;

    uint64_t primary_key() const { return member_stats_history[0].getRank(); }
};
struct member_vote_power {
    int32_t votePower;
    int32_t voteWeight;
};

struct member {
    id member_id;
    std::string profile_pic_url;
    std::string name;
    eosio::name account;
    std::string bio;
    placeholder social_links;
    member_vote_power votePower;
    id team;
    // NOTE: won't be in contract; this is representing balances pulled from system contracts
    wallet wallet;
    id inviter;
    // how will a contract get a list of fractals? will that be the fractally contract that serves as a registry of fractals?
    // would we cache this? or assert membership each time app is opened to ensure membership is up-to-date?
    std::vector<fractal> member_of_fractals;

    uint64_t primary_key() const { return member_id; }
};
EOSIO_REFLECT(member, member_id, profile_pic_url, name, account, bio, social_links, votePower, wallet, inviter, member_of_fractals);
