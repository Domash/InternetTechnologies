#ifndef CHAT_ROOM_H
#define CHAT_ROOM_H

#include "User.h"

class Room {
public:

    Room(
        std::string name,
        std::string password
    ) : name_(name), password_(password) {}

    void join(const user_ptr& user) {
        users_.insert(user);
    }

    void leave(const user_ptr& user) {
        users_.erase(user);
    }

    void deliver(const ChatMessage& message) {
        message_queue_.push_back(message);

        std::for_each(users_.begin(), users_.end(), [&](const user_ptr& user) {
            user -> deliver(message);
        });
    }

    std::string name() const {
        return name_;
    }

    bool is_public() const {
        return false;
    }


private:

    std::string name_;
    std::string password_;

    std::set<user_ptr> users_;
    MessageQueue message_queue_;

};

#endif //CHAT_ROOM_H
