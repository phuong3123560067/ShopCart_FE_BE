CREATE TABLE "roles" (
  "role_id" serial PRIMARY KEY,
  "role_name" varchar UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "user_id" serial PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "full_name" varchar,
  "role_id" int,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "products" (
  "product_id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" text,
  "price" numeric NOT NULL,
  "stock" int NOT NULL DEFAULT 0,
  "status" varchar DEFAULT 'Active',
  "image_url" varchar
);

CREATE TABLE "carts" (
  "cart_id" serial PRIMARY KEY,
  "user_id" int UNIQUE,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "cart_items" (
  "cart_item_id" serial PRIMARY KEY,
  "cart_id" int,
  "product_id" int,
  "quantity" int NOT NULL DEFAULT 1
);

CREATE TABLE "orders" (
  "order_id" serial PRIMARY KEY,
  "user_id" int,
  "total_price" numeric NOT NULL,
  "discount_amount" numeric DEFAULT 0,
  "shipping_fee" numeric DEFAULT 0,
  "final_price" numeric NOT NULL,
  "shipping_address" text NOT NULL,
  "phone_number" varchar(20) NOT NULL,
  "status" varchar DEFAULT 'Pending',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "order_items" (
  "order_item_id" serial PRIMARY KEY,
  "order_id" int,
  "product_id" int,
  "quantity" int NOT NULL,
  "price_at_purchase" numeric NOT NULL
);

CREATE TABLE "coupons" (
  "coupon_id" serial PRIMARY KEY,
  "code" varchar UNIQUE NOT NULL,
  "discount_percent" int NOT NULL,
  "min_order_value" numeric DEFAULT 0,
  "usage_limit" int DEFAULT 1,
  "used_count" int DEFAULT 0,
  "expiry_date" timestamp,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "order_coupons" (
  "id" serial PRIMARY KEY,
  "order_id" int UNIQUE,
  "coupon_id" int,
  "applied_at" timestamp DEFAULT (now())
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("role_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cart_items" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("cart_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "cart_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "order_coupons" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "order_coupons" ADD FOREIGN KEY ("coupon_id") REFERENCES "coupons" ("coupon_id") DEFERRABLE INITIALLY IMMEDIATE;
