#include <eosio/eosio.hpp>
#include <eosio/name.hpp>
#include <string>

#include "fractal.hpp"
#include "fractally.hpp"
#include "global_config.hpp"
#include "member.hpp"
#include "petition.hpp"
#include "post.hpp"
#include "shared.hpp"
#include "team.hpp"
#include "wallet.hpp"

#include "history/petitions.hpp"
#include "pools/media_pool.hpp"
#include "pools/sponsor_pool.hpp"
#include "pools/team_pool.hpp"
#include "stats/liquidity_stats.hpp"
#include "stats/media_stats.hpp"
#include "stats/member_stats.hpp"
#include "stats/sponsor_stats.hpp"
#include "stats/team_stats.hpp"

using namespace eosio;
using std::string;
using namespace contract_name;

fractally_contract::fractally_contract(name receiver, name code, datastream<const char*> ds)
    : contract(receiver, code, ds)
{
    /* NOP */
}

void fractally_contract::sayhi()
{
    member m;
    team t;
    post p;
    petition pet;
    wallet w;

    petition_vote pv;
    petition_decision pd;
    media_pool mp;
    sponsor_stakes ss;
    sponsor_pool sp;
    team_balance tb;
    team_pool tp;
    liquidity_stats_for_week lsw;
    liquidity_stats ls;
    post_vote_ledger pvl;
    member_stats_for_week msw;
    member_stats ms;
    sponsor_stats_for_week ssw;
    sponsor_stats sstats;
    team_stats_for_week tsw;
    team_stats ts;

    print("Hi");
}

void fractally_contract::sayhialice(const name& someone)
{
    check(someone == "alice"_n, "You may only say hi to Alice!");
    print("Hi, Alice!");
}

// Final part of the dispatcher
EOSIO_ACTION_DISPATCHER(contract_name::actions)

// Things to populate the ABI with
// EOSIO_ABIGEN(actions(contract_name::actions), table("schema1"_n, contract_name::Schema1), ricardian_clause("Class 1 clause", contract_name::ricardian_clause))
EOSIO_ABIGEN(actions(contract_name::actions))