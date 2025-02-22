PGDMP                         |        	   LADMInfor    15.1    15.1                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                        0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            !           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            "           1262    108172 	   LADMInfor    DATABASE     �   CREATE DATABASE "LADMInfor" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Chinese (Simplified)_China.936';
    DROP DATABASE "LADMInfor";
                postgres    false                        3079    108173 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            #           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    108184 	   LA_BAUnit    TABLE     �   CREATE TABLE public."LA_BAUnit" (
    id character varying NOT NULL,
    "beginLifespanVersion" timestamp without time zone NOT NULL,
    "endLifespanVersion" timestamp without time zone,
    "uID" character varying
);
    DROP TABLE public."LA_BAUnit";
       public         heap    postgres    false            �            1259    108189    LA_Party    TABLE     �   CREATE TABLE public."LA_Party" (
    "Party_id" character varying NOT NULL,
    "LA_PartyType" character varying NOT NULL,
    "Party_name" character varying NOT NULL
);
    DROP TABLE public."LA_Party";
       public         heap    postgres    false            �            1259    108194    LA_RRR    TABLE     -  CREATE TABLE public."LA_RRR" (
    "rID" character varying NOT NULL,
    "LA_RightType" character varying,
    share character varying,
    "beginLifespanVersion" timestamp without time zone NOT NULL,
    "endLifespanVersion" timestamp without time zone,
    "LA_RestrictionType" character varying
);
    DROP TABLE public."LA_RRR";
       public         heap    postgres    false            �            1259    108199    LA_SpatialUnit    TABLE     �   CREATE TABLE public."LA_SpatialUnit" (
    "suID" character varying NOT NULL,
    area numeric,
    dimension character varying
);
 $   DROP TABLE public."LA_SpatialUnit";
       public         heap    postgres    false            $           0    0    COLUMN "LA_SpatialUnit"."suID"    COMMENT     D   COMMENT ON COLUMN public."LA_SpatialUnit"."suID" IS 'LA_BAUnit ID';
          public          postgres    false    218            %           0    0 !   COLUMN "LA_SpatialUnit".dimension    COMMENT     M   COMMENT ON COLUMN public."LA_SpatialUnit".dimension IS 'true: 3D
false: 2D';
          public          postgres    false    218            �            1259    108204    t_apartment    TABLE     �  CREATE TABLE public.t_apartment (
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
    DROP TABLE public.t_apartment;
       public         heap    postgres    false    2                      0    108184 	   LA_BAUnit 
   TABLE DATA           ^   COPY public."LA_BAUnit" (id, "beginLifespanVersion", "endLifespanVersion", "uID") FROM stdin;
    public          postgres    false    215   K                 0    108189    LA_Party 
   TABLE DATA           N   COPY public."LA_Party" ("Party_id", "LA_PartyType", "Party_name") FROM stdin;
    public          postgres    false    216   �                 0    108194    LA_RRR 
   TABLE DATA           �   COPY public."LA_RRR" ("rID", "LA_RightType", share, "beginLifespanVersion", "endLifespanVersion", "LA_RestrictionType") FROM stdin;
    public          postgres    false    217   �                 0    108199    LA_SpatialUnit 
   TABLE DATA           C   COPY public."LA_SpatialUnit" ("suID", area, dimension) FROM stdin;
    public          postgres    false    218   ,                 0    108204    t_apartment 
   TABLE DATA           �   COPY public.t_apartment (id, "Apartment_id", "LA_Party_id", "LA_RRR_id", "LA_BAUnit_id", "LA_SpatialUnit_Apartment_id", "Party_name", "Current_Owner", "LA_SpatialUnit_Parkinglot_id") FROM stdin;
    public          postgres    false    219   �       �           2606    108211    LA_BAUnit LA_BAUnit_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."LA_BAUnit"
    ADD CONSTRAINT "LA_BAUnit_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."LA_BAUnit" DROP CONSTRAINT "LA_BAUnit_pkey";
       public            postgres    false    215            �           2606    108213    LA_Party LA_Party_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."LA_Party"
    ADD CONSTRAINT "LA_Party_pkey" PRIMARY KEY ("Party_id");
 D   ALTER TABLE ONLY public."LA_Party" DROP CONSTRAINT "LA_Party_pkey";
       public            postgres    false    216            �           2606    108215    LA_RRR LA_RRR_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public."LA_RRR"
    ADD CONSTRAINT "LA_RRR_pkey" PRIMARY KEY ("rID");
 @   ALTER TABLE ONLY public."LA_RRR" DROP CONSTRAINT "LA_RRR_pkey";
       public            postgres    false    217            �           2606    108217 "   LA_SpatialUnit LA_SpatialUnit_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."LA_SpatialUnit"
    ADD CONSTRAINT "LA_SpatialUnit_pkey" PRIMARY KEY ("suID");
 P   ALTER TABLE ONLY public."LA_SpatialUnit" DROP CONSTRAINT "LA_SpatialUnit_pkey";
       public            postgres    false    218            �           2606    108219    t_apartment t_apartment_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.t_apartment
    ADD CONSTRAINT t_apartment_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.t_apartment DROP CONSTRAINT t_apartment_pkey;
       public            postgres    false    219               >  x����q�0���)��z��Y��%mŹ&V���$}C �r���A�i���Z�k�#w{o�Y�ﴠ�.Ot�����*���:N�3n��/k�*p�l*��}���y����9�{ڐꚎ��.��6`�������C�:K=��w�������x
