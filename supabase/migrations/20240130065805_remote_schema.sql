
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE TYPE "public"."order_status" AS ENUM (
    'PENDING',
    'FULFILLED',
    'CANCELLED'
);

ALTER TYPE "public"."order_status" OWNER TO "postgres";

CREATE TYPE "public"."supplier_type" AS ENUM (
    'MERCHANT',
    'REFILL'
);

ALTER TYPE "public"."supplier_type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_order"(order_date timestamp without time zone, status public.order_status, supplierid integer, order_details_data jsonb) RETURNS void
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    order_id integer;
BEGIN
    INSERT INTO "order" (order_date, status, supplierid)
    VALUES (order_date, status, supplierid)
    RETURNING orderid INTO order_id;
    
    INSERT INTO order_detail (order_quantity, orderid, materialid)
    SELECT (order_data->>'order_quantity')::integer, order_id, (order_data->>'materialid')::integer
    FROM jsonb_array_elements(order_details_data) as order_data;
END
$$;

ALTER FUNCTION "public"."create_order"(order_date timestamp without time zone, status public.order_status, supplierid integer, order_details_data jsonb) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."_permissionTorole" (
    "A" text NOT NULL,
    "B" text NOT NULL
);

ALTER TABLE "public"."_permissionTorole" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_roleTouser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);

ALTER TABLE "public"."_roleTouser" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."connection" (
    "id" text NOT NULL,
    "provider_name" text NOT NULL,
    "providerid" text NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "userid" text NOT NULL
);

ALTER TABLE "public"."connection" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."customer_connection" (
    "so" text,
    "customer_details" text NOT NULL,
    "customer_contact" text NOT NULL,
    "customer_address" text NOT NULL,
    "area" text NOT NULL,
    "geo_localization" text NOT NULL,
    "connection_type" text NOT NULL,
    "has_mdu" boolean DEFAULT false NOT NULL,
    "assignement_date" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completion_date" timestamp(3) without time zone,
    "teamid" integer,
    "path" jsonb,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL
);

ALTER TABLE "public"."customer_connection" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."document_resource" (
    "id" integer NOT NULL,
    "name" text NOT NULL,
    "content_type" text,
    "size" integer,
    "tag" text,
    "url" text,
    "path" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone,
    "customerid" uuid,
    "document_templateid" integer
);

ALTER TABLE "public"."document_resource" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."document_resource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."document_resource_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."document_resource_id_seq" OWNED BY "public"."document_resource"."id";

