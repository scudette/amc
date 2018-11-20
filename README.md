# amc
Apache Media Center

This is just a number of quick scripts I put together to server media over Apache without needing to install anything special.
To install, simple check out this repository into /var/www/html and change /etc/apache2/apache2.conf:

```
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>
```

The main change allows .htaccess files to override directive (AllowOverride All).
