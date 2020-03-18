#include <boost/smart_ptr/make_shared.hpp>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/asio.hpp>

#include <unordered_map>
#include <iostream>

using boost::asio::ip::udp;

namespace colors {
    #define RST  "\x1B[0m"
    #define KRED  "\x1B[31m"
    #define KGRN  "\x1B[32m"
    #define KYEL  "\x1B[33m"
    #define KBLU  "\x1B[34m"
    #define KMAG  "\x1B[35m"
    #define KCYN  "\x1B[36m"
    #define KWHT  "\x1B[37m"

    #define FRED(x) KRED x RST
    #define FGRN(x) KGRN x RST
    #define FYEL(x) KYEL x RST
    #define FBLU(x) KBLU x RST
    #define FMAG(x) KMAG x RST
    #define FCYN(x) KCYN x RST
    #define FWHT(x) KWHT x RST

    #define BOLD(x) "\x1B[1m" x RST
    #define UNDL(x) "\x1B[4m" x RST
};

using namespace colors;

class Server {
public:

    Server(
        boost::asio::io_service& io_service,
        unsigned short port
    ) : io_service_(io_service), socket_(io_service, udp::endpoint(udp::v4(), port)) {
        startReceive();
    }

private:

    void startReceive() {
        socket_.async_receive_from(
            boost::asio::buffer(data_),
            remote_endpoint_,
            boost::bind(
                &Server::handleReceive,
                this,
                boost::asio::placeholders::error,
                boost::asio::placeholders::bytes_transferred
            )
        );
    }

    void handleReceive(
        const boost::system::error_code& error,
        std::size_t bytes_transferred
    ) {

        socket_.send_to(boost::asio::buffer(data_), remote_endpoint_);
        //socket_.send(boost::asio::buffer(data_), remote_endpoint_);
        std::cout << BOLD(FGRN("New connection from ")) << remote_endpoint_ << '\n';

        auto message = boost::make_shared<std::string>(data_.data());
        socket_.async_send(boost::asio::buffer(*message), boost::bind(
                &Server::handleSend,
                this,
                message,
                boost::asio::placeholders::error,
                boost::asio::placeholders::bytes_transferred
        ));

        startReceive();
    }

    void handleSend(
        boost::shared_ptr<std::string> message,
        const boost::system::error_code& error,
        std::size_t bytes_transferred
    ) {
        std::cout << *(message.get()) << std::endl;
    }

    // std::unordered_map<>;
    boost::array<char, 1024> data_;

    udp::socket socket_;
    udp::endpoint remote_endpoint_;
    boost::asio::io_service& io_service_;


};

int main(int argc, char* argv[]) {

    try {

        boost::asio::io_service io_service;

        Server server(io_service, 22832);

        io_service.run();

    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }

}