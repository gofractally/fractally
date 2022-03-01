#include <string>
#include <vector>

#include "shared.hpp"
#include "wallet.hpp"
#include "fractal.hpp"
#include "team.hpp"

struct MemberVotePower {
    int32_t votePower;
    int32_t voteWeight;
};

struct Member {
    std::string profile_pic_url;
    std::string name;
    placeholder account;
    std::string bio;
    placeholder social_links;
    MemberVotePower votePower;
    Team team;
    Wallet wallet;
    placeholder inviter;
    // how will a contract get a list of fractals? will that be the fractally contract that serves as a registry of fractals?
    // would we cache this? or assert membership each time app is opened to ensure membership is up-to-date?
    std::vector<Fractal> member_of_fractals;
};
