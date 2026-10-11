# Nội dung thương hiệu (phần A). Mỗi hãng:
#   tagline: 1–2 câu giới thiệu
#   history: các đoạn lịch sử (mốc chính)
#   lines: [(dòng sản phẩm, mô tả ngắn)]
#   tips: lời khuyên chọn mua
#   topics: hashtag chủ đề, website
C = {}

C["samsung"] = dict(
    tagline="Tập đoàn công nghệ Hàn Quốc dẫn đầu thế giới về tivi và màn hình, nổi bật với tủ lạnh, máy giặt và điều hòa ứng dụng công nghệ inverter, kết nối SmartThings.",
    history=[
        "Samsung Electronics ra đời năm 1969 tại Suwon (Hàn Quốc), là công ty con của tập đoàn Samsung do Lee Byung-chul sáng lập từ năm 1938. Những sản phẩm đầu tiên là tivi đen trắng và radio phục vụ thị trường nội địa.",
        "Thập niên 1980–1990, Samsung đầu tư mạnh vào chất bán dẫn và trở thành nhà sản xuất chip nhớ hàng đầu. Năm 2006, Samsung vươn lên vị trí số 1 thế giới về doanh số tivi và giữ vị trí này liên tục trong gần hai thập kỷ.",
        "Ngày nay Samsung có nhà máy lớn tại Việt Nam (Bắc Ninh, Thái Nguyên, TP.HCM). Các dòng gia dụng của hãng tập trung vào thiết kế Bespoke cá nhân hóa, động cơ Digital Inverter tiết kiệm điện và hệ sinh thái nhà thông minh SmartThings.",
    ],
    lines=[("Tivi Neo QLED, OLED, Crystal UHD", "Dải màn hình từ 43 đến 98 inch, mạnh về độ sáng và chống chói, phù hợp phòng khách nhiều ánh sáng."),
           ("Tủ lạnh Bespoke, Side by Side, Inverter", "Ngăn làm lạnh độc lập, máy nén Digital Inverter bảo hành dài hạn."),
           ("Máy giặt AI EcoBubble, máy sấy bơm nhiệt", "Công nghệ bong bóng giúp giặt sạch ở nhiệt độ thấp, AI tự chọn chế độ theo khối lượng đồ."),
           ("Điều hòa WindFree", "Làm lạnh qua hàng nghìn lỗ siêu nhỏ, không thổi gió trực tiếp vào người.")],
    tips=["Phòng khách sáng, cửa kính lớn: ưu tiên tivi Neo QLED có độ sáng cao.",
          "Gia đình 4–5 người nên chọn tủ lạnh từ 400 lít, có ngăn đông mềm để trữ thịt cá.",
          "Kiểm tra mã máy có hậu tố Inverter và nhãn năng lượng 5 sao để tiết kiệm điện lâu dài."],
    topics=["tivi", "tủ lạnh", "máy giặt", "điều hòa", "nhà thông minh"], website="https://www.samsung.com/vn/")

C["lg"] = dict(
    tagline="Thương hiệu điện tử Hàn Quốc tiên phong tivi OLED và động cơ Inverter Direct Drive trên máy giặt, nổi tiếng về độ bền.",
    history=[
        "Tiền thân của LG Electronics là GoldStar, thành lập năm 1958 tại Hàn Quốc. GoldStar sản xuất chiếc radio đầu tiên của Hàn Quốc năm 1959, sau đó là tủ lạnh và tivi đầu tiên của nước này.",
        "Năm 1995, GoldStar hợp nhất thương hiệu với Lucky Chemical thành LG, với slogan \"Life's Good\". Năm 2013, LG ra mắt tivi OLED cong thương mại đầu tiên trên thế giới và từ đó dẫn đầu phân khúc OLED.",
        "LG có tổ hợp nhà máy lớn tại Hải Phòng (Việt Nam). Gia dụng của hãng nổi bật với động cơ dẫn động trực tiếp, công nghệ hơi nước TrueSteam và nền tảng điều khiển ThinQ.",
    ],
    lines=[("Tivi OLED evo, QNED, NanoCell", "OLED cho màu đen sâu và góc nhìn rộng, hợp xem phim và chơi game."),
           ("Máy giặt AI DD, máy giặt sấy", "Động cơ Inverter Direct Drive ít rung, êm, được bảo hành động cơ dài hạn."),
           ("Tủ lạnh InstaView, Multi Door", "Gõ 2 lần lên cửa kính để xem bên trong mà không mất hơi lạnh."),
           ("Máy lọc không khí PuriCare, máy sấy quần áo, máy rửa bát", "Các thiết bị chăm sóc nhà cửa có kết nối ThinQ.")],
    tips=["Thích xem phim trong phòng tối: chọn OLED; phòng sáng nhiều: QNED.",
          "Máy giặt cửa trước 9–10 kg phù hợp gia đình 3–5 người.",
          "Nhà có trẻ nhỏ nên chọn máy giặt có chế độ hơi nước diệt khuẩn."],
    topics=["tivi", "máy giặt", "tủ lạnh", "máy lọc không khí"], website="https://www.lg.com/vn/")

