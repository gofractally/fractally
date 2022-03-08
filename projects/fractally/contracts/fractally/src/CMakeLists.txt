set(CONTRACT_NAME "fractally")
set(CONTRACT_FILES "fractally.cpp" "ricardian/fractally-ricardian.cpp")
set(TEST_FILES "test/test-fractally.cpp" "ricardian/fractally-ricardian.cpp")

# Adds contracts
add_contract(fractally)

set(CMAKE_EXPORT_COMPILE_COMMANDS on)
