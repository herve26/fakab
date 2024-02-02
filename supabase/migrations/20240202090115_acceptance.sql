create extension if not exists "moddatetime" with schema "extensions";


alter table "public"."document_resource" drop column "name";

alter table "public"."document_resource" add column "for_report" boolean not null default false;

alter table "public"."document_resource" alter column "path" drop not null;

alter table "public"."document_template" alter column "created_at" set default now();

alter table "public"."document_template" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."document_template" alter column "updated_at" drop not null;

alter table "public"."document_template" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;

CREATE UNIQUE INDEX document_resource_url_key ON public.document_resource USING btree (url);

alter table "public"."document_resource" add constraint "document_resource_url_key" UNIQUE using index "document_resource_url_key";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.document_resource FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


