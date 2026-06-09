--
-- PostgreSQL database dump
--

\restrict DuzXuxrYXtZS79TILBSm4xWS3NQun9M233GhAKgTUhDFacDf3YIpGX9tFGzfrr8

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductVariant" DROP CONSTRAINT IF EXISTS "ProductVariant_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductImage" DROP CONSTRAINT IF EXISTS "ProductImage_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_customerId_fkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_couponId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
ALTER TABLE IF EXISTS ONLY public."BlogPost" DROP CONSTRAINT IF EXISTS "BlogPost_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Product_sku_key";
DROP INDEX IF EXISTS public."ProductVariant_sku_key";
DROP INDEX IF EXISTS public."Customer_phone_key";
DROP INDEX IF EXISTS public."Customer_email_key";
DROP INDEX IF EXISTS public."Coupon_code_key";
DROP INDEX IF EXISTS public."Category_slug_key";
DROP INDEX IF EXISTS public."Category_name_key";
DROP INDEX IF EXISTS public."BlogPost_slug_key";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."StoreSettings" DROP CONSTRAINT IF EXISTS "StoreSettings_pkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductVariant" DROP CONSTRAINT IF EXISTS "ProductVariant_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductImage" DROP CONSTRAINT IF EXISTS "ProductImage_pkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_pkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaLibrary" DROP CONSTRAINT IF EXISTS "MediaLibrary_pkey";
ALTER TABLE IF EXISTS ONLY public."Customer" DROP CONSTRAINT IF EXISTS "Customer_pkey";
ALTER TABLE IF EXISTS ONLY public."Coupon" DROP CONSTRAINT IF EXISTS "Coupon_pkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE IF EXISTS ONLY public."BlogPost" DROP CONSTRAINT IF EXISTS "BlogPost_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."StoreSettings";
DROP TABLE IF EXISTS public."ProductVariant";
DROP TABLE IF EXISTS public."ProductImage";
DROP TABLE IF EXISTS public."Product";
DROP TABLE IF EXISTS public."OrderItem";
DROP TABLE IF EXISTS public."Order";
DROP TABLE IF EXISTS public."Notification";
DROP TABLE IF EXISTS public."MediaLibrary";
DROP TABLE IF EXISTS public."Customer";
DROP TABLE IF EXISTS public."Coupon";
DROP TABLE IF EXISTS public."Category";
DROP TABLE IF EXISTS public."BlogPost";
DROP TABLE IF EXISTS public."AuditLog";
DROP FUNCTION IF EXISTS public.rls_auto_enable();
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."ProductStatus";
DROP TYPE IF EXISTS public."PaymentStatus";
DROP TYPE IF EXISTS public."OrderStatus";
DROP TYPE IF EXISTS public."NotificationType";
DROP TYPE IF EXISTS public."DiscountType";
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED'
);


--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationType" AS ENUM (
    'ORDER',
    'INVENTORY',
    'SYSTEM',
    'MESSAGE'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'UNPAID',
    'PAID',
    'REFUNDED'
);


--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'STAFF'
);


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    details text NOT NULL,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    "titleKa" text NOT NULL,
    "titleRu" text NOT NULL,
    content text NOT NULL,
    "contentKa" text NOT NULL,
    "contentRu" text NOT NULL,
    slug text NOT NULL,
    image text NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    "nameKa" text NOT NULL,
    "nameRu" text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Coupon" (
    id text NOT NULL,
    code text NOT NULL,
    "discountType" public."DiscountType" NOT NULL,
    "discountValue" double precision NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "usageLimit" integer,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text NOT NULL,
    address text NOT NULL,
    notes text,
    segment text DEFAULT 'New'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MediaLibrary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MediaLibrary" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    folder text DEFAULT 'Uncategorized'::text NOT NULL,
    size integer NOT NULL,
    "mimeType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" DEFAULT 'SYSTEM'::public."NotificationType" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "customerName" text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    "deliveryDate" text NOT NULL,
    "deliveryTime" text NOT NULL,
    "paymentMethod" text NOT NULL,
    notes text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL,
    total double precision NOT NULL,
    "customerId" text,
    "couponId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text,
    "productName" text NOT NULL,
    "productPrice" double precision NOT NULL,
    qty integer NOT NULL,
    "variantSelected" text
);


