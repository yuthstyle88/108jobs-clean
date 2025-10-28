"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/Card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/Collapsible";
import {CategoriesIcon} from "@/constants/icons";
import {ChevronDown} from "lucide-react";
import Image from "next/image";

const Services = () => {
  const serviceCategories = [
    {
      id: "design",
      title: "Thiết kế đồ họa",
      icon: CategoriesIcon.graphic,
      subcategories: [
        {
          title: "Thiết kế logo",
          items: [
            "Thiết kế logo nhà hàng",
            "Thiết kế logo bóng đá",
            "Thiết kế logo công ty",
            "Thiết kế logo tập",
            "Thiết kế logo shop quần áo",
            "Thiết kế logo thương hiệu",
            "Thiết kế logo barber shop",
            "Thiết kế logo chibi",
            "Thiết kế logo sự kiện",
            "Thiết kế logo chữ",
            "Thiết kế logo trà sữa online",
            "Thiết kế logo theo tên",
            "Thiết kế logo spa",
            "Thiết kế logo cafe đẹp",
            "Thiết kế logo đồ gia dụng",
          ],
        },
        {
          title: "Thiết kế bao bì",
          items: [
            "Thiết kế bao bì thực phẩm",
            "Thiết kế bao bì mỹ phẩm",
            "Thiết kế bao bì hộp sữa",
            "Thiết kế bao bì cà phê",
          ],
        },
        {
          title: "Làm phim hoạt hình",
          items: [],
        },
        {
          title: "Thiết kế đồ họa thông tin",
          items: [],
        },
        {
          title: "Photoshop",
          items: [],
        },
        {
          title: "Thiết kế mô hình 3D",
          items: [],
        },
        {
          title: "Thiết kế nhân vật (Character Design)",
          items: [],
        },
        {
          title: "Presentation",
          items: [],
        },
        {
          title: "Thủ công mỹ nghệ",
          items: [],
        },
        {
          title: "Thiết kế nhận diện thương hiệu",
          items: [],
        },
        {
          title: "Thiết kế portfolio",
          items: [],
        },
        {
          title: "Thiết kế ấn phẩm",
          items: [
            "Thiết kế thiệp cưới",
            "Thiết kế card visit",
            "Thiết kế tờ rơi",
            "Thiết kế bìa sách",
            "Thiết kế banner",
            "Thiết kế bảng hiệu",
            "Thiết kế Poster",
            "Thiết kế Menu",
            "Thiết kế Brochure",
          ],
        },
        {
          title: "Thiết kế banner truyền thông xã hội",
          items: [
            "Quảng cáo facebook",
            "Thiết kế quảng cáo",
            "Thiết kế banner sinh nhật",
            "Thiết kế banner mỹ phẩm",
            "Thiết kế banner sự kiện",
            "Thiết kế banner Facebook",
            "Thiết kế banner shop thời trang",
            "Thiết kế banner đồ ăn",
            "Thiết kế banner giải bóng đá",
            "Thiết kế banner tốt nghiệp",
            "Thiết kế banner khai trương",
            "Thiết kế banner trung thu",
            "Thiết kế quảng cáo sản phẩm",
            "Thiết kế banner Shopee",
            "Thiết kế banner spa",
            "Thiết kế banner du lịch",
            "Thiết kế banner Youtube",
          ],
        },
        {
          title: "Vẽ minh họa",
          items: ["Vẽ bìa sách", "Minh họa truyện cổ tích"],
        },
        {
          title: "Vẽ hoạt hình",
          items: [],
        },
        {
          title: "Thiết kế bản đồ",
          items: [],
        },
        {
          title: "Thiết kế nhân vật trò chơi",
          items: [],
        },
        {
          title: "Thiết kế nhãn dán",
          items: [],
        },
        {
          title: "Thiết kế thời trang",
          items: [],
        },
        {
          title: "Thiết kế hình xăm",
          items: [],
        },
        {
          title: "Thiết kế - Vẽ Fanart",
          items: [],
        },
        {
          title: "Chuyển đổi vector",
          items: [],
        },
        {
          title: "Đồ họa vector",
          items: [],
        },
        {
          title: "Kỹ sư kết cấu",
          items: [],
        },
        {
          title: "Vẽ phối cảnh",
          items: [],
        },
        {
          title: "Thiết kế cảnh quan",
          items: [],
        },
        {
          title: "Thiết kế nội thất",
          items: [
            "Thiết kế nội thất khách sạn",
            "Thiết kế nội thất quán cà phê",
            "Thiết kế nội thất nhà ở",
            "Thiết kế nội thất văn phòng",
            "Thiết kế nhà xưởng",
            "Thiết kế gian hàng triển lãm",
            "Thiết kế nhà hàng",
            "Thiết kế cửa hàng",
          ],
        },
        {
          title: "Autocad",
          items: [],
        },
        {
          title: "Cac lĩnh vực khác",
          items: [],
        },
      ],
    },
    {
      id: "marketing",
      title: "Tiếp thị & Quảng cáo",
      icon: CategoriesIcon.marketing,
      subcategories: [
        {
          title: "Truyền thông trực tuyến",
          items: [
            "SEO",
            "Google Ads",
            "Social Media Boosting",
            "Quan hệ công chúng (PR)",
            "Content marketing",
            "Google Map",
            "Quảng cáo trang",
            "Bất động sản",
            "Viết bài đánh giá",
            "Quảng cáo trên mạng xã hội",
          ],
        },
        {
          title: "Influencer",
          items: ["Blogger", "Influencer Marketing"],
        },
        {
          title: "Marketing insight",
          items: ["Theo dõi phản tích"],
        },
        {
          title: "Marketing",
          items: [
            "Digital Marketing",
            "Community Manager",
            "Quản lý quan hệ khách hàng (CRM)",
            "Social Media Manager",
            "Email Marketing",
          ],
        },
        {
          title: "Tư vấn xây dựng thương hiệu (branding)",
          items: [],
        },
        {
          title: "Các tính vực khác",
          items: [],
        },
      ],
    },
    {
      id: "writing",
      title: "Viết lách & Dịch thuật",
      icon: CategoriesIcon.writing,
      subcategories: [
        {
          title: "Nội dung về Viết lách",
          items: [
            "Viết content mô tả sản phẩm",
            "Viết content học thuật",
            "Copywriting",
            "Viết content social media",
            "Viết content SEO",
          ],
        },
        {
          title: "Đánh máy và nhập liệu",
          items: [],
        },
        {
          title: "Transcription",
          items: [],
        },
        {
          title: "Dịch phụ đề - Làm phụ đề",
          items: [],
        },
        {
          title: "Viết caption",
          items: [],
        },
        {
          title: "Phiên dịch",
          items: [
            "Phiên dịch tiếng Trung",
            "Phiên dịch tiếng Anh",
            "Phiên dịch tiếng Pháp",
            "Phiên dịch tiếng Nhật",
            "Phiên dịch tiếng Hàn",
            "Phiên dịch tiếng Nga",
            "Phiên dịch tiếng Thái",
          ],
        },
        {
          title: "Dịch thuật",
          items: [
            "Dịch thuật tiếng Thái",
            "Dịch thuật tiếng Nga",
            "Dịch thuật tiếng Pháp",
            "Dịch Tiếng Nhật",
            "Tiếng Anh",
            "Dịch Tiếng Hàn",
            "Tiếng Trung",
          ],
        },
        {
          title: "Các tính vực khác",
          items: [],
        },
      ],
    },
    {
      id: "video",
      title: "Ảnh và Video",
      icon: CategoriesIcon.video,
      subcategories: [
        {
          title: "Quay phim",
          items: [
            "Phát sóng trực tiếp",
            "Quay MV",
            "Chỉnh sửa Video Tiktok",
            "Làm video quảng cáo sản phẩm",
          ],
        },
        {
          title: "Nhiếp ảnh (Photographer)",
          items: [
            "Chụp ảnh sự kiện",
            "Chụp ảnh kỷ yếu",
            "Chụp ảnh cưới",
            "Chụp ảnh đường phố",
            "Chụp ảnh sản phẩm",
            "Chụp ảnh chân dung",
            "Chụp ảnh tốt nghiệp",
            "Chụp ảnh đồ ăn",
            "Chụp ảnh gia đình",
          ],
        },
        {
          title: "Đồ họa chuyển động",
          items: [],
        },
        {
          title: "Dịch vụ podcast",
          items: [],
        },
        {
          title: "Sound Effects",
          items: [],
        },
        {
          title: "Trang điểm",
          items: [],
        },
        {
          title: "Tạo mẫu và thiết kế bối cảnh",
          items: [],
        },
        {
          title: "DJ",
          items: [],
        },
        {
          title: "Các tính vực khác",
          items: [],
        },
      ],
    },
    {
      id: "web",
      title: "Lập trình web",
      icon: CategoriesIcon.programming,
      subcategories: [
        {
          title: "Lập trình web (Web Development)",
          items: ["Python", "PHP", "Java", "ReactJS", "Golang", "C++"],
        },
        {
          title: "Wordpress",
          items: [],
        },
        {
          title: "Dịch vụ Chatbot",
          items: [],
        },
        {
          title: "Lập trình game",
          items: [],
        },
        {
          title: "Thiết kế UI/UX",
          items: [],
        },
        {
          title: "Ứng dụng máy tính",
          items: [],
        },
        {
          title: "Ứng dụng di động",
          items: [],
        },
        {
          title: "Internet of Things",
          items: [],
        },
        {
          title: "Khai thác dữ liệu web",
          items: [],
        },
        {
          title: "IT",
          items: [],
        },
        {
          title: "Quality Assurance (QA)",
          items: [],
        },
        {
          title: "Phân tích dữ liệu",
          items: [],
        },
        {
          title: "Business Analyst",
          items: [],
        },
        {
          title: "Các tính vực khác",
          items: [],
        },
      ],
    },
    {
      id: "consulting",
      title: "Tư vấn",
      icon: CategoriesIcon.consultant,
      subcategories: [
        {
          title: "Tư vấn pháp lý",
          items: [],
        },
        {
          title: "Tư vấn kinh doanh",
          items: [],
        },
        {
          title: "Đăng ký kinh doanh",
          items: [],
        },
        {
          title: "Kế toán",
          items: [],
        },
        {
          title: "Lập kế hoạch tài chính",
          items: [],
        },
        {
          title: "Thư ký",
          items: [],
        },
        {
          title: "Đặt mua sản phẩm từ Trung Quốc",
          items: [],
        },
        {
          title: "Tư vấn AI (AI Consultant)",
          items: [],
        },
        {
          title: "Thương mại điện tử",
          items: [],
        },
        {
          title: "Lập kế hoạch du lịch",
          items: [],
        },
        {
          title: "Chiêm tinh học",
          items: [],
        },
        {
          title: "Hướng dẫn đầu tư",
          items: [],
        },
        {
          title: "Khóa học trực tuyến",
          items: [],
        },
        {
          title: "Các tính vực khác",
          items: [],
        },
      ],
    },
    {
      id: "admin",
      title: "Văn hành",
      icon: CategoriesIcon.lifestyle,
      subcategories: [
        {
          title: "Quản trị viên trang",
          items: [],
        },
        {
          title: "Telesales",
          items: [],
        },
        {
          title: "Nhân viên bán hàng",
          items: [],
        },
        {
          title: "Tổ chức sự kiện",
          items: [],
        },
        {
          title: "Các tính vực khác",
          items: [],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Tất cả danh mục công việc
          </h1>
          <p className="text-gray-600 text-lg">
            Chọn loại dịch vụ phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Image
                    src={category.icon}
                    alt={category.title}
                    width={40}
                    height={40}
                    className=""
                  />
                  <span className="text-primary">{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.subcategories.map((subcategory, index) => (
                    <Collapsible key={index} open={true}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200">
                        <span className="font-medium text-sm text-text-primary">
                          {subcategory.title}
                        </span>
                        <ChevronDown className="h-4 w-4"/>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="pl-4 space-y-1">
                          {subcategory.items.map((item, itemIndex) => (
                            <button
                              key={itemIndex}
                              className="block text-left text-sm text-text-primary hover:text-primary py-1"
                            >
                              ∟ {item}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
