#include <boost/array.hpp>
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
        init(text);
    }

    ChatMessage(const std::string& text) : data_() {
        init(text);
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
        const auto position = std::find(data_.begin() + 1, data_.end(), 0);
        return std::string(data_.begin() + 1, position);
    }

    std::size_t size() const {
        return data_.size();
    }

private:

    void static init(const std::string& text) {
        if (text.empty()) {

        } else if(text.starts_with("/join")) {

        } else if(text.starts_with('/')) {

        } else {

        }
    }

    MessageType type_;
    boost::array<char, MESSAGE_LENGTH> data_;

};
