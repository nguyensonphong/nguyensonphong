-- Chạy thủ công trong Supabase SQL Editor, thay <MẬT_KHẨU>. User riêng cho NocoDB:
-- được xem toàn bộ dữ liệu và tạo đề xuất thay đổi, KHÔNG sửa trực tiếp hay sửa cấu trúc bảng.
create role nocodb login password '<MẬT_KHẨU>' bypassrls;
grant usage on schema catalog, pricing, content, ops to nocodb;
grant select on all tables in schema catalog, pricing, content, ops to nocodb;
-- Nhập liệu tự do: chỉ bảng đề xuất. Mọi thay đổi lên Shopify phải qua phê duyệt.
grant insert, update on ops.change_requests to nocodb;
grant usage on sequence ops.change_requests_id_seq to nocodb;
