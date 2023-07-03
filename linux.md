# allow `program` to run at port < 1024 without login as root
sudo setcap cap_net_bind_service=+ep /path/to/program