--
-- Name: Product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    "nameKa" text NOT NULL,
    "nameRu" text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    "descriptionKa" text DEFAULT ''::text NOT NULL,
    "descriptionRu" text DEFAULT ''::text NOT NULL,
    price double precision NOT NULL,
    sku text NOT NULL,
    inventory integer DEFAULT 0 NOT NULL,
    status public."ProductStatus" DEFAULT 'ACTIVE'::public."ProductStatus" NOT NULL,
    tag text,
    rating integer DEFAULT 5 NOT NULL,
    "categoryId" text NOT NULL,
    "seoTitle" text,
    "seoDescription" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductImage" (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ProductVariant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductVariant" (
    id text NOT NULL,
    "productId" text NOT NULL,
    sku text NOT NULL,
    size text,
    color text,
    metal text,
    stock integer DEFAULT 0 NOT NULL,
    "priceAdjustment" double precision DEFAULT 0.0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StoreSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StoreSettings" (
    id text DEFAULT 'global'::text NOT NULL,
    data jsonb NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."UserRole" DEFAULT 'STAFF'::public."UserRole" NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, "userId", action, details, "ipAddress", "createdAt") FROM stdin;
98d78579-d08a-4737-b3ac-df7514ed8311	d69977ff-932f-4548-b094-d07b60879924	SYSTEM_INITIALIZATION	Super admin initialized and default catalogue catalogs loaded.	127.0.0.1	2026-06-06 21:21:18.652
d3ba0725-e555-4ba5-be01-894452e0ba69	\N	CREATE_PRODUCT	Created product catalog item 1 (1)	\N	2026-06-06 21:30:03.88
ee2c0276-30c3-4593-8838-99bb7ba04c2b	\N	UPDATE_PRODUCT	Updated product metadata for 1 (1)	\N	2026-06-06 21:31:02.518
d0ac3f5b-1d1f-445b-a1b5-5d8d92c43343	\N	CREATE_PRODUCT	Created product catalog item 1231 (321)	\N	2026-06-06 21:37:34.802
0d344cfd-b067-42a2-b20a-01408685011d	\N	DELETE_PRODUCT	Deleted product: 1231 (SKU: 321)	\N	2026-06-08 10:28:18.369
fda2349b-2397-4b67-a558-c3f4b50081cd	\N	DELETE_PRODUCT	Deleted product: 1 (SKU: 1)	\N	2026-06-08 10:28:21.004
f955095d-5035-441a-8c4c-03971c462798	\N	DELETE_PRODUCT	Deleted product: Classic Gold Band (SKU: VEL-RING-BAND-06)	\N	2026-06-08 10:34:50.759
d4ce847b-c79d-44ae-ade2-37a524159a8d	\N	DELETE_PRODUCT	Deleted product: Solitaire Diamond Ring (SKU: VEL-RING-SOLI-05)	\N	2026-06-08 10:34:52.805
4c761b57-e623-4487-8738-6cf4d4b4847f	\N	DELETE_PRODUCT	Deleted product: Velluto Link Bracelet (SKU: VEL-BRAC-LINK-03)	\N	2026-06-08 10:35:01.613
7ae8510b-6809-4628-a30c-d1cb2c68a498	\N	DELETE_PRODUCT	Deleted product: Elegance Diamond Necklace (SKU: VEL-NECK-ELEG-02)	\N	2026-06-08 10:35:02.799
073e9df9-59a3-4d56-baac-9c2ae6565484	\N	DELETE_PRODUCT	Deleted product: Aura Gold Ring (SKU: VEL-RING-AURA-01)	\N	2026-06-08 10:35:08.882
d77ac28a-3b24-4117-905b-bee14f646894	\N	DELETE_PRODUCT	Deleted product: Gleam Diamond Earrings (SKU: VEL-EAR-GLEAM-04)	\N	2026-06-08 10:35:15.226
98ac0ff0-367e-40c6-aeb0-04c62f5e2e5c	\N	CREATE_PRODUCT	Created product catalog item Yellow Dress (KABA1)	\N	2026-06-08 10:53:38.705
d50001bf-eb0d-470e-9133-b68ec757a8e3	\N	UPDATE_PRODUCT	Updated product metadata for Yellow Dress (KABA1)	\N	2026-06-08 10:54:41.931
a68c8f8d-2eed-438b-8b0b-2a75978e7e25	\N	UPDATE_SETTINGS	Updated global store shipping, tax, payment parameters.	\N	2026-06-08 11:08:32.689
dc3d4aca-4406-4f1f-bcab-dbda7eaa491d	\N	CREATE_PRODUCT	Created product catalog item "The Coffee" (THECOFFEE1)	\N	2026-06-08 11:51:40.128
43504434-8b60-4169-be79-312f97f4daf4	\N	CREATE_PRODUCT	Created product catalog item The Marble (THEMARBLE1)	\N	2026-06-08 12:15:03.215
1e38624c-96e3-400c-aeac-b4474c7f9680	\N	CREATE_PRODUCT	Created product catalog item Glitter (DRESSBRCHKVIALA)	\N	2026-06-08 12:19:34.904
a2bf6290-28c1-4896-8e1b-8e8c424007ea	\N	UPDATE_PRODUCT	Updated product metadata for The Marble (THEMARBLE1)	\N	2026-06-08 12:20:02.765
ac00b2f6-1b07-47d3-b86e-2a37e97ed202	\N	UPDATE_SETTINGS	Updated global store shipping, tax, payment parameters.	\N	2026-06-08 20:11:52.236
db60e720-cf0f-4feb-ad9b-6a37f7380be5	\N	UPDATE_SETTINGS	Updated global store shipping, tax, payment parameters.	\N	2026-06-08 20:22:27.285
75245ec6-bfa4-4efc-a8fc-35db3f086d1a	\N	UPDATE_SETTINGS	Updated global store shipping, tax, payment parameters.	\N	2026-06-08 21:17:45.021
65547ad7-78b1-4400-9b74-ca8e043c1a3d	\N	CREATE_PRODUCT	Created product catalog item weq (eqw)	\N	2026-06-08 21:18:14.653
ac25663e-90f4-401c-842b-9ec78cbb4e2a	\N	DELETE_PRODUCT	Deleted product: weq (SKU: eqw)	\N	2026-06-08 21:21:56.828
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BlogPost" (id, title, "titleKa", "titleRu", content, "contentKa", "contentRu", slug, image, status, "authorId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, name, "nameKa", "nameRu", slug, "createdAt", "updatedAt") FROM stdin;
53ca6f72-110b-40a2-8afb-656564fba44a	Rings	ბეჭდები	Кольца	rings	2026-06-06 21:21:04.99	2026-06-06 21:21:04.99
43a1484f-be9e-467f-a567-20bee0a4afd6	Necklaces	ყელსაბამები	Колье	necklaces	2026-06-06 21:21:05.74	2026-06-06 21:21:05.74
c3fa539d-fdc3-48f4-9c8d-e59e36127f63	Bracelets	სამაჯურები	Браслеты	bracelets	2026-06-06 21:21:06.054	2026-06-06 21:21:06.054
bf5361cf-faa7-4820-a06b-d43dc572f5a7	Earrings	საყურეები	Серьги	earrings	2026-06-06 21:21:06.372	2026-06-06 21:21:06.372
d79be4df-5706-42bc-98ec-214607a9dd53	Dresses	კაბები	Платья	dresses	2026-06-08 10:47:26.239	2026-06-08 10:47:26.239
a9b0628d-1b78-49fa-8261-0dd883b3d518	Suits & Co-ords	კოსტუმები	Костюмы	suits-and-coords	2026-06-08 10:47:27.176	2026-06-08 10:47:27.176
00794e01-5c9a-48cd-9b59-2137295c8aa4	Knitwear	ნაქსოვი	Трикотаж	knitwear	2026-06-08 10:47:27.803	2026-06-08 10:47:27.803
9d5242da-0d24-42ca-a494-037f995d39f1	Tops & Blouses	ბლუზები	Блузки	tops-and-blouses	2026-06-08 10:47:28.418	2026-06-08 10:47:28.418
3a56516c-1787-4928-aed3-084fecde684e	Outerwear	გარეთა ტანსაცმელი	Верхняя одежда	outerwear	2026-06-08 10:47:29.035	2026-06-08 10:47:29.035
eae856de-5a4c-4dbf-a5c3-873471ce5c48	Accessories	აქსესუარები	Аксессуары	accessories	2026-06-08 10:47:29.65	2026-06-08 10:47:29.65
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Coupon" (id, code, "discountType", "discountValue", "expiresAt", "isActive", "usageLimit", "usageCount", "createdAt", "updatedAt") FROM stdin;
486e08bc-a7fc-4d55-95f7-df7d3d9aa3b4	VELLUTO10	PERCENTAGE	10	\N	t	\N	0	2026-06-06 21:21:12.368	2026-06-06 21:21:12.368
a323c8a3-706b-47a3-905c-f23b51334368	WELCOME100	FIXED	100	\N	t	\N	0	2026-06-06 21:21:13.002	2026-06-06 21:21:13.002
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Customer" (id, name, email, phone, address, notes, segment, "createdAt", "updatedAt") FROM stdin;
da7f0d7e-4d64-4b00-94b2-cf13abe94db2	Nino Bakradze	nino.b@gmail.com	+995599778899	Chavchavadze Ave 25, Tbilisi	Prefers evening deliveries.	VIP	2026-06-06 21:21:13.318	2026-06-06 21:21:13.318
6ce26987-0adb-49bf-b5d8-1acee9374372	Alexei Ivanov	alex.i@yandex.ru	+995577123456	Pekini St 10, Tbilisi	Always orders in Russian.	Regular	2026-06-06 21:21:13.948	2026-06-06 21:21:13.948
\.


