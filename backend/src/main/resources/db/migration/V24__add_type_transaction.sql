INSERT INTO public.type_transaction (type_name)
VALUES ('Adjustment')
ON CONFLICT (type_name) DO NOTHING;

INSERT INTO public.type_transaction (type_name)
VALUES ('Procurement')
ON CONFLICT (type_name) DO NOTHING;

