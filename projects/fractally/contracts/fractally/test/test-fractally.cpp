#include <eosio/tester.hpp>

// #include "core/state/interface/include/user_intf.hpp"
#include "core/test/include/helpers.hpp"
#include "fractally.hpp"

#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

using namespace eosio;

SCENARIO("Creating a post")
{
    GIVEN("A chain with account alice")
    {
        new_test_chain t({"alice"_n, "bob"_n});
        auto [alice, bob] = t.as("alice"_n, "bob"_n);

        THEN("Alice creates a Post")
        {
            // CHECK(succeeded(alice.trace<eosio_name::actions::create>("alice"_n, "alice"_n)));
            CHECK(checks::succeeded(alice.trace<fractally::actions::createpost>("post title", "post body")));
            // CHECK(true);
        }
        WHEN("Alice creates a Petition")
        {
            name account{"alice"_n};
            name ram_payer{"alice"_n};
            // auto trace = alice.trace<fractally::actions::createpost>(account, ram_payer);

            THEN("The account ID was created")
            {
                // CHECK(uid::exists(account));
                CHECK(true);
            }
            THEN("The created account does not have ID 0")
            {
                // uid alice_uid("alice"_n);
                // CHECK(alice_uid->uid != 0);
            }
            THEN("The RAM-payer's RAM was consumed as expected")
            {
                // check_ram_consumption(trace, {{eosio_name::table::owner_contract, eosio_name::table::ram_usage::first_emplace},
                //   {account, eosio_name::table::ram_usage::subsequent_emplace}});
            }
            THEN("Alice cannot create a second ID")
            {
                // t.get_chain().finish_block();
                // CHECK(failed_with(alice.trace<eosio_name::actions::create>(account, ram_payer), "Account already exists"));
            }
            THEN("Bob can create a second ID")
            {
                // CHECK(succeeded(bob.trace<eosio_name::actions::create>("bob"_n, "bob"_n)));
            }
            AND_WHEN("Bob creates the second ID")
            {
                // name account2{"bob"_n};
                // auto trace2 = bob.trace<eosio_name::actions::create>(account2, account2);
                THEN("Bob should have consumed the expected amount of RAM for a subsequent emplace")
                {
                    // check_ram_consumption(trace2, {{account2, eosio_name::table::ram_usage::subsequent_emplace}});
                }
            }
        }
    }
}