C["panasonic"] = dict(
    tagline="Thương hiệu Nhật Bản hơn 100 năm tuổi, được tin dùng ở Việt Nam với tủ lạnh, máy giặt, điều hòa công nghệ Nanoe™ và đồ gia dụng nhà bếp.",
    history=[
        "Konosuke Matsushita thành lập công ty năm 1918 tại Osaka, khởi đầu với ổ cắm điện hai đầu. Sau đó hãng mở rộng sang đèn xe đạp, radio, rồi tivi và tủ lạnh trong thời kỳ phục hồi kinh tế Nhật Bản.",
        "Tên Panasonic được dùng cho thị trường quốc tế từ năm 1955. Năm 2008, Matsushita Electric chính thức đổi tên thành Panasonic Corporation, thống nhất các thương hiệu National và Panasonic.",
        "Panasonic hiện diện tại Việt Nam từ rất sớm với nhiều nhà máy và trung tâm R&D. Thế mạnh của hãng là độ bền, công nghệ lọc khí Nanoe™ X và các thiết bị nhà bếp như nồi cơm, lò vi sóng.",
    ],
    lines=[("Điều hòa Inverter có Nanoe™ X", "Ức chế vi khuẩn, nấm mốc trong không khí, vận hành êm."),
           ("Tủ lạnh Prime Fresh, cấp đông mềm", "Giữ thịt cá ở -3°C, dùng ngay không cần rã đông."),
           ("Máy giặt cửa trên và cửa trước", "Bền, dễ sửa chữa, nhiều chế độ giặt nước nóng."),
           ("Nồi cơm điện, lò vi sóng, máy xay", "Đồ gia dụng nhà bếp quen thuộc với gia đình Việt.")],
    tips=["Phòng ngủ 12–15 m² chọn điều hòa 1 HP (9.000 BTU) inverter.",
          "Hay nấu ăn, trữ thực phẩm tươi: chọn tủ lạnh có ngăn Prime Fresh.",
          "Ưu tiên model có chứng nhận tiết kiệm điện để giảm hóa đơn mùa hè."],
    topics=["điều hòa", "tủ lạnh", "máy giặt", "đồ nhà bếp"], website="https://www.panasonic.com/vn/")

