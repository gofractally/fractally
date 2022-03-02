set(CONTRACT_NAME "fractally")
set(CONTRACT_FILES "fractally.cpp")
#set(TEST_FILES "test/test-eosio.name.cpp" "ricardian/eosio.name-ricardian.cpp")

# Adds contracts
add_contract(fractally)

set(CMAKE_EXPORT_COMPILE_COMMANDS on)
