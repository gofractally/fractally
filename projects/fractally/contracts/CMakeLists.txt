cmake_minimum_required(VERSION 3.0.0)

set(PROJ fractally)
project(${PROJ}
    VERSION 0.2
    DESCRIPTION "ƒractally: DOAn the independence rabbit hole"
    LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Libraries for building contracts and tests
find_package(clsdk REQUIRED)

set(CONTRACT_ROOT "${CMAKE_CURRENT_LIST_DIR}")

#include search path
list(APPEND  CMAKE_MODULE_PATH ${CONTRACT_ROOT} )

# Import the function that adds a contract
include(add_contract)

# Set output directory
set(ARTIFACTS_DIR "artifacts")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/${ARTIFACTS_DIR})

add_subdirectory(fractally/src)
#add_subdirectory(boot)
#add_subdirectory(fractally/src/history)
#add_subdirectory(fractally/src/pools)
#add_subdirectory(fractally/src/stats)

# These symlinks help keep absolute paths outside of the files in .vscode/
execute_process(COMMAND ln -sf ${clsdk_DIR} ${CMAKE_CURRENT_BINARY_DIR}/clsdk)
execute_process(COMMAND ln -sf ${WASI_SDK_PREFIX} ${CMAKE_CURRENT_BINARY_DIR}/wasi-sdk)

# Generate compile_commands.json during build to enable
# symbol lookup in some editors
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