C["sony"] = dict(
    tagline="Biểu tượng công nghệ Nhật Bản về hình ảnh và âm thanh: tivi BRAVIA, loa, tai nghe và máy chơi game PlayStation.",
    history=[
        "Sony được Masaru Ibuka và Akio Morita thành lập năm 1946 tại Tokyo với tên Tokyo Tsushin Kogyo. Năm 1955, hãng ra mắt radio bán dẫn TR-55, sản phẩm transistor đầu tiên của Nhật Bản.",
        "Tên Sony ra đời năm 1958. Hãng ghi dấu ấn với tivi Trinitron (1968), máy nghe nhạc Walkman (1979), đồng phát triển đĩa CD (1982) và máy chơi game PlayStation (1994).",
        "Ngày nay Sony Group hoạt động trong điện tử, game, âm nhạc và điện ảnh. Tivi BRAVIA dùng bộ xử lý hình ảnh riêng của hãng, nổi tiếng về màu sắc tự nhiên giống phim điện ảnh.",
    ],
    lines=[("Tivi BRAVIA OLED, Mini LED", "Màu sắc chân thực, xử lý chuyển động mượt."),
           ("Loa thanh, dàn âm thanh tại gia", "Kết nối với tivi BRAVIA để tạo âm thanh vòm."),
           ("Tai nghe chống ồn", "Chống ồn chủ động, phù hợp đi lại và làm việc."),
           ("PlayStation và phụ kiện", "Máy chơi game và tay cầm chính hãng.")],
    tips=["Xem phim nhiều: chọn tivi có chế độ hiệu chỉnh màu theo phim.",
          "Phòng khách 20–30 m² hợp tivi 65 inch kết hợp loa thanh.",
          "Mua phụ kiện chơi game chính hãng để đảm bảo tương thích."],
    topics=["tivi", "âm thanh", "gaming"], website="https://www.sony.com.vn/")

C["toshiba"] = dict(
    tagline="Thương hiệu Nhật Bản lâu đời trong điện máy, nổi bật ở tủ lạnh, máy giặt và nồi cơm điện bền bỉ.",
    history=[
        "Toshiba được thành lập năm 1939 từ sự hợp nhất của Shibaura Seisakusho (thiết bị điện nặng) và Tokyo Denki (thiết bị điện gia dụng). Hai tiền thân này lần lượt ra đời năm 1875 và 1890.",
        "Toshiba từng tạo ra nhiều sản phẩm \"đầu tiên của Nhật\" như nồi cơm điện tự động (1955) và máy giặt, tủ lạnh nội địa. Hãng cũng là nhà phát minh bộ nhớ flash vào thập niên 1980.",
        "Mảng điện gia dụng Toshiba Lifestyle hiện do Midea (Trung Quốc) sở hữu đa số từ năm 2016 nhưng vẫn giữ thương hiệu và tiêu chuẩn thiết kế Nhật Bản.",
    ],
    lines=[("Tủ lạnh Inverter ngăn đá trên/dưới", "Bền, giá hợp lý, có ngăn rau giữ ẩm."),
           ("Máy giặt Inverter cửa trên, cửa trước", "Công nghệ Greatwaves tạo sóng giặt mạnh."),
           ("Nồi cơm điện cao tần", "Nấu cơm đều, dẻo, nhiều chế độ."),
           ("Điều hòa, máy lọc nước", "Đa dạng mức giá cho gia đình.")],
    tips=["Ngân sách vừa phải nhưng cần độ bền: tủ lạnh Toshiba 2 cửa 250–350 lít.",
          "Nồi cơm cao tần nấu ngon hơn nồi cơ, phù hợp nhà ăn cơm hằng ngày."],
    topics=["tủ lạnh", "máy giặt", "nồi cơm"], website="https://www.toshiba-lifestyle.com/vn/")

C["sharp"] = dict(
    tagline="Hãng điện tử Nhật Bản với công nghệ lọc khí Plasmacluster độc quyền, tủ lạnh, lò vi sóng và máy lọc không khí.",
    history=[
        "Sharp bắt nguồn từ chiếc bút chì bấm \"Ever-Sharp\" do Tokuji Hayakawa phát minh năm 1915 tại Tokyo. Công ty được thành lập năm 1912 và lấy tên theo sản phẩm này.",
        "Sharp sản xuất radio đầu tiên của Nhật (1925) và máy tính bỏ túi dùng màn hình LCD (1973). Hãng là một trong những đơn vị đi đầu về màn hình tinh thể lỏng.",
        "Từ năm 2016 Sharp thuộc tập đoàn Foxconn (Đài Loan). Công nghệ ion Plasmacluster giúp khử mùi, ức chế nấm mốc và có mặt trên nhiều dòng sản phẩm của hãng.",
    ],
    lines=[("Máy lọc không khí Plasmacluster", "Có loại tích hợp tạo ẩm, bắt muỗi."),
           ("Tủ lạnh Inverter", "Khử mùi bằng Plasmacluster."),
           ("Lò vi sóng, nồi cơm điện", "Đơn giản, dễ dùng."),
           ("Điều hòa, máy giặt", "Phân khúc phổ thông.")],
    tips=["Nhà nuôi thú cưng hoặc hay bị mùi: chọn máy lọc khí có Plasmacluster.",
          "Phòng 20 m² cần máy lọc khí có CADR khoảng 150–200 m³/h."],
    topics=["máy lọc không khí", "tủ lạnh", "lò vi sóng"], website="https://vn.sharp/")

