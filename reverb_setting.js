

yum install supervisor

nano /etc/supervisord.conf

[program:reverb-worker]
process_name=%(program_name)s_%(process_num)02d
command=/opt/plesk/php/8.2/bin/php /var/www/vhosts/bearskill.com/httpdocs/badmintonparty/artisan reverb:start
autostart=true
autorestart=true
user=root
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/vhosts/bearskill.com/httpdocs/badmintonparty/logs/reverb-worker.log
