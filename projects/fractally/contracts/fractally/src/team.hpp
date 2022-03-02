#pragma once

#include <string>
#include <vector>

#include "member.hpp"
#include "shared.hpp"

struct team {
    std::string team_name;
    std::string bio;
    std::string website;
    placeholder social_links;
    member team_lead;
    std::vector<member> members;
};