C["hitachi"] = dict(
    tagline="Tập đoàn kỹ thuật Nhật Bản hơn một thế kỷ, nổi tiếng với tủ lạnh nhiều cửa cao cấp và máy hút bụi mạnh mẽ.",
    history=[
        "Hitachi được kỹ sư Namihei Odaira thành lập năm 1910 tại mỏ đồng Hitachi (tỉnh Ibaraki). Sản phẩm đầu tiên là động cơ điện cảm ứng 5 mã lực.",
        "Hitachi phát triển thành tập đoàn đa ngành gồm năng lượng, đường sắt, thang máy và công nghệ thông tin. Gia dụng là mảng giúp tên tuổi hãng gần gũi với các gia đình châu Á.",
        "Mảng gia dụng của Hitachi hiện thuộc Arçelik–Hitachi (liên doanh với Arçelik, Thổ Nhĩ Kỳ) tại thị trường ngoài Nhật Bản, vẫn giữ thiết kế và tiêu chuẩn Nhật.",
    ],
    lines=[("Tủ lạnh nhiều cửa, Side by Side", "Ngăn chân không giữ tươi, thiết kế mặt kính sang trọng."),
           ("Máy giặt cửa trên, cửa trước", "Lồng giặt lớn, giặt sạch mạnh."),
           ("Máy hút bụi", "Lực hút mạnh, bền.")],
    tips=["Muốn tủ lạnh cao cấp cho bếp mở: chọn tủ nhiều cửa mặt kính 450–600 lít.",
          "Đo kích thước hốc tủ trước khi mua, chừa 5–10 cm mỗi bên để tản nhiệt."],
    topics=["tủ lạnh", "máy giặt", "máy hút bụi"], website="https://www.hitachi-homeappliances.com/vn-vi/")

C["mitsubishi-electric"] = dict(
    tagline="Hãng Nhật Bản chuyên điều hòa, tủ lạnh và quạt với tiêu chí bền, êm và tiết kiệm điện.",
    history=[
        "Mitsubishi Electric tách ra từ Mitsubishi Shipbuilding năm 1921, khởi đầu với động cơ điện và quạt điện dành cho tàu thủy.",
        "Hãng phát triển mạnh các thiết bị điện công nghiệp, thang máy, vệ tinh và tự động hóa. Lưu ý: Mitsubishi Electric là công ty độc lập, khác với Mitsubishi Heavy Industries cũng sản xuất điều hòa.",
        "Tại Việt Nam, điều hòa Mitsubishi Electric được biết đến với độ bền cao, vận hành êm và cảm biến nhiệt độ cơ thể 3D i-see.",
    ],
    lines=[("Điều hòa Inverter treo tường", "Cảm biến 3D i-see Sensor đo nhiệt độ cơ thể."),
           ("Tủ lạnh nhiều cửa", "Ngăn cấp đông nhanh, giữ tươi."),
           ("Quạt điện, máy hút ẩm", "Bền, êm.")],
    tips=["Phòng 15–20 m² chọn điều hòa 1,5 HP (12.000 BTU).",
          "Nhà gần biển nên hỏi về dàn nóng có lớp phủ chống ăn mòn."],
    topics=["điều hòa", "tủ lạnh", "quạt"], website="https://www.mitsubishielectric.com/vn/")

