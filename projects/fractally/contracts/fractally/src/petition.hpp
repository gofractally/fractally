
#include "member.hpp"
#include "post.hpp"

struct Petition : Post {
    Member proposer;
    time_point proposed_time;
};
