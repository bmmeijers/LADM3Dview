--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: LA_BAUnit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LA_BAUnit" (
    id character varying NOT NULL,
    "beginLifespanVersion" timestamp without time zone NOT NULL,
    "endLifespanVersion" timestamp without time zone,
    "uID" character varying
);


ALTER TABLE public."LA_BAUnit" OWNER TO postgres;

--
-- Name: LA_Party; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LA_Party" (
    "Party_id" character varying NOT NULL,
    "LA_PartyType" character varying NOT NULL,
    "Party_name" character varying NOT NULL
);


ALTER TABLE public."LA_Party" OWNER TO postgres;

--
-- Name: LA_RRR; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LA_RRR" (
    "rID" character varying NOT NULL,
    "LA_RightType" character varying,
    share character varying,
    "beginLifespanVersion" timestamp without time zone NOT NULL,
    "endLifespanVersion" timestamp without time zone,
    "LA_RestrictionType" character varying
);


ALTER TABLE public."LA_RRR" OWNER TO postgres;

--
-- Name: LA_SpatialUnit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LA_SpatialUnit" (
    "suID" character varying NOT NULL,
    area numeric,
    dimension character varying
);


ALTER TABLE public."LA_SpatialUnit" OWNER TO postgres;

--
-- Name: COLUMN "LA_SpatialUnit"."suID"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."LA_SpatialUnit"."suID" IS 'LA_BAUnit ID';


--
-- Name: COLUMN "LA_SpatialUnit".dimension; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."LA_SpatialUnit".dimension IS 'true: 3D
false: 2D';


--
-- Name: t_apartment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_apartment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "Apartment_id" character varying NOT NULL,
    "LA_Party_id" character varying,
    "LA_RRR_id" character varying,
    "LA_BAUnit_id" character varying,
    "LA_SpatialUnit_Apartment_id" character varying,
    "Party_name" character varying,
    "Current_Owner" boolean,
    "LA_SpatialUnit_Parkinglot_id" character varying
);


ALTER TABLE public.t_apartment OWNER TO postgres;

--
-- Data for Name: LA_BAUnit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LA_BAUnit" (id, "beginLifespanVersion", "endLifespanVersion", "uID") FROM stdin;
6	2017-09-01 09:00:00	2019-09-01 23:59:59	005
8	2018-06-01 09:00:00	2019-06-01 23:59:59	006
10	2018-03-01 09:00:00	2019-03-01 23:59:59	007
15	2017-09-01 09:00:00	2019-09-01 23:59:59	010
25	2020-06-23 10:00:00	2050-06-23 10:00:00	017
1	2015-01-01 00:00:00	9999-12-31 23:59:59	001
2	2015-01-01 00:00:00	9999-12-31 23:59:59	002
3	2018-07-04 15:17:00	9999-12-31 23:59:59	003
4	2016-11-08 11:46:00	9999-12-31 23:59:59	004
5	2015-02-19 09:16:00	9999-12-31 23:59:59	005
7	2016-01-05 12:41:00	9999-12-31 23:59:59	006
9	2017-04-15 14:32:00	9999-12-31 23:59:59	007
11	2016-12-23 09:15:00	9999-12-31 23:59:59	008
12	2018-05-20 09:09:00	9999-12-31 23:59:59	009
14	2015-04-01 11:06:00	9999-12-31 23:59:59	010
17	2018-06-10 13:23:00	9999-12-31 23:59:59	011
18	2018-06-10 13:23:00	9999-12-31 23:59:59	012
19	2015-02-28 16:34:00	9999-12-31 23:59:59	013
20	2015-02-28 16:34:00	9999-12-31 23:59:59	013
21	2018-12-25 12:01:00	9999-12-31 23:59:59	014
23	2021-08-01 14:04:00	9999-12-31 23:59:59	016
24	2020-06-23 10:00:00	9999-12-31 23:59:59	017
26	2016-09-14 16:59:00	9999-12-31 23:59:59	018
27	2018-08-10 15:09:00	9999-12-31 23:59:59	019
28	2016-02-16 09:04:00	9999-12-31 23:59:59	020
29	2017-04-27 16:59:00	9999-12-31 23:59:59	021
22	2015-04-03 08:29:00	2021-08-01 14:04:00	015
\.


--
-- Data for Name: LA_Party; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LA_Party" ("Party_id", "LA_PartyType", "Party_name") FROM stdin;
10	naturalPerson	Henry
11	naturalPerson	Jackson
12	naturalPerson	Alice
13	naturalPerson	Alex
14	naturalPerson	John
15	naturalPerson	Luke
16	naturalPerson	William
17	naturalPerson	Lucas
18	naturalPerson	Jessica
19	naturalPerson	Tom
20	nonNaturalPerson	Bank
21	naturalPerson	Victoria
22	naturalPerson	Linda
23	naturalPerson	Charlie
24	naturalPerson	Damien
01	nonNaturalPerson	Association of owners
02	naturalperson	Mary
03	naturalPerson	Jack
04	naturalPerson	Sophia
05	naturalPerson	Mia
06	naturalPerson	Ella
07	naturalPerson	Luna
08	naturalPerson	James
09	naturalPerson	Bella
\.


