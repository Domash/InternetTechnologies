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
        Room& room
    ) : socket_(socket), remote_endpoint_(remote_endpoint), room_(room) {}

    void deliver(const ChatMessage& message) override {

    }

private:

    MessageQueue message_queue_;

    Room& room_;
    boost::asio::ip::udp::socket& socket_;
    boost::asio::ip::udp::endpoint remote_endpoint_;

};

#endif //CHAT_SESSION_H
