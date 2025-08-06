import { User, UserRole } from '../models/User';
import { Field } from '../models/Field';
import { generateTimeSlots } from '../utils/generateTimeSlots';

export const seedUsers = [
  {
    name: 'Nguyễn Văn An',
    email: 'owner1@example.com',
    password: 'password123',
    role: UserRole.Owner,
    phone: '0901234567',
  },
  {
    name: 'Trần Thị Bình',
    email: 'owner2@example.com',
    password: 'password123',
    role: UserRole.Owner,
    phone: '0901234568',
  },
  {
    name: 'Lê Văn Cường',
    email: 'owner3@example.com',
    password: 'password123',
    role: UserRole.Owner,
    phone: '0901234569',
  },
  {
    name: 'Phạm Thị Dung',
    email: 'player1@example.com',
    password: 'password123',
    role: UserRole.Player,
    phone: '0901234570',
  },
  {
    name: 'Hoàng Văn Em',
    email: 'player2@example.com',
    password: 'password123',
    role: UserRole.Player,
    phone: '0901234571',
  },
];

export const seedFields = [
  // Đà Nẵng Fields
  {
    name: 'Sân Bóng Đá Hoàng Sa',
    description: 'Sân cỏ nhân tạo hiện đại, phù hợp tổ chức giải đấu mini và tập luyện thường xuyên. Sân có hệ thống đèn chiếu sáng chuyên nghiệp và bãi đỗ xe rộng rãi.',
    sportType: 'football',
    location: {
      address: '123 Đường Hoàng Sa, Quận Sơn Trà',
      city: 'Đà Nẵng',
      coordinates: {
        lat: 16.0715,
        lng: 108.2241,
      },
    },
    pricing: {
      hourlyRate: 250000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Bóng+Hoàng+Sa',
      '/placeholder.svg?height=300&width=400&text=Toàn+Cảnh+Sân',
    ],
    amenities: ['Phòng Thay Đồ', 'Đèn Chiếu Sáng', 'Bãi Đỗ Xe', 'Nhà Vệ Sinh', 'Quầy Đồ Uống'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    name: 'Sân Cầu Lông Nguyễn Văn Linh',
    description: 'Sân cầu lông trong nhà đạt chuẩn thi đấu, có mái che và sàn gỗ chuyên dụng. Hệ thống máy lạnh hiện đại, phù hợp cho cả tập luyện và thi đấu.',
    sportType: 'badminton',
    location: {
      address: '456 Nguyễn Văn Linh, Quận Hải Châu',
      city: 'Đà Nẵng',
      coordinates: {
        lat: 16.0471,
        lng: 108.2103,
      },
    },
    pricing: {
      hourlyRate: 100000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+2',
    ],
    amenities: ['Máy Lạnh', 'Phòng Thay Đồ', 'Nhà Vệ Sinh', 'Quầy Đồ Uống', 'WiFi'],
    features: {
      lighting: true,
      parking: false,
      restrooms: true,
      equipment: true,
    },
  },
  {
    name: 'Câu Lạc Bộ Tennis Đà Nẵng',
    description: 'Sân tennis ngoài trời với mặt sân đất sét chuyên nghiệp và tầm nhìn thành phố tuyệt đẹp. Có huấn luyện viên chuyên nghiệp và cửa hàng dụng cụ.',
    sportType: 'tennis',
    location: {
      address: '789 Đại Lộ Tennis, Quận Ngũ Hành Sơn',
      city: 'Đà Nẵng',
      coordinates: {
        lat: 16.0544,
        lng: 108.2022,
      },
    },
    pricing: {
      hourlyRate: 150000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Tennis+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Tennis+2',
    ],
    amenities: ['Cửa Hàng Dụng Cụ', 'Có Huấn Luyện Viên', 'Bãi Đỗ Xe', 'Nhà Vệ Sinh', 'Quầy Đồ Uống'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: false,
    },
  },
  
  // Hồ Chí Minh Fields
  {
    name: 'Sân Bóng Đá Thành Phố',
    description: 'Sân bóng đá cỏ nhân tạo chất lượng cao tại trung tâm TP.HCM. Phù hợp cho các giải đấu cấp đội và tập luyện cá nhân.',
    sportType: 'football',
    location: {
      address: '123 Đường Lê Lợi, Quận 1',
      city: 'Hồ Chí Minh',
      coordinates: {
        lat: 10.7769,
        lng: 106.7009,
      },
    },
    pricing: {
      hourlyRate: 300000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Bóng+TPHCM+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Bóng+TPHCM+2',
    ],
    amenities: ['Phòng Thay Đồ', 'Đèn Chiếu Sáng', 'Bãi Đỗ Xe', 'Nhà Vệ Sinh', 'Quầy Đồ Uống', 'WiFi'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    name: 'Sân Cầu Lông Quận 7',
    description: 'Sân cầu lông trong nhà hiện đại với hệ thống máy lạnh và ánh sáng chuyên nghiệp. Phù hợp cho cả người mới bắt đầu và vận động viên chuyên nghiệp.',
    sportType: 'badminton',
    location: {
      address: '456 Đường Nguyễn Thị Thập, Quận 7',
      city: 'Hồ Chí Minh',
      coordinates: {
        lat: 10.7321,
        lng: 106.7074,
      },
    },
    pricing: {
      hourlyRate: 120000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+Q7+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+Q7+2',
    ],
    amenities: ['Máy Lạnh', 'Phòng Thay Đồ', 'Nhà Vệ Sinh', 'Quầy Đồ Uống', 'WiFi', 'Tủ Locker'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    name: 'Sân Tennis Phú Nhuận',
    description: 'Sân tennis ngoài trời với mặt sân cứng chuyên nghiệp. Có hệ thống đèn chiếu sáng và bãi đỗ xe rộng rãi.',
    sportType: 'tennis',
    location: {
      address: '789 Đường Phan Xích Long, Quận Phú Nhuận',
      city: 'Hồ Chí Minh',
      coordinates: {
        lat: 10.7991,
        lng: 106.6894,
      },
    },
    pricing: {
      hourlyRate: 180000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Tennis+PN+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Tennis+PN+2',
    ],
    amenities: ['Cửa Hàng Dụng Cụ', 'Bãi Đỗ Xe', 'Nhà Vệ Sinh', 'Quầy Đồ Uống', 'WiFi'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: false,
    },
  },
  
  // Hà Nội Fields
  {
    name: 'Sân Bóng Đá Mỹ Đình',
    description: 'Sân bóng đá cỏ nhân tạo chất lượng cao gần sân vận động Mỹ Đình. Phù hợp cho các giải đấu và tập luyện.',
    sportType: 'football',
    location: {
      address: '123 Đường Mỹ Đình, Quận Nam Từ Liêm',
      city: 'Hà Nội',
      coordinates: {
        lat: 21.0285,
        lng: 105.7740,
      },
    },
    pricing: {
      hourlyRate: 280000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Bóng+HN+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Bóng+HN+2',
    ],
    amenities: ['Phòng Thay Đồ', 'Đèn Chiếu Sáng', 'Bãi Đỗ Xe', 'Nhà Vệ Sinh', 'Quầy Đồ Uống'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    name: 'Sân Cầu Lông Cầu Giấy',
    description: 'Sân cầu lông trong nhà hiện đại tại quận Cầu Giấy. Có hệ thống máy lạnh và ánh sáng chuyên nghiệp.',
    sportType: 'badminton',
    location: {
      address: '456 Đường Xuân Thủy, Quận Cầu Giấy',
      city: 'Hà Nội',
      coordinates: {
        lat: 21.0368,
        lng: 105.7821,
      },
    },
    pricing: {
      hourlyRate: 110000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+CG+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+CG+2',
    ],
    amenities: ['Máy Lạnh', 'Phòng Thay Đồ', 'Nhà Vệ Sinh', 'Quầy Đồ Uống', 'WiFi'],
    features: {
      lighting: true,
      parking: false,
      restrooms: true,
      equipment: true,
    },
  },
  {
    name: 'Sân Tennis Tây Hồ',
    description: 'Sân tennis ngoài trời với tầm nhìn hồ Tây tuyệt đẹp. Mặt sân cứng chuyên nghiệp, phù hợp cho cả tập luyện và thi đấu.',
    sportType: 'tennis',
    location: {
      address: '789 Đường Thanh Niên, Quận Tây Hồ',
      city: 'Hà Nội',
      coordinates: {
        lat: 21.0455,
        lng: 105.8230,
      },
    },
    pricing: {
      hourlyRate: 160000,
      currency: 'VND',
    },
    images: [
      '/placeholder.svg?height=300&width=400&text=Sân+Tennis+TH+1',
      '/placeholder.svg?height=300&width=400&text=Sân+Tennis+TH+2',
    ],
    amenities: ['Cửa Hàng Dụng Cụ', 'Bãi Đỗ Xe', 'Nhà Vệ Sinh', 'Quầy Đồ Uống', 'WiFi'],
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: false,
    },
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Field.deleteMany({});
    
    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }
    
    // Get owner users for field assignment
    const owners = createdUsers.filter(user => user.role === UserRole.Owner);
    
    // Create fields
    for (let i = 0; i < seedFields.length; i++) {
      const fieldData = seedFields[i];
      const owner = owners[i % owners.length]; // Distribute fields among owners
      
      // Generate time slots for the field
      const availability = generateTimeSlots({
        basePrice: fieldData.pricing.hourlyRate,
        priceVariation: fieldData.pricing.hourlyRate * 0.3,
        availabilityRate: 0.7,
      });
      
      const field = new Field({
        ...fieldData,
        owner: owner._id,
        availability,
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
      });
      
      await field.save();
      console.log(`✅ Created field: ${field.name} in ${field.location.city}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users and ${seedFields.length} fields`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
} 