--
-- Data for Name: LA_RRR; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LA_RRR" ("rID", "LA_RightType", share, "beginLifespanVersion", "endLifespanVersion", "LA_RestrictionType") FROM stdin;
right01	commonOwnership	\N	2015-01-01 10:00:00	9999-12-31 23:59:59	\N
right02	commonOwnership	\N	2015-01-01 10:00:00	9999-12-31 23:59:59	\N
right08	Lease	1/1	2017-09-01 09:00:00	2019-09-01 23:59:59	\N
right09	Lease	1/1	2018-06-01 09:00:00	2019-06-01 23:59:59	\N
right10	Lease	1/1	2018-03-01 09:00:00	2019-03-01 23:59:59	\N
right22	Ownership	1/1	2015-04-03 08:29:00	2021-08-01 14:04:00	\N
restrict01	\N	1/1	2020-06-23 10:00:00	2050-06-23 10:00:00	mortgage
right15	Lease	1/2	2017-09-01 09:00:00	2019-09-01 23:59:59	\N
right16	Lease	1/2	2017-09-01 09:00:00	2019-09-01 23:59:59	\N
right03	Ownership	1/1	2018-07-04 15:17:00	9999-12-31 23:59:59	\N
right04	Ownership	1/1	2016-11-08 11:46:00	9999-12-31 23:59:59	\N
right05	Ownership	1/1	2015-02-19 09:16:00	9999-12-31 23:59:59	\N
right07	Ownership	1/1	2017-04-15 14:32:00	9999-12-31 23:59:59	\N
right11	Ownership	1/1	2016-12-23 09:15:00	9999-12-31 23:59:59	\N
right12	Ownership	1/2	2018-05-20 09:09:00	9999-12-31 23:59:59	\N
right13	Ownership	1/2	2018-05-20 09:09:00	9999-12-31 23:59:59	\N
right14	Ownership	1/1	2015-04-01 11:06:00	9999-12-31 23:59:59	\N
right17	Ownership	1/1	2018-06-10 13:23:00	9999-12-31 23:59:59	\N
right18	Ownership	1/1	2018-06-10 13:23:00	9999-12-31 23:59:59	\N
right19	usufruct	1/1	2015-02-28 16:34:00	9999-12-31 23:59:59	\N
right20	Ownership	1/1	2015-02-28 16:34:00	9999-12-31 23:59:59	\N
right21	Ownership	1/1	2018-12-25 12:01:00	9999-12-31 23:59:59	\N
right23	Ownership	1/1	2021-08-01 14:04:00	9999-12-31 23:59:59	\N
right24	Ownership	1/1	2020-06-23 10:00:00	9999-12-31 23:59:59	\N
right25	Ownership	1/1	2016-09-14 16:59:00	9999-12-31 23:59:59	\N
right26	Ownership	1/1	2018-08-10 15:09:00	9999-12-31 23:59:59	\N
right27	Ownership	1/1	2016-02-16 09:04:00	9999-12-31 23:59:59	\N
right28	Ownership	1/1	2017-04-27 16:59:00	9999-12-31 23:59:59	\N
right06	Ownership	1/1	2016-01-05 12:41:00	9999-12-31 23:59:59	\N
\.


--
-- Data for Name: LA_SpatialUnit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LA_SpatialUnit" ("suID", area, dimension) FROM stdin;
010004	110	3D
010005	16	3D
010006	120	3D
010007	111	3D
010008	109	3D
010009	130	3D
010010	110	3D
010011	16	3D
010012	120	3D
010013	16	3D
010014	111	3D
010015	16	3D
010016	109	3D
010017	16	3D
010018	130	3D
010019	16	3D
010020	110	3D
010021	16	3D
010022	120	3D
010023	16	3D
010024	120	3D
010025	16	3D
010026	110	3D
010027	120	3D
010028	16	3D
010029	111	3D
010030	16	3D
010031	109	3D
010032	16	3D
010033	130	3D
010034	16	3D
010001	3000	2D
010002	630	3D
010003	300	3D
010035	630	3D
010036	630	3D
010037	109	3D
\.


