# Making database

<pre><code>CREATE DATABASE PhotoFox;</code></pre>

<pre><code>CREATE USER fox PASSWORD 'qweasd12';</code></pre>

## Add user 
> To enable user for database, you need to add next line to {PostgreSQL directory}/16/data/pg_hba.conf

<pre><code>local 	photofox	fox					scram-sha-256</code></pre>

## Making tables and etc.
Use files .sql 