cmake_minimum_required(VERSION 3.0.0)

project(fractally
    VERSION 0.2
    DESCRIPTION "ƒractally: DOAn the independence rabbit hole"
    LANGUAGES CXX)

set(CONTRACT_ROOT "${CMAKE_CURRENT_LIST_DIR}")

list(APPEND  CMAKE_MODULE_PATH ${CONTRACT_ROOT} )

# Import the function that adds a contract
include(add_contract)

# Adds contracts
#add_subdirectory(boot)
#add_subdirectory(fractally/src)
#add_subdirectory(fractally/src/history)
#add_subdirectory(fractally/src/pools)
#add_subdirectory(fractally/src/stats)

set(CMAKE_EXPORT_COMPILE_COMMANDS on)