C["daikin"] = dict(
    tagline="Chuyên gia điều hòa không khí đến từ Nhật Bản, một trong những hãng điều hòa lớn nhất thế giới.",
    history=[
        "Daikin được Akira Yamada thành lập năm 1924 tại Osaka với tên Osaka Kinzoku Kogyosho, ban đầu sản xuất ống tản nhiệt cho máy bay.",
        "Năm 1951, hãng sản xuất điều hòa đóng gói đầu tiên của Nhật Bản. Năm 1982, Daikin phát triển hệ thống VRV, đặt nền móng cho điều hòa trung tâm trong các tòa nhà.",
        "Daikin chỉ tập trung vào điều hòa, lọc khí và môi chất lạnh. Hãng đi đầu trong việc dùng môi chất lạnh R32 thân thiện môi trường cho điều hòa dân dụng.",
    ],
    lines=[("Điều hòa Inverter treo tường", "Môi chất R32, tiết kiệm điện, làm lạnh nhanh."),
           ("Điều hòa âm trần, VRV", "Giải pháp cho căn hộ lớn, văn phòng."),
           ("Máy lọc không khí Streamer", "Phân hủy vi khuẩn, nấm mốc bằng phóng điện Streamer.")],
    tips=["Tính công suất: khoảng 600 BTU cho mỗi m² phòng ngủ, tăng thêm nếu phòng hướng tây.",
          "Lắp đặt đúng kỹ thuật (độ dài ống đồng, hút chân không) quan trọng ngang chất lượng máy."],
    topics=["điều hòa", "máy lọc không khí"], website="https://www.daikin.com.vn/")

C["carrier"] = dict(
    tagline="Thương hiệu Mỹ gắn với tên người phát minh ra điều hòa không khí hiện đại, Willis Carrier.",
    history=[
        "Năm 1902, kỹ sư Willis Carrier thiết kế hệ thống kiểm soát nhiệt độ và độ ẩm cho một nhà in ở New York. Đây được xem là chiếc điều hòa không khí hiện đại đầu tiên.",
        "Năm 1915, ông cùng 6 kỹ sư thành lập Carrier Engineering Corporation. Carrier đưa điều hòa vào rạp chiếu phim, tòa nhà văn phòng rồi đến hộ gia đình.",
        "Carrier Global hiện có trụ sở tại Florida (Mỹ), cung cấp điều hòa dân dụng, thương mại và hệ thống lạnh cho chuỗi cung ứng.",
    ],
    lines=[("Điều hòa treo tường Inverter", "Bền, làm lạnh ổn định."),
           ("Điều hòa tủ đứng, âm trần", "Phù hợp không gian lớn, cửa hàng.")],
    tips=["Cửa hàng, phòng khách rộng trên 40 m² nên cân nhắc điều hòa tủ đứng hoặc âm trần."],
    topics=["điều hòa"], website="https://www.carrier.com/")

C["electrolux"] = dict(
    tagline="Tập đoàn gia dụng Thụy Điển hơn 100 năm tuổi với thiết kế Bắc Âu: máy giặt, tủ lạnh, máy hút bụi và thiết bị nhà bếp.",
    history=[
        "Electrolux bắt đầu năm 1910 tại Stockholm. Năm 1919, doanh nhân Axel Wenner-Gren hợp nhất các công ty và tập trung bán máy hút bụi Lux tới từng hộ gia đình.",
        "Từ thập niên 1920, Electrolux sản xuất tủ lạnh hấp thụ và sau đó thâu tóm nhiều thương hiệu gia dụng châu Âu và Mỹ (như Zanussi, AEG, Frigidaire).",
        "Electrolux hiện diện mạnh tại Việt Nam với máy giặt cửa trước UltimateCare, máy sấy và thiết bị nhà bếp, theo triết lý thiết kế lấy con người làm trung tâm.",
    ],
    lines=[("Máy giặt cửa trước UltimateCare", "Giặt hơi nước, chống nhăn, bảo vệ sợi vải."),
           ("Máy sấy thông hơi, bơm nhiệt", "Phù hợp căn hộ không có chỗ phơi."),
           ("Tủ lạnh Inverter", "Ngăn rau TasteLock giữ tươi."),
           ("Máy hút bụi, nồi chiên, lò nướng", "Đồ gia dụng nhỏ thiết kế đẹp.")],
    tips=["Căn hộ chung cư không có chỗ phơi: combo máy giặt 9 kg + máy sấy 8 kg.",
          "Chọn máy sấy bơm nhiệt nếu sấy thường xuyên để tiết kiệm điện."],
    topics=["máy giặt", "máy sấy", "tủ lạnh", "máy hút bụi"], website="https://www.electrolux.vn/")