CREATE TABLE IF NOT EXISTS "public"."document_template" (
    "documentid" integer NOT NULL,
    "document_name" text NOT NULL,
    "document_desc" text,
    "document_code" text NOT NULL,
    "document_type" text,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."document_template" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."document_template_documentid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."document_template_documentid_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."document_template_documentid_seq" OWNED BY "public"."document_template"."documentid";

CREATE TABLE IF NOT EXISTS "public"."employee" (
    "employeeid" integer NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "email" text NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone,
    "inchargeofid" integer,
    "teamid" integer
);

ALTER TABLE "public"."employee" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."employee_employeeid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."employee_employeeid_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."employee_employeeid_seq" OWNED BY "public"."employee"."employeeid";

CREATE TABLE IF NOT EXISTS "public"."material" (
    "materialid" integer NOT NULL,
    "material_name" text NOT NULL,
    "material_code" text NOT NULL,
    "material_desc" text,
    "material_unit_code" text NOT NULL
);

ALTER TABLE "public"."material" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."material_unit" (
    "unit_code" text NOT NULL,
    "unit_name" text NOT NULL
);

ALTER TABLE "public"."material_unit" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."material_used" (
    "customerid" uuid NOT NULL,
    "materialid" integer NOT NULL,
    "quantity" integer NOT NULL
);

ALTER TABLE "public"."material_used" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."order_detail" (
    "order_detailid" integer NOT NULL,
    "order_quantity" integer NOT NULL,
    "received_date" timestamp(3) without time zone,
    "orderid" integer NOT NULL,
    "materialid" integer NOT NULL,
    "unit_price" numeric(65,30)
);

ALTER TABLE "public"."order_detail" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."material_inventory" AS
 SELECT m.materialid,
    m.material_name,
    m.material_code,
    m.material_desc,
    mu.unit_name AS materialunit,
    sum(od_agg.total) AS total,
    COALESCE(sum(ms.quantity), (0)::bigint) AS totalused,
    (sum(od_agg.total) - (COALESCE(sum(ms.quantity), (0)::bigint))::numeric) AS instock
   FROM (((public.material m
     JOIN public.material_unit mu ON ((m.material_unit_code = mu.unit_code)))
     LEFT JOIN ( SELECT order_detail.materialid,
            sum(order_detail.order_quantity) AS total
           FROM public.order_detail
          GROUP BY order_detail.materialid) od_agg ON ((m.materialid = od_agg.materialid)))
     LEFT JOIN public.material_used ms ON ((m.materialid = ms.materialid)))
  GROUP BY m.materialid, m.material_name, m.material_code, m.material_desc, mu.unit_name
  ORDER BY m.material_name;

ALTER TABLE "public"."material_inventory" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."material_materialid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."material_materialid_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."material_materialid_seq" OWNED BY "public"."material"."materialid";

CREATE TABLE IF NOT EXISTS "public"."note" (
    "id" text NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "ownerid" text NOT NULL
);

ALTER TABLE "public"."note" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."note_image" (
    "id" text NOT NULL,
    "alt_text" text,
    "content_type" text NOT NULL,
    "blob" bytea NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "noteid" text NOT NULL
);

ALTER TABLE "public"."note_image" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."order" (
    "orderid" integer NOT NULL,
    "order_date" timestamp(3) without time zone NOT NULL,
    "status" public.order_status DEFAULT 'PENDING'::public.order_status NOT NULL,
    "supplierid" integer
);

ALTER TABLE "public"."order" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."order_detail_order_detailid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."order_detail_order_detailid_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."order_detail_order_detailid_seq" OWNED BY "public"."order_detail"."order_detailid";

CREATE SEQUENCE IF NOT EXISTS "public"."order_orderid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."order_orderid_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."order_orderid_seq" OWNED BY "public"."order"."orderid";

CREATE OR REPLACE VIEW "public"."order_summary" AS
SELECT
    NULL::integer AS "orderid",
    NULL::timestamp(3) without time zone AS "order_date",
    NULL::public.order_status AS "status",
    NULL::integer AS "supplierid",
    NULL::text AS "supplier_name",
    NULL::bigint AS "order_details_count";

ALTER TABLE "public"."order_summary" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."password" (
    "hash" text NOT NULL,
    "userid" text NOT NULL
);

ALTER TABLE "public"."password" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."permission" (
    "id" text NOT NULL,
    "action" text NOT NULL,
    "entity" text NOT NULL,
    "access" text NOT NULL,
    "description" text DEFAULT ''::text NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."permission" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."role" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text DEFAULT ''::text NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."role" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."session" (
    "id" text NOT NULL,
    "expiration_date" timestamp(3) without time zone NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "userid" text NOT NULL
);

ALTER TABLE "public"."session" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."supplier" (
    "supplierid" integer NOT NULL,
    "supplier_name" text NOT NULL,
    "contact_person" text,
    "phonenumber" text,
    "email" text,
    "address" text,
    "supplier_type" public.supplier_type DEFAULT 'MERCHANT'::public.supplier_type NOT NULL
);

ALTER TABLE "public"."supplier" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."supplier_supplierid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."supplier_supplierid_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."supplier_supplierid_seq" OWNED BY "public"."supplier"."supplierid";

CREATE TABLE IF NOT EXISTS "public"."team" (
    "id" integer NOT NULL,
    "name" text NOT NULL
);

ALTER TABLE "public"."team" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."team_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."team_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."team_id_seq" OWNED BY "public"."team"."id";

CREATE TABLE IF NOT EXISTS "public"."team_material" (
    "teamid" integer NOT NULL,
    "materialid" integer NOT NULL,
    "quantity" integer NOT NULL
);

ALTER TABLE "public"."team_material" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."team_summary" AS
SELECT
    NULL::text AS "team_name",
    NULL::text AS "incharge_first_name",
    NULL::text AS "incharge_last_name",
    NULL::bigint AS "member_count";

ALTER TABLE "public"."team_summary" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" text NOT NULL,
    "email" text NOT NULL,
    "username" text NOT NULL,
    "name" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE "public"."user" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_image" (
    "id" text NOT NULL,
    "alt_text" text,
    "content_type" text NOT NULL,
    "blob" bytea NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(3) without time zone NOT NULL,
    "userid" text NOT NULL
);

ALTER TABLE "public"."user_image" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."verification" (
    "id" text NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "type" text NOT NULL,
    "target" text NOT NULL,
    "secret" text NOT NULL,
    "algorithm" text NOT NULL,
    "digits" integer NOT NULL,
    "period" integer NOT NULL,
    "charset" text NOT NULL,
    "expires_at" timestamp(3) without time zone
);

ALTER TABLE "public"."verification" OWNER TO "postgres";

ALTER TABLE ONLY "public"."document_resource" ALTER COLUMN "id" SET DEFAULT nextval('public.document_resource_id_seq'::regclass);

ALTER TABLE ONLY "public"."document_template" ALTER COLUMN "documentid" SET DEFAULT nextval('public.document_template_documentid_seq'::regclass);

ALTER TABLE ONLY "public"."employee" ALTER COLUMN "employeeid" SET DEFAULT nextval('public.employee_employeeid_seq'::regclass);

ALTER TABLE ONLY "public"."material" ALTER COLUMN "materialid" SET DEFAULT nextval('public.material_materialid_seq'::regclass);

ALTER TABLE ONLY "public"."order" ALTER COLUMN "orderid" SET DEFAULT nextval('public.order_orderid_seq'::regclass);

ALTER TABLE ONLY "public"."order_detail" ALTER COLUMN "order_detailid" SET DEFAULT nextval('public.order_detail_order_detailid_seq'::regclass);

ALTER TABLE ONLY "public"."supplier" ALTER COLUMN "supplierid" SET DEFAULT nextval('public.supplier_supplierid_seq'::regclass);

ALTER TABLE ONLY "public"."team" ALTER COLUMN "id" SET DEFAULT nextval('public.team_id_seq'::regclass);

ALTER TABLE ONLY "public"."connection"
    ADD CONSTRAINT "connection_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."customer_connection"
    ADD CONSTRAINT "customer_connection_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."customer_connection"
    ADD CONSTRAINT "customer_connection_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."document_resource"
    ADD CONSTRAINT "document_resource_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."document_template"
    ADD CONSTRAINT "document_template_pkey" PRIMARY KEY ("documentid");

ALTER TABLE ONLY "public"."employee"
    ADD CONSTRAINT "employee_pkey" PRIMARY KEY ("employeeid");

ALTER TABLE ONLY "public"."material"
    ADD CONSTRAINT "material_pkey" PRIMARY KEY ("materialid");

ALTER TABLE ONLY "public"."material_unit"
    ADD CONSTRAINT "material_unit_pkey" PRIMARY KEY ("unit_code");

ALTER TABLE ONLY "public"."material_used"
    ADD CONSTRAINT "material_used_pkey" PRIMARY KEY ("materialid", "customerid");

ALTER TABLE ONLY "public"."note_image"
    ADD CONSTRAINT "note_image_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."note"
    ADD CONSTRAINT "note_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."order_detail"
    ADD CONSTRAINT "order_detail_pkey" PRIMARY KEY ("order_detailid");

ALTER TABLE ONLY "public"."order"
    ADD CONSTRAINT "order_pkey" PRIMARY KEY ("orderid");

ALTER TABLE ONLY "public"."permission"
    ADD CONSTRAINT "permission_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."role"
    ADD CONSTRAINT "role_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."supplier"
    ADD CONSTRAINT "supplier_pkey" PRIMARY KEY ("supplierid");

ALTER TABLE ONLY "public"."team_material"
    ADD CONSTRAINT "team_material_pkey" PRIMARY KEY ("teamid", "materialid");

ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_image"
    ADD CONSTRAINT "user_image_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."verification"
    ADD CONSTRAINT "verification_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "_permissionTorole_AB_unique" ON public."_permissionTorole" USING btree ("A", "B");

CREATE INDEX "_permissionTorole_B_index" ON public."_permissionTorole" USING btree ("B");

CREATE UNIQUE INDEX "_roleTouser_AB_unique" ON public."_roleTouser" USING btree ("A", "B");

CREATE INDEX "_roleTouser_B_index" ON public."_roleTouser" USING btree ("B");

CREATE UNIQUE INDEX connection_provider_name_providerid_key ON public.connection USING btree (provider_name, providerid);

CREATE UNIQUE INDEX customer_connection_so_key ON public.customer_connection USING btree (so);

CREATE UNIQUE INDEX document_resource_document_templateid_key ON public.document_resource USING btree (document_templateid);

CREATE UNIQUE INDEX document_template_document_code_key ON public.document_template USING btree (document_code);

CREATE UNIQUE INDEX document_template_document_name_key ON public.document_template USING btree (document_name);

CREATE UNIQUE INDEX employee_email_key ON public.employee USING btree (email);

CREATE UNIQUE INDEX employee_inchargeofid_key ON public.employee USING btree (inchargeofid);

CREATE UNIQUE INDEX material_material_code_key ON public.material USING btree (material_code);

CREATE UNIQUE INDEX material_material_name_key ON public.material USING btree (material_name);

CREATE INDEX note_image_noteid_idx ON public.note_image USING btree (noteid);

CREATE INDEX note_ownerid_idx ON public.note USING btree (ownerid);

CREATE INDEX note_ownerid_updated_at_idx ON public.note USING btree (ownerid, updated_at);

CREATE UNIQUE INDEX password_userid_key ON public.password USING btree (userid);

CREATE UNIQUE INDEX permission_action_entity_access_key ON public.permission USING btree (action, entity, access);

CREATE UNIQUE INDEX role_name_key ON public.role USING btree (name);

CREATE INDEX session_userid_idx ON public.session USING btree (userid);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX user_image_userid_key ON public.user_image USING btree (userid);

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);