--
-- Data for Name: MediaLibrary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MediaLibrary" (id, name, url, folder, size, "mimeType", "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, title, message, type, "isRead", "createdAt") FROM stdin;
97c6e48b-25ba-4787-b364-6c5355498fd3	New Order Placed	Order ORD-100204 has been submitted by Nino Bakradze.	ORDER	f	2026-06-06 21:21:17.407
9641c929-dfd8-4a0b-80c9-48775ba51435	Low Stock Alert	Gleam Diamond Earrings (velluto-4) is down to 3 items in stock.	INVENTORY	f	2026-06-06 21:21:17.407
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "customerName", phone, address, "deliveryDate", "deliveryTime", "paymentMethod", notes, status, "paymentStatus", total, "customerId", "couponId", "createdAt", "updatedAt") FROM stdin;
ORD-100204	Nino Bakradze	+995599778899	Chavchavadze Ave 25, Tbilisi	2026-06-08	18:00	Card	Please wrap as a gift.	PENDING	PAID	1100	da7f0d7e-4d64-4b00-94b2-cf13abe94db2	\N	2026-06-06 21:21:14.261	2026-06-06 21:21:14.261
ORD-100205	Alexei Ivanov	+995577123456	Pekini St 10, Tbilisi	2026-06-09	14:00	Cash	\N	PROCESSING	UNPAID	520	6ce26987-0adb-49bf-b5d8-1acee9374372	\N	2026-06-06 21:21:16.146	2026-06-06 21:21:16.146
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItem" (id, "orderId", "productId", "productName", "productPrice", qty, "variantSelected") FROM stdin;
588d51a3-c031-421e-8667-2ce9ed196d89	ORD-100204	\N	Solitaire Diamond Ring	850	1	Size 17
9810f2f8-4691-4f3c-88ae-c4216dcf1a30	ORD-100204	\N	Aura Gold Ring	250	1	Size 17
fda512e6-7c31-45b1-9134-f0eb777c3165	ORD-100205	\N	Gleam Diamond Earrings	520	1	\N
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, name, "nameKa", "nameRu", description, "descriptionKa", "descriptionRu", price, sku, inventory, status, tag, rating, "categoryId", "seoTitle", "seoDescription", "createdAt", "updatedAt") FROM stdin;
yellow-dress	Yellow Dress	ყვითელი კაბა	жёлтое платье				490	KABA1	5	ACTIVE		5	d79be4df-5706-42bc-98ec-214607a9dd53			2026-06-08 10:53:34.295	2026-06-08 10:54:37.265
the-coffee	"The Coffee"	"The Coffee"	"The Coffee"		ლუქი ყავის არომატით		470	THECOFFEE1	0	ACTIVE		5	3a56516c-1787-4928-aed3-084fecde684e			2026-06-08 11:51:35.718	2026-06-08 11:51:35.718
glitter	Glitter	ბრჭყვიალა	Glitter				650	DRESSBRCHKVIALA	0	ACTIVE		5	d79be4df-5706-42bc-98ec-214607a9dd53			2026-06-08 12:19:28.865	2026-06-08 12:19:28.865
the-marble	The Marble	მარგალიტი	The Marble		დახვეწილობა ბრწყინვაშია		505	THEMARBLE1	3	ACTIVE		5	a9b0628d-1b78-49fa-8261-0dd883b3d518			2026-06-08 12:14:58.576	2026-06-08 12:19:58.541
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImage" (id, "productId", url, "isFeatured", "createdAt") FROM stdin;
dcfd6718-12b1-46f6-9bd5-5ab68b253d49	yellow-dress	/assets/images/DSC06962.jpeg	t	2026-06-08 10:54:37.265
0eb0fa3a-f644-41bc-b00b-c4a083156ea7	yellow-dress	/assets/images/DSC06881.jpeg	f	2026-06-08 10:54:37.265
66526844-2f31-4d36-bb85-00b0f6128c01	yellow-dress	/assets/images/DSC06980.jpeg	f	2026-06-08 10:54:37.265
a8efd32f-c2be-4c75-a151-3a0408d670c9	the-coffee	/assets/images/IMG_8346.jpeg	t	2026-06-08 11:51:35.718
68c76b73-abc6-4eab-bc04-5e486342a61c	the-coffee	/assets/images/IMG_8340.jpeg	f	2026-06-08 11:51:35.718
42b509a8-f72e-48c9-bf5c-f079d774349e	the-coffee	/assets/images/IMG_8339.jpeg	f	2026-06-08 11:51:35.718
fe3dba64-3499-4dbe-87e7-db3e1e92e84b	the-coffee	/assets/images/IMG_8337.jpeg	f	2026-06-08 11:51:35.718
b2d9b038-f435-4ce7-bdf1-75c51136b682	glitter	/assets/images/IMG_0063.jpeg	t	2026-06-08 12:19:28.865
ce2f1f7e-5dcc-465b-b36c-936cdae52563	glitter	/assets/images/IMG_0186.jpeg	f	2026-06-08 12:19:28.865
a62d9b71-fcfd-40a7-b7e4-775b5e567816	glitter	/assets/images/IMG_0062.jpeg	f	2026-06-08 12:19:28.865
d9594500-17ef-4cda-9792-0aed031d85da	the-marble	/assets/images/IMG_9958.jpeg	t	2026-06-08 12:19:58.541
7ab0f743-6a74-4a89-a5f9-9ee6b65d3b93	the-marble	/assets/images/IMG_0702.jpeg	f	2026-06-08 12:19:58.541
d995d8d8-1e4b-4470-983e-4b49bee5148f	the-marble	/assets/images/IMG_9955.jpeg	f	2026-06-08 12:19:58.541
c9e71833-66b3-425c-9f8f-caf423eb3a71	the-marble	/assets/images/IMG_0701.jpeg	f	2026-06-08 12:19:58.541
\.


