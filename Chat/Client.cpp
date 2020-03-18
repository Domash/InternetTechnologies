#include <boost/thread.hpp>
#include <boost/array.hpp>
#include <boost/asio.hpp>
#include <iostream>

#include "ChatMessage.h"

using boost::asio::ip::udp;

class Client {
public:

    Client(
        boost::asio::io_service& io_service,
        const std::string& host,
        const std::string& port
    ) : io_service_(io_service), socket_(io_service) {
        udp::resolver resolver(io_service_);
        udp::resolver::query query(udp::v4(), host, port);
        udp::resolver::iterator iterator = resolver.resolve(query);
        endpoint_ = *iterator;
        boost::asio::connect(socket_, iterator);
    }

    void send(const ChatMessage& msg) {
        std::cout << "SEND" << std::endl;
        socket_.send(boost::asio::buffer(msg.data(), msg.size()));
        //socket_.send_to(boost::asio::buffer(msg.data(), msg.size()), endpoint_);
    }

    ~Client() {
        socket_.close();
    }

private:

    udp::socket socket_;
    udp::endpoint endpoint_;
    boost::asio::io_service& io_service_;

};

int main(int argc, char* argv[]) {

    try {

        if(argc != 3) {
            std::cerr << "Use: <host> <port>" << std::endl;
        }

        boost::asio::io_service io_service;

        Client client(io_service, argv[1], "22832");

        boost::thread t(boost::bind(&boost::asio::io_service::run, &io_service));

        std::string input;
        while(std::getline(std::cin, input)) {
            ChatMessage msg(std::move(input));
            client.send(msg);
        }

        client.~Client();
        t.join();

    } catch (const std::exception& e) {
        std::cout << e.what() << std::endl;
    }

}