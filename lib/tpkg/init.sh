#!/bin/bash
#
# chkconfig: 34 99 1
# description: @@project.name node app
# processname: node
# pidfile: @@directory.run/@@project.name.pid

# source the sysconfig
. "@@directory.sysconfig/@@project.name-config.sh"

# source common functions
. /etc/rc.d/init.d/functions

PIDFILE="@@directory.run/@@project.name.pid"

function getpid() {
  echo `ps -C node -o pid,cmd | grep @@project.name/ | cut -c1-5`
}


case "$1" in
  start)
    cd @@directory.home
    echo "starting @@project.name ..."
    echo $PROG_CMD
    daemon --check=@@project.name --user=@@account.runAsUser $PROG_CMD
    echo
    getpid > $PIDFILE
    ;;
  stop)
    echo "stopping @@project.name ..."
    killproc -p $PIDFILE
    ;;
  restart)
    $0 stop
    $0 start
    ;;
  status)
    status -p $PIDFILE @@project.name
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
esac

exit 0