--
-- Data for Name: ProductVariant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductVariant" (id, "productId", sku, size, color, metal, stock, "priceAdjustment", "createdAt", "updatedAt") FROM stdin;
a17ad883-b263-4998-aead-fed6c4780b0d	yellow-dress	KABA1-VAR-1	XS		Sage Garden	1	490	2026-06-08 10:54:37.265	2026-06-08 10:54:37.265
f394d4d6-315b-4486-81df-471f3bfa54bb	yellow-dress	KABA1-VAR-2	S		Tuscan Cocoa	1	490	2026-06-08 10:54:37.265	2026-06-08 10:54:37.265
8ea06bfe-b691-449c-82b9-c89bb26521c3	yellow-dress	KABA1-VAR-3				0	0	2026-06-08 10:54:37.265	2026-06-08 10:54:37.265
0f322956-b88e-4fda-b1b2-8133dd4a84f5	the-coffee	VAR-9806	S			0	0	2026-06-08 11:51:35.718	2026-06-08 11:51:35.718
ccc06fbc-372c-4337-813b-9a4fd0ceb23e	the-coffee	VAR-3159	M			0	0	2026-06-08 11:51:35.718	2026-06-08 11:51:35.718
44f3590f-bf7b-4203-b393-a6189cb52044	the-coffee	VAR-6381	L			0	0	2026-06-08 11:51:35.718	2026-06-08 11:51:35.718
5edbfa7a-92e8-4083-903f-1ae78e2ba51f	the-coffee	VAR-8997	XL			0	0	2026-06-08 11:51:35.718	2026-06-08 11:51:35.718
097bc254-6b9b-4de3-ab17-fa3074c42a4b	glitter	VAR-090723	XS			1	0	2026-06-08 12:19:28.865	2026-06-08 12:19:28.865
05876d44-6c48-4aec-9d90-4c3a603ddba5	glitter	VAR-092299	S			2	0	2026-06-08 12:19:28.865	2026-06-08 12:19:28.865
91f476d6-b1e0-46d2-ba40-bd76fe4556b7	glitter	VAR-096274	M			3	0	2026-06-08 12:19:28.865	2026-06-08 12:19:28.865
07a61d3c-0f55-4e87-a78c-8e1fd69085d8	glitter	VAR-098482	L			4	0	2026-06-08 12:19:28.865	2026-06-08 12:19:28.865
bd5558bd-3b45-4d8e-82f3-cb996b61108d	the-marble	THEMARBLE1-VAR-1		Black	Black	1	0	2026-06-08 12:19:58.541	2026-06-08 12:19:58.541
020f8cb9-e19a-44da-badf-b956026e2679	the-marble	THEMARBLE1-VAR-2		Brown	Brown	1	0	2026-06-08 12:19:58.541	2026-06-08 12:19:58.541
b51584aa-8112-4810-b5e1-ef8fef31391c	the-marble	THEMARBLE1-VAR-3		Baby Pink	Baby Pink	1	0	2026-06-08 12:19:58.541	2026-06-08 12:19:58.541
ee26a61d-8b33-4953-a558-56762737a080	the-marble	THEMARBLE1-VAR-4		Baby Blue	Baby Blue	1	0	2026-06-08 12:19:58.541	2026-06-08 12:19:58.541
\.


