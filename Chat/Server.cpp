#include <boost/array.hpp>
#include <boost/asio.hpp>

#include <unordered_map>
#include <iostream>

using boost::asio::ip::udp;

class Server {
public:

    Server(
        boost::asio::io_service& io_service,
        unsigned short port
    ) : io_service_(io_service), socket_(io_service, udp::endpoint(udp::v4(), port)) {

        socket_.async_receive_from(
            boost::asio::buffer(data_),

        );

    }

private:

    std::unordered_map<>;
    boost::array<char, 1024> data_;

    udp::socket socket_;
    udp::endpoint sen
    boost::asio::io_service& io_service_;


};

int main(int argc, char* argv[]) {

    try {

        boost::asio::io_service io_service;

        Server server(io_service, atoi(argv[1]));

        io_service.run();

    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }

}