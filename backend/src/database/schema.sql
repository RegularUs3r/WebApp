CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS programName (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS hosts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    p_name UUID REFERENCES programName(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS subdomains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subdomain VARCHAR(255) UNIQUE,
    status INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    p_name UUID REFERENCES programName(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    link VARCHAR(255) UNIQUE NOT NULL,
    subdomain_id UUID REFERENCES subdomains(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS response (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    response_body TEXT NOT NULL,
    subdomain_id UUID REFERENCES subdomains(id) NOT NULL,
    link_id UUID REFERENCES links(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS notify (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE NOT NULL,
    period VARCHAR(255) NOT NULL,
    hook VARCHAR(255) NOT NULL,
    options VARCHAR(255) NOT NULL,
    p_name UUID REFERENCES programName(id) UNIQUE NOT NULL

);

CREATE TABLE IF NOT EXISTS maps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE NOT NULL,
    maplink VARCHAR(255) UNIQUE NOT NULL,
    p_name UUID REFERENCES programName(id) NOT NULL

);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE NOT NULL,
    status VARCHAR(255) UNIQUE NOT NULL,
    p_name UUID REFERENCES programName(id) UNIQUE NOT NULL

);

CREATE TABLE IF NOT EXISTS mfa (
   secret VARCHAR(255) UNIQUE NOT NULL
)