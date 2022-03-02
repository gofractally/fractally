#pragma once

#include <string>
#include <vector>

#include "shared.hpp"

struct team {
    id team_id;
    std::string team_name;
    std::string bio;
    std::string website;
    placeholder social_links;
    id team_lead;
    std::vector<id> members;

    uint64_t primary_key() const { return team_id; }
};
EOSIO_REFLECT(team, team_id, team_name, bio, website, social_links, team_lead, members);
