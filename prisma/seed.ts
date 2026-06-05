import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/thpt_edison')
const prisma = new PrismaClient({ adapter })



async function main() {
  console.log('Starting seeding database...')

  // Clear existing data in correct order due to foreign key constraints
  await prisma.activityLog.deleteMany({})
  await prisma.photo.deleteMany({})
  await prisma.album.deleteMany({})
  await prisma.attachment.deleteMany({})
  await prisma.postRevision.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.tag.deleteMany({})
  await prisma.document.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.contact.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.slide.deleteMany({})
  await prisma.leader.deleteMany({})
  await prisma.achievement.deleteMany({})
  await prisma.teacher.deleteMany({})
  await prisma.faq.deleteMany({})
  await prisma.subscriber.deleteMany({})


  console.log('Cleared existing data.')

  // 1. Create Users
  const saltRounds = 12
  const adminPassword = bcrypt.hashSync('Admin@123', saltRounds)
  const editorPassword = bcrypt.hashSync('Editor@123', saltRounds)
  const reviewerPassword = bcrypt.hashSync('Reviewer@123', saltRounds)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@thpt.edu.vn',
      password: adminPassword,
      name: 'Ban Giám Hiệu - Admin',
      role: 'admin',
      isActive: true,
    },
  })

  const editor = await prisma.user.create({
    data: {
      email: 'editor@thpt.edu.vn',
      password: editorPassword,
      name: 'Nguyễn Văn Biên (Editor)',
      role: 'editor',
      isActive: true,
    },
  })

  const reviewer = await prisma.user.create({
    data: {
      email: 'reviewer@thpt.edu.vn',
      password: reviewerPassword,
      name: 'Trần Thị Duyệt (Reviewer)',
      role: 'reviewer',
      isActive: true,
    },
  })

  console.log('Created Users:', { admin: admin.email, editor: editor.email, reviewer: reviewer.email })

  // 2. Create Categories
  const catNews = await prisma.category.create({
    data: { name: 'Tin nhà trường', slug: 'tin-nha-truong', description: 'Các tin tức, hoạt động chính thức của nhà trường', order: 1 },
  })

  const catAnnounce = await prisma.category.create({
    data: { name: 'Thông báo', slug: 'thong-bao', description: 'Các thông báo khẩn, thông báo từ ban giám hiệu', order: 2 },
  })

  const catAdmission = await prisma.category.create({
    data: { name: 'Tuyển sinh lớp 10', slug: 'tuyen-sinh-lop-10', description: 'Thông tin tuyển sinh hàng năm', order: 3 },
  })

  const catActivity = await prisma.category.create({
    data: { name: 'Hoạt động học sinh', slug: 'hoat-dong-hoc-sinh', description: 'Hoạt động của các câu lạc bộ, đoàn đội, hội thao', order: 4 },
  })

  const catResources = await prisma.category.create({
    data: { name: 'Tài nguyên học tập', slug: 'tai-nguyen-hoc-tap', description: 'Đề cương, giáo trình, biểu mẫu học sinh', order: 5 },
  })

  console.log('Created Categories.')

  // 3. Create Events
  const events = [
    {
      title: 'Lễ Bế Giảng Năm Học 2025 - 2026',
      description: 'Lễ tổng kết năm học và lễ ra trường cho học sinh khối 12 niên khóa 2023 - 2026.',
      startDate: new Date('2026-05-25T07:30:00Z'),
      endDate: new Date('2026-05-25T11:30:00Z'),
      location: 'Sân trường chính THPT Edison',
    },
    {
      title: 'Hội Nghị Tư Vấn Tuyển Sinh Lớp 10',
      description: 'Gặp gỡ phụ huynh và học sinh có nguyện vọng đăng ký thi tuyển vào lớp 10 năm học mới.',
      startDate: new Date('2026-06-15T08:00:00Z'),
      endDate: new Date('2026-06-15T11:00:00Z'),
      location: 'Hội trường lớn A - THPT Edison',
    },
    {
      title: 'Kỳ Thi Tốt Nghiệp THPT Quốc Gia 2026',
      description: 'Kỳ thi tốt nghiệp THPT quốc gia dành cho học sinh khối 12 toàn trường.',
      startDate: new Date('2026-06-27T07:00:00Z'),
      endDate: new Date('2026-06-29T17:00:00Z'),
      location: 'Khu vực phòng thi A, B, C',
    },
  ]

  for (const ev of events) {
    await prisma.event.create({ data: ev })
  }
  console.log('Created Events.')

  // 4. Create Documents
  const docs = [
    {
      title: 'Đề cương ôn tập Học kỳ II môn Toán lớp 12',
      description: 'Tài liệu hướng dẫn ôn thi học kỳ II do Tổ Toán tổng hợp cho học sinh khối 12.',
      filePath: '/uploads/documents/de-cuong-toan-12-hk2.pdf',
      fileName: 'de-cuong-toan-12-hk2.pdf',
      fileSize: 1024 * 1024 * 1.5, // 1.5MB
      fileType: 'pdf',
      categoryId: catResources.id,
    },
    {
      title: 'Kế hoạch tuyển sinh lớp 10 THPT Edison năm học 2026-2027',
      description: 'Văn bản hướng dẫn chi tiết quy trình đăng ký thi tuyển, chỉ tiêu tuyển sinh và lịch thi tuyển.',
      filePath: '/uploads/documents/ke-hoach-tuyen-sinh-2026-2027.pdf',
      fileName: 'ke-hoach-tuyen-sinh-2026-2027.pdf',
      fileSize: 1024 * 512, // 512KB
      fileType: 'pdf',
      categoryId: catAdmission.id,
    },
    {
      title: 'Mẫu đơn xin nghỉ học dành cho học sinh',
      description: 'Mẫu đơn chuẩn dùng khi học sinh cần xin nghỉ phép gửi Ban giám hiệu và giáo viên chủ nhiệm.',
      filePath: '/uploads/documents/mau-don-xin-nghi-hoc.docx',
      fileName: 'mau-don-xin-nghi-hoc.docx',
      fileSize: 1024 * 45, // 45KB
      fileType: 'docx',
      categoryId: catResources.id,
    },
  ]

  for (const doc of docs) {
    await prisma.document.create({ data: doc })
  }
  console.log('Created Documents.')

  // 5. Create Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Thông báo tuyển sinh lớp 10 Trường THPT Edison năm học 2026 - 2027',
      slug: 'thong-bao-tuyen-sinh-lop-10-truong-thpt-edison-nam-hoc-2026-2027',
      content: `<p>Trường THPT Edison trân trọng thông báo kế hoạch tuyển sinh vào lớp 10 năm học 2026 - 2027 như sau:</p>
                <h3>1. Chỉ tiêu tuyển sinh</h3>
                <p>Tổng chỉ tiêu tuyển sinh: <strong>450 học sinh</strong> (chia thành 10 lớp, bao gồm 2 lớp chất lượng cao).</p>
                <h3>2. Đối tượng và điều kiện dự tuyển</h3>
                <p>Học sinh đã tốt nghiệp THCS chương trình phổ thông quốc gia, độ tuổi theo quy định của Bộ Giáo dục & Đào tạo.</p>
                <h3>3. Phương thức tuyển sinh</h3>
                <ul>
                  <li>Thi tuyển: Theo kỳ thi chung của Sở GD&ĐT.</li>
                  <li>Xét tuyển thẳng: Học sinh đạt giải Học sinh giỏi cấp Tỉnh/Thành phố hoặc chứng chỉ IELTS từ 6.5 trở lên.</li>
                </ul>
                <p>Chi tiết vui lòng xem file kế hoạch đính kèm trong mục Tài liệu.</p>`,
      excerpt: 'Thông báo chính thức về chỉ tiêu, điều kiện tuyển sinh và phương thức tuyển sinh vào lớp 10 trường THPT Edison năm học 2026 - 2027.',
      thumbnail: '/uploads/thumbnails/tuyen-sinh-default.jpg',
      status: 'published',
      isFeatured: true,
      isPinned: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: catAdmission.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Đại hội Đoàn trường THPT Edison nhiệm kỳ 2025 - 2026 thành công tốt đẹp',
      slug: 'dai-hoi-doan-truong-thpt-edison-nhiem-ky-2025-2026-thanh-cong-tot-dep',
      content: `<p>Vừa qua, Đoàn trường THPT Edison đã tổ chức thành công Đại hội đại biểu Đoàn TNCS Hồ Chí Minh nhiệm kỳ 2025 - 2026.</p>
                <p>Đến dự Đại hội có đồng chí Bí thư Quận đoàn, đại diện Ban Chi ủy, Ban Giám hiệu nhà trường cùng 120 đoàn viên ưu tú đại diện cho các chi đoàn học sinh và giáo viên trong trường.</p>
                <p>Đại hội đã đánh giá kết quả hoạt động nhiệm kỳ trước và đề ra phương hướng hoạt động cho nhiệm kỳ mới, bầu ra Ban chấp hành gồm 15 đồng chí trẻ trung, năng động và đầy tâm huyết.</p>`,
      excerpt: 'Sự kiện chính trị quan trọng của tuổi trẻ trường THPT Edison nhằm nhìn lại chặng đường cũ và mở ra phương hướng hoạt động mới sôi nổi.',
      thumbnail: '/uploads/thumbnails/dai-hoi-doan-default.jpg',
      status: 'published',
      isFeatured: false,
      isPinned: false,
      publishedAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
      authorId: editor.id,
      categoryId: catNews.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      title: 'Thành tích xuất sắc của học sinh Edison tại kỳ thi Học sinh giỏi Cấp Thành phố',
      slug: 'thanh-tich-xuat-sac-cua-hoc-sinh-edison-tai-ky-thi-hoc-sinh-gioi-cap-thanh-pho',
      content: `<p>Nhà trường xin chúc mừng các em học sinh đã xuất sắc đạt giải cao tại kỳ thi Học sinh giỏi các môn văn hóa lớp 12 cấp Thành phố năm học 2025 - 2026.</p>
                <p>Edison vinh dự mang về: <strong>2 giải Nhất (Toán, Vật lý), 4 giải Nhì (Hóa học, Ngữ văn) và 7 giải Ba/Khuyến khích</strong>.</p>
                <p>Đây là thành quả xứng đáng cho những nỗ lực học tập không ngừng nghỉ của các em và sự hướng dẫn tận tình từ đội ngũ giáo viên bồi dưỡng.</p>`,
      excerpt: 'Nhà trường chúc mừng thành tích rực rỡ của các em học sinh khối 12 đạt giải cao trong Kỳ thi HSG thành phố năm học 2025 - 2026.',
      thumbnail: '/uploads/thumbnails/hsg-default.jpg',
      status: 'published',
      isFeatured: true,
      isPinned: false,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
      authorId: admin.id,
      categoryId: catNews.id,
    },
  })

  // Draft post from editor
  const post4 = await prisma.post.create({
    data: {
      title: 'Kế hoạch tổ chức Hội thảo Kỹ năng sống chuyên đề Phòng chống Bạo lực học đường',
      slug: 'ke-hoach-to-chuc-hoi-thao-ky-nang-song-chuyen-de-phong-chong-bao-luc-hoc-duong',
      content: `<p>Nhằm nâng cao nhận thức và trang bị kỹ năng tự bảo vệ cho học sinh, Tổ tư vấn tâm lý phối hợp với Ban chấp hành Đoàn trường xây dựng kế hoạch hội thảo kỹ năng sống.</p>
                <p>Dự kiến thời gian tổ chức vào tiết sinh hoạt dưới cờ thứ Hai ngày 22 tháng 6 năm 2026.</p>`,
      excerpt: 'Dự thảo kế hoạch tổ chức chuyên đề kỹ năng sống cho học sinh toàn trường.',
      status: 'draft',
      authorId: editor.id,
      categoryId: catActivity.id,
    },
  })

  console.log('Created Posts.')

  // 6. Create Albums & Photos
  const album1 = await prisma.album.create({
    data: {
      title: 'Lễ Khai Giảng Năm Học 2025 - 2026',
      description: 'Hình ảnh rực rỡ trong ngày khai hội khai trường bước vào năm học mới.',
      coverImage: '/uploads/images/khai-giang-cover.jpg',
    },
  })

  await prisma.photo.createMany({
    data: [
      { filePath: '/uploads/images/khai-giang-1.jpg', caption: 'Lễ chào cờ trang nghiêm mở đầu buổi lễ', order: 1, albumId: album1.id },
      { filePath: '/uploads/images/khai-giang-2.jpg', caption: 'Hiệu trưởng đánh trống khai giảng năm học mới', order: 2, albumId: album1.id },
      { filePath: '/uploads/images/khai-giang-3.jpg', caption: 'Học sinh khối 10 rạng rỡ ngày tựu trường', order: 3, albumId: album1.id },
    ],
  })

  const album2 = await prisma.album.create({
    data: {
      title: 'Giải Bóng Đá Edison Champions League 2026',
      description: 'Giải đấu thể thao thường niên gắn kết học sinh các khối lớp.',
      coverImage: '/uploads/images/bong-da-cover.jpg',
    },
  })

  await prisma.photo.createMany({
    data: [
      { filePath: '/uploads/images/bong-da-1.jpg', caption: 'Trận khai mạc kịch tính giữa khối 11 và khối 12', order: 1, albumId: album2.id },
      { filePath: '/uploads/images/bong-da-2.jpg', caption: 'Khán giả cổ vũ nhiệt tình trên khán đài', order: 2, albumId: album2.id },
    ],
  })

  console.log('Created Albums & Photos.')

  // 7. Create Contacts
  await prisma.contact.createMany({
    data: [
      {
        name: 'Nguyễn Thị Hoa',
        email: 'hoanguyen82@gmail.com',
        phone: '0912345678',
        subject: 'Hỏi về hồ sơ tuyển sinh lớp 10',
        message: 'Chào nhà trường, tôi muốn hỏi con tôi tốt nghiệp THCS ở ngoại tỉnh thì có thể đăng ký thi tuyển vào lớp 10 của trường được không và hồ sơ cần những gì?',
        isRead: false,
        isHandled: false,
      },
      {
        name: 'Trần Minh Tâm',
        email: 'minhtam2010@gmail.com',
        phone: '0987654321',
        subject: 'Đăng ký câu lạc bộ bóng rổ',
        message: 'Em là học sinh lớp 10A1 mới nhập học, em muốn đăng ký tham gia câu lạc bộ bóng rổ của trường nhưng không rõ thời gian và địa điểm tuyển thành viên.',
        isRead: true,
        isHandled: true,
      },
    ],
  })

  console.log('Created Contacts.')

  // 8. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      { action: 'login', entity: 'user', entityId: admin.id, details: 'Admin đăng nhập hệ thống', userId: admin.id },
      { action: 'create', entity: 'post', entityId: post1.id, details: 'Admin tạo bài viết tuyển sinh lớp 10', userId: admin.id },
      { action: 'create', entity: 'post', entityId: post2.id, details: 'Editor tạo bài viết đại hội đoàn trường', userId: editor.id },
      { action: 'publish', entity: 'post', entityId: post2.id, details: 'Reviewer duyệt xuất bản bài viết đại hội đoàn trường', userId: reviewer.id },
    ],
  })

  console.log('Created Activity Logs.')

  // 9. Create Slides (Hero Banner)
  await prisma.slide.createMany({
    data: [
      {
        title: 'Chào Mừng Đến Với THPT Edison',
        subtitle: 'Môi trường giáo dục khai phóng, hiện đại và toàn diện',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1600&auto=format&fit=crop&q=80',
        linkUrl: '/gioi-thieu',
        order: 1,
        isActive: true,
      },
      {
        title: 'Tuyển Sinh Lớp 10 Năm Học 2026 - 2027',
        subtitle: 'Đăng ký ngay để trở thành học sinh Edison',
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80',
        linkUrl: '/tuyen-sinh',
        order: 2,
        isActive: true,
      },
      {
        title: 'Thành Tích Xuất Sắc HSG Thành Phố 2026',
        subtitle: '2 giải Nhất, 4 giải Nhì, 7 giải Ba/Khuyến khích',
        imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80',
        linkUrl: '/thanh-tich',
        order: 3,
        isActive: true,
      },
    ],
  })
  console.log('Created Slides.')

  // 10. Create Leaders (Ban Giám Hiệu)
  await prisma.leader.createMany({
    data: [
      {
        name: 'ThS. Nguyễn Văn Minh',
        role: 'Hiệu trưởng',
        description: 'Hơn 20 năm kinh nghiệm quản lý giáo dục phổ thông, nguyên Hiệu phó trường chuyên Tỉnh. Tiên phong đổi mới phương pháp giảng dạy theo hướng khai phóng.',
        order: 1,
        isActive: true,
      },
      {
        name: 'Cô Trần Thị Hương',
        role: 'Phó Hiệu trưởng Chuyên môn',
        description: 'Thạc sĩ Ngữ văn, chuyên gia bồi dưỡng học sinh giỏi cấp Quốc gia. Nhiệt tâm với sự nghiệp trồng người.',
        order: 2,
        isActive: true,
      },
      {
        name: 'Thầy Lê Hoàng Dũng',
        role: 'Phó Hiệu trưởng Đời sống & Đoàn thể',
        description: 'Người định hướng và phát triển phong trào hoạt động ngoại khóa, câu lạc bộ học sinh. Gắn bó với tuổi trẻ Edison hơn 15 năm.',
        order: 3,
        isActive: true,
      },
    ],
  })
  console.log('Created Leaders.')

  // 11. Create Achievements
  await prisma.achievement.createMany({
    data: [
      {
        title: 'Giải Nhất HSG Toán Cấp Thành Phố',
        description: 'Em Nguyễn Hoàng Anh đạt điểm cao nhất kỳ thi HSG Toán cấp Thành phố năm 2026.',
        year: '2026',
        studentName: 'Nguyễn Hoàng Anh - 12A1',
        category: 'academic',
        order: 1,
        isActive: true,
      },
      {
        title: 'Giải Nhất HSG Vật Lý Cấp Thành Phố',
        description: 'Em Trần Minh Đức xuất sắc giành giải Nhất kỳ thi HSG Vật lý cấp Thành phố.',
        year: '2026',
        studentName: 'Trần Minh Đức - 12A2',
        category: 'academic',
        order: 2,
        isActive: true,
      },
      {
        title: 'Huy Chương Vàng Giải Bóng Đá Liên Trường',
        description: 'Đội bóng đá nam THPT Edison vô địch giải bóng đá liên trường toàn Tỉnh lần thứ 3 liên tiếp.',
        year: '2025',
        studentName: 'Đội tuyển Bóng đá nam',
        category: 'sports',
        order: 3,
        isActive: true,
      },
      {
        title: 'Giải Đặc Biệt Cuộc Thi Sáng Tạo Khoa Học Kỹ Thuật',
        description: 'Dự án "Máy lọc nước năng lượng mặt trời cho vùng cao" đạt giải đặc biệt cấp Tỉnh.',
        year: '2025',
        studentName: 'Nhóm STEM 11A3',
        category: 'academic',
        order: 4,
        isActive: true,
      },
      {
        title: 'Giải Nhất Liên Hoan Văn Nghệ Học Sinh',
        description: 'Tiết mục múa đương đại "Khát Vọng Tuổi Trẻ" giành giải Nhất Liên hoan Văn nghệ toàn Tỉnh.',
        year: '2025',
        studentName: 'CLB Múa Edison',
        category: 'arts',
        order: 5,
        isActive: true,
      },
    ],
  })
  console.log('Created Achievements.')

  // 12. Create Teachers
  await prisma.teacher.createMany({
    data: [
      { name: 'ThS. Phạm Thị Lan', subject: 'Toán học', degree: 'Thạc sĩ Toán', description: 'Giáo viên dạy giỏi cấp Tỉnh, 15 năm kinh nghiệm bồi dưỡng HSG.', order: 1, isActive: true },
      { name: 'ThS. Nguyễn Đức Hải', subject: 'Vật lý', degree: 'Thạc sĩ Vật lý', description: 'Chuyên gia thí nghiệm thực hành, huấn luyện đội tuyển HSG Vật lý.', order: 2, isActive: true },
      { name: 'TS. Lê Minh Tú', subject: 'Hóa học', degree: 'Tiến sĩ Hóa học', description: 'Nghiên cứu sinh từ ĐH Quốc Gia, tác giả nhiều đề thi tham khảo.', order: 3, isActive: true },
      { name: 'ThS. Vũ Thanh Hà', subject: 'Ngữ văn', degree: 'Thạc sĩ Ngữ văn', description: 'Giáo viên tâm huyết, tác giả nhiều bài nghiên cứu văn học.', order: 4, isActive: true },
      { name: 'CN. Trần Quốc Bảo', subject: 'Tiếng Anh', degree: 'IELTS 8.5', description: 'Du học sinh Anh Quốc, phương pháp dạy giao tiếp hiện đại.', order: 5, isActive: true },
      { name: 'ThS. Hoàng Thị Mai', subject: 'Tin học', degree: 'Thạc sĩ CNTT', description: 'Chuyên gia lập trình, hướng dẫn CLB Robotics và STEM.', order: 6, isActive: true },
    ],
  })
  console.log('Created Teachers.')

  // 13. Create FAQs
  await prisma.faq.createMany({
    data: [
      { question: 'Trường THPT Edison tuyển sinh lớp 10 như thế nào?', answer: 'Trường tuyển sinh theo 2 phương thức: Thi tuyển theo kỳ thi chung của Sở GD&ĐT và Xét tuyển thẳng cho học sinh đạt giải HSG cấp Tỉnh/TP hoặc có chứng chỉ IELTS từ 6.5 trở lên. Chi tiết xin xem trang Tuyển sinh.', category: 'admission', order: 1, isActive: true },
      { question: 'Học phí của trường THPT Edison là bao nhiêu?', answer: 'Học phí được công bố hàng năm theo quy định. Vui lòng liên hệ Phòng Tuyển sinh qua số điện thoại 024 7300 8896 hoặc email info@edisonschools.edu.vn để được tư vấn chi tiết về mức học phí và các khoản phí khác.', category: 'tuition', order: 2, isActive: true },
      { question: 'Trường có những câu lạc bộ nào cho học sinh?', answer: 'Trường THPT Edison có hơn 20 câu lạc bộ hoạt động thường xuyên: CLB Robotics & STEM, CLB Bóng đá, CLB Bóng rổ, CLB Múa, CLB Âm nhạc, CLB Tiếng Anh giao tiếp, CLB Văn học, CLB Toán học, CLB Tin học lập trình, CLB Thiện nguyện và nhiều CLB khác.', category: 'academic', order: 3, isActive: true },
      { question: 'Học sinh có được hỗ trợ định hướng nghề nghiệp không?', answer: 'Có. Trường có Tổ Tư vấn Tâm lý và Hướng nghiệp hoạt động thường xuyên. Hàng năm, trường tổ chức các buổi hội thảo hướng nghiệp, mời chuyên gia từ các trường đại học và doanh nghiệp đến chia sẻ.', category: 'academic', order: 4, isActive: true },
      { question: 'Trường có chương trình ngoại khóa gì?', answer: 'Trường tổ chức nhiều hoạt động ngoại khóa phong phú: dã ngoại thực tế, tham quan doanh nghiệp, hội thao, lễ hội văn nghệ, ngày hội STEM, cuộc thi sáng tạo, hoạt động thiện nguyện cộng đồng và chương trình trao đổi học sinh quốc tế.', category: 'general', order: 5, isActive: true },
      { question: 'Làm thế nào để liên hệ với nhà trường?', answer: 'Quý phụ huynh và học sinh có thể liên hệ qua: Điện thoại 024 7300 8896, Email info@edisonschools.edu.vn, hoặc đến trực tiếp Số 937 đường Dương Tự Minh, phường Phan Đình Phùng, Thái Nguyên. Ngoài ra có thể gửi phản hồi qua trang Liên hệ trên website.', category: 'general', order: 6, isActive: true },
    ],
  })
  console.log('Created FAQs.')

  console.log('Database seeding successfully completed!')

}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


