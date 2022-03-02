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