--
-- Data for Name: t_apartment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_apartment (id, "Apartment_id", "LA_Party_id", "LA_RRR_id", "LA_BAUnit_id", "LA_SpatialUnit_Apartment_id", "Party_name", "Current_Owner", "LA_SpatialUnit_Parkinglot_id") FROM stdin;
980bd770-51c0-495c-81cb-b2e9cd39a768	Parcel	01	right01	1	010001	Association of owners	t	\N
dd6036b6-cd01-443d-b323-500b4ff58664	Roof	01	right02	2	010002	Association of owners	t	\N
fc2a0d1d-b3d8-4f2e-ac23-75e1bb5ac586	101	02	right03	3	010004	Mary	t	010005
f62480c1-d2b3-4e8d-b4d3-d42c7b972001	102	02	right04	4	010006	Mary	t	\N
591af68b-5104-4b5d-9f0f-d38087554b97	103	03	right05	5	010007	Jack	t	\N
2e9eb903-d968-495b-b40a-0adfbf4c0827	105	03	right07	9	010009	Jack	t	\N
f6cd95a7-f960-4a33-9724-ece5a8ecb648	201	07	right11	11	010010	Luna	t	010011
0d657b80-56e8-435d-8c21-4779a00fc450	202	08	right12	12	010012	James	t	010013
e0763e55-cc2c-49ae-bfd5-dedbaf14c3eb	203	10	right14	14	010014	Henry	t	010015
c8dd48ed-9d04-469a-b41a-2914f79c227b	204	10	right17	17	010016	Henry	t	010017
dd562af8-1fba-4235-b115-fd0e1bfbcd2e	205	13	right06	18	010018	Alex	t	010019
1f72509c-7946-4bda-a09d-ae439c0da7f7	301	14	right19	19	010020	John	t	010021
ea8cc21f-4e53-448f-b851-add90e58caa6	302	16	right21	21	010022	William	t	010023
e86636b1-c368-4f31-9b2e-13e49507ef3f	304	18	right23	23	010024	Jessica	t	010025
84f61e7c-dcf6-4db9-a4bc-301b9093da6f	401	19	right24	24	010026	Tom	t	\N
f5092820-6afd-471d-9b6a-643c7152da25	304	17	right22	22	010024	Lucas	f	010025
6f7a217f-906e-4048-b175-062b0d580e54	402	21	right25	26	010027	Victoria	t	010028
e6b0ebf5-8078-4573-90d5-0db2e09aca1b	403	22	right26	27	010029	Linda	t	010030
92dbb60a-f2fb-4e01-9a88-731d01d8f44e	404	23	right27	28	010031	Charlie	t	010032
b10914db-68d6-4407-973b-26ec711d852f	405	24	right28	29	010033	Damien	t	010034
319f2a5c-9620-4e1f-b31e-b4b76a55766e	Stairs,Elevators	01	right02	2	010003	Association of owners	t	\N
344f6fa6-20d1-47eb-8111-e6f2a900c413	202	09	right13	12	010012	Bella	t	010013
39113aba-c7f0-4e32-a4b3-a68089a06206	303	03	right06	7	010008	Jack	t	\N
50bd2509-263c-4af3-a759-cbfe1b8497e3	Entrance	01	right02	2	010037	Association of owners	t	\N
7bfc93ca-5754-4f0a-b59c-9f9b814f3f68	B1	01	right02	2	010035	Association of owners	t	\N
b26b8e8e-4e52-450c-ada3-0b9e6f637709	B2	01	right02	2	010036	Association of owners	t	\N
13bb9d39-d58d-45a3-8944-ea1bb5d81052	105	06	right10	9	010009	Ella	t	\N
568799c1-90ac-46da-964e-ac478f5bb959	203	11	right15	14	010014	Jackson	t	010015
bc6d596e-fe77-4f69-97a9-054bf73be3c6	203	12	right16	14	010014	Alice	t	010015
8ba24002-696b-4c5b-8b52-dfdf7c3e0c24	301	15	right20	19	010020	Luke	t	010021
e4d469a3-b0e3-48a2-aa39-0397159865b1	401	20	restrict01	24	010026	Bank	t	\N
19dfc236-1d61-4078-8acb-8d71f0e3d5b2	103	04	right08	5	010007	Sophia	t	\N
f26449b3-40ba-44ae-b823-9f95c724ee33	303	05	right09	7	010008	Mia	t	\N
\.


--
-- Name: LA_BAUnit LA_BAUnit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LA_BAUnit"
    ADD CONSTRAINT "LA_BAUnit_pkey" PRIMARY KEY (id);


--
-- Name: LA_Party LA_Party_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LA_Party"
    ADD CONSTRAINT "LA_Party_pkey" PRIMARY KEY ("Party_id");


--
-- Name: LA_RRR LA_RRR_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LA_RRR"
    ADD CONSTRAINT "LA_RRR_pkey" PRIMARY KEY ("rID");


--
-- Name: LA_SpatialUnit LA_SpatialUnit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LA_SpatialUnit"
    ADD CONSTRAINT "LA_SpatialUnit_pkey" PRIMARY KEY ("suID");


--
-- Name: t_apartment t_apartment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_apartment
    ADD CONSTRAINT t_apartment_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

