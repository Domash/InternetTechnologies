#include <boost/algorithm/string.hpp>
#include <boost/array.hpp>

#include <algorithm>
#include <string>
#include <deque>

enum class MessageType {
    JOINED  = 0,
    COMMAND = 1,
    MESSAGE = 2,
    UNKNOWN = 3
};

std::string to_string(MessageType type) {
    switch (type) {
        case MessageType::JOINED: return "JOINED";
        case MessageType::COMMAND: return "COMMAND";
        case MessageType::MESSAGE: return "MESSAGE";
        default: return "UNKNOWN";
    }
}

class ChatMessage {
public:

    static constexpr std::size_t MESSAGE_LENGTH = 1024;

    ChatMessage() : data_(), type_(MessageType::UNKNOWN) {}

    ChatMessage(std::string& text) : data_() {
        initMessage(text);
    }

    ChatMessage(const std::string& text) : data_() {
        initMessage(text);
    }

    boost::array<char, MESSAGE_LENGTH>& data() {
        return data_;
    }

    boost::array<char, MESSAGE_LENGTH> data() const {
        return data_;
    }

    MessageType type() {
        return type_;
    }

    std::string text() const {
        if(type_ == MessageType::UNKNOWN) {
            return "UNKNOWN MESSAGE";
        }
        const auto position = std::find(data_.begin() + 1, data_.end(), 0);
        return std::string(data_.begin() + 1, position);
    }

    std::size_t size() const {
        return data_.size();
    }

    void decode() {
        switch (data_[0]) {
            case 0:
                type_ = MessageType::JOINED;
                break;
            case 1:
                type_ = MessageType::COMMAND;
                break;
            case 2:
                type_ = MessageType::MESSAGE;
                break;
            default:
                type_ = MessageType::UNKNOWN;
                break;
        }
    }

private:

    void initMessage(const std::string& text) {
        if (text.empty()) {
            type_ = MessageType::UNKNOWN;
        } else if(boost::algorithm::istarts_with(text, "/join")) {
            type_ = MessageType::JOINED;
        } else if(boost::algorithm::istarts_with(text, "/")) {
            type_ = MessageType::COMMAND;
        } else {
            type_ = MessageType::MESSAGE;
        }

        data_[0] = static_cast<char>(type_);
        memcpy(data_.data() + 1, text.data(), sizeof(char) * std::min(MESSAGE_LENGTH - 1, text.size()));
    }

    MessageType type_;
    boost::array<char, MESSAGE_LENGTH> data_;

};

typedef std::deque<ChatMessage> MessageQueue;