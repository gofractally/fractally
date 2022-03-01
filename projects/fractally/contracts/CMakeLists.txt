set(CONTRACT_ROOT "${CMAKE_CURRENT_LIST_DIR}")

# Import the function that adds a contract
list(APPEND  CMAKE_MODULE_PATH ${CONTRACT_ROOT} )
include(add_contract)

# Adds contracts
add_subdirectory(boot)
add_subdirectory(fractally/src)
add_subdirectory(fractally/src/history)
add_subdirectory(fractally/src/pools)
add_subdirectory(fractally/src/stats)

set(CMAKE_EXPORT_COMPILE_COMMANDS on)