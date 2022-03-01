#include <string>
#include <vector>

#include "shared.hpp"
#include "member.hpp"

struct Team {
    std::string team_name;
    std::string bio;
    std::string website;
    placeholder social_links;
    Member team_lead;
    std::vector<Member> members;
};