CREATE UNIQUE INDEX verification_target_type_key ON public.verification USING btree (target, type);

CREATE OR REPLACE VIEW "public"."order_summary" AS
 SELECT o.orderid,
    o.order_date,
    o.status,
    o.supplierid,
    s.supplier_name,
    count(od.orderid) AS order_details_count
   FROM ((public."order" o
     LEFT JOIN public.supplier s ON ((o.supplierid = s.supplierid)))
     LEFT JOIN public.order_detail od ON ((o.orderid = od.orderid)))
  GROUP BY o.orderid, s.supplier_name
  ORDER BY o.order_date;

CREATE OR REPLACE VIEW "public"."team_summary" AS
 SELECT team.name AS team_name,
    incharge.first_name AS incharge_first_name,
    incharge.last_name AS incharge_last_name,
    count(employee.employeeid) AS member_count
   FROM ((public.team
     LEFT JOIN public.employee incharge ON ((team.id = incharge.inchargeofid)))
     LEFT JOIN public.employee ON ((team.id = employee.teamid)))
  GROUP BY team.id, incharge.first_name, incharge.last_name;

ALTER TABLE ONLY "public"."_permissionTorole"
    ADD CONSTRAINT "_permissionTorole_A_fkey" FOREIGN KEY ("A") REFERENCES public.permission(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_permissionTorole"
    ADD CONSTRAINT "_permissionTorole_B_fkey" FOREIGN KEY ("B") REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_roleTouser"
    ADD CONSTRAINT "_roleTouser_A_fkey" FOREIGN KEY ("A") REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_roleTouser"
    ADD CONSTRAINT "_roleTouser_B_fkey" FOREIGN KEY ("B") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."connection"
    ADD CONSTRAINT "connection_userid_fkey" FOREIGN KEY (userid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."customer_connection"
    ADD CONSTRAINT "customer_connection_teamid_fkey" FOREIGN KEY (teamid) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."document_resource"
    ADD CONSTRAINT "document_resource_customerid_fkey" FOREIGN KEY (customerid) REFERENCES public.customer_connection(id) ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."document_resource"
    ADD CONSTRAINT "document_resource_document_templateid_fkey" FOREIGN KEY (document_templateid) REFERENCES public.document_template(documentid) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."employee"
    ADD CONSTRAINT "employee_inchargeofid_fkey" FOREIGN KEY (inchargeofid) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."employee"
    ADD CONSTRAINT "employee_teamid_fkey" FOREIGN KEY (teamid) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."material"
    ADD CONSTRAINT "material_material_unit_code_fkey" FOREIGN KEY (material_unit_code) REFERENCES public.material_unit(unit_code) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."material_used"
    ADD CONSTRAINT "material_used_customerid_fkey" FOREIGN KEY (customerid) REFERENCES public.customer_connection(id) ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."material_used"
    ADD CONSTRAINT "material_used_materialid_fkey" FOREIGN KEY (materialid) REFERENCES public.material(materialid) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."note_image"
    ADD CONSTRAINT "note_image_noteid_fkey" FOREIGN KEY (noteid) REFERENCES public.note(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."note"
    ADD CONSTRAINT "note_ownerid_fkey" FOREIGN KEY (ownerid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."order_detail"
    ADD CONSTRAINT "order_detail_materialid_fkey" FOREIGN KEY (materialid) REFERENCES public.material(materialid) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."order_detail"
    ADD CONSTRAINT "order_detail_orderid_fkey" FOREIGN KEY (orderid) REFERENCES public."order"(orderid) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."order"
    ADD CONSTRAINT "order_supplierid_fkey" FOREIGN KEY (supplierid) REFERENCES public.supplier(supplierid) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."password"
    ADD CONSTRAINT "password_userid_fkey" FOREIGN KEY (userid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_userid_fkey" FOREIGN KEY (userid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."team_material"
    ADD CONSTRAINT "team_material_materialid_fkey" FOREIGN KEY (materialid) REFERENCES public.material(materialid) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."team_material"
    ADD CONSTRAINT "team_material_teamid_fkey" FOREIGN KEY (teamid) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."user_image"
    ADD CONSTRAINT "user_image_userid_fkey" FOREIGN KEY (userid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_order"(order_date timestamp without time zone, status public.order_status, supplierid integer, order_details_data jsonb) TO "anon";
GRANT ALL ON FUNCTION "public"."create_order"(order_date timestamp without time zone, status public.order_status, supplierid integer, order_details_data jsonb) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_order"(order_date timestamp without time zone, status public.order_status, supplierid integer, order_details_data jsonb) TO "service_role";

GRANT ALL ON TABLE "public"."_permissionTorole" TO "anon";
GRANT ALL ON TABLE "public"."_permissionTorole" TO "authenticated";
GRANT ALL ON TABLE "public"."_permissionTorole" TO "service_role";

GRANT ALL ON TABLE "public"."_roleTouser" TO "anon";
GRANT ALL ON TABLE "public"."_roleTouser" TO "authenticated";
GRANT ALL ON TABLE "public"."_roleTouser" TO "service_role";

GRANT ALL ON TABLE "public"."connection" TO "anon";
GRANT ALL ON TABLE "public"."connection" TO "authenticated";
GRANT ALL ON TABLE "public"."connection" TO "service_role";

GRANT ALL ON TABLE "public"."customer_connection" TO "anon";
GRANT ALL ON TABLE "public"."customer_connection" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_connection" TO "service_role";

GRANT ALL ON TABLE "public"."document_resource" TO "anon";
GRANT ALL ON TABLE "public"."document_resource" TO "authenticated";
GRANT ALL ON TABLE "public"."document_resource" TO "service_role";

GRANT ALL ON SEQUENCE "public"."document_resource_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."document_resource_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."document_resource_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."document_template" TO "anon";
GRANT ALL ON TABLE "public"."document_template" TO "authenticated";
GRANT ALL ON TABLE "public"."document_template" TO "service_role";

GRANT ALL ON SEQUENCE "public"."document_template_documentid_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."document_template_documentid_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."document_template_documentid_seq" TO "service_role";

GRANT ALL ON TABLE "public"."employee" TO "anon";
GRANT ALL ON TABLE "public"."employee" TO "authenticated";
GRANT ALL ON TABLE "public"."employee" TO "service_role";

GRANT ALL ON SEQUENCE "public"."employee_employeeid_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."employee_employeeid_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."employee_employeeid_seq" TO "service_role";

GRANT ALL ON TABLE "public"."material" TO "anon";
GRANT ALL ON TABLE "public"."material" TO "authenticated";
GRANT ALL ON TABLE "public"."material" TO "service_role";

GRANT ALL ON TABLE "public"."material_unit" TO "anon";
GRANT ALL ON TABLE "public"."material_unit" TO "authenticated";
GRANT ALL ON TABLE "public"."material_unit" TO "service_role";

GRANT ALL ON TABLE "public"."material_used" TO "anon";
GRANT ALL ON TABLE "public"."material_used" TO "authenticated";
GRANT ALL ON TABLE "public"."material_used" TO "service_role";

GRANT ALL ON TABLE "public"."order_detail" TO "anon";
GRANT ALL ON TABLE "public"."order_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."order_detail" TO "service_role";

GRANT ALL ON TABLE "public"."material_inventory" TO "anon";
GRANT ALL ON TABLE "public"."material_inventory" TO "authenticated";
GRANT ALL ON TABLE "public"."material_inventory" TO "service_role";

GRANT ALL ON SEQUENCE "public"."material_materialid_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."material_materialid_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."material_materialid_seq" TO "service_role";

GRANT ALL ON TABLE "public"."note" TO "anon";
GRANT ALL ON TABLE "public"."note" TO "authenticated";
GRANT ALL ON TABLE "public"."note" TO "service_role";

GRANT ALL ON TABLE "public"."note_image" TO "anon";
GRANT ALL ON TABLE "public"."note_image" TO "authenticated";
GRANT ALL ON TABLE "public"."note_image" TO "service_role";

GRANT ALL ON TABLE "public"."order" TO "anon";
GRANT ALL ON TABLE "public"."order" TO "authenticated";
GRANT ALL ON TABLE "public"."order" TO "service_role";

GRANT ALL ON SEQUENCE "public"."order_detail_order_detailid_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_detail_order_detailid_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_detail_order_detailid_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."order_orderid_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_orderid_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_orderid_seq" TO "service_role";

GRANT ALL ON TABLE "public"."order_summary" TO "anon";
GRANT ALL ON TABLE "public"."order_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."order_summary" TO "service_role";

GRANT ALL ON TABLE "public"."password" TO "anon";
GRANT ALL ON TABLE "public"."password" TO "authenticated";
GRANT ALL ON TABLE "public"."password" TO "service_role";

GRANT ALL ON TABLE "public"."permission" TO "anon";
GRANT ALL ON TABLE "public"."permission" TO "authenticated";
GRANT ALL ON TABLE "public"."permission" TO "service_role";

GRANT ALL ON TABLE "public"."role" TO "anon";
GRANT ALL ON TABLE "public"."role" TO "authenticated";
GRANT ALL ON TABLE "public"."role" TO "service_role";

GRANT ALL ON TABLE "public"."session" TO "anon";
GRANT ALL ON TABLE "public"."session" TO "authenticated";
GRANT ALL ON TABLE "public"."session" TO "service_role";

GRANT ALL ON TABLE "public"."supplier" TO "anon";
GRANT ALL ON TABLE "public"."supplier" TO "authenticated";
GRANT ALL ON TABLE "public"."supplier" TO "service_role";

GRANT ALL ON SEQUENCE "public"."supplier_supplierid_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."supplier_supplierid_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."supplier_supplierid_seq" TO "service_role";

GRANT ALL ON TABLE "public"."team" TO "anon";
GRANT ALL ON TABLE "public"."team" TO "authenticated";
GRANT ALL ON TABLE "public"."team" TO "service_role";

GRANT ALL ON SEQUENCE "public"."team_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."team_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."team_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."team_material" TO "anon";
GRANT ALL ON TABLE "public"."team_material" TO "authenticated";
GRANT ALL ON TABLE "public"."team_material" TO "service_role";

GRANT ALL ON TABLE "public"."team_summary" TO "anon";
GRANT ALL ON TABLE "public"."team_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."team_summary" TO "service_role";

GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";

GRANT ALL ON TABLE "public"."user_image" TO "anon";
GRANT ALL ON TABLE "public"."user_image" TO "authenticated";
GRANT ALL ON TABLE "public"."user_image" TO "service_role";

GRANT ALL ON TABLE "public"."verification" TO "anon";
GRANT ALL ON TABLE "public"."verification" TO "authenticated";
GRANT ALL ON TABLE "public"."verification" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