C["whirlpool"] = dict(
    tagline="Thương hiệu gia dụng Mỹ hơn 100 năm, mạnh về máy giặt, tủ lạnh dung tích lớn và thiết bị bếp.",
    history=[
        "Whirlpool có nguồn gốc từ Upton Machine Company, thành lập năm 1911 tại Benton Harbor, Michigan (Mỹ), chuyên sản xuất máy giặt chạy điện.",
        "Tên Whirlpool được dùng từ năm 1950. Hãng mở rộng toàn cầu qua nhiều thương vụ, trong đó có Maytag và KitchenAid.",
        "Whirlpool được biết đến với công nghệ 6th Sense tự động điều chỉnh theo lượng đồ giặt và thực phẩm.",
    ],
    lines=[("Máy giặt cửa trên, cửa trước", "Lồng lớn, công nghệ 6th Sense."),
           ("Tủ lạnh Side by Side", "Dung tích lớn cho gia đình đông người."),
           ("Lò nướng, máy rửa bát", "Thiết bị bếp tiêu chuẩn Mỹ.")],
    tips=["Gia đình 6 người trở lên nên chọn máy giặt từ 12 kg."],
    topics=["máy giặt", "tủ lạnh", "đồ nhà bếp"], website="https://www.whirlpool.com/")

C["bosch"] = dict(
    tagline="Tập đoàn kỹ thuật Đức gắn với chất lượng \"Made in Germany\": máy rửa bát, bếp từ, máy giặt và dụng cụ cầm tay.",
    history=[
        "Robert Bosch mở \"Xưởng cơ khí chính xác và kỹ thuật điện\" tại Stuttgart năm 1886. Thành công đầu tiên của hãng là bộ đánh lửa magneto cho động cơ ô tô.",
        "Bosch phát triển thành nhà cung cấp linh kiện ô tô lớn nhất thế giới. Mảng gia dụng (BSH, thành lập năm 1967) sản xuất tủ lạnh, máy giặt và máy rửa bát.",
        "Phần lớn cổ phần của Bosch thuộc quỹ từ thiện Robert Bosch Stiftung. Đây là mô hình sở hữu đặc biệt giúp hãng tập trung đầu tư dài hạn cho chất lượng.",
    ],
    lines=[("Máy rửa bát độc lập, âm tủ", "Sấy Zeolith, rửa sạch dầu mỡ món Á."),
           ("Bếp từ, lò nướng âm tủ", "Thiết kế tối giản, an toàn."),
           ("Máy giặt cửa trước Serie 4/6/8", "Bền, êm, tiết kiệm nước."),
           ("Dụng cụ cầm tay (máy khoan, máy mài)", "Dòng xanh chuyên nghiệp và dòng DIY cho gia đình.")],
    tips=["Gia đình 4–6 người chọn máy rửa bát 13–14 bộ.",
          "Bếp từ đôi cần đường điện riêng và aptomat 32A."],
    topics=["máy rửa bát", "bếp từ", "máy giặt", "dụng cụ"], website="https://www.bosch-home.com/vn/")

