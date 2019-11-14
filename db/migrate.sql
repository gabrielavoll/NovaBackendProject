DROP TABLE IF EXISTS transfer_pending, data;

CREATE TABLE transfer_pending (
		id serial,
		file_ext varchar(20),
		country_code varchar(3),
		tags varchar(500),
		date_t timestamp DEFAULT now(),
		token varchar(13),
		account_id varchar(10),
		routing_number varchar(10),
		PRIMARY KEY (country_code, account_id, routing_number)
);

CREATE TABLE data (
		id serial,
		file_ext varchar(20),
		country_code varchar(3),
		account_id varchar(10),
		routing_number varchar(10),
		first_name varchar(100),
		last_name varchar(100),
		credit_score integer,
		credit_limit integer,
		date_t_saved timestamp DEFAULT now(),
		date_t_init timestamp,
		tags varchar(500),
		PRIMARY KEY (country_code, account_id, routing_number)
);