--
-- Data for Name: StoreSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StoreSettings" (id, data, "updatedAt") FROM stdin;
global	{"tax": {"vatRate": 18, "isTaxIncluded": true}, "address": "Vardisubani, Tbilisi, Georgia", "payments": {"bankDetails": "", "bankTransfer": true, "cardOnDelivery": false, "cashOnDelivery": true}, "shipping": {"tbilisiRate": 0, "regionalRate": 15, "minFreeShipping": 300}, "storeName": "Velluto Luxury Store", "heroImages": ["/assets/images/IMG_0701.jpeg", "/assets/images/IMG_8337.jpeg", "/assets/images/DSC06980.jpeg"], "socialLinks": {"facebook": "https://facebook.com/velluto", "instagram": "https://www.instagram.com/velluto_____/", "pinterest": "https://pinterest.com/velluto"}, "contactEmail": "boutique@velluto.com", "contactPhone": "+995 599 12 34 56"}	2026-06-08 21:17:44.266
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, name, role, status, "createdAt", "updatedAt") FROM stdin;
d69977ff-932f-4548-b094-d07b60879924	superadmin@velluto.com	$2b$10$2IHZnHMzXTM2tF8Q5gqR9OP7Amzix9gDScvjUFG/sCQLobK1wKk9O	Elena Rostova	SUPER_ADMIN	ACTIVE	2026-06-06 21:21:03.427	2026-06-06 21:21:03.427
08fbd833-b587-4a84-b87f-ea87fe440d12	admin@velluto.com	$2b$10$2IHZnHMzXTM2tF8Q5gqR9OP7Amzix9gDScvjUFG/sCQLobK1wKk9O	Giorgi Kldiashvili	ADMIN	ACTIVE	2026-06-06 21:21:04.365	2026-06-06 21:21:04.365
34bda88a-f3b5-412a-99e1-82f35dc0d895	staff@velluto.com	$2b$10$2IHZnHMzXTM2tF8Q5gqR9OP7Amzix9gDScvjUFG/sCQLobK1wKk9O	Tamta Sharashidze	STAFF	ACTIVE	2026-06-06 21:21:04.677	2026-06-06 21:21:04.677
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: MediaLibrary MediaLibrary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MediaLibrary"
    ADD CONSTRAINT "MediaLibrary_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: ProductVariant ProductVariant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductVariant"
    ADD CONSTRAINT "ProductVariant_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: StoreSettings StoreSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoreSettings"
    ADD CONSTRAINT "StoreSettings_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: Customer_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Customer_email_key" ON public."Customer" USING btree (email);


