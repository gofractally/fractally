#include <string_view>
#include <token/token.hpp>

#include "helpers.hpp"

#include <catch2/catch.hpp>
#include "fractally/contract/include/fractal.hpp"
#include "fractally/contract/include/fractally.hpp"
#include "fractally/contract/include/global_config.hpp"
#include "fractally/contract/include/liquidity.hpp"
#include "fractally/contract/include/member.hpp"
#include "fractally/contract/include/pools.hpp"
#include "fractally/contract/include/shared.hpp"
#include "fractally/contract/include/sponsors.hpp"
#include "fractally/contract/include/team.hpp"
#include "fractally/contract/include/wallet.hpp"

using eosio::action_trace;
using eosio::asset;
using eosio::name;
using eosio::test_chain;
using eosio::transaction_status;
using eosio::transaction_trace;
using std::array;
using std::pair;
using std::string;
using std::string_view;
using std::vector;

namespace {
    constexpr name token_contract_account = "eosio.token"_n;
    constexpr name system_account = "eosio"_n;

    const asset eos_supply = eosio::s2a("1000000.0000 EOS");
    const asset user_balance = eosio::s2a("10000.0000 EOS");

}  // namespace

new_test_chain::new_test_chain(const vector<name>& users)
    : _users(users)
{
    // Install legacy token contract
    _chain.create_code_account(token_contract_account);
    _chain.set_code("eosio.token"_n, CLSDK_CONTRACTS_DIR "token.wasm");

    // Install new fractally contract
    _chain.create_code_account(fractally::default_contract_account);
    _chain.set_code(fractally::default_contract_account, "artifacts/fractally/fractally.wasm");

    // Create user accounts
    setup_create_user_accounts();

    // Setup tokens
    setup_system_token();

    // Distribute tokens
    setup_fund_users();
}

array<test_chain::user_context, 1> new_test_chain::as(name n1)
{
    return {_chain.as(n1)};
}

array<test_chain::user_context, 2> new_test_chain::as(name n1, name n2)
{
    return {_chain.as(n1), _chain.as(n2)};
}

array<test_chain::user_context, 3> new_test_chain::as(name n1, name n2, name n3)
{
    return {_chain.as(n1), _chain.as(n2), _chain.as(n3)};
}

array<test_chain::user_context, 4> new_test_chain::as(name n1, name n2, name n3, name n4)
{
    return {_chain.as(n1), _chain.as(n2), _chain.as(n3), _chain.as(n4)};
}

void new_test_chain::setup_create_user_accounts()
{
    for (auto user : _users) {
        _chain.create_account(user);
    }
}

void new_test_chain::setup_system_token()
{
    _chain.as(token_contract_account).act<token::actions::create>(system_account, eos_supply);
    _chain.as(system_account).act<token::actions::issue>(system_account, eos_supply, "");
}

void new_test_chain::setup_fund_users()
{
    for (auto user : _users) {
        _chain.as("eosio"_n).act<token::actions::transfer>(system_account, user, user_balance, "");
    }
}

bool checks::succeeded(const transaction_trace& trace)
{
    if (trace.except) {
        UNSCOPED_INFO("transaction has exception: " << *trace.except << "\n");
    }

    return (trace.status == transaction_status::executed);
}

bool checks::failed_with(const transaction_trace& trace, string_view err)
{
    bool ret = (trace.except->find(err.data()) != string::npos);
    if (!ret && trace.except) {
        UNSCOPED_INFO("transaction has exception: " << *trace.except << "\n");
    }
    return ret;
}

void checks::check_ram_consumption(const transaction_trace& trace, const vector<pair<name, int64_t>>& consumption)
{
    const vector<action_trace>& actions = trace.action_traces;
    eosio::check(actions.size() == 1, "This check expects only single action traces");
    const auto& ram_deltas = actions.at(0).account_ram_deltas;

    {
        INFO("Check for equality in the total number of RAM changes");
        CHECK(ram_deltas.size() == consumption.size());
    }

    {
        INFO("Check that each actual RAM delta was in the set of expected deltas");
        for (const auto& delta : ram_deltas) {
            bool foundMatch = std::any_of(consumption.begin(), consumption.end(), [&](const auto& cPair) {
                return cPair.first == delta.account && cPair.second == delta.delta;
            });
            if (!foundMatch) {
                INFO("Real RAM Delta: [" << delta.account.to_string() << "][" << std::to_string(delta.delta) << "]");
                CHECK(false);
            }
        }
    }
}