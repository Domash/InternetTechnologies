#include <boost/algorithm/string/predicate.hpp>
#include <boost/array.hpp>
#include <algorithm>
#include <string>

enum class MessageType {
    JOINED  = 0,
    COMMAND = 1,
    MESSAGE = 2,
    UNKNOWN = 3
};

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

    MessageType type() {
        return type_;
    }

    boost::array<char, MESSAGE_LENGTH>& data() {
        return data_;
    }

    boost::array<char, MESSAGE_LENGTH> data() const {
        return data_;
    }

    std::string text() const {
        if(type_ == MessageType::UNKNOWN) {
            throw std::invalid_argument("MessageType = UNKNOWN");
        }
        const auto position = std::find(data_.begin() + 1, data_.end(), 0);
        return std::string(data_.begin() + 1, position);
    }

    std::size_t size() const {
        return data_.size();
    }

private:

    void initMessage(const std::string& text) {
        if (text.empty()) {
            type_ = MessageType::UNKNOWN;
        } else if(boost::starts_with(text, "/join")) {
            type_ = MessageType::JOINED;
        } else if(boost::starts_with(text, "/")) {
            type_ = MessageType::COMMAND;
        } else {
            type_ = MessageType::MESSAGE;
        }
        data_[0] = static_cast<char>(type_);
        std::copy(text.begin(), text.end(), data_.begin() + 1);
    }

    MessageType type_;
    boost::array<char, MESSAGE_LENGTH> data_;

};
