// #include <iostream>

#include <eosio/eosio.hpp>
#include <eosio/name.hpp>
#include <string>

#include "core/state/table/petition.hpp"
#include "core/state/table/post.hpp"

#include "fractally.hpp"
#include "global_config.hpp"
#include "include/fractal.hpp"
#include "member.hpp"
#include "shared.hpp"
#include "team.hpp"
#include "wallet.hpp"

#include "liquidity.hpp"
#include "pools.hpp"
#include "sponsors.hpp"

using std::string;
using namespace eosio;
using namespace fractally;

fractally_contract::fractally_contract(name receiver, name code, datastream<const char*> ds)
    : contract(receiver, code, ds)
{
    /* NOP */
}

template <int N>
struct fibs_by_index {
    constexpr fibs_by_index()
        : arr()
    {
        arr[0] = 1;
        arr[1] = 2;
        for (auto i = 2; i < N; ++i) {
            arr[i] = arr[i - 2] + arr[i - 1];
        }
    }
    uint32_t arr[N];
};

void ensure_everything_can_be_compiled()
{
    using namespace fractally::table;

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
    member_stats_one_week msw;
    member_stats ms;
    sponsor_stats_for_week ssw;
    sponsor_stats sstats;
    team_stats_for_week tsw;
    team_stats ts;
    return;
}

void fractally_contract::createpost(const std::string title_cid, const std::string body_cid)
{
    ensure_everything_can_be_compiled();
    constexpr int maxPerGroup = 6;
    constexpr int maxNumRounds = 5;
    constexpr auto rank_id_to_rank = fibs_by_index<maxPerGroup * maxNumRounds>();

    print("Hi");
}

void fractally_contract::sayhialice(const name& someone)
{
    check(someone == "alice"_n, "You may only say hi to Alice!");
    print("Hi, Alice!");
}

// Final part of the dispatcher
// NOTE 2: ::actions is build by EOSIO_ACTIONS (in .hpp file)
EOSIO_ACTION_DISPATCHER(fractally::actions)

// Things to populate the ABI with
// EOSIO_ABIGEN(actions(contract_name::actions), table("schema1"_n, contract_name::Schema1), ricardian_clause("Class 1 clause", contract_name::ricardian_clause))
EOSIO_ABIGEN(actions(fractally::actions))