# add_subdirectory(state)

function(add_core_lib suffix)
    add_library(core${suffix}
        "test/helpers.cpp"
    )
    target_include_directories(core${suffix} 
        PRIVATE
        ${${PROJ}_SOURCE_DIR}
        ${CMAKE_CURRENT_LIST_DIR}
        "test/include/"
        "data_type/include/"
        "../"
    )
    target_link_libraries(core${suffix}
        PUBLIC
        cltestlib${suffix}
        eosio-core${suffix}
        # ${PROJ}-interface-lib${suffix}
    )
endfunction()

add_core_lib("")
add_core_lib("-debug")

# "-test" version is the same as "-debug" except its used for the test project, and not the contracts
#   Because it has compiling_tests defined
add_library(core-test
    "test/helpers.cpp"
)
target_include_directories(core-test
    PRIVATE
    ${${PROJ}_SOURCE_DIR}
    ${CMAKE_CURRENT_LIST_DIR}
    "test/include/"
    "data_type/include/"
    "../"
)
target_link_libraries(core-test
    PUBLIC
    cltestlib-debug
    eosio-core-debug
    # ${PROJ}-interface-lib-test
)

set(CMAKE_EXPORT_COMPILE_COMMANDS on)