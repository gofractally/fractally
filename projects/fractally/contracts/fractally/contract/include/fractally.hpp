#pragma once

#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <eosio/name.hpp>
#include <eosio/singleton.hpp>
#include <string>
#include <vector>

// #include "Schema1.hpp"

namespace fractally {
    // using contract_name::Schema1;
    using eosio::check;
    using eosio::contract;
    using eosio::datastream;
    using eosio::name;
    using eosio::print;
    using std::string;

    // Ricardian contracts live in ricardian/fractally-ricardian.cpp
    extern const char* action1_ricardian;
    extern const char* ricardian_clause;

    // The account this contract is normally deployed to
    inline constexpr auto default_contract_account = "fractally"_n;

    class fractally_contract : public contract {
       public:
        using eosio::contract::contract;

        fractally_contract(name receiver, name code, datastream<const char*> ds);

        void sayhi();

        void sayhialice(const name& someone);

        // using Schema1Table = eosio::multi_index<"schema1"_n, Schema1>;
    };

    // This macro:
    // * Creates a part of the dispatcher
    // * Defines action wrappers which make it easy for other contracts and for test cases to invoke
    //   this contract's actions
    // * Optional: provides the names of actions to the ABI generator. Without this, the ABI
    //   generator will make up names (e.g. arg0, arg1, arg2, ...).
    // * Optional: provides ricardian contracts to the ABI generator. Without this, the ABI generator
    //   will leave the ricardian contracts blank.

    // clang-format off
    // NOTE 1: Intellisense won't work until first build.
    EOSIO_ACTIONS(fractally_contract,
                  default_contract_account,
                  //   action(sayhi, ricardian_contract(sayhi_ricardian)),
                  //   action(sayhialice, someone, ricardian_contract(sayhialice_ricardian)))
                  action(sayhi, ricardian_contract(action1_ricardian)),
                  action(sayhialice, someone, ricardian_contract(action1_ricardian)))
    // clang-format on

}  // namespace fractally