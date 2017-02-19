#!/bin/sh

# command path
prog="nodeblog"
npm="/usr/local/bin/npm"
pm2="/usr/local/bin/pm2"
pwd="/home/nodeblog"
bower-installer="/usr/local/bin/bower-installer"

# log color
green='\033[0;32m'
red='\033[0;31m'
nc='\033[0m'

# environment variables
export NODE_ENV=$1
export NODE_PATH=$pwd
export PORT=3000
export DEBUG=*NODEBLOG*,-*info

printf "${green}[NODEBLOG]${nc} ${red}System Environment Variable${nc}\n"
printf "${green}[NODEBLOG][NODE_ENV]${nc}: ${red}${NODE_ENV}${nc} \n"
printf "${green}[NODEBLOG][NODE_PATH]${nc}: ${red}${NODE_PATH}${nc} \n"
printf "${green}[NODEBLOG][PORT]${nc}: ${red}${PORT}${nc} \n"
printf "${green}[NODEBLOG][DEBUG]${nc}: ${red}${DEBUG}${nc} \n"
printf "${green}[NODEBLOG][DEBUG_FD]${nc}: ${red}${DEBUG_FD}${nc} \n"

if [ ! -d $pwd/pid ]; then
    mkdir $pwd/pid
    printf "${green}[NODEBLOG]${nc} ${red}create directory pid${nc} \n"
fi
if [ ! -d $pwd/log ]; then
    mkdir $pwd/log
    printf "${green}[NODEBLOG]${nc} ${red}create directory log${nc} \n"
fi

start() {
	cd $NODE_PATH
    $npm install -d
    $npm install bower-installer -g
    $bower-installer

    printf "${green}[NODEBLOG]${nc} ${red}starting${nc} \n"
    $npm start
    printf "${green}[NODEBLOG]${nc} ${red}completed${nc} \n"
}

restart() {
	cd $NODE_PATH
    $npm install -d
    $bower-installer

    printf "${green}[NODEBLOG]${nc} ${red}restarting${nc} \n"
    $npm restart
    printf "${green}[NODEBLOG]${nc} ${red}completed${nc} \n"
}

reload() {
	cd $NODE_PATH
    $npm install -d
    $bower-installer

    printf "${green}[NODEBLOG]${nc} ${red}reloading${nc} \n"
    $npm reload
    printf "${green}[NODEBLOG]${nc} ${red}completed${nc} \n"
}

graceful() {
    cd $NODE_PATH
    $npm install -d
    $bower-installer

    printf "${green}[NODEBLOG]${nc} ${red}gracefuling${nc} \n"
    $npm restart
    printf "${green}[NODEBLOG]${nc} ${red}completed${nc} \n"
}

stop() {
    cd $NODE_PATH

    printf "${green}[NODEBLOG]${nc} ${red}stopping${nc} \n"
    $npm stop
    printf "${green}[NODEBLOG]${nc} ${red}completed${nc} \n"
}

delete() {
    cd $NODE_PATH

    printf "${green}[NODEBLOG]${nc} ${red}deleting${nc} \n"
    $npm delete
    printf "${green}[NODEBLOG]${nc} ${red}completed${nc} \n"
}

status() {
    cd $NODE_PATH

    $npm list
    printf "Status $prog: [ ${green}OK${nc} ]\n"
}

case "$2" in
    start)
        start && exit 0
        $2
        ;;
    restart)
        restart && exit 0
        $2
        ;;
    reload)
		reload && exit 0
		$2
		;;
    graceful)
        graceful && exit 0
        $2
        ;;
    stop)
        stop && exit 0
        $2
        ;;
    delete)
		delete && exit 0
		$2
		;;
    status)
        status && exit 0
        $2
        ;;
    *)
        echo $"Usage: $0 {development|stage|production} {start|restart|reload|graceful|stop|delete|status}"
        exit 2
esac