--
-- Name: Customer_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Customer_phone_key" ON public."Customer" USING btree (phone);


--
-- Name: ProductVariant_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ProductVariant_sku_key" ON public."ProductVariant" USING btree (sku);


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BlogPost BlogPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_couponId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES public."Coupon"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductVariant ProductVariant_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductVariant"
    ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuditLog; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;

--
-- Name: BlogPost; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."BlogPost" ENABLE ROW LEVEL SECURITY;

--
-- Name: Coupon; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Coupon" ENABLE ROW LEVEL SECURITY;

--
-- Name: Customer; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Customer" ENABLE ROW LEVEL SECURITY;

--
-- Name: MediaLibrary; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."MediaLibrary" ENABLE ROW LEVEL SECURITY;

--
-- Name: Notification; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Notification" ENABLE ROW LEVEL SECURITY;

--
-- Name: Order; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

--
-- Name: OrderItem; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;

--
-- Name: Product; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

--
-- Name: ProductImage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ProductImage" ENABLE ROW LEVEL SECURITY;

--
-- Name: ProductVariant; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."ProductVariant" ENABLE ROW LEVEL SECURITY;

--
-- Name: StoreSettings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."StoreSettings" ENABLE ROW LEVEL SECURITY;

--
-- Name: User; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict DuzXuxrYXtZS79TILBSm4xWS3NQun9M233GhAKgTUhDFacDf3YIpGX9tFGzfrr8