C["haier"] = dict(
    tagline="Tập đoàn gia dụng Trung Quốc nhiều năm dẫn đầu thế giới về số lượng thiết bị gia dụng lớn bán ra, với tủ lạnh, máy giặt và điều hòa đa dạng mức giá.",
    history=[
        "Haier ra đời năm 1984 tại Thanh Đảo từ một nhà máy tủ lạnh nhỏ đang thua lỗ. CEO Trương Thụy Mẫn nổi tiếng với việc cho đập bỏ 76 tủ lạnh lỗi để xây dựng văn hóa chất lượng.",
        "Từ thập niên 2000, Haier mở rộng toàn cầu, mua lại mảng gia dụng của Sanyo (2011) và GE Appliances (2016).",
        "Haier có mặt tại Việt Nam với tủ lạnh, máy giặt và điều hòa phân khúc phổ thông đến trung cấp, cùng thương hiệu AQUA (kế thừa từ Sanyo).",
    ],
    lines=[("Tủ lạnh Inverter", "Nhiều dung tích, giá cạnh tranh."),
           ("Máy giặt cửa trên, cửa trước", "Chế độ giặt nhanh, tiết kiệm nước."),
           ("Điều hòa", "Phổ thông, dễ bảo trì.")],
    tips=["Ngân sách hạn chế nhưng cần dung tích lớn: so sánh tủ lạnh Haier cùng mức giá với các hãng Nhật, Hàn."],
    topics=["tủ lạnh", "máy giặt", "điều hòa"], website="https://www.haier.com/vn/")

C["hisense"] = dict(
    tagline="Thương hiệu điện tử Trung Quốc nổi bật với tivi ULED, Laser TV và tủ lạnh giá tốt.",
    history=[
        "Hisense được thành lập năm 1969 tại Thanh Đảo, ban đầu là nhà máy sản xuất radio.",
        "Hãng mở rộng sang tivi, điều hòa, tủ lạnh và mua lại Gorenje (Slovenia) năm 2018 cùng mảng tivi của Toshiba năm 2017.",
        "Hisense tập trung vào công nghệ hiển thị như ULED và Laser TV, đồng thời là nhà tài trợ của nhiều giải bóng đá lớn.",
    ],
    lines=[("Tivi ULED, Mini LED, Laser TV", "Màn hình lớn với chi phí hợp lý."),
           ("Tủ lạnh, máy giặt", "Phân khúc phổ thông.")],
    tips=["Muốn màn hình từ 85 inch với ngân sách vừa phải: cân nhắc tivi Hisense hoặc Laser TV."],
    topics=["tivi", "tủ lạnh"], website="https://www.hisense.com/")

C["tcl"] = dict(
    tagline="Hãng điện tử Trung Quốc thuộc nhóm bán nhiều tivi nhất thế giới, mạnh về Mini LED và Google TV.",
    history=[
        "TCL được thành lập năm 1981 tại Huệ Châu (Quảng Đông), khởi đầu với băng cassette và điện thoại bàn.",
        "Thập niên 1990–2000, TCL chuyển sang tivi và mua lại mảng tivi của Thomson (Pháp). Hãng tự sản xuất tấm nền qua công ty con CSOT.",
        "TCL có nhà máy tại Bình Dương (Việt Nam) và đứng trong top 2 thế giới về sản lượng tivi.",
    ],
    lines=[("Tivi QLED, Mini LED Google TV", "Cấu hình tốt trong tầm giá."),
           ("Điều hòa, máy giặt, tủ lạnh", "Giá cạnh tranh.")],
    tips=["Ưu tiên tivi có tần số quét 120 Hz nếu chơi game console."],
    topics=["tivi", "điều hòa"], website="https://www.tcl.com/vn/")

