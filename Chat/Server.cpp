#include <boost/smart_ptr/make_shared.hpp>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/asio.hpp>

#include <unordered_map>
#include <iostream>
#include <map>

#include "Session.h"
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
        std::vector<std::string> words = chat_message_.splitted_text();
        if(words.size() == 2) {
            std::string username = words[1];
            if(users_.find(remote_endpoint_) != users_.end()) {
                Session session(socket_, remote_endpoint_, "SERVER");
                session.deliver(ChatMessage("Login is already exists."));
            } else {
                users_[remote_endpoint_] = boost::make_shared<Session>(socket_, remote_endpoint_, username);
                users_[remote_endpoint_] -> deliver(ChatMessage("Welcome to chat."));
            }
        } else {
            Session session(socket_, remote_endpoint_, "SERVER");
            session.deliver(ChatMessage("Invalid command form."));
        }
    }

    void handleCommand() {
        const auto session = users_[remote_endpoint_];
        const std::string username = session -> username();
        const std::string command  = chat_message_.text();

        if(command == "/users_list") {
            session -> deliver(ChatMessage(users_list(username)));
        } else if(command == "/rooms_list") {
            session -> deliver(ChatMessage(rooms_list()));
        } else if(boost::algorithm::istarts_with(command, "/create_room")) {

        } else if(boost::algorithm::istarts_with(command, "/join_room")) {

        } else if(boost::algorithm::istarts_with(command, "/leave_room")) {

        }

    }

    void handleMessage() {
        const auto session = users_[remote_endpoint_];
        const auto room = session -> room();

        if(room) {
            // PREPARE MESSAGE
            room -> deliver(ChatMessage("[" + session -> username() + "]: " + chat_message_.text()));
        }
    }

    void handleSend(
        boost::shared_ptr<std::string> message,
        const boost::system::error_code& error,
        std::size_t bytes_transferred
    ) {
        //std::cout << *(message.get()) << std::endl;
    }

    std::string users_list(const std::string& username) {
        std::string users;
        std::for_each(begin(users_), end(users_), [&](const std::pair<udp::endpoint, boost::shared_ptr<Session>>& pair) {
            const auto& [_, session] = pair;
            const auto& username_ = session -> username();
            if(username_ != username) {
               users += username_ + '\n';
           }
        });
        return users;
    }

    std::string rooms_list() {
        std::string rooms;
        std::for_each(begin(rooms_), end(rooms_), [&](const std::pair<std::string, Room>& pair) {
            const auto& [room_name, room] = pair;
            if(room.is_public()) {
                rooms += room_name + '\n';
            }
        });
        return rooms;
    }

    bool create_room(const std::string& username) {

    }

    std::pair<bool, std::string> join_room(const std::string& username) {

    }

    bool exit_room() {

    }
    
    ChatMessage chat_message_;

    std::unordered_map<std::string, Room> rooms_;
    std::map<udp::endpoint, boost::shared_ptr<Session>> users_;

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