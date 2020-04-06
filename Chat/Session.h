#ifndef CHAT_SESSION_H
#define CHAT_SESSION_H

#include <boost/enable_shared_from_this.hpp>
#include <boost/asio/io_service.hpp>
#include <boost/asio/ip/udp.hpp>

#include "Room.h"

class Session
    : public User,
      public boost::enable_shared_from_this<Session>
{
public:

    Session(
        boost::asio::ip::udp::socket& socket,
        boost::asio::ip::udp::endpoint& remote_endpoint,
        std::string username
    ) : User(std::move(username)), socket_(socket), remote_endpoint_(remote_endpoint) {}

    void deliver(const ChatMessage& message) override {
        std::cout << message.text() << std::endl;
    }

    boost::shared_ptr<Room> room() const {
        return room_;
    }

    void set_room(const boost::shared_ptr<Room>& room) {
        room_ = room;
    }


private:

    MessageQueue message_queue_;

    boost::shared_ptr<Room> room_;
    boost::asio::ip::udp::socket& socket_;
    boost::asio::ip::udp::endpoint remote_endpoint_;

};

#endif //CHAT_SESSION_H
