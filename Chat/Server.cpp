#include <boost/smart_ptr/make_shared.hpp>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/asio.hpp>

#include <unordered_map>
#include <iostream>

#include "ChatMessage.h"
#include "Colors.h"

using namespace colors;

using boost::asio::ip::udp;

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
            boost::asio::buffer(chat_message_.data()),
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

        if(!error || error == boost::asio::error::message_size) {
            chat_message_.decode();

            switch (chat_message_.type()) {
                case MessageType::JOINED:
                    handleJoin();
                    break;
                case MessageType::COMMAND:
                    handleCommand();
                    break;
                case MessageType::MESSAGE:
                    handleMessage();
                    break;
                default:
                    break;
            }

        }

//        if(.type() == MessageType::JOINED) {
//            std::cout << BOLD(FGRN("New connection from ")) << remote_endpoint_ << std::endl;
//        }

        //socket_.send_to(boost::asio::buffer(data_), remote_endpoint_);
        //socket_.send(boost::asio::buffer(data_), remote_endpoint_);
        //std::cout << BOLD(FGRN("New connection from ")) << remote_endpoint_ << '\n';

//        auto text = boost::make_shared<std::string>(chat_message_.data());
//        socket_.async_send(boost::asio::buffer(*text), boost::bind(
//                &Server::handleSend,
//                this,
//                text,
//                boost::asio::placeholders::error,
//                boost::asio::placeholders::bytes_transferred
//        ));

        startReceive();
    }

    void handleJoin() {

    }

    void handleCommand() {

    }

    void handleMessage() {

    }


    void handleSend(
        boost::shared_ptr<std::string> message,
        const boost::system::error_code& error,
        std::size_t bytes_transferred
    ) {
        //std::cout << *(message.get()) << std::endl;
    }

    // std::unordered_map<>;
    ChatMessage chat_message_;

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