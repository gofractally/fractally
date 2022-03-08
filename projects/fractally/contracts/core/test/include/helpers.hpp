#pragma once

#include <algorithm>
#include <array>
#include <eosio/tester.hpp>

class new_test_chain {
   public:
    new_test_chain(const std::vector<eosio::name>& users);

    std::array<eosio::test_chain::user_context, 1> as(eosio::name);
    std::array<eosio::test_chain::user_context, 2> as(eosio::name, eosio::name);
    std::array<eosio::test_chain::user_context, 3> as(eosio::name, eosio::name, eosio::name);
    std::array<eosio::test_chain::user_context, 4> as(eosio::name, eosio::name, eosio::name, eosio::name);

    eosio::test_chain& get_chain() { return _chain; }

   private:
    eosio::test_chain _chain;
    std::vector<eosio::name> _users;

    void setup_create_user_accounts();
    void setup_system_token();
    void setup_fund_users();
};

namespace checks {
    bool succeeded(const eosio::transaction_trace& trace);
    bool failed_with(const eosio::transaction_trace& trace, std::string_view err);
    void check_ram_consumption(const eosio::transaction_trace& trace, const std::vector<std::pair<eosio::name, int64_t>>& consumption);
}  // namespace checks
