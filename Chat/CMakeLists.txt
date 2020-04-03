cmake_minimum_required(VERSION 3.15)
project(Chat)

set(CMAKE_CXX_STANDARD 17)

find_package(Boost COMPONENTS log log_setup thread filesystem system)

if(Boost_FOUND)

    message(STATUS "Boost_INCLUDE_DIRS: ${Boost_INCLUDE_DIRS}")
    message(STATUS "Boost_LIBRARIES: ${Boost_LIBRARIES}")
    message(STATUS "Boost_VERSION: ${Boost_VERSION}")

    include_directories(${Boost_INCLUDE_DIRS})

endif()

add_executable(Client Client.cpp ChatMessage.h Colors.h User.h Room.h Session.h)
add_executable(Server Server.cpp ChatMessage.h)

if(Boost_FOUND)
    target_link_libraries(Client ${Boost_LIBRARIES})
    target_link_libraries(Server ${Boost_LIBRARIES})

endif()