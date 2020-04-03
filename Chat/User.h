#ifndef CHAT_USER_H
#define CHAT_USER_H

#include "ChatMessage.h"

class User {
public:

    User() = default;

    User(std::string& username) : username_(username) {}

    User(const std::string username) : username_(username) {}

    virtual ~User() {}

    virtual void deliver(const ChatMessage& message) = 0;

    std::string username() const {
        return username_;
    }

private:

    const std::string username_;

};

typedef boost::shared_ptr<User> user_ptr;

#endif //CHAT_USER_H