0:��5m	b���V�o�Tr����k��<h��-]Ԧ�zV�!�]��p
��:mFeĴƣP?�q�� �)�zJHB��-{2&�F��彸ƫ����nr�y=&4�=����M]ئ�շ�%X{���G#Y�0C��|t����xM�0���٘�{         �   x�e��JA������d��ek�VEo�	ӑ;���-�ۛE�\|��9���N��S*Ueq��|��{;�������ܫho��N�)\:��93��W�x�
x��S�	��}����Ty��7$t>�+�It>��`�'���dN���[9	l�׵jd�Xe�K�����c{�So8��w{�co[_�~��ۻ���ŊѦW���[ݤY�� ~ �h��         �  x��UKn�0];���Ό?�}��� �R`A���^�3&*Bv1������>���nT���p�x���i��T�WE�N�j"�R�?���d���h3&��^��iP���4CX�������_ �"!���D�"{!`ݖϷ�G
gb#�䅍`eO�i���;�	�d.��l�p��z;,܏ ��u� ��ճL�-��]5u�x��V�������1��t9��_�����H��*�u�h1�i��B��G	
)�K��TMĂ�iZ4����G	�:M��񴙯j@�#���	~�������#.V	�Y�_��y��kr��0K^F�x�="_L�O)�;�H��4�>5��A�Gi���O$��K1�[1������u�         �   x�U�A!��1U찰������J-8�5�q��ݻn�n���0�4ӈ�n����!�3�$2ߜHP#���C��M�a*���%���Kj���G	��x�q�*Y�T�Jt�������q���.e1����Wk�9S�         '  x�}�ˎ[7D��W�l>{i'��q�l�i�b�)��y�}�ë�1fuu��]]]MΦ�����9T�m-�P��K�Y�$���Xu����O�c����r�{y؟��N���c?_ԃ��㮵h\,Q�f���5]9�)~��c����i���h��%�$�ىkY�A]K8�nK	R�VP`�)��^���?�<��݈䳩V7*N�����橦f��'�W~}�(�(��s���k_B�<���e�S(`p�a�
�ԝ���{a���g3�oDi�_M��	7LR�0�3bm$��=�4*��$�Z�ϊ�>ia,j\�F��r�M kw�ŐJ�?bǑ*˕�ΔX�����]M��N���
s�nRt=]+U�']�тn��W�`5n0�����u6�jn�����<�@,+������	�7�K���_X�WC$Y�QD{rAk���S��F���Uy8,���z}�_Y��#Q0\uba�&Z7-�;��II��+���]m$��N����K�Vv����y蒃���r�`A�Xd�V�����^�84 3�����i��fL����m&��p~ֶpN���_.�z5�]�#ڞ�nu��VX�/U�8ؘ]�8�����V?)�_N��_�e2:�hp&�K���jBa�j�+J#���ݗ*5�g�#	�44�ص7>��)h��2T�Ϥ�Bl���~�ׇ�y�Tc��XL/#�l$	��6��*����/*Z6#V���v�9�cj�DL��Q�S�"K�:9��lyx��S�K��͜U�}��a߯8�k`�Vt��{�0�h�h�����_NsN}/��~���;gy�`pD/|�늳Q_R�R�]}x������C�S���+��^�n��!Q����Z�#������'�e�z˓7�p�[�8��	��1O�h��i��]����,v�Z�AZ��2`Ή�n�$�X�20��s�N�=>��X��v饂S�]R@L4��.I�7��lx	[(��s��@����q����a��zC_�Ɨ�֕�X���Q f�X27k�X>�6Ж7ק�v5g*sb�Ze#P4"9���}�#�?��ߎgó��������/5����S����sam�X�]��� ���{}��~��"�1�:r�V,�\�am$l S1-����1���ݗ��Y<�6����sP��q���C���/���pF�̷�|#�̈́��5.j�"c�M\�rKv��B�u��f~�B|8��i�i?(z��6c�*�s�f܎`�Pq���8[}���P��R>~�����C�2     