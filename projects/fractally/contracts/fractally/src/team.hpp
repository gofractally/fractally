#pragma once

#include <string>
#include <vector>

#include "shared.hpp"

struct team {
    placeholder team_id;
    std::string team_name;
    std::string bio;
    std::string website;
    placeholder social_links;
    member_id team_lead;
    std::vector<member> members;
};