C["xiaomi"] = dict(
    tagline="Hệ sinh thái nhà thông minh từ Trung Quốc: robot hút bụi, máy lọc không khí, camera và đồ gia dụng kết nối app Xiaomi Home.",
    history=[
        "Xiaomi được Lôi Quân cùng các cộng sự thành lập năm 2010 tại Bắc Kinh, khởi đầu bằng giao diện MIUI và điện thoại Mi 1 năm 2011.",
        "Từ năm 2013, Xiaomi xây dựng hệ sinh thái bằng cách đầu tư vào hàng trăm công ty khởi nghiệp sản xuất thiết bị thông minh dưới thương hiệu Mi/Mijia.",
        "Xiaomi theo đuổi chiến lược giá hợp lý, thiết kế tối giản và mọi thiết bị đều điều khiển được qua một ứng dụng duy nhất.",
    ],
    lines=[("Robot hút bụi lau nhà", "Bản đồ hóa LiDAR, tự đổ rác."),
           ("Máy lọc không khí, quạt thông minh", "Điều khiển qua app, giọng nói."),
           ("Camera an ninh, đèn, ổ cắm thông minh", "Dễ lắp đặt, giá tốt."),
           ("Tivi, nồi cơm, máy lọc nước", "Kết nối app Xiaomi Home.")],
    tips=["Nhà nhiều thảm hoặc nuôi thú cưng: chọn robot hút bụi lực hút từ 4.000 Pa trở lên.",
          "Kiểm tra thiết bị có bản quốc tế (hỗ trợ tiếng Việt, ổ cắm 220V)."],
    topics=["robot hút bụi", "máy lọc không khí", "nhà thông minh"], website="https://www.mi.com/vn/")

C["philips"] = dict(
    tagline="Thương hiệu Hà Lan hơn 130 năm, gần gũi với gia đình Việt qua bóng đèn, bàn ủi, nồi chiên không dầu và máy xay.",
    history=[
        "Gerard Philips và cha là Frederik thành lập công ty sản xuất bóng đèn sợi đốt năm 1891 tại Eindhoven (Hà Lan).",
        "Philips sản xuất radio từ năm 1927, phát minh băng cassette (1963) và đồng phát triển đĩa CD với Sony.",
        "Ngày nay Royal Philips tập trung vào sức khỏe. Mảng đồ gia dụng mang thương hiệu Philips do Versuni đảm nhiệm, còn mảng chiếu sáng thuộc Signify.",
    ],
    lines=[("Nồi chiên không dầu Airfryer", "Công nghệ Rapid Air, giảm đến 90% chất béo."),
           ("Bàn ủi hơi nước, bàn ủi khô", "Mặt đế chống dính, phun hơi mạnh."),
           ("Máy xay sinh tố, máy ép trái cây", "Bền, dễ vệ sinh."),
           ("Đèn LED, máy lọc không khí", "Tiết kiệm điện, bảo vệ mắt.")],
    tips=["Gia đình 3–4 người chọn nồi chiên 4–6 lít.",
          "Ủi nhiều quần áo mỗi tuần: chọn bàn ủi hơi nước đứng hoặc có bình chứa rời."],
    topics=["nồi chiên", "bàn ủi", "máy xay", "đèn"], website="https://www.philips.com.vn/")

C["tefal"] = dict(
    tagline="Thương hiệu Pháp phát minh chảo chống dính, nổi tiếng với chảo nồi, nồi chiên và bàn ủi.",
    history=[
        "Năm 1954, kỹ sư Marc Grégoire tìm ra cách phủ lớp PTFE lên chảo nhôm theo gợi ý của vợ là Colette. Năm 1956, ông thành lập Tefal, tên ghép từ TEFlon và ALuminium.",
        "Tefal nhanh chóng phổ biến chảo chống dính ra toàn cầu. Năm 1968, hãng gia nhập tập đoàn Groupe SEB.",
        "Tefal nổi bật với chỉ báo nhiệt Thermo-Spot đổi màu khi chảo đạt nhiệt độ lý tưởng, cùng các đồ điện gia dụng nhà bếp.",
    ],
    lines=[("Chảo, nồi chống dính", "Có loại dùng được bếp từ, chỉ báo nhiệt Thermo-Spot."),
           ("Nồi chiên không dầu, nồi áp suất điện", "Nấu nhanh, an toàn."),
           ("Bàn ủi hơi nước", "Mặt đế Durilium trượt êm.")],
    tips=["Dùng bếp từ: chọn chảo có đáy từ (biểu tượng cuộn dây).",
          "Không dùng muỗng kim loại và không nung chảo rỗng ở lửa lớn để giữ lớp chống dính bền hơn."],
    topics=["chảo nồi", "đồ nhà bếp", "bàn ủi"], website="https://www.tefal.com.vn/")
