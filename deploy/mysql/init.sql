CREATE DATABASE IF NOT EXISTS airbnb_dev;
CREATE DATABASE IF NOT EXISTS airbnb_booking_dev;
GRANT ALL PRIVILEGES ON airbnb_dev.* TO 'myhotel'@'%';
GRANT ALL PRIVILEGES ON airbnb_booking_dev.* TO 'myhotel'@'%';
FLUSH PRIVILEGES;
