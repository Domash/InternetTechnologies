#include <string>

struct ChatMessage {

    ChatMessage() = default;

    ChatMessage(std::string& msg) : data_(msg) { }

    ChatMessage(const std::string& msg) : data_(msg) { }

    ChatMessage(std::string&& msg) noexcept : data_(std::move(msg)) {}

    char* data() {
        return data_.data();
    }

    const char* data() const {
        return data_.data();
    }

    std::size_t size() const {
        return data_.size();
    }

private:

    std::string data_;

};
