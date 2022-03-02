#pragma once

#include <string>
#include <vector>

#include "fractal.hpp"
#include "shared.hpp"
// #include "team.hpp"
#include "wallet.hpp"

struct memberVotePower {
    int32_t votePower;
    int32_t voteWeight;
};

struct member {
    member_id id;
    std::string profile_pic_url;
    std::string name;
    placeholder account;
    std::string bio;
    placeholder social_links;
    memberVotePower votePower;
    // Team team;
    wallet wallet;
    member_id inviter;
    // how will a contract get a list of fractals? will that be the fractally contract that serves as a registry of fractals?
    // would we cache this? or assert membership each time app is opened to ensure membership is up-to-date?
    std::vector<fractal> member_of_fractals;

    uint64_t primary_key() const { return id; }
};
EOSIO_REFLECT(member, id, profile_pic_url, name, account, bio, social_links, votePower, wallet, inviter, member_of_fractals);
