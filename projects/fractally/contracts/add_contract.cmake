# Builds:
#  - Two contract wasms (release and debug)
#  - One test wasm
#  - One abi

macro(add_contract contractName)

    # Include directories can be the same in each contract by default
    set(INCLUDE_DIRS "contract/include/" ${CMAKE_CURRENT_LIST_DIR} ${${PROJ}_SOURCE_DIR} "../")

    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${contractName})

    function(add_version suffix)
        # Separate debug artifacts into directory
        set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}${suffix})

        # Create contract(s)
        add_executable(${contractName}${suffix} ${CONTRACT_FILES})
        target_include_directories(${contractName}${suffix} PRIVATE ${INCLUDE_DIRS})
        target_link_libraries(${contractName}${suffix} 
            eosio-contract-simple-malloc${suffix}
            # ${PROJ}-interface-lib${suffix}
        )
    endfunction()

    add_version("")
    add_version("-debug")


    # The rest of the artifacts in this file are debug artifacts
    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}-debug)

    
    # Generate ${contractName}.abi
    # This is a 2-step process:
    #   * Build ${contractName}.abi.wasm. This must link to eosio-contract-abigen.
    #   * Run the wasm to generate the abi
    add_executable(${contractName}-abigen ${CONTRACT_FILES})
    # Abigen needs some misc include directories since the target builds the contract cpp
    target_include_directories(${contractName}-abigen PRIVATE ${INCLUDE_DIRS})
    target_link_libraries(${contractName}-abigen eosio-contract-abigen)
    
    add_custom_command(TARGET ${contractName}-abigen POST_BUILD
        COMMAND cltester ../${ARTIFACTS_DIR}/${contractName}-debug/${contractName}-abigen.wasm > ../${ARTIFACTS_DIR}/${contractName}/${contractName}.abi
    )


    # Builds test-${contractName}.wasm
    # Tests must link to either cltestlib (runs faster) or cltestlib-debug
    # (shows stack traces on failure).
    if (DEFINED TEST_FILES)
        add_executable(test-${contractName} ${TEST_FILES} )
        target_link_libraries(test-${contractName}
            cltestlib-debug
            core-test
        )        
        target_include_directories(test-${contractName}
            PRIVATE
            ${INCLUDE_DIRS}
            "test/include/"
        )
        # ctest rule which runs test-${contractName}.wasm. The -v and -s
        # options provide detailed logging. ctest hides this detail;
        # use `ctest -V` so show it.
        enable_testing()
        add_test(
            NAME ${contractName}_TEST
            COMMAND cltester ../${ARTIFACTS_DIR}/${contractName}-debug/test-${contractName}.wasm -s
        )
    endif()

    set(CMAKE_EXPORT_COMPILE_COMMANDS on)

endmacro()