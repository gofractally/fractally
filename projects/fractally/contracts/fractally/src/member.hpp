#pragma once

#include <string>
#include <vector>

#include "fractal.hpp"
#include "shared.hpp"
// #include "team.hpp"
#include "wallet.hpp"

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
