#include <iostream>
#include <string>
#include <boost/asio.hpp>
#include <boost/bind.hpp>
#include <deque>

using boost::asio::ip::tcp;

struct ChatMessage {

    ChatMessage() = default;

    ChatMessage(std::string& msg) : _data(msg) { }

    ChatMessage(const std::string& msg) : _data(msg) { }

    ChatMessage(std::string&& msg) noexcept : _data(std::move(msg)) {}

    char* data() {
        return _data.data();
    }

    const char* data() const {
        return _data.data();
    }

    std::size_t size() const {
        return _data.size();
    }

private:

    std::string _data;

};

class ChatClient {
public:

    ChatClient(
        boost::asio::io_service& io_service,
        tcp::resolver::iterator endpoint_iterator
    ) : _io_service(io_service), _socket(io_service) {
        boost::asio::async_connect(
            _socket,
            endpoint_iterator,
            boost::bind(&ChatClient::handle_connect, this, boost::asio::placeholders::error)
        );
    }

    void write(const ChatMessage& msg) {
        _io_service.post(boost::bind(&ChatClient::do_write, this, msg));
    }

    void close() {
        _io_service.post(boost::bind(&ChatClient::do_close, this));
    }

private:

    void handle_connect(const boost::system::error_code& error) {
        if(!error) {
            boost::asio::async_read(
                _socket,
                boost::asio::buffer(_read_msg.data(), _read_msg.size()),
                boost::bind(&ChatClient::handle_read, this, boost::asio::placeholders::error)
            );
        }
    }

    void handle_read(const boost::system::error_code& error) {
        if(!error) {
            std::cout << _read_msg.data() << std::endl;
            boost::asio::async_read(
                    _socket,
                    boost::asio::buffer(_read_msg.data(), _read_msg.size()),
                    boost::bind(&ChatClient::handle_read, this, boost::asio::placeholders::error)
            );
        } else {
            do_close();
        }
    }

    void do_write(const ChatMessage& msg) {
        if(_write_msgs.empty()) {
            _write_msgs.push_back(msg);
            boost::asio::async_write(
                    _socket,
                    boost::asio::buffer(_write_msgs.front().data(), _write_msgs.front().size()),
                    boost::bind(&ChatClient::handle_write, this, boost::asio::placeholders::error)
            );
        } else {
            _write_msgs.push_back(msg);
        }
    }

    void handle_write(const boost::system::error_code& error) {
        if(!error) {
            _write_msgs.pop_front();
            if(!_write_msgs.empty()) {
                boost::asio::async_write(
                        _socket,
                        boost::asio::buffer(_write_msgs.front().data(), _write_msgs.front().size()),
                        boost::bind(&ChatClient::handle_write, this, boost::asio::placeholders::error)
                );
            }
        } else {
            do_close();
        }
    }

    void do_close() {
        _socket.close();
    }


    boost::asio::io_service& _io_service;
    tcp::socket _socket;
    ChatMessage _read_msg;
    std::deque<ChatMessage> _write_msgs;

};

int main(int argc, char* argv[]) {

    try {

        boost::asio::io_service io_service;

        tcp::resolver resolver(io_service);
        tcp::resolver::query query(argv[1], argv[2]); // host & port
        tcp::resolver::iterator iterator = resolver.resolve(query);

        ChatClient chat(io_service, iterator);

        std::thread t(boost::bind(&boost::asio::io_service::run, &io_service));

        std::string input;
        while(std::getline(std::cin, input)) {
            ChatMessage msg(std::move(input));
            chat.write(msg);
        }

        chat.close();
        t.join();

    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }

    return 0;
}

